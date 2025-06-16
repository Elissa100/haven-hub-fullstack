import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bed, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  status: string;
  price: number;
  imageUrl?: string;
}

const CleanerDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedRooms();
  }, []);

  const fetchAssignedRooms = async () => {
    try {
      const response = await axios.get('/cleaner/rooms');
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to fetch assigned rooms');
    } finally {
      setLoading(false);
    }
  };

  const updateRoomStatus = async (roomId: number, status: string) => {
    try {
      await axios.put(`/cleaner/rooms/${roomId}/status?status=${status}`);
      toast.success(`Room status updated to ${status}`);
      fetchAssignedRooms();
    } catch (error) {
      toast.error('Failed to update room status');
    }
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'occupied':
        return <Clock className="h-5 w-5 text-red-600" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bed className="h-5 w-5 text-gray-600" />;
    }
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
          Cleaner Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Manage room cleaning status and maintenance requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{rooms.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Bed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {rooms.filter(room => room.status === 'AVAILABLE').length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {rooms.filter(room => room.status === 'MAINTENANCE').length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={room.imageUrl || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Room {room.roomNumber}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {room.type} Room
                  </p>
                </div>
                {getStatusIcon(room.status)}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => updateRoomStatus(room.id, 'AVAILABLE')}
                  disabled={room.status === 'AVAILABLE'}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Mark as Clean
                </button>
                <button
                  onClick={() => updateRoomStatus(room.id, 'MAINTENANCE')}
                  disabled={room.status === 'MAINTENANCE'}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Needs Maintenance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <Bed className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            No rooms assigned yet.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Check back later for room assignments.
          </p>
        </div>
      )}
    </div>
  );
};

export default CleanerDashboard;