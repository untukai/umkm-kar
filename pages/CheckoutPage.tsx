
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';
import Toast from '../components/Toast';
import { Order } from '../types';

const CheckoutPage: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    phone: '',
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800">Anda Perlu Masuk</h1>
        <p className="text-neutral-600 mt-4">Silakan masuk ke akun Anda untuk melanjutkan proses checkout dan melihat pesanan Anda.</p>
        <Link to="/login?redirect=/checkout">
          <Button className="mt-6 !font-bold !py-3">Masuk untuk Checkout</Button>
        </Link>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800">Keranjang Belanja Kosong</h1>
        <p className="text-neutral-600 mt-4">Tidak ada barang di keranjang Anda untuk checkout.</p>
        <Link to="/products">
          <Button className="mt-6 !font-bold !py-3">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
        alert("Harap isi semua informasi pengiriman.");
        return;
    }

    const newOrder: Order = {
      id: new Date().getTime().toString(),
      items: cartItems,
      total: totalPrice,
      date: new Date().toISOString(),
      status: 'dikemas',
      shippingAddress: shippingInfo
    };
    
    const existingOrders: Order[] = JSON.parse(localStorage.getItem('kodik-orders') || '[]');
    localStorage.setItem('kodik-orders', JSON.stringify([...existingOrders, newOrder]));

    setShowToast(true);
    clearCart();
    setTimeout(() => {
        navigate('/profile');
    }, 3000);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Alamat Pengiriman</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Nama Penerima</label>
                <Input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700">Alamat Lengkap</label>
                <Input type="text" id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">Nomor Telepon</label>
                <Input type="tel" id="phone" name="phone" value={shippingInfo.phone} onChange={handleInputChange} required className="mt-1" />
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2">Metode Pembayaran</h2>
            <div className="space-y-3">
              <label htmlFor="cod" className="flex items-center border p-4 rounded-lg has-[:checked]:bg-primary-dark/10 has-[:checked]:border-primary transition-all">
                <input type="radio" id="cod" name="payment" value="cod" defaultChecked className="h-4 w-4 text-primary focus:ring-primary"/>
                <span className="ml-3 font-medium text-neutral-700">Cash on Delivery (COD)</span>
              </label>
               <label htmlFor="transfer" className="flex items-center border p-4 rounded-lg bg-neutral-100 text-neutral-500 cursor-not-allowed">
                <input type="radio" id="transfer" name="payment" value="transfer" disabled className="h-4 w-4"/>
                <span className="ml-3 font-medium">Bank Transfer (Segera Hadir)</span>
              </label>
            </div>
          </div>
          <div className="w-full lg:w-1/3">
             <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Ringkasan Pesanan</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex justify-between items-start text-sm">
                    <span className="flex-1 text-neutral-600">{item.product.name} <span className="font-semibold">x{item.quantity}</span></span>
                    <span className="font-semibold text-neutral-800">{formatRupiah(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between font-bold text-lg text-neutral-800">
                <span>Total</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
              <Button type="submit" className="w-full mt-6 !font-bold !py-3">Bayar Sekarang</Button>
            </div>
          </div>
        </div>
      </form>
      {showToast && <Toast message="Pembayaran berhasil! Mengalihkan ke riwayat pesanan..." onClose={() => setShowToast(false)} />}
    </>
  );
};

export default CheckoutPage;
