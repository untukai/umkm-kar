import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { products, categories, sellers } from '../data/dummyData';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const query = searchParams.get('q');
  const categoryId = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');
  const showInStock = searchParams.get('showInStock') === 'true';
  const productType = searchParams.get('type');

  const selectedCategory = categories.find(c => c.id === categoryId);

  useEffect(() => {
    let baseProducts = [...products];

    // Product Type filter
    if (productType) {
      baseProducts = baseProducts.filter(p => p.type === productType);
    }

    // Category filter
    if (categoryId) {
      const categoryName = categories.find(c => c.id === categoryId)?.name;
      if (categoryName) {
        baseProducts = baseProducts.filter(p => p.category === categoryName);
      }
    }

    // Stock filter
    if (showInStock) {
      baseProducts = baseProducts.filter(p => p.stock > 0);
    }

    // Rating filter
    if (minRating) {
      const ratingNum = parseFloat(minRating);
      baseProducts = baseProducts.filter(p => {
        const seller = sellers.find(s => s.id === p.sellerId);
        return seller && seller.rating >= ratingNum;
      });
    }

    // Price range filter
    if (minPrice) {
      baseProducts = baseProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      baseProducts = baseProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Final text search filter
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      baseProducts = baseProducts.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.description.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredProducts(baseProducts);
    
  }, [query, categoryId, minPrice, maxPrice, minRating, showInStock, productType]);

  const noProductsFound = filteredProducts.length === 0;

  const pageTitle = () => {
    if (query) return `Hasil pencarian untuk "${query}"`;
    if (selectedCategory) return `Kategori: ${selectedCategory.name}`;
    return 'Semua Produk';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <FilterSidebar categories={categories} />
      <div className="flex-1 w-full min-w-0">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm mb-8">
          <h1 className="text-3xl font-bold">{pageTitle()}</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">{filteredProducts.length} produk ditemukan</p>
        </div>
        
        {noProductsFound ? (
           <div className="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
              <p className="text-neutral-500 dark:text-neutral-400">Tidak ada produk yang cocok dengan kriteria Anda.</p>
          </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
