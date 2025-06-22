import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookingModal from './BookingModal';
import { MapPin, DollarSign, Users, Wifi, Coffee, Car, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  status: string;
  price: number;
  imageUrl?: string;
}

interface RoomCardProps {
  room: Room;
  onBookingSuccess?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBookingSuccess }) => {
  const { user } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRoomBooked, setIsRoomBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkRoomBookingStatus();
  }, [room.id]);

  const checkRoomBookingStatus = async () => {
    try {
      setLoading(true);
      // Check if room has any active bookings
      const response = await axios.get(`/bookings`);
      const bookings = response.data;

      const activeBooking = bookings.find((booking: any) =>
          booking.room.id === room.id &&
          (booking.status === 'APPROVED' || booking.status === 'PENDING')
      );

      setIsRoomBooked(!!activeBooking);
    } catch (error) {
      console.error('Error checking room booking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = () => {
    if (!user) {
      toast.error('Please login to book a room');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book a room');
      return;
    }

    if (isRoomBooked) {
      toast.error('This room is currently booked or pending approval');
      return;
    }

    setIsBookingModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'single':
        return <Users className="h-4 w-4" />;
      case 'double':
        return <Users className="h-4 w-4" />;
      case 'suite':
        return <Users className="h-4 w-4" />;
      case 'deluxe':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    onBookingSuccess?.();
    checkRoomBookingStatus(); // Refresh booking status
    toast.success('Booking created successfully! Check your notifications for updates.');
  };

  const isBookingDisabled = () => {
    return room.status !== 'AVAILABLE' || isRoomBooked || loading;
  };

  const getBookingButtonText = () => {
    if (loading) return 'Checking...';
    if (room.status !== 'AVAILABLE') return 'Not Available';
    if (isRoomBooked) return 'Currently Booked';
    return 'Book Now';
  };

  const getBookingButtonReason = () => {
    if (room.status !== 'AVAILABLE') {
      return `Room is currently ${room.status.toLowerCase()}`;
    }
    if (isRoomBooked) {
      return 'This room is currently booked or pending approval';
    }
    return '';
  };

  const hourlyRate = room.price / 24;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img
              src={room.imageUrl || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'}
              alt={`Room ${room.roomNumber}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
              }}
          />
          <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
            {room.status}
          </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Room {room.roomNumber}
              </h3>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                {getRoomTypeIcon(room.type)}
                <span className="ml-1 capitalize">{room.type}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                <DollarSign className="h-5 w-5" />
                {room.price}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">per day</span>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                ${hourlyRate.toFixed(2)}/hour
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Wifi className="h-4 w-4 mr-1" />
                <span>Free WiFi</span>
              </div>
              <div className="flex items-center">
                <Coffee className="h-4 w-4 mr-1" />
                <span>Coffee</span>
              </div>
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1" />
                <span>Parking</span>
              </div>
            </div>
          </div>

          {getBookingButtonReason() && (
              <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  {getBookingButtonReason()}
                </p>
              </div>
          )}

          <button
              onClick={handleBookingClick}
              disabled={isBookingDisabled()}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isBookingDisabled()
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {getBookingButtonText()}
          </button>
        </div>

        {isBookingModalOpen && (
            <BookingModal
                room={room}
                onClose={() => setIsBookingModalOpen(false)}
                onSuccess={handleBookingSuccess}
            />
        )}
      </div>
  );
};

export default RoomCard;