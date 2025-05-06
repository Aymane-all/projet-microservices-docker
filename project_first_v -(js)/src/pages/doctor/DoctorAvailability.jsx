import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Button from '../../components/common/Button';

const DoctorAvailability = () => {
  const [availabilities, setAvailabilities] = useState([
    { day: 'Monday', slots: [] },
    { day: 'Tuesday', slots: [] },
    { day: 'Wednesday', slots: [] },
    { day: 'Thursday', slots: [] },
    { day: 'Friday', slots: [] },
    { day: 'Saturday', slots: [] },
    { day: 'Sunday', slots: [] },
  ]);

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAvailabilities([
        { day: 'Monday', slots: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }] },
        { day: 'Tuesday', slots: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }] },
        { day: 'Wednesday', slots: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }] },
        { day: 'Thursday', slots: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }] },
        { day: 'Friday', slots: [{ start: '09:00', end: '15:00' }] },
        { day: 'Saturday', slots: [] },
        { day: 'Sunday', slots: [] },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addTimeSlot = () => {
    if (startTime >= endTime) {
      setMessage('End time must be after start time');
      return;
    }

    setAvailabilities(prev =>
      prev.map(availability =>
        availability.day === selectedDay
          ? {
              ...availability,
              slots: [...availability.slots, { start: startTime, end: endTime }]
                .sort((a, b) => a.start.localeCompare(b.start))
            }
          : availability
      )
    );

    setMessage('Time slot added successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  const removeTimeSlot = (day, index) => {
    setAvailabilities(prev =>
      prev.map(availability =>
        availability.day === day
          ? {
              ...availability,
              slots: availability.slots.filter((_, i) => i !== index)
            }
          : availability
      )
    );
  };

  const saveAvailability = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Availability saved successfully');
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Manage Your Availability</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Set Your Available Hours
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {availabilities.map(day => (
                <option key={day.day} value={day.day}>{day.day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input 
                type="time" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input 
                type="time" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button 
            onClick={addTimeSlot} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            Add Time Slot
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Your Current Availability
        </h2>

        {availabilities.map((dayData) => (
          <div key={dayData.day} className="mb-6">
            <h3 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">
              {dayData.day}
            </h3>

            {dayData.slots.length === 0 ? (
              <p className="text-gray-500 italic">No availability set</p>
            ) : (
              <div className="space-y-2">
                {dayData.slots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span>
                      {slot.start} to {slot.end}
                    </span>
                    <button 
                      onClick={() => removeTimeSlot(dayData.day, index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-8">
          <Button 
            onClick={saveAvailability} 
            className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;
