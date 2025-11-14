import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';
import { products, categories, sellers } from '../data/dummyData';
import { Product } from '../types';
import { getAIRecommendations } from '../services/geminiService';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [aiRecommendedProductNames, setAiRecommendedProductNames] = useState<string[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get('q');
  const categoryId = searchParams.get('category');
  const sellerId = searchParams.get('seller');

  const selectedCategory = categories.find(c => c.id === categoryId);
  const selectedSeller = sellers.find(s => s.id === parseInt(sellerId || ''));

  // This effect handles all product filtering and AI logic
  useEffect(() => {
    // 1. Base filtering by category or seller (provides context for AI)
    let baseProducts = [...products];
    if (categoryId) {
      const categoryName = categories.find(c => c.id === categoryId)?.name;
      if (categoryName) {
        baseProducts = baseProducts.filter(p => p.category === categoryName);
      }
    }
    if (sellerId) {
      baseProducts = baseProducts.filter(p => p.sellerId === parseInt(sellerId));
    }

    // 2. Final filtering for display, adding the text search query
    let finalProductsForDisplay = [...baseProducts];
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      finalProductsForDisplay = finalProductsForDisplay.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.description.toLowerCase().includes(lowercasedQuery)
      );
    }
    setFilteredProducts(finalProductsForDisplay);
    
    // 3. Trigger AI recommendations based on search query OR selected category
    const recommendationQuery = query || selectedCategory?.name;
    if (recommendationQuery) {
      setIsLoadingRecommendations(true);
      setError(null);
      setAiRecommendedProductNames([]);
      
      // Pass the broader category-filtered list to the AI for better context
      getAIRecommendations(recommendationQuery, baseProducts)
        .then(recommendations => {
          setAiRecommendedProductNames(recommendations);
        })
        .catch(err => {
          console.error("Failed to get AI recommendations:", err);
          setError("Gagal mendapatkan rekomendasi AI. Silakan coba lagi.");
        })
        .finally(() => {
          setIsLoadingRecommendations(false);
        });
    } else {
        setAiRecommendedProductNames([]);
        setIsLoadingRecommendations(false);
        setError(null);
    }

  }, [query, categoryId, sellerId, selectedCategory]);

  // Derive display lists from state
  const baseProducts = products.filter(p => {
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    const categoryMatch = !categoryId || p.category === categoryName;
    const sellerMatch = !sellerId || p.sellerId === parseInt(sellerId);
    return categoryMatch && sellerMatch;
  });

  const aiRecommendedProducts = baseProducts.filter(p => aiRecommendedProductNames.includes(p.name));
  const aiRecommendedIds = new Set(aiRecommendedProducts.map(p => p.id));
  const otherProducts = filteredProducts.filter(p => !aiRecommendedIds.has(p.id));
  
  const noProductsFound = filteredProducts.length === 0 && aiRecommendedProducts.length === 0;

  const pageTitle = () => {
    if (query) return `Hasil pencarian untuk "${query}"`;
    if (selectedCategory) return `Kategori: ${selectedCategory.name}`;
    if (selectedSeller) return `Produk dari ${selectedSeller.name}`;
    return 'Semua Produk';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <CategorySidebar categories={categories} />
      <div className="flex-1 w-full min-w-0">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h1 className="text-3xl font-bold">{pageTitle()}</h1>
          <p className="text-neutral-600 mt-2">{filteredProducts.length} produk ditemukan</p>
        </div>
        
        {isLoadingRecommendations && (
          <div className="text-center py-6 mb-8 bg-white rounded-lg shadow-sm">
              <p className="text-primary font-semibold animate-pulse">✨ AI sedang mencari produk terbaik untuk Anda...</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        {aiRecommendedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Rekomendasi AI Untuk Anda</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {aiRecommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {otherProducts.length > 0 && (
            <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">
                    {aiRecommendedProducts.length > 0 ? "Hasil Lainnya" : "Daftar Produk"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {otherProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        )}

        {noProductsFound && !isLoadingRecommendations && (
           <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-neutral-500">Tidak ada produk yang cocok dengan kriteria Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
