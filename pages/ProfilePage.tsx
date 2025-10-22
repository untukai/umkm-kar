
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';
import Button from '../components/Button';

const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const storedOrders = JSON.parse(localStorage.getItem('kodik-orders') || '[]');
      setOrders(storedOrders.reverse());
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <Button onClick={handleLogout} variant="outline">Keluar</Button>
      </div>
      <p className="text-lg mb-8">Selamat datang, <span className="font-semibold">{user?.email}</span>!</p>

      <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Pesanan #{order.id}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">{formatRupiah(order.total)}</p>
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">{order.status}</span>
                </div>
              </div>
              <div className="mt-4 border-t pt-2">
                {order.items.map(item => (
                    <p key={item.product.id} className="text-sm text-gray-600">{item.product.name} x{item.quantity}</p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Anda belum memiliki riwayat pesanan.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
