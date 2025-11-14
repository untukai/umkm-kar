import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Category } from '../types';

interface CategorySidebarProps {
  categories: Category[];
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const getCategoryLink = (categoryId: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    return `/products?${newParams.toString()}`;
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
        <h2 className="text-xl font-bold mb-4">Kategori Produk</h2>
        <nav className="space-y-2">
          <Link
            to={getCategoryLink(null)}
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
              to={getCategoryLink(category.id)}
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

export default CategorySidebar;
