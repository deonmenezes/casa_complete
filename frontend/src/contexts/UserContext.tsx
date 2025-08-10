import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// ENHANCEMENT: Added name and email fields to store user's personal information
// collected during the onboarding process
// MANAGE ACCOUNT: Added additional fields for profile management
export interface UserData {
  phoneNumber?: string;
  name?: string; // User's full name collected in UserDetailsStep
  email?: string; // User's email address collected in UserDetailsStep
  dateOfBirth?: string; // User's date of birth
  gender?: string; // User's gender selection (collected in UserDetailsStep)
  isLoggedIn: boolean;
  isNewUser: boolean;
  onboardingData?: {
    ageRange?: string;
    styleInterests?: string[];
    preferredFits?: string[];
  };
}

interface UserContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
  updateOnboardingData: (data: Partial<UserData['onboardingData']>) => void;
  completeOnboarding: () => Promise<void>;
  logout: () => void; // ENHANCEMENT: Added logout function for proper session management
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// PERSISTENCE FEATURE: Helper functions for localStorage to maintain user session
// across page refreshes and browser restarts
const STORAGE_KEY = 'casa_user_data';

/**
 * PERSISTENCE: Loads user data from localStorage on app startup
 * Includes validation to handle corrupted or invalid data
 * @returns UserData object or default logged-out state
 */
const loadUserDataFromStorage = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that the parsed data has the expected structure
      if (typeof parsed === 'object' && parsed !== null &&
          typeof parsed.isLoggedIn === 'boolean') {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
    // Clear corrupted data to prevent future issues
    localStorage.removeItem(STORAGE_KEY);
  }
  // Return default logged-out state if no valid data found
  return {
    isLoggedIn: false,
    isNewUser: false,
    onboardingData: {}
  };
};

/**
 * PERSISTENCE: Saves user data to localStorage for session persistence
 * @param userData - The user data to save
 */
const saveUserDataToStorage = (userData: UserData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // PERSISTENCE: Initialize state with data from localStorage instead of default values
  const [userData, setUserData] = useState<UserData>(loadUserDataFromStorage);

  // PERSISTENCE: Auto-save to localStorage whenever userData changes
  // This ensures user session persists across page refreshes
  useEffect(() => {
    saveUserDataToStorage(userData);
  }, [userData]);

  const updateOnboardingData = (data: Partial<UserData['onboardingData']>) => {
    setUserData(prev => ({
      ...prev,
      onboardingData: {
        ...prev.onboardingData,
        ...data
      }
    }));
  };

  /**
   * LOGOUT FUNCTIONALITY: Properly clears user session
   * Resets both React state and localStorage to ensure complete logout
   */
  const logout = () => {
    const defaultUserData = {
      isLoggedIn: false,
      isNewUser: false,
      onboardingData: {}
    };
    setUserData(defaultUserData);
    localStorage.removeItem(STORAGE_KEY); // Clear persisted data
  };

  const completeOnboarding = async () => {
    try {
      // BACKEND INTEGRATION: Prepare user data for backend API
      // Uses collected name/email from UserDetailsStep, falls back to generated values
      const userDataForBackend = {
        phone: userData.phoneNumber,
        email: userData.email || `${userData.phoneNumber?.replace(/[^0-9]/g, '')}@temp.casa`, // Use collected email or generate temp
        display_name: userData.name || `User_${userData.phoneNumber?.slice(-4)}`, // Use collected name or generate from phone
        interests: userData.onboardingData?.styleInterests || [],
        ml_preferences: userData.onboardingData?.preferredFits || [],
        age: userData.onboardingData?.ageRange?.includes('Gen Z') ? 22 :
             userData.onboardingData?.ageRange?.includes('Millennial') ? 30 : 25,
        last_login: new Date()
      };

      // Send data to backend
      console.log('Sending user data to backend:', userDataForBackend);
      const response = await axios.post('http://localhost:5002/api/users', userDataForBackend);
      console.log('User registered successfully:', response.data);

      // ONBOARDING COMPLETION: Mark user as no longer new
      setUserData(prev => ({
        ...prev,
        isNewUser: false
      }));
    } catch (error: any) {
      console.error('Error registering user:', error);
      if (error.response) {
        console.error('Backend error response:', error.response.data);
        console.error('Status:', error.response.status);

        // DUPLICATE USER HANDLING: If user already exists, just mark onboarding as complete
        if (error.response.status === 400 &&
            error.response.data.error &&
            error.response.data.error.includes('duplicate')) {
          console.log('User already exists, marking onboarding as complete');
        }
      }
      // FALLBACK: Still update local state even if backend fails
      setUserData(prev => ({
        ...prev,
        isNewUser: false
      }));
    }
  };

  return (
    <UserContext.Provider value={{
      userData,
      setUserData,
      updateOnboardingData,
      completeOnboarding,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
