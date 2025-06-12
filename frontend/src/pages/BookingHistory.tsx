import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, DollarSign, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    id: number;
    roomNumber: string;
    type: string;
    price: number;
    imageUrl?: string;
  };
  checkInDate: string;
  checkOutDate: string;
  status: string;
  createdAt: string;
}

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bookings/my');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:8080/bookings/${bookingId}`);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          My Bookings
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Track and manage your hotel reservations.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            No bookings found.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Book your first room to see your reservations here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
            const totalPrice = nights * booking.room.price;

            return (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={booking.room.imageUrl || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'}
                      alt={`Room ${booking.room.roomNumber}`}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                          Room {booking.room.roomNumber}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 capitalize mb-2">
                          {booking.room.type} Room
                        </p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          <DollarSign className="h-5 w-5" />
                          {totalPrice}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {nights} night{nights > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <div>
                          <p className="text-sm">Check-in</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(booking.checkInDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <div>
                          <p className="text-sm">Check-out</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(booking.checkOutDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <Clock className="h-4 w-4 mr-1" />
                      Booked on {formatDate(booking.createdAt)}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Booking ID: #{booking.id}
                      </div>
                      
                      {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;