// Role-based middleware
export const checkRole = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" })
      }
      
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Access denied" })
      }
      
      next()
    }
  }
  
  // Check if user is a patient
  export const isPatient = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }
    
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can perform this action" })
    }
    
    next()
  }
  
  // Check if user is a doctor
  export const isMedcin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }
    
    if (req.user.role !== "medcin") {
      return res.status(403).json({ message: "Only doctors can perform this action" })
    }
    
    next()
  }
  
  // Check if user is either a patient or a medcin
  export const isPatientOrMedcin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }
    
    if (req.user.role !== "patient" && req.user.role !== "medcin") {
      return res.status(403).json({ message: "Access denied" })
    }
    
    next()
  }
  