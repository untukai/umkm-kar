
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Seller } from '../types';
import { AppDataContext } from './AppDataContext'; // Import the main data context

interface SellerContextType {
  selectedSeller: Seller | null;
  showSellerModal: (sellerId: string) => void;
  hideSellerModal: () => void;
}

export const SellerContext = createContext<SellerContextType | undefined>(undefined);

export const SellerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const appData = useContext(AppDataContext);

  const showSellerModal = (sellerId: string) => {
    setSelectedSellerId(sellerId);
  };

  const hideSellerModal = () => {
    setSelectedSellerId(null);
  };
  
  const selectedSeller = appData?.sellers.find(s => s._id === selectedSellerId) || null;

  return (
    <SellerContext.Provider value={{ selectedSeller, showSellerModal, hideSellerModal }}>
      {children}
    </SellerContext.Provider>
  );
};