
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { SearchIcon, ShoppingCartIcon, UserIcon, MenuIcon, XIcon, HeartIcon, StoreIcon } from './Icons';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
    }
    setIsMenuOpen(false); // Close menu after search
  };

  const navLinks = [
    { name: 'Kategori', path: '/products' },
    { name: 'Artikel Lokal', path: '/articles' },
    { name: 'Kolaborasi', path: '/collaboration' },
  ];

  const MobileMenu = () => (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header inside Panel */}
        <div className="flex items-center justify-between p-4 border-b">
           <Link to="/" className="flex items-center text-2xl font-bold text-primary">
            <StoreIcon className="h-8 w-8 mr-2" />
            <span id="mobile-menu-title" className="text-2xl">KODIK</span>
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 text-neutral-600 hover:text-primary transition-colors" aria-label="Tutup menu">
            <XIcon className="h-7 w-7" />
          </button>
        </div>

        {/* Body of Panel */}
        <div className="p-4 flex flex-col h-[calc(100%-73px)]">
          <form onSubmit={handleSearch} className="w-full mb-2">
            <div className="relative">
              <input type="search" name="search" className="w-full border border-neutral-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Cari produk..." />
              <button type="submit" className="absolute right-0 top-0 mt-1.5 mr-3" aria-label="Cari">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
          </form>
          
          <nav className="flex flex-col space-y-2 mt-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="block px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* User Actions at the bottom */}
          <div className="mt-auto pt-4 border-t border-neutral-200">
             <nav className="flex flex-col space-y-2">
                <Link to={isAuthenticated ? "/profile" : "/login"} className="flex items-center px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors">
                    <UserIcon className="h-6 w-6 mr-3 text-neutral-500" />
                    <span>{isAuthenticated ? 'Profil Saya' : 'Masuk / Daftar'}</span>
                </Link>
             </nav>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo + Desktop Nav */}
            <div className="flex items-center gap-x-8">
              <Link to="/" className="flex-shrink-0 flex items-center text-3xl font-bold text-primary">
                <StoreIcon className="h-10 w-10 mr-2" />
                <span className="hidden sm:inline">KODIK</span>
              </Link>
              <nav className="hidden lg:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="text-neutral-600 hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-x-3 sm:gap-x-4">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative">
                  <input
                    type="search"
                    name="search"
                    className="border border-neutral-300 bg-neutral-100 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark text-sm transition-all duration-300 w-48 focus:w-64"
                    placeholder="Cari produk..."
                  />
                  <button type="submit" className="absolute right-0 top-0 mt-1.5 mr-3" aria-label="Cari">
                    <SearchIcon className="h-5 w-5 text-neutral-400" />
                  </button>
                </div>
              </form>
              
              {/* Desktop Icons */}
              <div className="hidden lg:flex items-center gap-x-4">
                <Link to="/wishlist" title="Wishlist" className="text-neutral-600 hover:text-primary transition-colors">
                  <HeartIcon className="h-7 w-7" />
                </Link>
                <Link to={isAuthenticated ? "/profile" : "/login"} title="Profil Pengguna" className="text-neutral-600 hover:text-primary transition-colors">
                  <UserIcon className="h-7 w-7" />
                </Link>
              </div>

              {/* Mobile Wishlist Icon */}
              <Link to="/wishlist" title="Wishlist" className="lg:hidden text-neutral-600 hover:text-primary transition-colors p-2">
                <HeartIcon className="h-7 w-7" />
              </Link>

              {/* Cart (Always Visible) */}
              <Link to="/cart" title="Keranjang Belanja" className="relative text-neutral-600 hover:text-primary transition-colors p-2">
                <ShoppingCartIcon className="h-7 w-7" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </Link>

              {/* Hamburger Button (Mobile Only) */}
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-neutral-600 hover:text-primary" aria-label="Buka menu">
                <MenuIcon className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default Header;
