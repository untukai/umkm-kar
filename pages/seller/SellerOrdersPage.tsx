

import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../types';
import { useAppData } from '../../hooks/useAppData';

const SellerOrdersPage: React.FC = () => {
  const { orders } = useAppData(); // In a real app, fetch this for the specific seller

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">Daftar Pesanan</h1>
        <p className="text-neutral-600 mt-1">{orders.length} pesanan ditemukan</p>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Pelanggan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{formatDate(order.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{formatRupiah(order.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusChipClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/seller/orders/${order.id}`} className="text-primary hover:text-primary-dark font-semibold">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-neutral-500">Belum ada pesanan yang masuk.</p>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
