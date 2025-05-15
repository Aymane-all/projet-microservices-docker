import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Award, Users, MessageCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const AboutPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">About</span>{' '}
                  <span className="block text-accent-400 xl:inline">MediConnect</span>
                </h1>
                <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Learn more about our mission to revolutionize healthcare access and delivery through innovative technology.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to={isAuthenticated ? "/patient/doctors" : "/register"}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
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
            src="https://images.pexels.com/photos/6177609/pexels-photo-6177609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Medical professionals meeting"
          />
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Story</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How MediConnect began
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <p className="text-lg text-gray-500">
                MediConnect was founded in 2020 with a simple but powerful vision: to make quality healthcare accessible to everyone, everywhere. Our founders, a team of healthcare professionals and technology experts, recognized the challenges faced by patients in accessing timely care and by doctors in managing their practices efficiently.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                What started as a small telemedicine solution has grown into a comprehensive healthcare platform connecting thousands of patients with hundreds of healthcare providers across the country.
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-500">
                Today, MediConnect stands at the forefront of healthcare innovation, continuously evolving to meet the changing needs of patients and providers alike. Our platform not only facilitates virtual consultations but also supports in-person appointments, medical record management, and secure patient-doctor communication.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                We're committed to breaking down barriers to healthcare access and improving health outcomes through technology that empowers both patients and healthcare providers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What drives us every day
            </p>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 mx-auto">
              Our core values guide everything we do at MediConnect, from product development to customer support.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Heart size={28} />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Patient-Centered</h3>
              <p className="mt-2 text-base text-gray-500">
                We put patients first in everything we do, ensuring their needs, preferences, and well-being drive our decisions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Award size={28} />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Excellence</h3>
              <p className="mt-2 text-base text-gray-500">
                We strive for excellence in all aspects of our service, from technical reliability to customer support.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Users size={28} />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Inclusivity</h3>
              <p className="mt-2 text-base text-gray-500">
                We believe everyone deserves access to quality healthcare, regardless of their location or background.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <MessageCircle size={28} />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Transparency</h3>
              <p className="mt-2 text-base text-gray-500">
                We foster open communication with our users and partners, building trust through honesty and clarity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Team</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              The people behind MediConnect
            </p>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 mx-auto">
              Meet our dedicated team of healthcare professionals, technologists, and industry experts.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Team Member */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <img
                className="h-64 w-full object-cover"
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Dr. Michael Johnson"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">Dr. Michael Johnson</h3>
                <p className="text-sm font-medium text-primary-600">Co-Founder & Chief Medical Officer</p>
                <p className="mt-3 text-gray-500">
                  Board-certified physician with over 20 years of experience in healthcare delivery and innovation.
                </p>
              </div>
            </div>

            {/* Team Member */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <img
                className="h-64 w-full object-cover"
                src="https://images.pexels.com/photos/5439153/pexels-photo-5439153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Sarah Chen"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">Sarah Chen</h3>
                <p className="text-sm font-medium text-primary-600">Co-Founder & CEO</p>
                <p className="mt-3 text-gray-500">
                  Former healthcare executive with a passion for leveraging technology to solve healthcare challenges.
                </p>
              </div>
            </div>

            {/* Team Member */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <img
                className="h-64 w-full object-cover"
                src="https://images.pexels.com/photos/8197527/pexels-photo-8197527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="David Rodriguez"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">David Rodriguez</h3>
                <p className="text-sm font-medium text-primary-600">CTO</p>
                <p className="mt-3 text-gray-500">
                  Tech innovator with extensive experience building secure, scalable healthcare platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience better healthcare?</span>
            <span className="block text-accent-400">Join MediConnect today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to={isAuthenticated ? "/patient/doctors" : "/register"}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;