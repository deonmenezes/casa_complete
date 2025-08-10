/**
 * ENHANCED ONBOARDING FLOW: Updated to include user details collection and success popup
 * New flow: UserDetails → Age/Interests → Preferences → Success Popup → Home
 *
 * Changes made:
 * - Added UserDetailsStep (step 0) to collect name and email
 * - Added RegistrationSuccessPopup after completion
 * - Updated step numbering to accommodate new step
 * - Enhanced user experience with personalized success message
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import UserDetailsStep from '../components/UserDetailsStep'; // NEW: User details collection
import OnboardingStep1 from '../components/OnboardingStep1';
import OnboardingStep2 from '../components/OnboardingStep2';
import RegistrationSuccessPopup from '../components/RegistrationSuccessPopup'; // NEW: Success popup

const OnboardingPage: React.FC = () => {
  // STEP MANAGEMENT: Updated to start with step 0 (UserDetailsStep)
  const [currentStep, setCurrentStep] = useState(0); // 0: UserDetails, 1: Age/Interests, 2: Preferences
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // NEW: Success popup state
  const { userData, setUserData, updateOnboardingData, completeOnboarding } = useUser();
  const navigate = useNavigate();

  /**
   * NEW STEP HANDLER: Handles user details collection (name, email, and gender)
   * Saves the collected information to user context and proceeds to next step
   */
  const handleUserDetailsContinue = (name: string, email: string, gender: string) => {
    setUserData(prev => ({
      ...prev,
      name, // Store collected name
      email, // Store collected email
      gender // Store collected gender
    }));
    setCurrentStep(1); // Proceed to age/interests step
  };

  const handleStep1Continue = (ageRange: string, styleInterests: string[]) => {
    updateOnboardingData({
      ageRange,
      styleInterests
    });
    setCurrentStep(2);
  };

  const handleStep2Continue = async (preferredFits: string[]) => {
    updateOnboardingData({
      preferredFits
    });
    await completeOnboarding();
    // ENHANCED UX: Show success popup instead of immediately navigating to home
    setShowSuccessPopup(true);
  };

  /**
   * SUCCESS POPUP HANDLER: Closes popup and navigates to home page
   * This provides a better user experience than immediate navigation
   */
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/'); // Navigate to home after user acknowledges success
  };

  console.log('User data in onboarding:', userData);

  return (
    <div>
      {/* STEP 0: NEW - User Details Collection (Name & Email) */}
      {currentStep === 0 && (
        <UserDetailsStep onContinue={handleUserDetailsContinue} />
      )}
      {/* STEP 1: Age Range and Style Interests */}
      {currentStep === 1 && (
        <OnboardingStep1 onContinue={handleStep1Continue} />
      )}
      {/* STEP 2: Preferred Fits */}
      {currentStep === 2 && (
        <OnboardingStep2 onContinue={handleStep2Continue} />
      )}

      {/* NEW: Success Popup with personalized message */}
      <RegistrationSuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        userName={userData.name} // Pass collected name for personalization
      />
    </div>
  );
};

export default OnboardingPage;
