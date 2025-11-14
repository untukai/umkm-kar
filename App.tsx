
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { SellerProvider } from './context/SellerContext';
import { WishlistProvider } from './context/WishlistContext'; // Import WishlistProvider
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CollaborationPage from './pages/CollaborationPage';
import WishlistPage from './pages/WishlistPage'; // Import WishlistPage

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <SellerProvider>
            <WishlistProvider>
              <HashRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/articles/:id" element={<ArticleDetailPage />} />
                    <Route path="/collaboration" element={<CollaborationPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                  </Routes>
                </Layout>
              </HashRouter>
            </WishlistProvider>
          </SellerProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;