import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Toast from './Toast';
import SellerDetailModal from './SellerDetailModal'; // Import the new modal
import BackToTopButton from './BackToTopButton'; // Import the BackToTopButton
import { useToast } from '../hooks/useToast';
import { useSeller } from '../hooks/useSeller'; // Import the new hook

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toastMessage, hideToast } = useToast();
  const { selectedSeller, hideSellerModal } = useSeller();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
      {selectedSeller && <SellerDetailModal seller={selectedSeller} onClose={hideSellerModal} />}
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default Layout;