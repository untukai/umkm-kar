
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { liveSessions, sellers, products, virtualGifts } from '../data/dummyData';
import { LiveChatMessage, Product, VirtualGift } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/Button';
// FIX: Import CurrencyDollarIcon
import { UserIcon, StoreIcon, SendIcon, GiftIcon, ShoppingCartIcon, CurrencyDollarIcon } from '../components/Icons';

const LiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, spendCoins } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const session = liveSessions.find(s => s.id === parseInt(id || ''));
  const seller = session ? sellers.find(s => s.id === session.sellerId) : null;
  const sessionProducts = session ? products.filter(p => session.productIds.includes(p.id)) : [];

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [flyingGifts, setFlyingGifts] = useState<{ id: number; icon: string }[]>([]);

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
    if (!newMessage.trim() || !user) return;
    const msg: LiveChatMessage = { id: Date.now(), userName: user.email.split('@')[0], text: newMessage };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const handleSendGift = (gift: VirtualGift) => {
    if (!user) {
      showNotification('Gagal', 'Anda harus login untuk mengirim hadiah.', 'error');
      return;
    }
    if (spendCoins(gift.price)) {
      const msg: LiveChatMessage = { id: Date.now(), userName: user.email.split('@')[0], text: `mengirim ${gift.name}`, isGift: true, giftIcon: gift.icon };
      setChatMessages(prev => [...prev, msg]);
      showNotification('Berhasil', `Anda mengirim ${gift.name}!`);
      
      // Trigger flying gift animation
      const newGift = { id: Date.now(), icon: gift.icon };
      setFlyingGifts(prev => [...prev, newGift]);
      setTimeout(() => {
        setFlyingGifts(prev => prev.filter(f => f.id !== newGift.id));
      }, 3000); // Animation duration
      
    } else {
      showNotification('Gagal', 'Koin Anda tidak cukup.', 'error');
    }
    setShowGifts(false);
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showNotification('Berhasil', `'${product.name}' ditambahkan ke keranjang.`);
  };

  if (!session || !seller) {
    return <div className="text-center p-8">Sesi live tidak ditemukan.</div>;
  }
  
  const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col lg:flex-row">
       <style>{`
        @keyframes fly-up {
          0% { transform: translateY(0) scale(0.5); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-fly-up {
          animation: fly-up 3s ease-out forwards;
        }
      `}</style>

      {/* Main Content: Video + Products */}
      <div className="flex-1 flex flex-col bg-neutral-900 relative">
        <div className="absolute top-4 left-4 z-10">
          <Link to="/live">
            <Button variant="secondary" className="bg-black/50 text-white hover:bg-black/80 !px-3 !py-1.5 text-sm">&larr; Kembali</Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-lg">
           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
             <StoreIcon className="w-5 h-5 text-primary" />
           </div>
           <div>
              <h2 className="font-bold text-sm leading-tight">{seller.name}</h2>
              <p className="text-xs text-neutral-300">{session.title}</p>
           </div>
        </div>
        
        {/* Flying Gifts Container */}
        <div className="absolute bottom-20 right-4 h-64 w-24 overflow-hidden pointer-events-none">
          {flyingGifts.map((gift) => (
            <div key={gift.id} className="absolute bottom-0 animate-fly-up text-4xl" style={{ left: `${Math.random() * 50}%` }}>
              {gift.icon}
            </div>
          ))}
        </div>

        {/* Video Player Placeholder */}
        <div className="flex-1 bg-black flex items-center justify-center">
            <img src={session.thumbnailUrl} alt="Live Thumbnail" className="max-h-full max-w-full object-contain" />
        </div>
        
        {/* Product Carousel */}
        <div className="bg-black/80 backdrop-blur-sm p-3">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {sessionProducts.map(p => (
              <div key={p.id} className="flex-shrink-0 w-48 bg-neutral-800 rounded-lg p-2 flex items-center gap-2">
                <img src={p.imageUrls[0]} alt={p.name} className="w-14 h-14 rounded-md object-cover" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold leading-tight line-clamp-2">{p.name}</p>
                  <p className="font-bold text-primary">{formatRupiah(p.price)}</p>
                  <button onClick={() => handleAddToCart(p)} className="text-white bg-primary/80 hover:bg-primary rounded-full px-2 py-0.5 mt-1 text-[10px] font-bold">
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: Chat */}
      <div className="w-full lg:w-80 bg-neutral-800 flex flex-col h-1/3 lg:h-full">
        <div className="p-3 border-b border-neutral-700 text-center">
            <h3 className="font-bold">Live Chat</h3>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
           {chatMessages.map(msg => (
             <div key={msg.id} className="flex gap-2 items-start text-sm">
                <div className="w-7 h-7 rounded-full bg-neutral-600 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4 text-neutral-300" />
                </div>
                <div>
                   <span className="font-semibold text-neutral-400">{msg.userName}</span>
                   {msg.isGift ? (
                     <span className="ml-2 bg-primary/20 text-primary px-2 py-1 rounded-md">
                       {msg.giftIcon} {msg.text}
                     </span>
                   ) : (
                     <p className="text-white leading-tight">{msg.text}</p>
                   )}
                </div>
             </div>
           ))}
           <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-neutral-700">
           {showGifts && (
              <div className="mb-2 p-2 bg-neutral-900 rounded-lg grid grid-cols-5 gap-2 animate-fade-in">
                  {virtualGifts.map(gift => (
                    <button key={gift.id} onClick={() => handleSendGift(gift)} className="flex flex-col items-center p-1 rounded-md hover:bg-neutral-700 transition-colors">
                        <span className="text-2xl">{gift.icon}</span>
                        <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                          <CurrencyDollarIcon className="w-3 h-3" />
                          {gift.price}
                        </span>
                    </button>
                  ))}
              </div>
           )}
           <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button type="button" onClick={() => setShowGifts(!showGifts)} className="p-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors" title="Kirim Hadiah">
                  <GiftIcon className="w-5 h-5 text-yellow-400"/>
              </button>
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Ketik komentar..." 
                className="flex-1 bg-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button type="submit" className="p-2.5 bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                <SendIcon className="w-5 h-5 text-white" />
              </button>
           </form>
            {user && <p className="text-xs text-neutral-400 mt-2 text-center">Koin Anda: {user.coins || 0}</p>}
        </div>
      </div>
    </div>
  );
};

export default LiveDetailPage;
