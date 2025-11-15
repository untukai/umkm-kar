
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { products, sellers } from '../../data/dummyData';
import Button from '../../components/Button';
import { PlusIcon } from '../../components/Icons';
import { Product } from '../../types';

const MyProductsPage: React.FC = () => {
  const { user } = useAuth();
  
  const currentSeller = sellers.find(s => s.email === user?.email);
  const sellerProducts = currentSeller ? products.filter(p => p.sellerId === currentSeller.id) : [];

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };
  
  const getStatusChipClass = (status: Product['status']) => {
    switch (status) {
      case 'aktif': return 'bg-green-100 text-green-800';
      case 'nonaktif': return 'bg-neutral-200 text-neutral-800';
      case 'habis stok': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b pb-4 gap-4">
        <div>
            <h1 className="text-2xl font-bold">Produk Saya</h1>
            <p className="text-neutral-600 mt-1">{sellerProducts.length} produk ditemukan</p>
        </div>
        <Link to="/seller/products/new">
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <PlusIcon className="w-5 h-5" />
            <span>Tambah Produk</span>
          </Button>
        </Link>
      </div>

      {sellerProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Produk</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Harga</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stok</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {sellerProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrls[0]} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{formatRupiah(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`text-sm font-medium ${product.stock > 0 ? 'text-neutral-900' : 'text-red-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusChipClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/seller/products/edit/${product.id}`} className="text-primary hover:text-primary-dark">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-neutral-500">Anda belum memiliki produk. Silakan tambahkan produk pertama Anda.</p>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
