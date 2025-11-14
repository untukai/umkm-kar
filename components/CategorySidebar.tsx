

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Category } from '../types';

interface FilterSidebarProps {
  categories: Category[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const getFilterLink = (paramName: 'category', paramValue: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (paramValue) {
      newParams.set(paramName, paramValue);
    } else {
      newParams.delete(paramName);
    }

    // Reset search query 'q' for a clearer user experience when changing filters
    newParams.delete('q');
    
    return `/products?${newParams.toString()}`;
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
        <h2 className="text-xl font-bold mb-4">Kategori Produk</h2>
        <nav className="space-y-2">
          <Link
            to={getFilterLink('category', null)}
            className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
              !currentCategory
                ? 'bg-primary text-white font-semibold'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Semua Kategori
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={getFilterLink('category', category.id)}
              className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                currentCategory === category.id
                  ? 'bg-primary text-white font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default FilterSidebar;