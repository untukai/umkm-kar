
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Seller } from '../types';
import { XIcon, StarIcon } from './Icons';
import Button from './Button';

interface SellerDetailModalProps {
  seller: Seller;
  onClose: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-neutral-300'}`}
          fill={index < Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-neutral-600">{rating.toFixed(1)}</span>
    </div>
  );
};

const SellerDetailModal: React.FC<SellerDetailModalProps> = ({ seller, onClose }) => {
  const navigate = useNavigate();

  const handleViewProducts = () => {
    onClose();
    navigate(`/products?seller=${seller.id}`);
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="seller-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-transform duration-300 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 transition-colors"
            aria-label="Tutup"
          >
            <XIcon className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-primary">{seller.name.charAt(0)}</span>
            </div>
            <h2 id="seller-modal-title" className="text-2xl font-bold text-neutral-800">{seller.name}</h2>
            <div className="mt-2">
              <StarRating rating={seller.rating} />
            </div>
            <p className="text-neutral-600 mt-4 text-sm leading-relaxed">{seller.description}</p>
          </div>

          <div className="mt-6">
            <Button onClick={handleViewProducts} className="w-full !font-bold">
              Lihat Semua Produk Penjual
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailModal;