

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { liveSessions, sellers, products, virtualGifts, endLiveSession } from '../data/dummyData';
import { LiveChatMessage, Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useFollow } from '../hooks/useFollow';
import Button from '../components/Button';
import { UserIcon, StoreIcon, SendIcon, GiftIcon, ShoppingCartIcon, XCircleIcon, UserPlusIcon, XIcon, ShareIcon } from '../components/Icons';

const LiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { isFollowing, followSeller, unfollowSeller } = useFollow();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const session = liveSessions.find(s => s.id === parseInt(id || ''));
  const seller = session ? sellers.find(s => s.id === session.sellerId) : null;
  const sessionProducts = session ? products.filter(p => session.productIds.includes(p.id)) : [];

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConfirmEndLiveOpen, setIsConfirmEndLiveOpen] = useState(false);
  const [pinnedProduct, setPinnedProduct] = useState<Product | null>(sessionProducts[0] || null);

  useEffect(() => {
    // Initial dummy chat messages
    setChatMessages([
      { id: 1, userName: 'Budi', text: 'Wah, serabinya kelihatan enak banget!' },
      { id: 2, userName: 'Citra', text: 'Ada promo apa aja nih, kak?' },
    ]);

    // Simulate new messages appearing
    const interval = setInterval(() => {
      const randomUser = ['Dewi', 'Agus', 'Eko'][Math.floor(Math.random() * 3)];
      const randomMessage = ['Harganya berapa?', 'Bisa kirim hari ini?', 'Stoknya banyak?'][Math.floor(Math.random() * 3)];
      setChatMessages(prev => [...prev, { id: Date.now(), userName: randomUser, text: randomMessage }]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!isAuthenticated) {
        showNotification('Gagal', 'Anda harus masuk untuk mengirim komentar.', 'error', {label: 'Masuk', path: '/login'});
        return;
    }
    const msg: LiveChatMessage = { id: Date.now(), userName: user.email.split('@')[0], text: newMessage };
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

  const handleEndLive = () => {
    if (session && endLiveSession(session.id)) {
      showNotification('Berhasil', 'Sesi live telah diakhiri.');
      navigate('/seller/live');
    } else {
      showNotification('Gagal', 'Tidak dapat mengakhiri sesi live.', 'error');
    }
    setIsConfirmEndLiveOpen(false);
  };

  if (!session || !seller) {
    return <div className="text-center p-8">Sesi live tidak ditemukan.</div>;
  }
  
  const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  const isSellerOwner = isAuthenticated && user?.role === 'penjual' && user.email === seller.email;
  const isSessionLive = session.status === 'live';
  const isFollowingSeller = isFollowing(seller.id);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
        showNotification('Gagal', 'Anda harus masuk untuk mengikuti penjual.', 'error');
        return;
    }
    if (isFollowingSeller) {
      unfollowSeller(seller.id);
    } else {
      followSeller(seller.id);
      showNotification('Berhasil', `Anda sekarang mengikuti ${seller.name}`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black text-white font-sans">
        {/* Background Video/Image */}
        <img src={session.thumbnailUrl} alt="Live Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60"></div>

        {/* Main Overlay Container */}
        <div className="relative z-10 h-full w-full flex flex-col p-4">

          {/* Top Bar */}
          <header className="w-full flex justify-between items-start">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm p-1.5 rounded-full">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <StoreIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight">{seller.name}</h2>
                <p className="text-xs text-neutral-300">
                  {session.likes && session.likes > 1000 
                    ? `${(session.likes / 1000).toFixed(1)}K` 
                    : session.likes} likes
                </p>
              </div>
              {!isSellerOwner && (
                <button 
                  onClick={handleFollowToggle}
                  className={`ml-2 px-4 py-1.5 text-sm font-bold rounded-full transition-colors flex items-center gap-1.5 ${
                    isFollowingSeller 
                    ? 'bg-white/20 text-white' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isFollowingSeller ? 'Diikuti' : 'Ikuti'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">{session.viewers}</span>
              </div>
              {isSellerOwner && isSessionLive && (
                <button onClick={() => setIsConfirmEndLiveOpen(true)} className="bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded-full text-sm font-bold">
                  Akhiri
                </button>
              )}
              <button onClick={() => navigate('/live')} className="bg-black/40 backdrop-blur-sm p-1.5 rounded-full">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Spacer to push content to the bottom */}
          <div className="flex-1"></div>

          {/* Bottom Section (Chat, Pinned Product, Actions) */}
          <footer className="w-full flex flex-col items-start">
            {/* Live Chat */}
            <div className="w-full md:w-3/4 lg:w-1/2 h-48 overflow-y-auto space-y-2 pb-4 scrollbar-hide [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_100%)]">
                  {chatMessages.map(msg => (
                <div key={msg.id} className="flex gap-2 items-start text-sm animate-fade-in">
                  <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg max-w-xs">
                    <span className="font-semibold text-neutral-400 mr-2">{msg.userName}</span>
                    <span className="text-white leading-tight">{msg.text}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Pinned Product */}
            {pinnedProduct && (
              <div className="bg-white/90 backdrop-blur-sm text-black p-2 rounded-lg flex items-center gap-3 animate-fade-in mb-4 w-full max-w-sm shadow-lg">
                <img src={pinnedProduct.imageUrls[0]} alt={pinnedProduct.name} className="w-16 h-16 rounded-md object-cover"/>
                <div className="flex-1">
                  <p className="font-bold text-sm line-clamp-2">{pinnedProduct.name}</p>
                  <p className="font-bold text-primary">{formatRupiah(pinnedProduct.price)}</p>
                </div>
                <Button onClick={() => handleAddToCart(pinnedProduct)} className="!px-6 !font-bold">Beli</Button>
                <button onClick={() => setPinnedProduct(null)} className="p-1 text-neutral-500 hover:text-black">
                  <XIcon className="w-5 h-5"/>
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="w-full flex items-center gap-3">
              <button className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg" onClick={() => showNotification('Info', 'Fitur toko sedang disiapkan!')}>
                <ShoppingCartIcon className="w-6 h-6"/>
              </button>
              <form onSubmit={handleSendMessage} className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Tambah komentar..."
                  className="w-full h-12 bg-black/40 backdrop-blur-sm rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  autoComplete="off"
                />
              </form>
              <button className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg" onClick={() => showNotification('Info', 'Fitur hadiah sedang disiapkan!')}>
                <GiftIcon className="w-6 h-6"/>
              </button>
                <button className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg" onClick={() => showNotification('Info', 'Fitur bagikan sedang disiapkan!')}>
                <ShareIcon className="w-6 h-6"/>
              </button>
            </div>
          </footer>
        </div>
      </div>
      
      {/* End Live Confirmation Modal */}
      {isConfirmEndLiveOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={() => setIsConfirmEndLiveOpen(false)}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center text-neutral-800 animate-popup-in" onClick={e => e.stopPropagation()}>
                <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                <h2 className="text-xl font-bold mb-2">Akhiri Sesi Live?</h2>
                <p className="text-neutral-600 mb-6">
                    Apakah Anda yakin ingin mengakhiri sesi live ini? Sesi ini akan disimpan sebagai siaran ulang.
                </p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setIsConfirmEndLiveOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={handleEndLive} className="bg-red-500 hover:bg-red-600 focus:ring-red-500">
                        Ya, Akhiri
                    </Button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default LiveDetailPage;