import React from 'react';

const DoctorProfile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Doctor Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="w-40 h-40 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-6xl text-blue-500">👨‍⚕️</span>
              </div>
              <h2 className="text-xl font-semibold text-center">Dr. John Smith</h2>
              <p className="text-gray-600 text-center">Cardiologist</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium mb-2">Contact Information</h3>
              <p className="text-sm mb-1"><span className="font-medium">Email:</span> dr.smith@example.com</p>
              <p className="text-sm mb-1"><span className="font-medium">Phone:</span> (555) 123-4567</p>
              <p className="text-sm"><span className="font-medium">Office:</span> Medical Center, Floor 3, Room 302</p>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Biography</h3>
              <p className="text-sm">
                Dr. John Smith is a board-certified cardiologist with over 15 years of experience in treating
                cardiovascular diseases. He specializes in preventive cardiology, heart failure management,
                and advanced cardiac imaging. Dr. Smith completed his medical training at Harvard Medical School
                and his cardiology fellowship at Johns Hopkins Hospital.
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Specializations</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Preventive Cardiology</li>
                <li>Heart Failure Management</li>
                <li>Cardiac Imaging</li>
                <li>Hypertension Treatment</li>
                <li>Cholesterol Management</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium mb-2">Education & Credentials</h3>
              <ul className="list-disc list-inside text-sm">
                <li>MD - Harvard Medical School</li>
                <li>Residency - Massachusetts General Hospital</li>
                <li>Fellowship in Cardiology - Johns Hopkins Hospital</li>
                <li>Board Certified in Cardiovascular Disease</li>
                <li>Fellow of the American College of Cardiology</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
