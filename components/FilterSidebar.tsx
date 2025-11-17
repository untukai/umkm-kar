

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Category } from '../types';
import { StarIcon, XCircleIcon } from './Icons';
import Button from './Button';
import Input from './Input';

interface FilterSidebarProps {
  categories: Category[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });

  const currentCategory = searchParams.get('category');
  const showInStock = searchParams.get('showInStock') === 'true';
  const minRating = searchParams.get('minRating');
  const productType = searchParams.get('type');

  // Sync local price state with URL params
  useEffect(() => {
    setPriceRange({
      min: searchParams.get('minPrice') || '',
      max: searchParams.get('maxPrice') || '',
    });
  }, [searchParams]);

  const updateSearchParams = (updates: Record<string, string | null | boolean>) => {
    setSearchParams(prev => {
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === false) {
          prev.delete(key);
        } else {
          prev.set(key, String(value));
        }
      });
      return prev;
    }, { replace: true });
  };

  const handlePriceApply = () => {
    updateSearchParams({ minPrice: priceRange.min, maxPrice: priceRange.max });
  };

  const handleResetFilters = () => {
    updateSearchParams({
      showInStock: null,
      minRating: null,
      minPrice: null,
      maxPrice: null,
      type: null,
    });
    setPriceRange({ min: '', max: '' });
  };
  
  const getCategoryLink = (categoryId: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryId) {
        newParams.set('category', categoryId);
    } else {
        newParams.delete('category');
    }
    return `/products?${newParams.toString()}`;
  }

  const ratingOptions = [4, 3];
  const productTypes = ['Produk Fisik', 'Produk Digital', 'Jasa'];


  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg sticky top-24">
        <div className="pb-4 mb-4 border-b dark:border-neutral-700">
          <h2 className="text-xl font-bold">Kategori Produk</h2>
          <nav className="space-y-1 mt-4">
            <Link
              to={getCategoryLink(null)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                !currentCategory ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={getCategoryLink(category.id)}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                  currentCategory === category.id ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Filter</h2>
            <button onClick={handleResetFilters} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" /> Reset
            </button>
          </div>
          <div className="space-y-6">
             <div>
              <h3 className="font-semibold mb-2">Tipe Produk</h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => updateSearchParams({ type: null })}
                  className={`text-sm p-2 rounded-md text-left transition-colors ${!productType ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                >
                  Semua Tipe
                </button>
                {productTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => updateSearchParams({ type: type })}
                    className={`text-sm p-2 rounded-md text-left transition-colors ${productType === type ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ketersediaan</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInStock}
                  onChange={(e) => updateSearchParams({ showInStock: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600"
                />
                <span className="text-sm dark:text-neutral-200">Hanya stok tersedia</span>
              </label>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Rating Penjual</h3>
              <div className="flex flex-col gap-2">
                {ratingOptions.map(rating => (
                    <button
                        key={rating}
                        onClick={() => updateSearchParams({ minRating: String(rating) })}
                        className={`flex items-center gap-2 text-sm p-2 rounded-md text-left transition-colors ${minRating === String(rating) ? 'bg-primary/10 font-semibold' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                    >
                        <StarIcon className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        <span className="dark:text-neutral-200">{rating} ke atas</span>
                    </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Rentang Harga</h3>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Harga Minimum"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Harga Maksimum"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                />
                <Button onClick={handlePriceApply} className="w-full !text-sm !py-2">
                  Terapkan Harga
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
