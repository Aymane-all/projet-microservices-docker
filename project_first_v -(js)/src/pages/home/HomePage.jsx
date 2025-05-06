import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Clock, Shield, Phone } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const getStartedLink = () => {
    if (!isAuthenticated) return '/register';
    if (user?.role === 'patient') return '/patient/doctors';
    return '/doctor/dashboard';
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Healthcare that</span>{' '}
                  <span className="block text-accent-400 xl:inline">works for you</span>
                </h1>
                <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Connect with top doctors online, book appointments, and manage your healthcare journey - all in one place.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to={getStartedLink()}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-full w-full object-cover"
            src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Healthcare professionals working"
          />
        </div>
      </div>

      {/* How it works section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">How it works</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Three simple steps to better healthcare
            </p>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              MediConnect streamlines your healthcare experience with an easy-to-use platform.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                  <Search size={28} />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Find specialists</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Search for doctors by specialty, location, or availability to find the perfect match for your healthcare needs.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                  <Calendar size={28} />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Book appointments</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Schedule appointments at times that work for you. No more waiting on hold or scheduling conflicts.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                  <User size={28} />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Receive care</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Connect with your doctor, receive quality care, and manage your health records all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured doctors section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Featured Specialists</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet our top doctors
            </p>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              Our platform connects you with experienced, highly-rated healthcare professionals.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Featured doctors content here */}
            {/* Example Doctor Card */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <img
                className="h-48 w-full object-cover"
                src="https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Dr. Jane Smith"
              />
              <div className="p-6">
                <p className="text-sm font-medium text-primary-600">Cardiology</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">Dr. Jane Smith</h3>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className={`h-4 w-4 ${rating < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-600">4.8 • 120+ reviews</p>
                </div>
                <p className="mt-3 text-gray-500">
                  Specializing in heart conditions with over 15 years of experience.
                </p>
                <div className="mt-6">
                  <Link to={isAuthenticated ? "/patient/book/1" : "/login"}>
                    <Button fullWidth>Book Appointment</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Repeat similar structure for other doctors */}
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              The benefits of MediConnect
            </p>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              Experience the convenience and quality care that comes with using MediConnect.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Clock size={28} />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">24/7 Access</h3>
              <p className="mt-2 text-base text-gray-500">
                Access healthcare services anytime, anywhere – no more waiting for office hours.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Shield size={28} />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Safe & Secure</h3>
              <p className="mt-2 text-base text-gray-500">
                Your health data is protected with industry-leading security standards.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Phone size={28} />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Easy Communication</h3>
              <p className="mt-2 text-base text-gray-500">
                Easily communicate with your doctor through our secure messaging system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
