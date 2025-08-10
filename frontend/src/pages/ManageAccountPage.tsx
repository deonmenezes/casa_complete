/**
 * MANAGE ACCOUNT PAGE: Allows users to edit and update their profile information
 * Features:
 * - Edit full name, phone number, email
 * - Update Instagram username for discounts
 * - Set date of birth
 * - Select gender
 * - Delete account option
 * - Form validation and error handling
 * - Backend integration for updates
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, Trash2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const ManageAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  
  // FORM STATE: Managing editable user information (phone number is read-only)
  const [formData, setFormData] = useState({
    fullName: userData.name || '',
    email: userData.email || '',
    dateOfBirth: userData.dateOfBirth || '',
    gender: userData.gender || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // NEW: Loading state for deletion
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');

  // LOAD USER DATA: Populate form with existing user data on component mount
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.name || '',
        email: userData.email || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || ''
      });
    }
  }, [userData]);

  const handleBack = () => {
    navigate('/profile');
  };

  // FORM VALIDATION: Validate user input before submission (phone number is read-only)
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FORM SUBMISSION: Handle form submission and backend update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // UPDATE USER CONTEXT: Update local state immediately for better UX (phone number unchanged)
      const updatedUserData = {
        ...userData,
        name: formData.fullName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      };

      setUserData(updatedUserData);
      
      // TODO: Add backend API call to update user information
      // const response = await fetch(`http://localhost:5002/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedData)
      // });

      setSuccessMessage('Profile updated successfully!');
      
      // AUTO-HIDE SUCCESS MESSAGE: Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // INPUT CHANGE HANDLER: Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // CLEAR FIELD ERROR: Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // GENDER SELECTION: Handle gender button selection
  const handleGenderSelect = (gender: string) => {
    handleInputChange('gender', gender);
  };

  // DELETE ACCOUNT: Handle account deletion with confirmation
  const handleDeleteAccount = async () => {
    // CONFIRMATION DIALOG: Double-check with user before deletion
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.'
    );

    if (!confirmDelete) {
      return; // User cancelled deletion
    }

    // FINAL CONFIRMATION: Extra safety check
    const finalConfirm = window.confirm(
      'This is your final warning. Deleting your account will:\n\n' +
      '• Remove all your personal information\n' +
      '• Delete your preferences and history\n' +
      '• Log you out immediately\n\n' +
      'Are you absolutely sure you want to proceed?'
    );

    if (!finalConfirm) {
      return; // User cancelled final confirmation
    }

    setIsDeleting(true);
    setErrors({});

    try {
      // BACKEND API CALL: Delete user account from database
      const response = await fetch('http://localhost:5002/api/users/delete-by-phone', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: userData.phoneNumber
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Account deleted successfully:', result);

        // IMMEDIATE LOGOUT: Clear user data and redirect
        setUserData({
          isLoggedIn: false,
          isNewUser: false,
          onboardingData: {}
        });

        // SHOW SUCCESS MESSAGE: Brief confirmation before redirect
        alert('Your account has been deleted successfully. You will now be logged out.');

        // REDIRECT TO HOME: Navigate away from profile
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error('Delete account error:', errorData);
        setErrors({ general: errorData.error || 'Failed to delete account. Please try again.' });
      }
    } catch (error) {
      console.error('Network error during account deletion:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* HEADER: Navigation and title */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Manage Account</h1>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PROFILE AVATAR SECTION */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {formData.fullName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
              >
                <Edit size={14} />
              </button>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="bg-green-600 text-white p-3 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          {/* GENERAL ERROR */}
          {errors.general && (
            <div className="bg-red-600 text-white p-3 rounded-lg text-center">
              {errors.general}
            </div>
          )}

          {/* FULL NAME FIELD */}
          <div>
            <label className="block text-white font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full p-4 rounded-xl bg-gray-800 text-white border-2 transition-colors ${
                errors.fullName ? 'border-red-500' : 'border-gray-700 focus:border-gray-600'
              } focus:outline-none`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-2">{errors.fullName}</p>
            )}
          </div>

          {/* PHONE NUMBER FIELD - READ ONLY */}
          <div>
            <label className="block text-white font-medium mb-2">Phone Number</label>
            <div className="flex bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 opacity-60">
              <div className="flex items-center px-4 py-4 bg-gray-700 text-gray-300">
                +91
              </div>
              <input
                type="tel"
                value={userData.phoneNumber?.replace('+91', '') || ''}
                readOnly
                className="flex-1 px-4 py-4 bg-gray-800 text-gray-400 cursor-not-allowed focus:outline-none"
                placeholder="Phone Number"
              />
              <div className="px-4 py-4 text-gray-500">
                Cannot Edit
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">Phone number cannot be changed for security reasons</p>
          </div>

          {/* EMAIL FIELD */}
          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-4 rounded-xl bg-gray-800 text-white border-2 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-700 focus:border-gray-600'
              } focus:outline-none`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">{errors.email}</p>
            )}
          </div>



          {/* DATE OF BIRTH FIELD */}
          <div>
            <label className="block text-white font-medium mb-2">DOB</label>
            <div className="relative">
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-800 text-white border-2 border-gray-700 focus:border-gray-600 focus:outline-none"
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* GENDER SELECTION */}
          <div>
            <label className="block text-white font-medium mb-4">Gender</label>
            <div className="flex space-x-3">
              {['Male', 'Female', 'Other'].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleGenderSelect(gender)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    formData.gender === gender
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-900 hover:bg-white active:scale-95'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>

          {/* DELETE ACCOUNT BUTTON */}
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className={`w-full py-4 rounded-xl font-semibold text-lg border-2 transition-all flex items-center justify-center space-x-2 ${
              isDeleting
                ? 'bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Trash2 size={20} />
            <span>{isDeleting ? 'DELETING...' : 'DELETE ACCOUNT'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAccountPage;
