

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveSessions, sellers, products, endLiveSession } from '../data/dummyData';
import { LiveChatMessage, Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useFollow } from '../hooks/useFollow';
import Button from '../components/Button';
import { ShoppingCartIcon, XIcon, ShareIcon, StoreIcon, SunIcon, EyeIcon, HeartIcon } from '../components/Icons';

const LiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { isFollowing, followSeller, unfollowSeller } = useFollow();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const session = liveSessions.find(s => s.id === parseInt(id || ''));
  const seller = session ? sellers.find(s => s.id === session.sellerId) : null;
  const sessionProducts = session ? products.filter(p => session.productIds.includes(p.id)) : [];
  
  const currentSeller = user ? sellers.find(s => s.email === user.email) : null;
  const isHost = session?.status === 'live' && currentSeller?.id === seller?.id;

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [pinnedProduct, setPinnedProduct] = useState<Product | null>(sessionProducts[0] || null);
  const [showEndLiveModal, setShowEndLiveModal] = useState(false);

  useEffect(() => {
    setChatMessages([
        { id: 1, userName: 'Budi', text: 'Wah, serabinya kelihatan enak banget!' },
        { id: 2, userName: 'Citra', text: 'Ada promo apa aja nih, kak?' },
        { id: 3, userName: 'Dewi', text: 'Harganya berapa?' },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!session || !seller || !videoRef.current) return;

    const videoEl = videoRef.current;
    let stream: MediaStream | null = null;
    
    // Reset video state before setting new source
    videoEl.pause();
    videoEl.src = '';
    videoEl.srcObject = null;
    
    if (session.status === 'live') {
      if (isHost) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(mediaStream => {
            stream = mediaStream;
            videoEl.srcObject = mediaStream;
            videoEl.muted = true; // Host preview is muted
            videoEl.play().catch(e => console.error("Host autoplay failed", e));
          })
          .catch(err => {
            console.error("Failed to get camera stream:", err);
            showNotification('Gagal Memuat Kamera', 'Tidak bisa mengakses kamera. Pastikan Anda telah memberikan izin.', 'error');
            navigate('/seller/live');
          });
      } else {
        // Buyer is watching live, play placeholder video to simulate stream
        videoEl.src = 'https://videos.pexels.com/video-files/853878/853878-hd_1280_720_25fps.mp4';
        videoEl.muted = false;
        videoEl.loop = true;
        videoEl.play().catch(e => console.error("Buyer autoplay failed", e));
      }
    } else { // status === 'replay'
      // For replays, both host and buyer see the placeholder video
      videoEl.src = 'https://videos.pexels.com/video-files/853878/853878-hd_1280_720_25fps.mp4';
      videoEl.muted = false;
      videoEl.loop = true;
      videoEl.play().catch(e => console.error("Replay autoplay failed", e));
    }

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [session, seller, isHost, navigate, showNotification]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!isAuthenticated) {
        showNotification('Gagal', 'Anda harus masuk untuk mengirim komentar.', 'error', { label: 'Masuk', path: '/login' });
        return;
    }
    const msg: LiveChatMessage = { id: Date.now(), userName: 'Anda', text: newMessage };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showNotification('Berhasil', `'${product.name}' ditambahkan ke keranjang.`, 'success', { label: 'Lihat Keranjang', path: '/cart' });
  };
  
  const handleCloseClick = () => {
    if (user?.role === 'penjual' && session?.status === 'live') {
      setShowEndLiveModal(true);
    } else {
      navigate('/live');
    }
  };

  const handleEndLive = () => {
    if (session) {
      endLiveSession(session.id);
      showNotification('Berhasil', 'Sesi live telah diakhiri.');
      navigate('/seller/live');
    }
    setShowEndLiveModal(false);
  };
  
  if (!session || !seller) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-100 text-center p-4">
            <h1 className="text-2xl font-bold">Sesi live tidak ditemukan.</h1>
            <Button onClick={() => navigate('/live')} className="mt-4">Kembali ke Live</Button>
        </div>
    );
  }

  const following = isFollowing(seller.id);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      showNotification('Gagal', 'Anda harus masuk untuk mengikuti toko.', 'error', { label: 'Masuk', path: '/login' });
      return;
    }
    if (following) {
      unfollowSeller(seller.id);
    } else {
      followSeller(seller.id);
    }
  };

  const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'jt';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  return (
    <div className="h-screen w-screen bg-black text-white relative flex flex-col font-sans overflow-hidden">
      {/* Background Video Player */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls={!isHost && session.status !== 'live'} // Show controls for non-hosts or on replays
        muted={isHost} // Host preview is muted
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ transform: isHost ? 'scaleX(-1)' : 'none' }}
        poster={session.thumbnailUrl} // Use thumbnail as a poster image
      />

      {/* Top Bar */}
      <header className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
        {/* Combined Seller Info & Follow Button */}
        <div className="flex items-center gap-2 bg-neutral-900/60 backdrop-blur-sm p-1.5 pr-3 rounded-full">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <StoreIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm truncate">{seller.name}</p>
              <button
                onClick={handleFollowToggle}
                className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${following ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}
              >
                {following ? 'Diikuti' : 'Ikuti'}
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{formatNumber(session.viewers || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <HeartIcon className="w-3 h-3" />
                    <span>{formatNumber(session.likes || 0)}</span>
                </div>
            </div>
          </div>
        </div>
        
        {/* Close Button */}
        <button onClick={handleCloseClick} className="p-2.5 bg-neutral-900/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors">
          <XIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Bottom Overlays */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 mt-auto flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
        {/* Chat Messages */}
        <div className="w-full max-h-48 overflow-y-auto text-sm space-y-2 mb-4 scrollbar-hide">
          {chatMessages.map(msg => (
            <p key={msg.id} className="drop-shadow-md animate-fade-in">
              <span className="font-bold mr-1.5 opacity-80">{msg.userName}:</span>
              <span>{msg.text}</span>
            </p>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        {/* Pinned Product */}
        {pinnedProduct && (
          <div className="bg-white/95 backdrop-blur-sm text-black p-2 rounded-lg flex items-center gap-3 animate-fade-in shadow-lg mb-4">
            <img src={pinnedProduct.imageUrls[0]} alt={pinnedProduct.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0"/>
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

        {/* Action Bar */}
        <footer className="flex items-center gap-3">
          <form onSubmit={handleSendMessage} className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Tambah komentar..."
              className="w-full bg-neutral-800/60 backdrop-blur-sm placeholder-neutral-300 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="off"
            />
          </form>
          <button className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShoppingCartIcon className="w-6 h-6" /></button>
          <button className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><SunIcon className="w-6 h-6" /></button>
          <button className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShareIcon className="w-6 h-6" /></button>
        </footer>
      </div>

      {/* End Live Modal */}
      {showEndLiveModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={() => setShowEndLiveModal(false)}>
          <div className="bg-white text-black p-6 rounded-lg text-center w-full max-w-sm animate-popup-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">Akhiri Sesi Live?</h2>
            <p className="text-neutral-600 mb-6">Apakah Anda yakin ingin mengakhiri siaran langsung ini?</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowEndLiveModal(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleEndLive} className="flex-1">
                Ya, Akhiri
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDetailPage;