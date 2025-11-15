



import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { SellerProvider } from './context/SellerContext';
import { WishlistProvider } from './context/WishlistContext';
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
import WishlistPage from './pages/WishlistPage';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import SellerLayout from './components/seller/SellerLayout'; // Import SellerLayout
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import MyProductsPage from './pages/seller/MyProductsPage';
import ProductFormPage from './pages/seller/ProductFormPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage'; // Import SellerOrdersPage
import SellerOrderDetailPage from './pages/seller/SellerOrderDetailPage'; // Import SellerOrderDetailPage
import FeedPage from './pages/FeedPage';
import LivePage from './pages/LivePage';
import LiveDetailPage from './pages/LiveDetailPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <SellerProvider>
            <WishlistProvider>
              <HashRouter>
                <ScrollToTop />
                <Routes>
                  {/* Public Routes with main Layout */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/:id" element={<ProductDetailPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="articles" element={<ArticlesPage />} />
                    <Route path="articles/:id" element={<ArticleDetailPage />} />
                    <Route path="collaboration" element={<CollaborationPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="feed" element={<FeedPage />} />
                    <Route path="live" element={<LivePage />} />
                    <Route path="live/:id" element={<LiveDetailPage />} />
                  </Route>

                  {/* Seller Protected Routes with its own Layout */}
                  <Route path="/seller" element={<ProtectedRoute />}>
                    <Route element={<SellerLayout />}>
                      <Route index element={<SellerDashboardPage />} />
                      <Route path="orders" element={<SellerOrdersPage />} />
                      <Route path="orders/:id" element={<SellerOrderDetailPage />} />
                      <Route path="products" element={<MyProductsPage />} />
                      <Route path="products/new" element={<ProductFormPage />} />
                      <Route path="products/edit/:id" element={<ProductFormPage />} />
                    </Route>
                  </Route>
                </Routes>
              </HashRouter>
            </WishlistProvider>
          </SellerProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
