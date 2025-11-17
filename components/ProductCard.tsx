

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import Button from './Button';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useSeller } from '../hooks/useSeller';
import { useWishlist } from '../hooks/useWishlist';
import { useShare } from '../hooks/useShare';
import { useAppData } from '../hooks/useAppData';
import { StoreIcon, HeartIcon, ShareIcon, StarIcon } from './Icons';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { showSellerModal } = useSeller();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showShareModal } = useShare();
  const { sellers, reviews } = useAppData();
  const navigate = useNavigate();
  
  const seller = sellers.find(s => s.id === product.sellerId);
  const isWishlisted = isInWishlist(product.id);
  const imageUrl = product.imageUrls?.[0];

  const productReviews = reviews.filter(r => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : 0;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    showNotification(
      'Berhasil',
      `'${product.name}' ditambahkan ke keranjang.`,
      'success',
      { label: 'Lihat Keranjang', path: '/cart' }
    );
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    showNotification('Berhasil', `'${product.name}' ditambahkan, Anda akan diarahkan ke checkout.`);
    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showSellerModal(product.sellerId);
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      showNotification(
        'Ditambahkan ke Wishlist',
        `'${product.name}' berhasil disimpan.`,
        'success',
        { label: 'Lihat Wishlist', path: '/wishlist' }
      );
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = `${window.location.origin}${window.location.pathname}#/products/${product.id}`;
    const shareData = {
      title: `KODIK: ${product.name}`,
      text: `Cek produk keren ini dari ${seller?.name} di KODIK!`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof DOMException && error.name !== 'AbortError') {
          console.error('Error sharing natively:', error);
          showShareModal(shareData);
        }
      }
    } else {
      showShareModal(shareData);
    }
  };

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <Link to={`/products/${product.id}`} className="block bg-white rounded-lg overflow-hidden transition-all duration-300 border border-neutral-200 hover:shadow-xl hover:-translate-y-1 group flex flex-col h-full">
      <div className="relative w-full aspect-square bg-neutral-100 overflow-hidden">
        {imageUrl && (
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        )}
        {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                {product.discount}%
            </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button onClick={handleWishlistToggle} className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-600 hover:text-red-500 transition-colors" aria-label="Wishlist">
                <HeartIcon className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleShare} className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-600 hover:text-primary transition-colors" aria-label="Share">
                <ShareIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm text-neutral-800 group-hover:text-primary transition-colors h-10 line-clamp-2">{product.name}</h3>
        
        <div className="mt-2">
          {product.discount ? (
            <div className="flex items-baseline gap-2">
              <p className="text-base font-bold text-red-600">{formatRupiah(discountedPrice)}</p>
              <p className="text-xs text-neutral-500 line-through">{formatRupiah(product.price)}</p>
            </div>
          ) : (
            <p className="text-base font-bold text-neutral-800">{formatRupiah(product.price)}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
          {avgRating > 0 ? (
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{avgRating.toFixed(1)}</span>
              <span>({productReviews.length})</span>
            </div>
          ) : <div />}
          <span>{product.stock} tersisa</span>
        </div>

        <button onClick={handleSellerClick} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary mt-2 transition-colors w-full text-left">
          <StoreIcon className="w-4 h-4" />
          <span className="truncate">{seller?.name || 'Penjual'}</span>
        </button>

      </div>
      <div className="p-3 pt-0 mt-auto">
        <div className="space-y-2">
           <Button onClick={handleBuyNow} disabled={product.stock === 0} className="w-full !text-sm !py-2">
            {product.stock > 0 ? 'Beli Langsung' : 'Stok Habis'}
          </Button>
          <Button onClick={handleAddToCart} variant="outline" disabled={product.stock === 0} className="w-full !text-sm !py-2">
            + Keranjang
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
