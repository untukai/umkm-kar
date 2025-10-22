import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toastMessage, hideToast } = useToast();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
      <Footer />
    </div>
  );
};

export default Layout;