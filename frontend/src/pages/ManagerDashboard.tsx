import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Bed, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  totalBookings: number;
  totalUsers: number;
}

const ManagerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    totalBookings: 0,
    totalUsers: 0
  });
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        axios.get('/manager/dashboard'),
        axios.get('/manager/analytics')
      ]);

      setStats(statsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const roomStatusData = [
    { name: 'Available', value: stats.availableRooms, color: '#10B981' },
    { name: 'Booked', value: stats.bookedRooms, color: '#F59E0B' },
    { name: 'Maintenance', value: stats.totalRooms - stats.availableRooms - stats.bookedRooms, color: '#EF4444' }
  ];

  const bookingTrendsData = [
    { name: 'Jan', bookings: 45 },
    { name: 'Feb', bookings: 52 },
    { name: 'Mar', bookings: 48 },
    { name: 'Apr', bookings: 61 },
    { name: 'May', bookings: 55 },
    { name: 'Jun', bookings: 67 }
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
          Manager Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Analytics, monitoring, and system overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Booked</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalBookings}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalUsers}</p>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
            Booking Trends (6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Occupancy Rate</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                {stats.totalRooms > 0 ? Math.round((stats.bookedRooms / stats.totalRooms) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Daily Rate</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">$185</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Revenue per Room</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">$142</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">4.8/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            System Health
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">System Status</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Database Health</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Excellent</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">API Response Time</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">45ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="text-gray-900 dark:text-white font-semibold">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Recent System Activity
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center text-white text-sm font-semibold mr-3">
                B
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New booking created for Room 101
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center text-white text-sm font-semibold mr-3">
                C
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Room 205 marked as cleaned
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="bg-purple-500 rounded-full h-8 w-8 flex items-center justify-center text-white text-sm font-semibold mr-3">
                U
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New user registered
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;