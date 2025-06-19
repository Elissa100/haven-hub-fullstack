import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Bed, Calendar, DollarSign, Settings, TrendingUp, BarChart3, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import CreateUserModal from '../components/CreateUserModal';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  totalBookings: number;
  pendingBookings: number;
  totalUsers: number;
}

interface Booking {
  id: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    roomNumber: string;
    type: string;
  };
  checkInDate: string;
  checkOutDate: string;
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [roomsResponse, bookingsResponse] = await Promise.all([
        axios.get('/rooms'),
        axios.get('/bookings')
      ]);

      const rooms = roomsResponse.data;
      const bookings = bookingsResponse.data;

      // Calculate booked rooms (rooms with approved or pending bookings)
      const bookedRoomIds = new Set();
      bookings.forEach((booking: any) => {
        if (booking.status === 'APPROVED' || booking.status === 'PENDING') {
          bookedRoomIds.add(booking.room.id);
        }
      });

      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.filter((room: any) => room.status === 'AVAILABLE').length - bookedRoomIds.size,
        bookedRooms: bookedRoomIds.size,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((booking: any) => booking.status === 'PENDING').length,
        totalUsers: 0 // This would need a separate endpoint
      });

      // Get recent bookings (last 5)
      const sortedBookings = bookings
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

      setRecentBookings(sortedBookings);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await axios.put(`/bookings/${bookingId}/status?status=${status}`);
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update booking status');
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
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Chart data
  const roomStatusData = [
    { name: 'Available', value: stats.availableRooms, color: '#10B981' },
    { name: 'Booked', value: stats.bookedRooms, color: '#F59E0B' },
    { name: 'Maintenance', value: stats.totalRooms - stats.availableRooms - stats.bookedRooms, color: '#EF4444' }
  ];

  const bookingStatusData = [
    { name: 'Pending', value: stats.pendingBookings },
    { name: 'Approved', value: stats.totalBookings - stats.pendingBookings }
  ];

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
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your hotel operations and monitor performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRooms}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Bed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Rooms</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.availableRooms}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Booked Rooms</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.bookedRooms}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Bookings</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.pendingBookings}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Room Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={roomStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                >
                  {roomStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Booking Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions and System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                  to="/admin/rooms"
                  className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">Manage Rooms</span>
              </Link>
              <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors w-full text-left"
              >
                <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-green-700 dark:text-green-300 font-medium">Create Staff User</span>
              </button>
              <button className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors w-full text-left">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">View Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                {stats.totalRooms > 0 ? Math.round((stats.bookedRooms / stats.totalRooms) * 100) : 0}%
              </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">System Status</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white font-semibold">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Recent Bookings
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        Room {booking.room.roomNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {booking.room.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {booking.status === 'PENDING' && (
                          <div className="flex space-x-2">
                            <button
                                onClick={() => updateBookingStatus(booking.id, 'APPROVED')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                            >
                              Approve
                            </button>
                            <button
                                onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                            >
                              Reject
                            </button>
                          </div>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateUserModal && (
            <CreateUserModal
                onClose={() => setShowCreateUserModal(false)}
                onSuccess={() => {
                  setShowCreateUserModal(false);
                  fetchDashboardData();
                }}
            />
        )}
      </div>
  );
};

export default AdminDashboard;