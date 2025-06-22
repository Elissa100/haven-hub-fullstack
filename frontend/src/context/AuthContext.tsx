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
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.includes('ADMIN') || false;
  const hasRole = (role: string) => user?.roles?.includes(role) || false;

  useEffect(() => {
    // Configure axios defaults
    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.timeout = 10000;

    // Add request interceptor for better logging
    axios.interceptors.request.use(
        (config) => {
          console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
          return config;
        },
        (error) => {
          console.error('Request error:', error);
          return Promise.reject(error);
        }
    );

    // Add response interceptor for better error handling
    axios.interceptors.response.use(
        (response) => {
          console.log(`Response from ${response.config.url}:`, response.status);
          return response;
        },
        (error) => {
          console.error('Response error:', error);

          if (error.response) {
            // Server responded with error status
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
          } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
          } else {
            // Something else happened
            console.error('Error message:', error.message);
          }

          return Promise.reject(error);
        }
    );

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('User restored from localStorage:', JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for email:', email);

      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      const { accessToken, id, firstName, lastName, roles } = response.data;

      const userObj = { id, firstName, lastName, email, roles };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userObj));

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(userObj);

      console.log('Login successful for user:', userObj);
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log('Attempting registration for email:', userData.email);

      await axios.post('/auth/register', userData);

      console.log('Registration successful');
    } catch (error: any) {
      console.error('Registration error:', error);

      let errorMessage = 'Registration failed';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Email already exists or invalid data';
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
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
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};