
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'pembeli' | 'penjual') => void;
  logout: () => void;
  isAuthenticated: boolean;
  spendCoins: (amount: number) => boolean;
  topUpCoins: (coinAmount: number) => boolean;
  redeemCoins: (coinAmount: number) => boolean;
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

  const login = (email: string, role: 'pembeli' | 'penjual') => {
    const newUser: User = { 
      email, 
      role, 
      coins: 500, // Start with 500 coins
      balance: 50000, // Start with Rp 50,000 balance
    }; 
    setUser(newUser);
    localStorage.setItem('kodik-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kodik-user');
  };

  const spendCoins = (amount: number): boolean => {
    if (user && user.coins && user.coins >= amount) {
      const updatedUser = { ...user, coins: user.coins - amount };
      setUser(updatedUser);
      localStorage.setItem('kodik-user', JSON.stringify(updatedUser));
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
      setUser(updatedUser);
      localStorage.setItem('kodik-user', JSON.stringify(updatedUser));
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
    setUser(updatedUser);
    localStorage.setItem('kodik-user', JSON.stringify(updatedUser));
    return true;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, spendCoins, topUpCoins, redeemCoins }}>
      {children}
    </AuthContext.Provider>
  );
};