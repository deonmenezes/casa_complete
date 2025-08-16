import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios'

// Define TypeScript interfaces
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

export interface BrandData {
  _id: string,
  name: string;
  logo_url: string;
  description?: string;
  website?: string;
  email: string;
  password: string;
  social_links: string[];
  crm_user_ids?: string[];
  inventory_sync_status?: string;
  is_active: boolean;
  store_addresses: StoreAddress[];
  emergency_contact: EmergencyContact;
  return_policy?: string;
  shipping_policy?: string;
  store_policy?: string;
  bank_details: BankDetails;
  created_at?: string;
  updated_at?: string;
}

// Context value type
interface BrandContextType {
  brand: BrandData | null;
  setBrand: (brand: BrandData) => void;
  loginBrand: (email: string, password: string) => Promise<boolean>;
  logoutBrand: () => void;
}

// Create Context
const BrandContext = createContext<BrandContextType | undefined>(undefined);

// Provider component
export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [brand, setBrand] = useState<BrandData | null>(null);

  const loginBrand = async (email: string, password: string) => {
    try {
        const response = await axios.post('https://casa-backend-uf0h.onrender.com/api/brands/login', {email, password})
        setBrand(response.data.brand)
        return response.data.success
    } catch (error: any){
        console.error('Login error :', error.response?.data || error.message);
        return false;
    }
  }

  const logoutBrand = () => {
    setBrand(null)
  }

  return (
    <BrandContext.Provider value={{ brand, setBrand, loginBrand, logoutBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

// Hook to use context
export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
