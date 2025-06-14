import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import BookingHistory from './pages/BookingHistory';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import ManageRooms from './pages/ManageRooms';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/rooms" element={<Rooms />} />
                                <Route
                                    path="/bookings"
                                    element={
                                        <ProtectedRoute>
                                            <BookingHistory />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <UserProfile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/rooms"
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <ManageRooms />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </main>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                className: 'dark:bg-gray-800 dark:text-white',
                            }}
                        />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;