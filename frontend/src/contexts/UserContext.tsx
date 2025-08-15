import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface UserData {
  _id: string; // ✅ required
  role: number; // ✅ required
  phoneNumber?: string;
  name?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
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
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const STORAGE_KEY = 'casa_user_data';

// ✅ Validate if _id is a 24-char Mongo ObjectId
const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

const loadUserDataFromStorage = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof parsed.isLoggedIn === 'boolean' &&
        parsed.idLoggedIn === false
      ) {
        // ✅ Allow partially valid data if user is logged in
        return {
          _id: typeof parsed._id === 'string' ? parsed._id : '',
          role: typeof parsed.role === 'number' ? parsed.role : -1,
          phoneNumber: parsed.phoneNumber || '',
          name: parsed.name || '',
          email: parsed.email || '',
          dateOfBirth: parsed.dateOfBirth || '',
          gender: parsed.gender || '',
          isLoggedIn: true,
          isNewUser: parsed.isNewUser ?? false,
          onboardingData: parsed.onboardingData || {}
        };
      }
      else if(
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof parsed.isLoggedIn === 'boolean' &&
        parsed.isLoggedIn === true
      ) {
        return {
          _id: typeof parsed._id === 'string' ? parsed._id : '',
          role: typeof parsed.role === 'number' ? parsed.role : -1,
          phoneNumber: parsed.phoneNumber || '',
          name: parsed.name || '',
          email: parsed.email || '',
          dateOfBirth: parsed.dateOfBirth || '',
          gender: parsed.gender || '',
          isLoggedIn: true,
          isNewUser: parsed.isNewUser ?? false,
          onboardingData: parsed.onboardingData || {}
        };
      }
    }
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
    localStorage.removeItem(STORAGE_KEY);
  }

  // Default fallback (user is logged out)
  return {
    _id: '',
    role: -1,
    isLoggedIn: false,
    isNewUser: false,
    onboardingData: {}
  };
};


const saveUserDataToStorage = (userData: UserData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(loadUserDataFromStorage);

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

  const logout = () => {
    setUserData({
      _id: '',
      role: -1,
      isLoggedIn: false,
      isNewUser: false,
      onboardingData: {}
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const completeOnboarding = async () => {
    try {
      const userDataForBackend = {
        phone: userData.phoneNumber,
        email: userData.email || `${userData.phoneNumber?.replace(/[^0-9]/g, '')}@temp.casa`,
        display_name: userData.name || `User_${userData.phoneNumber?.slice(-4)}`,
        interests: userData.onboardingData?.styleInterests || [],
        ml_preferences: userData.onboardingData?.preferredFits || [],
        age: userData.onboardingData?.ageRange?.includes('Gen Z') ? 22 :
             userData.onboardingData?.ageRange?.includes('Millennial') ? 30 : 25,
        last_login: new Date()
      };

      const response = await axios.post('http://https://casa-backend-uf0h.onrender.com/api/users', userDataForBackend);
      console.log('✅ User registered successfully:', response.data);

      setUserData(prev => ({
        ...prev,
        isNewUser: false,
        isLoggedIn: true,
        _id: response.data._id,
        role: response.data.role
      }));
    } catch (error: any) {
      console.error('❌ Error registering user:', error);
      if (error.response?.status === 400 && error.response.data.error?.includes('duplicate')) {
        console.log('User already exists, marking onboarding as complete');
      }
      setUserData(prev => ({
        ...prev,
        isNewUser: false,
        isLoggedIn: true,
        _id: prev._id || '',
        role: prev.role || 0
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