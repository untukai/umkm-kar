
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, sellers } from '../data/dummyData'; // Import sellers
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { useSeller } from '../hooks/useSeller';
import { useWishlist } from '../hooks/useWishlist'; // Import useWishlist
import Button from '../components/Button';
import ProductCard from '../components/ProductCard'; // Import ProductCard
import { generateProductDescription } from '../services/geminiService';
import { XIcon, HeartIcon } from '../components/Icons'; // Import HeartIcon

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { showSellerModal } = useSeller();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const product = products.find(p => p.id === parseInt(id || ''));
  const seller = product ? sellers.find(s => s.id === product.sellerId) : undefined;

  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(true);

  // --- State untuk Galeri Gambar ---
  const productImages = product
    ? [
        product.imageUrl.replace(/(\?text=.*)/, `?text=${encodeURIComponent(product.name)}`),
        product.imageUrl.replace(/(\?text=.*)/, `?text=${encodeURIComponent(product.name)}+2`),
        product.imageUrl.replace(/(\?text=.*)/, `?text=${encodeURIComponent(product.name)}+3`),
        product.imageUrl.replace(/(\?text=.*)/, `?text=${encodeURIComponent(product.name)}+4`),
      ]
    : [
        `https://via.placeholder.com/600x600/E5E7EB/4B5563?text=Gambar+1`,
        `https://via.placeholder.com/600x600/E5E7EB/4B5563?text=Gambar+2`,
        `https://via.placeholder.com/600x600/E5E7EB/4B5563?text=Gambar+3`,
        `https://via.placeholder.com/600x600/E5E7EB/4B5563?text=Gambar+4`,
      ];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  // --- Akhir State untuk Galeri Gambar ---

  useEffect(() => {
    if (product) {
      setIsLoadingDescription(true);
      setAiDescription(null);
      setSelectedImageIndex(0); // Reset image on product change
      
      generateProductDescription(product)
        .then(description => {
          setAiDescription(description);
        })
        .catch(error => {
          console.error("Failed to load AI description, falling back to default.", error);
        })
        .finally(() => {
          setIsLoadingDescription(false);
        });
    }
  }, [product]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      showToast(`'${product.name}' berhasil ditambahkan ke keranjang.`);
    }
  };
  
  const handleSellerClick = () => {
    if (seller) {
      showSellerModal(seller.id);
    }
  };
  
  const handleWishlistToggle = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showToast(`'${product.name}' dihapus dari wishlist.`);
    } else {
      addToWishlist(product);
      showToast(`'${product.name}' ditambahkan ke wishlist.`);
    }
  };

  if (!product || !seller) {
    return (
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Produk atau Penjual tidak ditemukan</h1>
        <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
          <Button>Kembali ke Halaman Produk</Button>
        </Link>
      </div>
    );
  }

  // Logic to find related products
  let relatedProducts = products
    .filter(p => p.sellerId === product.sellerId && p.id !== product.id);
  
  let relatedProductsTitle = "Produk Lain dari Penjual Ini";

  // Fallback to category if seller has no other products
  if (relatedProducts.length === 0) {
    relatedProducts = products
      .filter(p => p.category === product.category && p.id !== product.id);
    relatedProductsTitle = "Produk Serupa Lainnya";
  }

  const displayedRelatedProducts = relatedProducts.slice(0, 4);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
  
  const renderDescription = () => {
    if (isLoadingDescription) {
      return (
        <div className="min-h-[150px] flex flex-col justify-center">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            </div>
            <p className="text-sm text-center text-primary font-semibold pt-6">✨ Asisten AI sedang menulis deskripsi produk yang menarik...</p>
        </div>
      );
    }
    
    if (aiDescription) {
      return (
        <>
          <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{aiDescription}</p>
          <div className="text-right text-xs text-neutral-500 italic mt-4">
            Deskripsi ini dibuat dengan bantuan AI
          </div>
        </>
      );
    }

    return <p className="text-neutral-700 leading-relaxed">{product.description}</p>;
  };

  return (
    <>
      <div className="space-y-8">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Kiri: Galeri Gambar */}
            <div>
              <div 
                className="w-full aspect-square bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden cursor-zoom-in group"
                onClick={() => setIsZoomModalOpen(true)}
              >
                <img 
                  src={productImages[selectedImageIndex]} 
                  alt={`${product.name} - Gambar ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {productImages.map((imgSrc, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={imgSrc} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Kanan: Detail dan Aksi */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{product.name}</h1>
              <p className="text-lg text-neutral-500 mt-2">
                Kategori: <span className="font-semibold text-primary">{product.category}</span>
              </p>
              <p className="text-3xl md:text-4xl font-bold text-neutral-800 my-6">{formatRupiah(product.price)}</p>

              <div className="mt-auto border rounded-lg p-6 shadow-sm bg-neutral-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Atur Jumlah</h3>
                    <p className="text-sm text-neutral-600">Stok: <span className="font-bold">{product.stock}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full !text-base sm:!text-lg !py-3 !font-bold">
                      {product.stock > 0 ? '+ Keranjang' : 'Stok Habis'}
                    </Button>
                    <button 
                      onClick={handleWishlistToggle} 
                      className={`p-3 rounded-lg border-2 transition-colors ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-neutral-300 text-neutral-500 hover:border-red-500 hover:text-red-500'}`}
                      aria-label="Tambah ke wishlist"
                    >
                      <HeartIcon className="w-6 h-6" fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h3 className="font-bold text-xl border-b pb-3 mb-4">Deskripsi Produk</h3>
          {renderDescription()}
          <div className="mt-6 border-t pt-4">
               <button onClick={handleSellerClick} className="text-lg text-neutral-600 hover:text-primary transition-colors">
                 Penjual: <span className="font-semibold underline">{seller.name}</span>
               </button>
          </div>
        </div>
        
        {/* Related Products Section */}
        {displayedRelatedProducts.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-4">{relatedProductsTitle}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayedRelatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Zoom Gambar */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-neutral-300"
            aria-label="Tutup"
          >
            <XIcon className="w-8 h-8"/>
          </button>
          <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img 
              src={productImages[selectedImageIndex]} 
              alt={`Zoomed ${product.name}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;