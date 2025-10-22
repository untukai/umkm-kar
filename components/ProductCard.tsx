
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import Button from './Button';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { useSeller } from '../hooks/useSeller'; // Import useSeller
import { sellers } from '../data/dummyData'; // Import sellers data
import { StoreIcon } from './Icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { showSellerModal } = useSeller();
  
  const seller = sellers.find(s => s.id === product.sellerId);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking the button
    addToCart(product);
    showToast(`'${product.name}' berhasil ditambahkan ke keranjang.`);
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    showSellerModal(product.sellerId);
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 border border-neutral-200 hover:shadow-xl flex flex-col">
      <Link to={`/products/${product.id}`} className="block flex-grow">
        <div className="w-full h-48 bg-neutral-200 flex items-center justify-center">
          <span className="text-neutral-500">Gambar Produk</span>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-normal text-neutral-700 h-10 overflow-hidden">{product.name}</h3>
          <p className="text-lg font-bold text-neutral-900 mt-2">{formatRupiah(product.price)}</p>
          <button onClick={handleSellerClick} className="flex items-center text-xs text-neutral-500 mt-2 hover:text-primary transition-colors w-full text-left">
            <StoreIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{seller?.name || 'Penjual tidak ditemukan'}</span>
          </button>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <Button onClick={handleAddToCart} className="w-full !font-bold">Tambah Keranjang</Button>
      </div>
    </div>
  );
};

export default ProductCard;