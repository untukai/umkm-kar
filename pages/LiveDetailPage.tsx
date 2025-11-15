import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveSessions, sellers, products, endLiveSession } from '../data/dummyData';
import { LiveChatMessage, Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useFollow } from '../hooks/useFollow';
import Button from '../components/Button';
import { ShoppingCartIcon, XIcon, ShareIcon, StoreIcon, EyeIcon, HeartIcon } from '../components/Icons';

let heartCounter = 0;

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
  
  // State for realistic simulation
  const [likes, setLikes] = useState(session?.likes || 0);
  const [viewers, setViewers] = useState(session?.viewers || 0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  // Predefined messages for simulation
  const sampleChats: Omit<LiveChatMessage, 'id'>[] = [
    { userName: 'Andi', text: 'Keren banget produknya!' },
    { userName: 'Sari', text: 'Diskonnya sampai kapan kak?' },
    { userName: 'Rina', text: 'Baru join, lagi bahas apa nih?' },
    { userName: 'Budi', text: '💚', isGift: true, giftIcon: '💚' },
    { userName: 'Joko', text: 'Pengirimannya aman kan?' },
    { userName: 'Wati', text: 'Langsung checkout ah! 👍' },
    { userName: 'Dian', text: 'Warnanya ada apa aja?' },
    { userName: 'Putri', text: '👑', isGift: true, giftIcon: '👑' },
  ];

  // Effect to run the live simulation for buyers
  useEffect(() => {
    if (isHost || session?.status !== 'live') return;

    const viewersInterval = setInterval(() => setViewers(v => Math.max(50, v + Math.floor(Math.random() * 5) - 2)), 3000);
    const likesInterval = setInterval(() => setLikes(l => l + Math.floor(Math.random() * 10)), 1500);
    const chatInterval = setInterval(() => {
      const randomMsg = sampleChats[Math.floor(Math.random() * sampleChats.length)];
      setChatMessages(prev => [...prev, { ...randomMsg, id: Date.now() }]);
    }, 2500);

    // Initial messages
    setChatMessages([
        { id: 1, userName: 'Budi', text: 'Wah, serabinya kelihatan enak banget!' },
        { id: 2, userName: 'Citra', text: 'Ada promo apa aja nih, kak?' },
    ]);


    return () => {
      clearInterval(viewersInterval);
      clearInterval(likesInterval);
      clearInterval(chatInterval);
    };
  }, [isHost, session?.status]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!session || !seller || !videoRef.current) return;

    const videoEl = videoRef.current;
    let stream: MediaStream | null = null;
    
    videoEl.pause();
    videoEl.src = '';
    videoEl.srcObject = null;
    
    if (session.status === 'live') {
      if (isHost) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(mediaStream => {
            stream = mediaStream;
            videoEl.srcObject = mediaStream;
            videoEl.muted = true;
            videoEl.play().catch(e => console.error("Host autoplay failed", e));
          })
          .catch(err => {
            console.error("Failed to get camera stream:", err);
            showNotification('Gagal Memuat Kamera', 'Tidak bisa mengakses kamera. Pastikan Anda telah memberikan izin.', 'error');
            navigate('/seller/live');
          });
      } else {
        videoEl.src = 'https://videos.pexels.com/video-files/855352/855352-hd_720_1366_25fps.mp4';
        videoEl.muted = false;
        videoEl.loop = true;
        videoEl.play().catch(e => console.error("Buyer autoplay failed", e));
      }
    } else {
      videoEl.src = 'https://videos.pexels.com/video-files/855352/855352-hd_720_1366_25fps.mp4';
      videoEl.muted = false;
      videoEl.loop = true;
      videoEl.play().catch(e => console.error("Replay autoplay failed", e));
    }

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
    if (isHost) {
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
  
  const handleAddHeart = () => {
    setLikes(l => l + 1); // Increment likes count
    const newHeart = { id: heartCounter++, x: Math.random() * 50 + 25 };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id)), 2000);
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
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'jt';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
  };

  return (
    <div className="h-screen w-screen bg-black text-white relative flex flex-col font-sans overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls={session.status === 'replay'}
        muted={isHost || session.status === 'live'}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ transform: isHost ? 'scaleX(-1)' : 'none' }}
        poster={session.thumbnailUrl}
      />

      <div className="absolute bottom-20 right-4 h-64 w-20 pointer-events-none z-20">
        {floatingHearts.map(heart => (
          <div key={heart.id} className="absolute bottom-0 animate-float-up" style={{ left: `${heart.x}%` }}>
            <HeartIcon className="w-8 h-8 text-red-500" fill="currentColor" style={{ filter: `hue-rotate(${Math.random() * 360}deg)` }} />
          </div>
        ))}
      </div>
      
      <header className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 bg-neutral-900/60 backdrop-blur-sm p-1.5 pr-3 rounded-full">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <StoreIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm truncate">{seller.name}</p>
              {!isHost && (
                <button onClick={handleFollowToggle} className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${following ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}>
                    {following ? 'Diikuti' : 'Ikuti'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                <div className="flex items-center gap-1"><EyeIcon className="w-4 h-4" /><span>{formatNumber(viewers)}</span></div>
                <div className="flex items-center gap-1"><HeartIcon className="w-3 h-3" /><span>{formatNumber(likes)}</span></div>
            </div>
          </div>
        </div>
        
        <button onClick={handleCloseClick} className="p-2.5 bg-neutral-900/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors">
          <XIcon className="w-5 h-5" />
        </button>
      </header>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 mt-auto flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
        <div className="w-full max-h-48 overflow-y-auto text-sm space-y-2 mb-4 scrollbar-hide">
          {chatMessages.map(msg => (
            <p key={msg.id} className="drop-shadow-md animate-fade-in">
              {msg.isGift ? (
                <span className="bg-yellow-400/20 text-yellow-300 p-2 rounded-lg">
                  <span className="font-bold mr-1.5 opacity-80">{msg.userName}</span> mengirimkan {msg.giftIcon}
                </span>
              ) : (
                <>
                  <span className="font-bold mr-1.5 opacity-80">{msg.userName}:</span>
                  <span>{msg.text}</span>
                </>
              )}
            </p>
          ))}
          <div ref={chatEndRef} />
        </div>
        
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

        <footer className="flex items-center gap-3">
          {!isHost &&
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
          }
          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShoppingCartIcon className="w-6 h-6" /></button>
            {!isHost && <button onClick={handleAddHeart} className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><HeartIcon className="w-6 h-6 text-red-400" /></button>}
            <button className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShareIcon className="w-6 h-6" /></button>
          </div>
        </footer>
      </div>

      {showEndLiveModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={() => setShowEndLiveModal(false)}>
          <div className="bg-white text-black p-6 rounded-lg text-center w-full max-w-sm animate-popup-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">Akhiri Sesi Live?</h2>
            <p className="text-neutral-600 mb-6">Apakah Anda yakin ingin mengakhiri siaran langsung ini?</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowEndLiveModal(false)} className="flex-1">Batal</Button>
              <Button onClick={handleEndLive} className="flex-1">Ya, Akhiri</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDetailPage;