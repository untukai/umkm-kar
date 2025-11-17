

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => void; // New method for Google Sign-In
  loginAsSeller: (email: string) => void; // Specific method for seller login
  logout: () => void;
  isAuthenticated: boolean;
  spendCoins: (amount: number) => boolean;
  topUpCoins: (coinAmount: number) => boolean;
  redeemCoins: (coinAmount: number) => boolean;
  topUpBalance: (amount: number) => void;
  withdrawBalance: (amount: number) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('kodik-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const persistUser = (user: User) => {
    setUser(user);
    localStorage.setItem('kodik-user', JSON.stringify(user));
  };

  // Simulated Google Sign-In for buyers
  const signInWithGoogle = () => {
    const newUser: User = { 
      email: 'pembeli.google@example.com',
      name: 'Pembeli KODIK',
      role: 'pembeli', 
      coins: 500,
      balance: 50000,
    }; 
    persistUser(newUser);
  };
  
  // Login for sellers (demo purpose)
  const loginAsSeller = (email: string) => {
      const newSellerUser: User = {
          email: email,
          name: 'Penjual Demo',
          role: 'penjual',
          coins: 1000,
          balance: 5000000,
      };
      persistUser(newSellerUser);
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('kodik-user');
  };

  const spendCoins = (amount: number): boolean => {
    if (user && user.coins && user.coins >= amount) {
      const updatedUser = { ...user, coins: user.coins - amount };
      persistUser(updatedUser);
      return true;
    }
    return false;
  };

  const topUpCoins = (coinAmount: number): boolean => {
    if (!user || !user.balance) return false;
    const cost = coinAmount * 1000;
    if (user.balance >= cost) {
      const updatedUser = {
        ...user,
        balance: user.balance - cost,
        coins: (user.coins || 0) + coinAmount,
      };
      persistUser(updatedUser);
      return true;
    }
    return false;
  };

  const redeemCoins = (coinAmount: number): boolean => {
    if (!user || !user.coins || user.coins < coinAmount) return false;
    const value = coinAmount * 1000;
    const updatedUser = {
      ...user,
      balance: (user.balance || 0) + value,
      coins: user.coins - coinAmount,
    };
    persistUser(updatedUser);
    return true;
  };
  
  const topUpBalance = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: (user.balance || 0) + amount,
      };
      persistUser(updatedUser);
    }
  };
  
  const withdrawBalance = (amount: number): boolean => {
    if (!user || !user.balance) return false;
    const adminFee = 2500;
    const totalWithdrawal = amount + adminFee;
    if (user.balance >= totalWithdrawal) {
      const updatedUser = {
        ...user,
        balance: user.balance - totalWithdrawal,
      };
      persistUser(updatedUser);
      return true;
    }
    return false;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, loginAsSeller, logout, isAuthenticated, spendCoins, topUpCoins, redeemCoins, topUpBalance, withdrawBalance }}>
      {children}
    </AuthContext.Provider>
  );
};