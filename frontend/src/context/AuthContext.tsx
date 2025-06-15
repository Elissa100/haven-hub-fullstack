import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Axios interceptor to handle token refresh and errors
const setupAxiosInterceptors = (logout: () => void) => {
  // Request interceptor to add token to all requests
  axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
  );

  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Only logout if it's not a login/register request
          const isAuthRequest = error.config?.url?.includes('/auth/');
          if (!isAuthRequest) {
            console.log('401 error detected, logging out user');
            logout();
          }
        }
        return Promise.reject(error);
      }
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.includes('ADMIN') || false;
  const hasRole = (role: string) => user?.roles?.includes(role) || false;

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    // Configure axios defaults
    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.timeout = 10000;

    // Setup interceptors
    setupAxiosInterceptors(logout);

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Verify token is still valid by making a test request
        axios.get('/users/profile')
            .then(response => {
              // Update user data from server
              const serverUser = response.data;
              const updatedUser = {
                id: serverUser.id,
                firstName: serverUser.firstName,
                lastName: serverUser.lastName,
                email: serverUser.email,
                phoneNumber: serverUser.phoneNumber,
                profileImageUrl: serverUser.profileImageUrl,
                roles: parsedUser.roles // Keep roles from token
              };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            .catch((error) => {
              // Token is invalid, clear auth data
              console.log('Token validation failed:', error);
              if (error.response?.status === 401) {
                logout();
              }
            });
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const { accessToken, id, firstName, lastName, roles } = response.data;

      const userObj = { id, firstName, lastName, email, roles };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userObj));

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(userObj);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      await axios.post('/auth/register', userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            login,
            register,
            logout,
            isAdmin,
            hasRole,
            loading,
            updateUser,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};