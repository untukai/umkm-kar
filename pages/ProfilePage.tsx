import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';
import Button from '../components/Button';
import { BoxIcon, TruckIcon, CheckCircleIcon, ChevronDownIcon } from '../components/Icons';

// Sub-component for displaying the visual order status tracker
const OrderStatusTracker = ({ currentStatus }: { currentStatus: Order['status'] }) => {
  const statuses: { id: Order['status']; name: string; icon: React.ReactNode }[] = [
    { id: 'dikemas', name: 'Dikemas', icon: <BoxIcon className="w-6 h-6" /> },
    { id: 'dikirim', name: 'Dikirim', icon: <TruckIcon className="w-6 h-6" /> },
    { id: 'selesai', name: 'Selesai', icon: <CheckCircleIcon className="w-6 h-6" /> },
  ];
  const currentStatusIndex = statuses.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full px-2 sm:px-4 py-4">
      <div className="flex items-center">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isLineActive = index < currentStatusIndex;
          const isLast = index === statuses.length - 1;

          return (
            <React.Fragment key={status.id}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                  {status.icon}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors ${isCompleted ? 'text-primary' : 'text-neutral-500'}`}>{status.name}</p>
              </div>
              {!isLast && (
                <div className={`flex-grow h-1 mx-2 transition-colors ${isLineActive ? 'bg-primary' : 'bg-neutral-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);


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
  
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
  };
  
  const getStatusChipClass = (status: Order['status']) => {
    switch (status) {
      case 'dikemas': return 'bg-yellow-100 text-yellow-800';
      case 'dikirim': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <Button onClick={handleLogout} variant="outline">Keluar</Button>
      </div>
      <p className="text-lg mb-8">Selamat datang, <span className="font-semibold">{user?.email}</span>!</p>

      <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="border rounded-lg overflow-hidden transition-shadow duration-300">
              <button 
                onClick={() => toggleOrderDetails(order.id)} 
                className="w-full text-left bg-neutral-50 p-4 hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 transition-colors"
                aria-expanded={expandedOrderId === order.id}
                aria-controls={`order-details-${order.id}`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-neutral-800">Pesanan #{order.id}</p>
                    <p className="text-sm text-neutral-500">{formatDate(order.date)}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <div className="text-right sm:text-left">
                       <p className="font-bold text-lg text-primary">{formatRupiah(order.total)}</p>
                    </div>
                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(order.status)} capitalize`}>{order.status}</span>
                    <ChevronDownIcon className={`w-6 h-6 text-neutral-500 transition-transform flex-shrink-0 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>
              {expandedOrderId === order.id && (
                <div id={`order-details-${order.id}`} className="p-4 bg-white border-t animate-fade-in">
                  <h3 className="font-bold text-lg mb-4">Detail Pesanan</h3>
                  <OrderStatusTracker currentStatus={order.status} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-neutral-700 mb-2">Alamat Pengiriman</h4>
                        <div className="text-sm text-neutral-600">
                          <p className="font-bold">{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.phone}</p>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                       <h4 className="font-semibold text-neutral-700 mb-2">Barang Pesanan</h4>
                       <ul className="list-disc list-inside text-sm text-neutral-600">
                        {order.items.map(item => (
                            <li key={item.product.id}>{item.product.name} <span className="font-semibold">(x{item.quantity})</span></li>
                        ))}
                       </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Anda belum memiliki riwayat pesanan.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;