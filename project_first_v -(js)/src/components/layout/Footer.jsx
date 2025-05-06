import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-bold text-primary-500">
              MediConnect
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Connecting patients with the right healthcare professionals effortlessly.
            </p>
            <div className="mt-4 flex space-x-6">
              {/* Facebook */}
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523...Z" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547...Z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.315 2c2.43...Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* For Patients */}
          <div className="col-span-1">
            <h3 className="text-sm font-medium text-gray-900">For Patients</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/patient/doctors" className="text-sm text-gray-500 hover:text-primary-500">Find Doctors</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Book Appointments</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Health Articles</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">FAQs</Link></li>
            </ul>
          </div>

          {/* For Doctors */}
          <div className="col-span-1">
            <h3 className="text-sm font-medium text-gray-900">For Doctors</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Join Network</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Manage Schedule</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Resources</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Success Stories</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="col-span-1">
            <h3 className="text-sm font-medium text-gray-900">About</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">About Us</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Careers</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Contact</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-500">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0 flex items-center">
            Made with <Heart size={14} className="mx-1 text-error-500" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
