

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';
import { TrashIcon, PlusIcon, MinusIcon } from '../components/Icons';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-neutral-800">Keranjang Belanja Kosong</h1>
        <p className="text-neutral-600 mt-4">Ayo, isi dengan produk-produk UMKM terbaik!</p>
        <Link to="/products">
          <Button className="mt-6 !font-bold">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        <div className="flex-grow bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-6">
          {cartItems.map(item => {
            const itemPrice = item.discount
              ? item.price * (1 - item.discount / 100)
              : item.price;
              
            return (
            <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6 last:border-b-0">
              
              {/* Item Info */}
              <div className="flex items-center gap-4 flex-grow">
                <img src={item.imageUrls[0]} alt={item.product.name} className="w-20 h-20 bg-neutral-200 rounded-md flex-shrink-0 object-cover" />
                <div className="flex-grow">
                  <h2 className="font-semibold text-base sm:text-lg text-neutral-800">{item.product.name}</h2>
                  {item.discount ? (
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-primary font-bold">{formatRupiah(itemPrice)}</p>
                      <p className="text-xs text-neutral-500 line-through">{formatRupiah(item.price)}</p>
                    </div>
                  ) : (
                    <p className="text-primary font-bold mt-1">{formatRupiah(item.price)}</p>
                  )}
                </div>
              </div>
              
              {/* Controls and Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center border border-neutral-300 rounded-md">
                   <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50" disabled={item.quantity <= 1}>
                      <MinusIcon className="w-4 h-4" />
                  </button>
                  <input type="text" value={item.quantity} readOnly className="w-10 text-center border-l border-r border-neutral-300 focus:outline-none h-full"/>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 text-neutral-600 hover:bg-neutral-100">
                      <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="font-bold w-24 sm:w-28 text-right text-neutral-800">{formatRupiah(itemPrice * item.quantity)}</p>
                
                <button onClick={() => removeFromCart(item.productId)} className="text-neutral-500 hover:text-red-500 p-1">
                  <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            </div>
          )})}
        </div>
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Ringkasan Belanja</h2>
            <div className="flex justify-between mb-4 text-neutral-700">
              <span>Total Harga ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} produk)</span>
              <span className="font-semibold">{formatRupiah(totalPrice)}</span>
            </div>
            <Link to="/checkout" className="w-full">
              <Button className="w-full mt-4 !font-bold !py-3">Lanjut ke Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;