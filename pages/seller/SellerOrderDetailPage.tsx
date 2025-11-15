

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orders, updateOrderStatus } from '../../data/dummyData';
import { Order } from '../../types';
import Button from '../../components/Button';
import { useNotification } from '../../hooks/useNotification';

const SellerOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [statusToConfirm, setStatusToConfirm] = useState<Order['status'] | null>(null);
  
  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      showNotification("Error", "Pesanan tidak ditemukan.", "error");
      navigate('/seller/orders');
    }
  }, [id, navigate, showNotification]);

  const handleInitiateStatusChange = (newStatus: Order['status']) => {
    setStatusToConfirm(newStatus);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (order && statusToConfirm) {
      updateOrderStatus(order.id, statusToConfirm);
      setOrder({ ...order, status: statusToConfirm });
      showNotification("Berhasil", `Status pesanan diubah menjadi "${statusToConfirm}".`);
    }
    setIsConfirmModalOpen(false);
    setStatusToConfirm(null);
  };
  
  const handleCancelStatusChange = () => {
    setIsConfirmModalOpen(false);
    setStatusToConfirm(null);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusChipClass = (status: Order['status']) => {
    switch (status) {
      case 'menunggu pembayaran': return 'bg-orange-100 text-orange-800';
      case 'dikemas': return 'bg-yellow-100 text-yellow-800';
      case 'dikirim': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (!order) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            Memuat detail pesanan...
        </div>
    );
  }

  const orderStatusSteps: Order['status'][] = ['dikemas', 'dikirim', 'selesai'];
  const nextStatus = orderStatusSteps[orderStatusSteps.indexOf(order.status) + 1];

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b pb-4 gap-3">
          <div>
              <h1 className="text-2xl font-bold">Detail Pesanan #{order.id}</h1>
              <p className="text-sm text-neutral-500">
                  Tanggal: {formatDate(order.date)} · Pelanggan: {order.customerName}
              </p>
          </div>
          <Link to="/seller/orders">
            <Button variant="outline">&larr; Kembali ke Daftar Pesanan</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items */}
          <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-neutral-800">Barang Pesanan</h3>
              {order.items.map(item => {
                  const unitPrice = item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;
                  const subtotal = unitPrice * item.quantity;
                  
                  return (
                    <div key={item.product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-16 h-16 bg-neutral-200 rounded-md object-cover flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-neutral-800">{item.product.name}</p>
                            <div className="text-sm text-neutral-600 mt-1 flex items-center gap-1">
                              <span>{item.quantity} x</span>
                              {item.product.discount ? (
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-semibold text-primary">{formatRupiah(unitPrice)}</span>
                                  <span className="text-xs text-neutral-500 line-through">{formatRupiah(item.product.price)}</span>
                                </div>
                              ) : (
                                <span className="font-semibold">{formatRupiah(unitPrice)}</span>
                              )}
                            </div>
                        </div>
                        <p className="font-bold text-neutral-800 text-right">{formatRupiah(subtotal)}</p>
                    </div>
                  );
              })}
          </div>
          
          {/* Right Column: Summary & Shipping */}
          <div className="space-y-6">
              <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">Ringkasan</h3>
                  <div className="p-4 bg-neutral-50 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Status</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${getStatusChipClass(order.status)}`}>
                              {order.status}
                          </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                          <span className="text-neutral-800">Total</span>
                          <span className="text-primary">{formatRupiah(order.total)}</span>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">Alamat Pengiriman</h3>
                  <div className="p-4 bg-neutral-50 rounded-lg text-sm text-neutral-700 space-y-1">
                      <p className="font-semibold">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.phone}</p>
                  </div>
              </div>

              {order.status !== 'selesai' && order.status !== 'menunggu pembayaran' && (
                <div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">Aksi Pesanan</h3>
                    {nextStatus ? (
                      <Button 
                          className="w-full !font-bold"
                          onClick={() => handleInitiateStatusChange(nextStatus)}
                      >
                          Ubah Status ke "{nextStatus}"
                      </Button>
                    ) : (
                      <p className="text-sm text-neutral-500 text-center p-3 bg-neutral-50 rounded-lg">Pesanan sudah selesai.</p>
                    )}
                </div>
              )}
          </div>
        </div>
      </div>
      
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={handleCancelStatusChange}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center animate-popup-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Konfirmasi Perubahan Status</h2>
            <p className="text-neutral-600 mb-6">
              Apakah Anda yakin ingin mengubah status pesanan ini menjadi <strong className="capitalize">{statusToConfirm}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleCancelStatusChange}>
                Batal
              </Button>
              <Button onClick={handleConfirmStatusChange}>
                Ya, Ubah Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerOrderDetailPage;