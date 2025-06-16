import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import { Hotel, User, LogOut, Moon, Sun, Settings, Calendar, Users, Bed, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin, hasRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return null;
    
    if (hasRole('ADMIN')) return { path: '/admin', label: 'Admin', icon: Settings };
    if (hasRole('MANAGER')) return { path: '/manager', label: 'Manager', icon: BarChart3 };
    if (hasRole('RECEPTIONIST')) return { path: '/receptionist', label: 'Reception', icon: Users };
    if (hasRole('CLEANER')) return { path: '/cleaner', label: 'Cleaner', icon: Bed };
    
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                HavenHub
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/rooms"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/rooms')
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Rooms
            </Link>

            {user && (
              <>
                <Link
                  to="/bookings"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/bookings')
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Calendar className="h-4 w-4 inline mr-1" />
                  My Bookings
                </Link>

                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-1" />
                  Profile
                </Link>
              </>
            )}

            {dashboardLink && (
              <Link
                to={dashboardLink.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(dashboardLink.path) || 
                  (dashboardLink.path === '/admin' && isActive('/admin/rooms'))
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <dashboardLink.icon className="h-4 w-4 inline mr-1" />
                {dashboardLink.label}
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <NotificationDropdown />
                
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  {user.profileImageUrl ? (
                    <img
                      src={`http://localhost:8080${user.profileImageUrl}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  {user.roles && user.roles.length > 0 && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      {user.roles[0]}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;