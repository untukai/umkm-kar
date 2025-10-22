import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    const redirectUrl = searchParams.get('redirect') || '/profile';
    navigate(redirectUrl);
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800">Selamat Datang Kembali</h1>
            <p className="text-neutral-500 mt-2">Masuk untuk melanjutkan belanja di KODIK.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <Input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="contoh@email.com"
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <Input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="********"
            />
          </div>
          <Button type="submit" className="w-full !font-bold !py-3">Masuk</Button>
        </form>
        <p className="text-center text-sm text-neutral-600 mt-8">
          Belum punya akun? <a href="#" className="font-medium text-primary hover:underline">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;