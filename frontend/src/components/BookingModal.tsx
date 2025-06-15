import React, { useState } from 'react';
import { X, Calendar, DollarSign } from 'lucide-react';
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
  checkInDate: string;
  checkOutDate: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff > 0 ? daysDiff : 0;
    }
    return 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * room.price;

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book a room');
        onClose();
        return;
      }

      // Make sure axios has the authorization header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const bookingData = {
        roomId: room.id,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
      };

      console.log('Sending booking request:', bookingData);
      console.log('With headers:', config.headers);

      const response = await axios.post('http://localhost:8080/bookings', bookingData, config);

      console.log('Booking response:', response.data);
      toast.success('Booking created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Booking error:', error);

      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        // Don't trigger logout here, let the interceptor handle it
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

  const today = new Date().toISOString().split('T')[0];

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
                    {room.price} per night
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Check-in Date
                </label>
                <input
                    type="date"
                    min={today}
                    {...register('checkInDate', { required: 'Check-in date is required' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {errors.checkInDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.checkInDate.message}
                    </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Check-out Date
                </label>
                <input
                    type="date"
                    min={checkInDate || today}
                    {...register('checkOutDate', {
                      required: 'Check-out date is required',
                      validate: (value) => {
                        if (checkInDate && value <= checkInDate) {
                          return 'Check-out date must be after check-in date';
                        }
                        return true;
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {errors.checkOutDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.checkOutDate.message}
                    </p>
                )}
              </div>

              {nights > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {nights} night{nights > 1 ? 's' : ''}
                  </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${room.price} × {nights}
                  </span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-blue-600 dark:text-blue-400">${totalPrice}</span>
                    </div>
                  </div>
              )}

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
                    disabled={loading || nights <= 0}
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