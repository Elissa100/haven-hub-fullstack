import React, { useState } from 'react';
import { X, Calendar, DollarSign, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  price: number;
  imageUrl?: string;
}

interface BookingModalProps {
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}

interface BookingFormData {
  startDateTime: string;
  endDateTime: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();

  const startDateTime = watch('startDateTime');
  const endDateTime = watch('endDateTime');

  const calculateHours = () => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const diffInMs = end.getTime() - start.getTime();
      const hours = Math.ceil(diffInMs / (1000 * 60 * 60));
      return hours > 0 ? hours : 0;
    }
    return 0;
  };

  const hours = calculateHours();
  const hourlyRate = room.price / 24; // Assuming daily rate
  const totalPrice = hours * hourlyRate;

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book a room');
        onClose();
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const bookingData = {
        roomId: room.id,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
      };

      console.log('Sending booking request:', bookingData);

      const response = await axios.post('http://localhost:8080/bookings', bookingData, config);

      console.log('Booking response:', response.data);
      toast.success('Booking created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Booking error:', error);

      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to book rooms');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const minDateTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16); // 1 hour from now

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Book Room {room.roomNumber}
              </h2>
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <img
                  src={room.imageUrl || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-32 object-cover rounded-lg"
              />
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {room.type} Room
                  </p>
                  <div className="flex items-center text-lg font-semibold text-blue-600 dark:text-blue-400">
                    <DollarSign className="h-4 w-4" />
                    {room.price} per day
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    ${hourlyRate.toFixed(2)} per hour
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date & Time
                </label>
                <input
                    type="datetime-local"
                    min={minDateTime}
                    {...register('startDateTime', { required: 'Start date and time is required' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {errors.startDateTime && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.startDateTime.message}
                    </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  End Date & Time
                </label>
                <input
                    type="datetime-local"
                    min={startDateTime || minDateTime}
                    {...register('endDateTime', {
                      required: 'End date and time is required',
                      validate: (value) => {
                        if (startDateTime && value <= startDateTime) {
                          return 'End time must be after start time';
                        }
                        if (startDateTime) {
                          const start = new Date(startDateTime);
                          const end = new Date(value);
                          const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                          if (diffInHours < 1) {
                            return 'Minimum booking duration is 1 hour';
                          }
                        }
                        return true;
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {errors.endDateTime && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.endDateTime.message}
                    </p>
                )}
              </div>

              {hours > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {hours} hour{hours > 1 ? 's' : ''}
                  </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${hourlyRate.toFixed(2)} × {hours}
                  </span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-blue-600 dark:text-blue-400">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Minimum booking duration is 1 hour. Your booking will be pending approval.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || hours < 1}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default BookingModal;