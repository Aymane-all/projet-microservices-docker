import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar,
  ChevronDown,
  X
} from 'lucide-react';
import Button from '../../components/common/Button';
import { getAllDoctors, getAllSpecialties } from '../../api/doctors';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [doctorsData, specialtiesData] = await Promise.all([
          getAllDoctors(),
          getAllSpecialties()
        ]);
        setDoctors(doctorsData);
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialty.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty.id === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
          <p className="mt-2 text-gray-600">Search for specialists and book appointments</p>
        </div>

        {/* Search and filter section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="md:w-64 relative">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{selectedSpecialty ? specialties.find(s => s.id === selectedSpecialty)?.name : 'All Specialties'}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {filtersOpen && (
                <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg rounded-md py-1 border border-gray-200">
                  <div className="max-h-60 overflow-y-auto">
                    <div 
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${!selectedSpecialty ? 'bg-primary-50 text-primary-700' : ''}`}
                      onClick={() => {
                        setSelectedSpecialty('');
                        setFiltersOpen(false);
                      }}
                    >
                      All Specialties
                    </div>
                    {specialties.map(specialty => (
                      <div 
                        key={specialty.id} 
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedSpecialty === specialty.id ? 'bg-primary-50 text-primary-700' : ''}`}
                        onClick={() => {
                          setSelectedSpecialty(specialty.id);
                          setFiltersOpen(false);
                        }}
                      >
                        {specialty.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {(searchQuery || selectedSpecialty) && (
              <Button 
                variant="outline"
                size="sm"
                icon={<X size={16} />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Doctors list */}
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map(doctor => (
              <div 
                key={doctor.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-transform hover:transform hover:scale-[1.01] hover:shadow-md"
              >
                <div className="flex flex-col h-full">
                  <div className="relative">
                    <img 
                      src={doctor.profileImage || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                      alt={doctor.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {doctor.specialty.name}
                        </span>
                        <div className="flex items-center text-white">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          <span className="text-sm">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>New York, NY</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {doctor.about}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doctor.qualifications.slice(0, 3).map((qualification, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {qualification}
                        </span>
                      ))}
                      {doctor.qualifications.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{doctor.qualifications.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="block text-xs text-gray-500">Consultation Fee</span>
                        <span className="text-xl font-semibold text-gray-900">${doctor.consultationFee}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Experience</span>
                        <span className="text-lg font-medium text-gray-900">{doctor.experience} years</span>
                      </div>
                    </div>
                    <Link to={`/patient/book/${doctor.id}`}>
                      <Button 
                        variant="primary" 
                        fullWidth
                        icon={<Calendar size={16} />}
                      >
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
