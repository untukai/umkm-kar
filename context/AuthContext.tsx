import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: 'buyer' | 'seller') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek sesi login saat aplikasi pertama kali dimuat
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Gagal memeriksa sesi pengguna:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Fungsi login sekarang hanya mengarahkan ke endpoint backend
  const login = (role: 'buyer' | 'seller') => {
    // Backend akan menangani alur OAuth dan mengarahkan kembali ke frontend
    window.location.href = `/api/auth/google/${role}`;
  };

  // Fungsi logout juga mengarahkan ke endpoint backend
  const logout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        // Arahkan ke halaman utama setelah logout
        window.location.href = '/';
    } catch (error) {
        console.error("Gagal melakukan logout:", error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
