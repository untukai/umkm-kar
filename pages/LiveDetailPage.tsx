

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveSessions, sellers, products } from '../data/dummyData';
import { LiveChatMessage, Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/Button';
import { ShoppingCartIcon, XIcon, ShareIcon, MenuIcon, HeartIcon, SunIcon } from '../components/Icons';

const LiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const session = liveSessions.find(s => s.id === parseInt(id || ''));
  const seller = session ? sellers.find(s => s.id === session.sellerId) : null;
  const sessionProducts = session ? products.filter(p => session.productIds.includes(p.id)) : [];

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [pinnedProduct, setPinnedProduct] = useState<Product | null>(sessionProducts[0] || null);

  useEffect(() => {
    // Initial dummy chat messages from data
    setChatMessages([
        { id: 1, userName: 'Budi', text: 'Wah, serabinya kelihatan enak banget!' },
        { id: 2, userName: 'Citra', text: 'Ada promo apa aja nih, kak?' },
        { id: 3, userName: 'Dewi', text: 'Harganya berapa?' },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!isAuthenticated) {
        showNotification('Gagal', 'Anda harus masuk untuk mengirim komentar.', 'error', { label: 'Masuk', path: '/login' });
        return;
    }
    // This is a dummy implementation
    const msg: LiveChatMessage = { id: Date.now(), userName: 'Anda', text: newMessage };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showNotification(
      'Berhasil',
      `'${product.name}' ditambahkan ke keranjang.`,
      'success',
      { label: 'Lihat Keranjang', path: '/cart' }
    );
  };

  if (!session || !seller) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold">Sesi live tidak ditemukan.</h1>
            <Button onClick={() => navigate('/live')} className="mt-4">Kembali ke Live</Button>
        </div>
    );
  }

  const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  return (
    <div className="flex justify-center items-center py-4">
      {/* Mobile-like Container */}
      <div className="w-full max-w-sm h-[calc(100vh-10rem)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Top Header Bar */}
        <header className="p-3 border-b flex justify-between items-center bg-white flex-shrink-0 z-10">
          <button onClick={() => navigate('/live')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-lg">
              K
            </div>
          </button>
          <div className="flex items-center gap-4 text-neutral-700">
            <HeartIcon className="w-6 h-6 cursor-pointer" onClick={() => navigate('/wishlist')} />
            <ShoppingCartIcon className="w-6 h-6 cursor-pointer" onClick={() => navigate('/cart')} />
            <MenuIcon className="w-6 h-6 cursor-pointer" onClick={() => showNotification('Info', 'Menu navigasi sedang disiapkan!')} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-black relative">
            {/* Likes text */}
            <div className="absolute top-2 left-4 text-white/50 text-xs">
              {session.likes} likes
            </div>

            {/* Chat Message Overlays */}
            <div className="absolute bottom-4 left-4 right-4 text-white text-sm space-y-2 pb-20">
                {chatMessages.map(msg => (
                    <p key={msg.id} className="drop-shadow-md animate-fade-in">
                        <span className="font-bold mr-1">{msg.userName}</span>
                        <span>{msg.text}</span>
                    </p>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Pinned Product at the bottom of the main content */}
            <div className="mt-auto p-3">
                {pinnedProduct && (
                <div className="bg-neutral-100/95 backdrop-blur-sm text-black p-2 rounded-lg flex items-center gap-3 animate-fade-in shadow-lg">
                    <img src={pinnedProduct.imageUrls[0]} alt={pinnedProduct.name} className="w-12 h-12 rounded-md object-cover"/>
                    <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{pinnedProduct.name}</p>
                    <p className="font-semibold text-primary">{formatRupiah(pinnedProduct.price)}</p>
                    </div>
                    <Button onClick={() => handleAddToCart(pinnedProduct)} className="!px-5 !py-2 !font-bold !text-sm flex-shrink-0">Beli</Button>
                    <button onClick={() => setPinnedProduct(null)} className="p-1 text-neutral-500 hover:text-black">
                    <XIcon className="w-4 h-4"/>
                    </button>
                </div>
                )}
            </div>
        </main>

        {/* Bottom Action Bar */}
        <footer className="p-3 border-t flex items-center gap-3 bg-white flex-shrink-0">
          <ShoppingCartIcon className="w-6 h-6 text-neutral-600 cursor-pointer" onClick={() => showNotification('Info', 'Toko produk live sedang disiapkan!')} />
          <form onSubmit={handleSendMessage} className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Tambah komentar..."
              className="w-full bg-transparent text-sm focus:outline-none"
              autoComplete="off"
            />
          </form>
          <SunIcon className="w-6 h-6 text-neutral-600 cursor-pointer" onClick={() => showNotification('Info', 'Fitur hadiah sedang disiapkan!')} />
          <ShareIcon className="w-6 h-6 text-neutral-600 cursor-pointer" onClick={() => showNotification('Info', 'Fitur bagikan sedang disiapkan!')} />
        </footer>

      </div>
    </div>
  );
};

export default LiveDetailPage;
