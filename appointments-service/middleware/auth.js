const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set req.user to the decoded JWT payload
    req.user = {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name
    };
    // Ensure role exists
    if (!req.user.role) {
      return res.status(401).json({ message: 'User role not defined in token' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not found in request' });
    }

    // Check if role exists
    if (!req.user.role) {
      return res.status(403).json({
        message: `User role undefined is not authorized to access this route`
      });
    }

    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};