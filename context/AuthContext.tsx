
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'pembeli' | 'penjual') => void;
  logout: () => void;
  isAuthenticated: boolean;
  spendCoins: (amount: number) => boolean;
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
    const newUser: User = { email, role, coins: 500 }; // Start with 500 coins
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, spendCoins }}>
      {children}
    </AuthContext.Provider>
  );
};
