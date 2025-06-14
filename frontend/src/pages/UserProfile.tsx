import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profileImageUrl?: string;
    createdAt: string;
}

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileFormData>();

    const newPassword = watch('newPassword');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/users/profile');
            setProfile(response.data);
            reset({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                phoneNumber: response.data.phoneNumber || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const updateData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                ...(data.currentPassword && data.newPassword && {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                })
            };

            await axios.put('/users/profile', updateData);
            toast.success('Profile updated successfully!');
            fetchProfile();
            setShowPasswordFields(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/users/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProfile(prev => prev ? { ...prev, profileImageUrl: response.data } : null);
            toast.success('Profile image updated successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    My Profile
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Image Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Profile Picture
                        </h2>

                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    {profile?.profileImageUrl ? (
                                        <img
                                            src={`http://localhost:8080${profile.profileImageUrl}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>

                                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                                    <Camera className="w-4 h-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            {uploading && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Uploading...
                                </p>
                            )}

                            <div className="text-center mt-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {profile?.firstName} {profile?.lastName}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Member since {new Date(profile?.createdAt || '').toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Account Information
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <User className="h-4 w-4 inline mr-1" />
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('firstName', { required: 'First name is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('lastName', { required: 'Last name is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Mail className="h-4 w-4 inline mr-1" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Phone className="h-4 w-4 inline mr-1" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    {...register('phoneNumber')}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Optional"
                                />
                            </div>

                            {/* Password Change Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Change Password
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
                                    >
                                        {showPasswordFields ? 'Cancel' : 'Change Password'}
                                    </button>
                                </div>

                                {showPasswordFields && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Lock className="h-4 w-4 inline mr-1" />
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                {...register('currentPassword', {
                                                    required: showPasswordFields ? 'Current password is required' : false
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.currentPassword && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.currentPassword.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                {...register('newPassword', {
                                                    required: showPasswordFields ? 'New password is required' : false,
                                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.newPassword && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.newPassword.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                {...register('confirmPassword', {
                                                    required: showPasswordFields ? 'Please confirm your new password' : false,
                                                    validate: (value) => !showPasswordFields || value === newPassword || 'Passwords do not match'
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.confirmPassword && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.confirmPassword.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;