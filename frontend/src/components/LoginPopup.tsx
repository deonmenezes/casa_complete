import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import OtpInput from './OtpInput';


interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: (email: string) => void; // Changed from phoneNumber to email
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose, onContinue }) => {
  const [email, setEmail] = useState(''); // Changed from phoneNumber
  const [emailError, setEmailError] = useState(''); // Changed from phoneError
  const [step, setStep] = useState<'email' | 'otp'>('email'); // Changed from 'phone' to 'email'
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [fullEmail, setFullEmail] = useState(''); // Changed from fullPhoneNumber

  const { setUserData } = useUser();
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const isEmailValid = validateEmail(email);

  const handleContinue = async () => {
    if (!isEmailValid) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setFullEmail(email);

    try {
<<<<<<< HEAD
      // Generate OTP for email
      const response = await fetch('http://localhost:5002/api/users/generate-otp', {
=======
      const res = await fetch('http://https://casa-backend-uf0h.onrender.com/api/users/generate-otp', {
>>>>>>> ade6ad192c2a962557a2f4760de75691b79847ca
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Email sent successfully - OTP is included in response for development
          setGeneratedOtp(data.otp?.toString() || '');
          setStep('otp');
          console.log('📧 OTP sent to email:', email, 'OTP:', data.otp);
          
          // Show success message
          setEmailError(''); // Clear any previous errors
        } else {
          // Email failed but OTP generated (development fallback)
          if (data.otp) {
            setGeneratedOtp(data.otp.toString());
            setStep('otp');
            console.log('📧 OTP generated (email failed):', data.otp);
            // Show warning that email failed
            setEmailError('Email service unavailable, but OTP generated. Check console for OTP.');
          } else {
            setEmailError(data.error || 'Failed to generate OTP');
          }
        }
      } else {
        const errorData = await response.json();
        setEmailError(errorData.error || 'Failed to generate OTP');
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      setEmailError('Network error. Please try again.');
    }
  };

  /**
   * OTP VERIFICATION: Handles successful OTP verification and user context update
   * PERSISTENCE: User data is automatically saved to localStorage via UserContext
   * USER DETECTION: Checks if user exists in backend to determine if they're new or returning
   */
  const handleOtpVerify = async (enteredOtp: string) => {
    console.log('🔍 Verifying OTP:', {
      enteredOtp,
      generatedOtp,
      fullEmail,
      otpMatch: enteredOtp === generatedOtp.toString()
    });

    if (enteredOtp === generatedOtp.toString()) {
      console.log('✅ OTP verified successfully');

      try {
        // CHECK IF USER EXISTS: Query backend to see if this is a returning user
<<<<<<< HEAD
        console.log('🔍 Checking user existence for email:', fullEmail);
        const response = await fetch(`http://localhost:5002/api/users/by-email?email=${encodeURIComponent(fullEmail)}`);
        const users = await response.json();

        console.log('📧 API Response:', {
          url: `http://localhost:5002/api/users/by-email?email=${encodeURIComponent(fullEmail)}`,
=======
        console.log('🔍 Checking user existence for phone:', fullPhoneNumber);
        const response = await fetch(`http://https://casa-backend-uf0h.onrender.com/api/users?phone=${encodeURIComponent(fullPhoneNumber)}`);
        const users = await response.json();

        console.log('📞 API Response:', {
          url: `http://https://casa-backend-uf0h.onrender.com/api/users?phone=${encodeURIComponent(fullPhoneNumber)}`,
>>>>>>> ade6ad192c2a962557a2f4760de75691b79847ca
          responseStatus: response.status,
          usersCount: users.length,
          users: users
        });

        const existingUser = users.find((user: any) => user.email === fullEmail);
        const isNewUser = !existingUser;

        console.log('User check result:', {
          fullEmail,
          existingUser,
          isNewUser,
          userEmails: users.map((u: any) => u.email)
        });

        // ENHANCED USER CONTEXT: Update with login status and user detection
        setUserData({
          _id: existingUser?._id,
          email: fullEmail,
          name: existingUser?.display_name || undefined,
          phoneNumber: existingUser?.phone || undefined,
          isLoggedIn: true,
          isNewUser: isNewUser,
          onboardingData: existingUser ? {
            ageRange: existingUser.age <= 25 ? 'Gen Z (18-25)' : existingUser.age <= 35 ? 'Millennial (26-35)' : 'Other',
            styleInterests: existingUser.interests || [],
            preferredFits: existingUser.ml_preferences || []
          } : {}
        });

        // Close the popup
        handleClose();

        // Call the original onContinue if provided (for backward compatibility)
        if (onContinue) {
          onContinue(fullEmail);
        }

        // SMART NAVIGATION: Only redirect to onboarding if user is new
        if (isNewUser) {
          console.log('New user detected - redirecting to onboarding');
          navigate('/onboarding');
        } else {
          console.log('Existing user detected - redirecting to home');
          navigate('/');
        }

        // REMOVED: User creation logic - let onboarding handle this
        // The onboarding process will create the user with complete data

      } catch (error) {
        console.error('❌ Error checking user existence:', error);
        
        // FALLBACK: If backend check fails, treat as new user
        setUserData({
          email: fullEmail,
          isLoggedIn: true,
          isNewUser: true,
          name: undefined,
          phoneNumber: undefined,
          _id: undefined
        });

        handleClose();
        if (onContinue) {
          onContinue(fullEmail);
        }
        navigate('/onboarding');
      }
    } else {
      console.log('❌ Invalid OTP');
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/users/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: fullEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Email sent successfully - update OTP for new verification
          if (data.otp) {
            setGeneratedOtp(data.otp.toString());
            console.log('📧 New OTP sent to email:', fullEmail, 'New OTP:', data.otp);
          }
        } else {
          // Email failed but OTP generated (development fallback)
          if (data.otp) {
            setGeneratedOtp(data.otp.toString());
            console.log('📧 New OTP generated (email failed):', data.otp);
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to resend OTP:', errorData.error);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  const handleBack = () => {
    setStep('email');
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setGeneratedOtp('');
    setFullEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-gray-800 rounded-t-3xl p-6 pb-8 animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-8 pt-4">
          {step === 'email' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Login/Signup</h2>
              
              <div className="mb-6">
                <label className="block text-white font-medium mb-4">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 outline-none text-base rounded-lg ${
                    emailError ? 'border-2 border-red-500' : ''
                  }`}
                />

                {emailError && (
                  <p className="text-red-400 text-sm mt-2">
                    {emailError}
                  </p>
                )}

                <p className="text-gray-400 text-sm mt-3">
                  A verification code will be sent to this email address
                </p>
              </div>

              <div className="mb-8">
                <p className="text-gray-400 text-sm leading-relaxed">
                  By clicking, I accept the{' '}
                  <span className="text-white font-medium underline cursor-pointer hover:text-blue-400 transition-colors">
                    Terms & Conditions
                  </span>{' '}
                  &{' '}
                  <span className="text-white font-medium underline cursor-pointer hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </span>
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={!isEmailValid}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isEmailValid
                    ? 'bg-gray-300 text-gray-900 hover:bg-white active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </>
          ) : (
            <OtpInput
              phoneNumber={fullEmail} // Pass fullEmail to OtpInput (will contain email)
              onBack={handleBack}
              onVerify={handleOtpVerify}
              onResend={handleResendOtp}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPopup;