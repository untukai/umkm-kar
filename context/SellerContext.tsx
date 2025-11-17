
import React, { createContext, useState, ReactNode } from 'react';
import { Seller } from '../types';
import { sellers } from '../data/dummyData';

interface SellerContextType {
  selectedSeller: Seller | null;
  showSellerModal: (sellerId: number) => void;
  hideSellerModal: () => void;
}

export const SellerContext = createContext<SellerContextType | undefined>(undefined);

export const SellerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const showSellerModal = (sellerId: number) => {
    const sellerToShow = sellers.find(s => s.id === sellerId);
    if (sellerToShow) {
      setSelectedSeller(sellerToShow);
    }
  };

  const hideSellerModal = () => {
    setSelectedSeller(null);
  };

  return (
    <SellerContext.Provider value={{ selectedSeller, showSellerModal, hideSellerModal }}>
      {children}
    </SellerContext.Provider>
  );
};