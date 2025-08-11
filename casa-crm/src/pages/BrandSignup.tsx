import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Globe, Camera, Plus, X, AlertCircle, Check, MapPin, Phone, Landmark } from 'lucide-react';

interface StoreAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
}

interface EmergencyContact {
  name: string;
  email: string;
  number: string;
  working_hours: string;
}

interface BankDetails {
  account_number: string;
  ifsc_code: string;
  upi_id: string;
}

interface FormData {
  name: string;
  logo_url: string;
  description: string;
  website: string;
  social_links: string[];
  email: string;
  password: string;
  store_addresses: StoreAddress[];
  emergency_contact: EmergencyContact;
  bank_details: BankDetails;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const BrandSignup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    logo_url: '',
    description: '',
    website: '',
    social_links: [''],
    email: '',
    password: '',
    store_addresses: [{
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      landmark: ''
    }],
    emergency_contact: {
      name: '',
      email: '',
      number: '',
      working_hours: ''
    },
    bank_details: {
      account_number: '',
      ifsc_code: '',
      upi_id: ''
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Brand name is required';
    if (!formData.logo_url.trim()) newErrors.logo_url = 'Logo URL is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Store address validation
    formData.store_addresses.forEach((addr, idx) => {
      if (!addr.street) newErrors[`store_${idx}_street`] = 'Street is required';
      if (!addr.city) newErrors[`store_${idx}_city`] = 'City is required';
      if (!addr.state) newErrors[`store_${idx}_state`] = 'State is required';
      if (!addr.country) newErrors[`store_${idx}_country`] = 'Country is required';
      if (!addr.pincode) newErrors[`store_${idx}_pincode`] = 'Pincode is required';
    });

    // Emergency contact validation
    if (!formData.emergency_contact.name) newErrors.emergency_name = 'Name is required';
    if (!formData.emergency_contact.email || !validateEmail(formData.emergency_contact.email)) newErrors.emergency_email = 'Valid email is required';
    if (!formData.emergency_contact.number) newErrors.emergency_number = 'Number is required';
    if (!formData.emergency_contact.working_hours) newErrors.emergency_hours = 'Working hours are required';

    // Bank details validation
    if (!formData.bank_details.account_number) newErrors.bank_acc = 'Account number is required';
    if (!formData.bank_details.ifsc_code) newErrors.bank_ifsc = 'IFSC code is required';
    if (!formData.bank_details.upi_id) newErrors.bank_upi = 'UPI ID is required';

    setErrors(newErrors);
    console.log(newErrors)
    console.log(Object.keys(newErrors).length === 0)
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleStoreChange = (index: number, field: keyof StoreAddress, value: string) => {
    const newStores = [...formData.store_addresses];
    newStores[index][field] = value;
    setFormData(prev => ({ ...prev, store_addresses: newStores }));
  };

  const handleEmergencyChange = (field: keyof EmergencyContact, value: string) => {
    setFormData(prev => ({ ...prev, emergency_contact: { ...prev.emergency_contact, [field]: value } }));
  };

  const handleBankChange = (field: keyof BankDetails, value: string) => {
    setFormData(prev => ({ ...prev, bank_details: { ...prev.bank_details, [field]: value } }));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const links = [...formData.social_links];
    links[index] = value;
    setFormData(prev => ({ ...prev, social_links: links }));
  };

  const addSocialLink = () => setFormData(prev => ({ ...prev, social_links: [...prev.social_links, ''] }));

  const removeSocialLink = (index: number) => {
    if (formData.social_links.length > 1) {
      setFormData(prev => ({ ...prev, social_links: prev.social_links.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const cleanedData = {
        ...formData,
        social_links: formData.social_links.filter(link => link.trim() !== '')
      };
      const res = await fetch('http://localhost:5002/api/brands/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      if (res.ok) setIsSuccess(true);
      else {
        const data = await res.json();
        setErrors({ general: data.message || 'Registration failed' });
      }
    } catch {
      setErrors({ general: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg max-w-sm">
          <Check className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold mt-4">Registration Successful!</h1>
          <Link to="/login" className="mt-4 block bg-blue-500 text-white py-3 rounded-xl">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Brand Signup</h1>
        {errors.general && <p className="bg-red-100 text-red-600 p-3 rounded-xl">{errors.general}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Brand Info */}
          <input type="text" name="name" placeholder="Brand Name" value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50" />
          <input type="url" name="logo_url" placeholder="Logo URL" value={formData.logo_url} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50" />
          <input type="url" name="website" placeholder="Website" value={formData.website} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50" />

          {/* Social Links */}
          {formData.social_links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input type="url" value={link} onChange={(e) => handleSocialLinkChange(i, e.target.value)} className="flex-1 p-3 rounded-xl bg-slate-50" />
              {formData.social_links.length > 1 && (
                <button type="button" onClick={() => removeSocialLink(i)} className="bg-red-200 p-2 rounded-xl"><X /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSocialLink} className="w-full bg-slate-100 py-2 rounded-xl">+ Add Social Link</button>

          {/* Store Address */}
          <h2 className="font-semibold mt-4">Store Address</h2>
          {formData.store_addresses.map((store, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2">
              {Object.keys(store).map((field) => (
                <input key={field} type="text" placeholder={field} value={(store as any)[field]} onChange={(e) => handleStoreChange(idx, field as keyof StoreAddress, e.target.value)} className="p-3 rounded-xl bg-slate-50 col-span-1" />
              ))}
            </div>
          ))}

          {/* Emergency Contact */}
          <h2 className="font-semibold mt-4">Emergency Contact</h2>
          {Object.keys(formData.emergency_contact).map((field) => (
            <input key={field} type="text" placeholder={field} value={(formData.emergency_contact as any)[field]} onChange={(e) => handleEmergencyChange(field as keyof EmergencyContact, e.target.value)} className="w-full p-3 rounded-xl bg-slate-50" />
          ))}

          {/* Bank Details */}
          <h2 className="font-semibold mt-4">Bank Details</h2>
          {Object.keys(formData.bank_details).map((field) => (
            <input key={field} type="text" placeholder={field} value={(formData.bank_details as any)[field]} onChange={(e) => handleBankChange(field as keyof BankDetails, e.target.value)} className="w-full p-3 rounded-xl bg-slate-50" />
          ))}

          {/* Email & Password */}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50" />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 rounded-xl">{isLoading ? 'Creating...' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  );
};

export default BrandSignup;
