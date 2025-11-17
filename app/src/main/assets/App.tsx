import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { SellerProvider } from './context/SellerContext';
import { ThemeProvider } from './context/ThemeContext';
import { FollowProvider } from './context/FollowContext';
import { ShareProvider } from './context/ShareContext';

// Components
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import SellerLayout from './components/seller/SellerLayout';
import ShareModal from './components/ShareModal';

// Pages
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
import FeedPage from './pages/FeedPage';
import LivePage from './pages/LivePage';
import LiveDetailPage from './pages/LiveDetailPage';

// Seller Pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import MyProductsPage from './pages/seller/MyProductsPage';
import ProductFormPage from './pages/seller/ProductFormPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerOrderDetailPage from './pages/seller/SellerOrderDetailPage';
import SellerLivePage from './pages/seller/SellerLivePage';
import SellerChatPage from './pages/seller/SellerChatPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';
import SellerFinancePage from './pages/seller/SellerFinancePage';
import SellerPromoPage from './pages/seller/SellerPromoPage';
import SellerReviewsPage from './pages/seller/SellerReviewsPage';
import SellerSettingsPage from './pages/seller/SellerSettingsPage';
import SellerCollaborationPage from './pages/seller/SellerCollaborationPage';

const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <NotificationProvider>
      <ShareProvider>
        <AuthProvider>
          <SellerProvider>
            <CartProvider>
              <WishlistProvider>
                <FollowProvider>
                  {children}
                </FollowProvider>
              </WishlistProvider>
            </CartProvider>
          </SellerProvider>
        </AuthProvider>
      </ShareProvider>
    </NotificationProvider>
  </ThemeProvider>
);

const App: React.FC = () => {
  return (
    <AllProviders>
      <HashRouter>
        <ScrollToTop />
        <ShareModal />
        <Routes>
          <Route path="/live/:id" element={<LiveDetailPage />} />

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
            
            <Route path="seller" element={<ProtectedRoute />}>
              <Route element={<SellerLayout />}>
                <Route index element={<SellerDashboardPage />} />
                <Route path="products" element={<MyProductsPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/edit/:id" element={<ProductFormPage />} />
                <Route path="orders" element={<SellerOrdersPage />} />
                <Route path="orders/:id" element={<SellerOrderDetailPage />} />
                <Route path="live" element={<SellerLivePage />} />
                <Route path="chat" element={<SellerChatPage />} />
                <Route path="analytics" element={<SellerAnalyticsPage />} />
                <Route path="finance" element={<SellerFinancePage />} />
                <Route path="promo" element={<SellerPromoPage />} />
                <Route path="reviews" element={<SellerReviewsPage />} />
                <Route path="settings" element={<SellerSettingsPage />} />
                <Route path="collaboration" element={<SellerCollaborationPage />} />
              </Route>
            </Route>

          </Route>
        </Routes>
      </HashRouter>
    </AllProviders>
  );
};

export default App;
