import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import Button from './Button';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { useSeller } from '../hooks/useSeller';
import { useWishlist } from '../hooks/useWishlist'; // Import useWishlist
import { sellers } from '../data/dummyData';
import { StoreIcon, HeartIcon, ShareIcon } from './Icons'; // Import ShareIcon

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { showSellerModal } = useSeller();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const seller = sellers.find(s => s.id === product.sellerId);
  const isWishlisted = isInWishlist(product.id);

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
    showToast(`'${product.name}' berhasil ditambahkan ke keranjang.`);
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showSellerModal(product.sellerId);
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showToast(`'${product.name}' dihapus dari wishlist.`);
    } else {
      addToWishlist(product);
      showToast(`'${product.name}' ditambahkan ke wishlist.`);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Improved URL generation to be more robust. It takes the current URL,
    // removes any existing hash, and appends the correct product hash path.
    const productUrl = `${window.location.href.split('#')[0]}#/products/${product.id}`;

    // Use modern clipboard API if available and in a secure context
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(productUrl)
        .then(() => showToast('Tautan produk berhasil disalin!'))
        .catch(err => {
          console.error('Async clipboard copy failed:', err);
          showToast('Gagal menyalin tautan.');
        });
    } else {
      // Fallback for older browsers or non-secure contexts
      try {
        const textArea = document.createElement('textarea');
        textArea.value = productUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          showToast('Tautan produk berhasil disalin!');
        } else {
          showToast('Gagal menyalin tautan.');
        }
      } catch (err) {
        console.error('Fallback copy failed:', err);
        showToast('Gagal menyalin tautan.');
      }
    }
  };

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 border border-neutral-200 hover:shadow-xl flex flex-col relative">
      {product.discount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          -{product.discount}%
        </div>
      )}
      <button 
        onClick={handleWishlistToggle} 
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 rounded-full text-neutral-600 hover:text-red-500 backdrop-blur-sm transition-colors" 
        aria-label="Tambah ke wishlist"
      >
        <HeartIcon className={`w-6 h-6 ${isWishlisted ? 'text-red-500' : ''}`} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/products/${product.id}`} className="block flex-grow">
        <div className="w-full h-48 bg-neutral-200">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-normal text-neutral-700 h-10 overflow-hidden">{product.name}</h3>
          <div className="mt-2 h-12 flex flex-col justify-center">
            {product.discount ? (
              <div>
                <p className="text-sm text-neutral-500 line-through">
                  {formatRupiah(product.price)}
                </p>
                <p className="text-base sm:text-lg font-bold text-red-600">
                  {formatRupiah(discountedPrice)}
                </p>
              </div>
            ) : (
              <p className="text-base sm:text-lg font-bold text-neutral-900">{formatRupiah(product.price)}</p>
            )}
          </div>
          <button onClick={handleSellerClick} className="flex items-center text-xs text-neutral-500 mt-2 hover:text-primary transition-colors w-full text-left">
            <StoreIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{seller?.name || 'Penjual tidak ditemukan'}</span>
          </button>
        </div>
      </Link>
      <div className="p-3 pt-0 mt-auto">
        <div className="flex items-center gap-2">
            <Button onClick={handleAddToCart} className="flex-grow !font-bold !text-sm">Tambah Keranjang</Button>
            <button 
                onClick={handleShare}
                className="p-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary transition-colors flex-shrink-0"
                aria-label="Bagikan produk"
                title="Bagikan produk"
            >
                <ShareIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;