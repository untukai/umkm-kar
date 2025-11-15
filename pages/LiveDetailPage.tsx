import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveSessions, sellers, products, endLiveSession, addOrUpdateLiveSession } from '../data/dummyData';
import { LiveChatMessage, Product, LiveSession } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { useFollow } from '../hooks/useFollow';
import { useShare } from '../hooks/useShare';
import Button from '../components/Button';
import { ShoppingCartIcon, XIcon, ShareIcon, StoreIcon, EyeIcon, HeartIcon, VideoCameraIcon } from '../components/Icons';
import signalingService from '../services/signalingService';

let heartCounter = 0;

// Enhanced configuration with redundant STUN servers for better reliability
const configuration = { 
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ] 
};

// NEW MODAL COMPONENT
const PermissionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  errorMessage: string;
}> = ({ isOpen, onClose, onRetry, errorMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay">
      <div className="bg-white text-black rounded-lg shadow-xl w-full max-w-md animate-popup-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-yellow-600">Izin Diperlukan</h2>
          <button onClick={onClose} className="p-1 text-neutral-500 hover:text-neutral-800"><XIcon className="w-6 h-6"/></button>
        </div>
        <div className="p-6 text-center">
            <VideoCameraIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">{errorMessage}</p>
            <p className="text-xs text-neutral-500">
                Pastikan Anda mengklik "Allow" atau "Izinkan" saat browser meminta akses. Jika Anda tidak sengaja memblokirnya, Anda perlu mengubah pengaturan izin untuk situs ini di browser Anda.
            </p>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Tutup</Button>
          <Button type="button" onClick={onRetry}>Coba Lagi</Button>
        </div>
      </div>
    </div>
  );
};

const LiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { isFollowing, followSeller, unfollowSeller } = useFollow();
  const { showShareModal } = useShare();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [pendingViewers, setPendingViewers] = useState<string[]>([]);

  const [session, setSession] = useState(() => liveSessions.find(s => s.id === parseInt(id || '')));
  const [isLoading, setIsLoading] = useState(!session);

  const seller = useMemo(() => session ? sellers.find(s => s.id === session.sellerId) : null, [session]);
  const sessionProducts = useMemo(() => session ? products.filter(p => session.productIds.includes(p.id)) : [], [session]);
  
  const currentSeller = useMemo(() => user ? sellers.find(s => s.email === user.email) : null, [user]);
  const isHost = useMemo(() => session?.status === 'live' && currentSeller?.id === seller?.id, [session, currentSeller, seller]);

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEndLiveModal, setShowEndLiveModal] = useState(false);
  const [pinnedProductId, setPinnedProductId] = useState<number | null>(null);

  const [likes, setLikes] = useState(session?.likes || 0);
  const [viewers, setViewers] = useState(session?.viewers || 0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  const qualityProfiles = {
      high: {
          videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
      },
  };

  const pinnedProduct = useMemo(() => {
    if (!pinnedProductId) return null;
    return products.find(p => p.id === pinnedProductId) || null;
  }, [pinnedProductId]);

  // Reliable remote stream playback for viewers
  useEffect(() => {
    if (remoteStream && videoRef.current) {
        videoRef.current.srcObject = remoteStream;
        videoRef.current.play().catch(error => {
            console.warn("Autoplay was prevented:", error);
            if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play();
            }
        });
    }
  }, [remoteStream]);

  // FIX: Moved startBroadcast and its dependency createPeerConnectionForViewer out of useEffect
  // and wrapped in useCallback to fix scope issue and prevent re-renders.
  const createPeerConnectionForViewer = useCallback(async (viewerId: string) => {
    if (!localStreamRef.current) {
        console.error("Host stream not ready when trying to connect viewer:", viewerId);
        return;
    }
    if (!id) return;

    console.log(`Creating peer connection for viewer ${viewerId}`);
    const pc = new RTCPeerConnection(configuration);
    peerConnectionsRef.current.set(viewerId, pc);

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            signalingService.sendMessage({ type: 'ice-candidate', payload: event.candidate, sessionId: id, targetPeerId: viewerId });
        }
    };
    
    // Handle ICE connection state changes for debugging and auto-recovery
    pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state for viewer ${viewerId} changed to: ${pc.iceConnectionState}`);
        if (pc.iceConnectionState === 'failed') {
            showNotification('Koneksi Gagal', `Koneksi dengan penonton terputus. Mencoba menyambungkan kembali...`, 'error');
            // The host should initiate the restart
            pc.restartIce();
        }
    };
    
    // Use onnegotiationneeded to handle initial offer and subsequent offers for ICE restarts
    pc.onnegotiationneeded = async () => {
        console.log(`Negotiation needed for viewer ${viewerId}. Creating offer...`);
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            signalingService.sendMessage({ type: 'offer', payload: offer, sessionId: id, targetPeerId: viewerId });
        } catch (err) {
            console.error(`Error creating offer for ${viewerId}:`, err);
        }
    };

    localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
  }, [id, showNotification]);

  const startBroadcast = useCallback(async () => {
    setShowPermissionModal(false);
    try {
        // Always request high quality to have a good source stream to manipulate
        const stream = await navigator.mediaDevices.getUserMedia({ video: qualityProfiles['high'].videoConstraints, audio: true });
        localStreamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.error("Local stream play failed", e));
        }
        // Process any viewers who joined before the stream was ready by using functional update
        setPendingViewers(currentPendingViewers => {
            console.log(`Stream ready. Processing ${currentPendingViewers.length} pending viewers.`);
            currentPendingViewers.forEach(viewerId => createPeerConnectionForViewer(viewerId));
            return [];
        });
    } catch (err) {
        console.error("Failed to get media stream:", err);
        let errorMessage = 'Anda harus mengizinkan akses kamera dan mikrofon untuk memulai sesi live.';
        if (err instanceof DOMException) {
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage = 'Akses kamera dan mikrofon ditolak. Mohon izinkan akses di pengaturan browser Anda dan coba lagi.';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage = 'Tidak ada kamera atau mikrofon yang ditemukan di perangkat Anda.';
            }
        }
        setPermissionError(errorMessage);
        setShowPermissionModal(true);
    }
  }, [createPeerConnectionForViewer, setPendingViewers, setPermissionError, setShowPermissionModal]);

  useEffect(() => {
    if (!id) return;
    
    let timeoutId: number | null = null;
    
    const handleVisibilityChange = async () => {
        if (document.visibilityState === 'visible' && isHost && localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack && videoTrack.readyState === 'ended') {
                console.log("Camera track ended. Restarting broadcast.");
                showNotification("Info", "Menyalakan kembali kamera Anda...");
                try {
                    const newStream = await navigator.mediaDevices.getUserMedia({ video: qualityProfiles['high'].videoConstraints, audio: true });
                    const newVideoTrack = newStream.getVideoTracks()[0];
                    const newAudioTrack = newStream.getAudioTracks()[0];

                    for (const pc of peerConnectionsRef.current.values()) {
                        const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
                        if (videoSender) await videoSender.replaceTrack(newVideoTrack);
                        const audioSender = pc.getSenders().find(s => s.track?.kind === 'audio');
                        if (audioSender) await audioSender.replaceTrack(newAudioTrack);
                    }

                    localStreamRef.current.getTracks().forEach(track => track.stop());
                    localStreamRef.current = newStream;
                    if (videoRef.current) videoRef.current.srcObject = newStream;

                } catch (err) {
                    console.error("Failed to restart media stream:", err);
                    let errorMessage = 'Gagal mengakses ulang kamera dan mikrofon Anda.';
                    if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                        errorMessage = 'Izin kamera/mikrofon dicabut. Mohon izinkan kembali di pengaturan browser.';
                    }
                    setPermissionError(errorMessage);
                    setShowPermissionModal(true);
                }
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleSignalingMessage = async (message: any) => {
        if (message.sessionId !== id) return;

        const fromPeerId = message.fromPeerId;
        const targetPeerId = message.targetPeerId;
        const myPeerId = signalingService.getPeerId();

        try {
            // isHost is a memoized value that depends on `session`. Ensure it's correct.
            // Since this function is defined inside useEffect which depends on isHost, it should be fine.
            if (isHost) {
                const pc = peerConnectionsRef.current.get(fromPeerId);
                
                if (message.type === 'viewer-join') {
                    if (localStreamRef.current && localStreamRef.current.active) {
                        console.log(`Viewer ${fromPeerId} joining. Stream ready. Creating connection.`);
                        await createPeerConnectionForViewer(fromPeerId);
                    } else {
                        console.log(`Viewer ${fromPeerId} joining. Stream not ready. Queuing.`);
                        setPendingViewers(prev => [...prev, fromPeerId]);
                    }
                } else if (message.type === 'answer' && pc) {
                    await pc.setRemoteDescription(new RTCSessionDescription(message.payload));
                } else if (message.type === 'ice-candidate' && pc) {
                     await pc.addIceCandidate(new RTCIceCandidate(message.payload));
                } else if (message.type === 'request-session-data') {
                    const currentSession = liveSessions.find(s => s.id === parseInt(id));
                    if (currentSession) {
                        signalingService.sendMessage({
                            type: 'session-data-response',
                            payload: currentSession,
                            sessionId: id,
                            targetPeerId: fromPeerId
                        });
                    }
                }
            } else { // Viewer logic
                if (message.type === 'offer' && targetPeerId === myPeerId) {
                    let pc = peerConnectionsRef.current.get('host');
                    if (!pc) {
                        pc = new RTCPeerConnection(configuration);
                        peerConnectionsRef.current.set('host', pc);

                        pc.onicecandidate = (event) => {
                            if (event.candidate) {
                                signalingService.sendMessage({ type: 'ice-candidate', payload: event.candidate, sessionId: id, targetPeerId: fromPeerId });
                            }
                        };
                        
                        pc.oniceconnectionstatechange = () => {
                            console.log(`Viewer ICE connection state changed to: ${pc.iceConnectionState}`);
                        };

                        pc.ontrack = (event) => {
                            setRemoteStream(event.streams[0]);
                        };
                    }

                    await pc.setRemoteDescription(new RTCSessionDescription(message.payload));
                    
                    candidateQueueRef.current.forEach(candidate => {
                        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error("Error adding queued ICE candidate", e));
                    });
                    candidateQueueRef.current = [];

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    signalingService.sendMessage({ type: 'answer', payload: answer, sessionId: id, targetPeerId: fromPeerId });
                } else if (message.type === 'ice-candidate' && targetPeerId === myPeerId) {
                    const pc = peerConnectionsRef.current.get('host');
                    if (pc && pc.remoteDescription) {
                        await pc.addIceCandidate(new RTCIceCandidate(message.payload));
                    } else {
                        candidateQueueRef.current.push(message.payload);
                    }
                }
            }

            if (message.type === 'session-data-response' && targetPeerId === myPeerId) {
                const receivedSession = message.payload as LiveSession;
                if (receivedSession) {
                    addOrUpdateLiveSession(receivedSession); // Update global store
                    setSession(receivedSession); // Update local state
                    setIsLoading(false); // Stop loading
                    if (timeoutId) clearTimeout(timeoutId); // Clear the timeout
                }
            }
            if (message.type === 'pin-product') setPinnedProductId(message.payload.productId);
            else if (message.type === 'unpin-product') setPinnedProductId(null);
            else if (message.type === 'end-session') {
                setIsSessionEnded(true);
                peerConnectionsRef.current.forEach(pc => pc.close());
                peerConnectionsRef.current.clear();
                if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
                setTimeout(() => navigate('/live'), 3000);
            }
        } catch (error) {
            console.error("Error handling signaling message:", error, message);
        }
    };
    
    signalingService.connect(id);
    signalingService.onMessage(handleSignalingMessage);

    if (session) {
      if (session.status === 'live') {
        if (isHost) {
          startBroadcast();
        } else {
          signalingService.sendMessage({ type: 'viewer-join', sessionId: id });
        }
      } else { // Replay
        setIsLoading(false);
        if (videoRef.current) {
          videoRef.current.src = 'https://videos.pexels.com/video-files/855352/855352-hd_720_1366_25fps.mp4';
          videoRef.current.muted = false;
          videoRef.current.loop = true;
          videoRef.current.play().catch(e => console.error("Replay autoplay failed", e));
        }
      }
    } else {
        // Session not found locally, request it from host
        console.log("Session not found locally, requesting from host...");
        signalingService.sendMessage({ type: 'request-session-data', sessionId: id });
        // Set a timeout to prevent indefinite loading
        timeoutId = window.setTimeout(() => {
            if (!session) { // Check again in case a response came in right at the 5s mark
                setIsLoading(false); // This will trigger the "not found" message if session is still null
            }
        }, 5000);
    }

    return () => {
        if (timeoutId) clearTimeout(timeoutId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();
        signalingService.disconnect();
    };
  }, [id, isHost, navigate, showNotification, createPeerConnectionForViewer, startBroadcast]);

  const sampleChats: Omit<LiveChatMessage, 'id'>[] = [
    { userName: 'Andi', text: 'Keren banget produknya!' }, { userName: 'Sari', text: 'Diskonnya sampai kapan kak?' }, { userName: 'Rina', text: 'Baru join, lagi bahas apa nih?' }, { userName: 'Budi', text: '💚', isGift: true, giftIcon: '💚' }, { userName: 'Joko', text: 'Pengirimannya aman kan?' }, { userName: 'Wati', text: 'Langsung checkout ah! 👍' },
  ];

  useEffect(() => {
    if (isHost || session?.status !== 'live') return;
    const viewersInterval = setInterval(() => setViewers(v => Math.max(50, v + Math.floor(Math.random() * 5) - 2)), 3000);
    const likesInterval = setInterval(() => setLikes(l => l + Math.floor(Math.random() * 10)), 1500);
    const chatInterval = setInterval(() => {
      const randomMsg = sampleChats[Math.floor(Math.random() * sampleChats.length)];
      setChatMessages(prev => [...prev, { ...randomMsg, id: Date.now() }]);
    }, 2500);
    setChatMessages([ { id: 1, userName: 'Budi', text: 'Wah, serabinya kelihatan enak banget!' }, { id: 2, userName: 'Citra', text: 'Ada promo apa aja nih, kak?' }, ]);
    return () => { clearInterval(viewersInterval); clearInterval(likesInterval); clearInterval(chatInterval); };
  }, [isHost, session?.status]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => { e.preventDefault(); if (!newMessage.trim()) return; if (!isAuthenticated) { showNotification('Gagal', 'Anda harus masuk untuk mengirim komentar.', 'error', { label: 'Masuk', path: '/login' }); return; } const msg: LiveChatMessage = { id: Date.now(), userName: 'Anda', text: newMessage }; setChatMessages(prev => [...prev, msg]); setNewMessage(''); };
  const handleAddToCart = (product: Product) => { addToCart(product); showNotification('Berhasil', `'${product.name}' ditambahkan ke keranjang.`, 'success', { label: 'Lihat Keranjang', path: '/cart' }); };
  const handleCloseClick = () => { if (isHost) { setShowEndLiveModal(true); } else { navigate('/live'); } };
  const handleEndLive = () => { if (session) { endLiveSession(session.id); showNotification('Berhasil', 'Sesi live telah diakhiri.'); navigate('/seller/live'); } setShowEndLiveModal(false); };
  const handleAddHeart = () => { setLikes(l => l + 1); const newHeart = { id: heartCounter++, x: Math.random() * 50 + 25 }; setFloatingHearts(prev => [...prev, newHeart]); setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id)), 2000); };

  const handlePinProduct = (productId: number) => {
    if (!isHost || !id) return;
    signalingService.sendMessage({ type: 'pin-product', payload: { productId }, sessionId: id });
  };
  
  const handleUnpinProduct = () => {
    if (!isHost || !id) return;
    signalingService.sendMessage({ type: 'unpin-product', sessionId: id });
  };

  const handleShare = async () => {
    if (!session || !seller) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}#/live/${session.id}`;
    const shareData = {
      title: `${seller.name} sedang live di KODIK!`,
      text: `Tonton keseruan live shopping dari ${seller.name} dan dapatkan promo spesial!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof DOMException && error.name !== 'AbortError') {
          console.error('Error sharing natively:', error);
          showShareModal(shareData);
        }
      }
    } else {
      showShareModal(shareData);
    }
  };
  
  if (isLoading) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-900 text-white text-center p-4">
            <h1 className="text-2xl font-bold animate-pulse">Menyambungkan ke Sesi Live...</h1>
            <p className="mt-2 text-neutral-300">Harap tunggu sebentar.</p>
        </div>
    );
  }

  if (!session || !seller) { return <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-100 text-center p-4"><h1 className="text-2xl font-bold">Sesi live tidak ditemukan atau telah berakhir.</h1><Button onClick={() => navigate('/live')} className="mt-4">Kembali ke Live</Button></div>; }

  const following = isFollowing(seller.id);
  const handleFollowToggle = () => { if (!isAuthenticated) { showNotification('Gagal', 'Anda harus masuk untuk mengikuti toko.', 'error', { label: 'Masuk', path: '/login' }); return; } if (following) { unfollowSeller(seller.id); } else { followSeller(seller.id); } };

  const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  const formatNumber = (num: number) => { if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'jt'; if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'; return num.toString(); };
  
  const renderHostFooter = () => (
    <div className="flex items-center gap-3 w-full">
      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg flex-1 max-w-sm">
        <p className="text-xs font-bold mb-2">Sematkan Produk</p>
        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
          {sessionProducts.map(product => (
            <div key={product.id} className={`flex items-center gap-2 p-1 rounded-md text-xs transition-colors ${pinnedProductId === product.id ? 'bg-primary/80' : 'bg-black/30'}`}>
              <img src={product.imageUrls[0]} alt={product.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
              <p className="flex-1 truncate">{product.name}</p>
              <button
                onClick={() => handlePinProduct(product.id)}
                className="bg-white/20 hover:bg-white/40 px-2 py-1 rounded-md text-xs font-semibold disabled:opacity-50"
                disabled={pinnedProductId === product.id}
              >
                {pinnedProductId === product.id ? 'Tersemat' : 'Pin'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBuyerFooter = () => (
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
  );

  return (
    <>
      <div className="h-screen w-screen bg-black text-white relative flex flex-col font-sans overflow-hidden">
        <video ref={videoRef} autoPlay playsInline controls={session.status === 'replay'} className="absolute inset-0 w-full h-full object-cover z-0" style={{ transform: isHost ? 'scaleX(-1)' : 'none' }} poster={session.thumbnailUrl} />
        {isSessionEnded && (
          <div className="absolute inset-0 bg-black/70 z-30 flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <h2 className="text-2xl font-bold">Siaran Langsung Telah Berakhir</h2>
            <p className="mt-2 text-neutral-300">Terima kasih telah menonton. Anda akan diarahkan kembali.</p>
          </div>
        )}
        <div className="absolute bottom-20 right-4 h-64 w-20 pointer-events-none z-20">
          {floatingHearts.map(heart => (<div key={heart.id} className="absolute bottom-0 animate-float-up" style={{ left: `${heart.x}%` }}><HeartIcon className="w-8 h-8 text-red-500" fill="currentColor" style={{ filter: `hue-rotate(${Math.random() * 360}deg)` }} /></div>))}
        </div>
        <header className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-neutral-900/60 backdrop-blur-sm p-1.5 pr-3 rounded-full">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><StoreIcon className="w-5 h-5 text-white" /></div>
            <div>
              <div className="flex items-center gap-2"><p className="font-bold text-sm truncate">{seller.name}</p>{!isHost && (<button onClick={handleFollowToggle} className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${following ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}>{following ? 'Diikuti' : 'Ikuti'}</button>)}</div>
              <div className="flex items-center gap-3 text-xs text-white/80 mt-1"><div className="flex items-center gap-1"><EyeIcon className="w-4 h-4" /><span>{formatNumber(viewers)}</span></div><div className="flex items-center gap-1"><HeartIcon className="w-3 h-3" /><span>{formatNumber(likes)}</span></div></div>
            </div>
          </div>
          <button onClick={handleCloseClick} className="p-2.5 bg-neutral-900/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><XIcon className="w-5 h-5" /></button>
        </header>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 mt-auto flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
          <div className="w-full max-h-48 overflow-y-auto text-sm space-y-2 mb-4 scrollbar-hide">
            {chatMessages.map(msg => (<p key={msg.id} className="drop-shadow-md animate-fade-in">{msg.isGift ? (<span className="bg-yellow-400/20 text-yellow-300 p-2 rounded-lg"><span className="font-bold mr-1.5 opacity-80">{msg.userName}</span> mengirimkan {msg.giftIcon}</span>) : (<><span className="font-bold mr-1.5 opacity-80">{msg.userName}:</span><span>{msg.text}</span></>)}</p>))}
            <div ref={chatEndRef} />
          </div>
          
          {pinnedProduct && (
            <div className="bg-white/95 backdrop-blur-sm text-black p-2 rounded-lg flex items-center gap-3 animate-fade-in shadow-lg mb-4">
              <img src={pinnedProduct.imageUrls[0]} alt={pinnedProduct.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0"/>
              <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{pinnedProduct.name}</p><p className="font-semibold text-primary">{formatRupiah(pinnedProduct.price)}</p></div>
              <Button onClick={() => handleAddToCart(pinnedProduct)} className="!px-5 !py-2 !font-bold !text-sm flex-shrink-0">Beli</Button>
              {isHost && <button onClick={handleUnpinProduct} className="p-1 text-neutral-500 hover:text-black"><XIcon className="w-4 h-4"/></button>}
            </div>
          )}

          <footer className="flex items-center gap-3">
            {isHost ? renderHostFooter() : renderBuyerFooter()}
            <div className="flex items-center gap-3 ml-auto">
              <button className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShoppingCartIcon className="w-6 h-6" /></button>
              {!isHost && <button onClick={handleAddHeart} className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><HeartIcon className="w-6 h-6 text-red-400" /></button>}
              <button onClick={handleShare} className="p-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"><ShareIcon className="w-6 h-6" /></button>
            </div>
          </footer>
        </div>

        {showEndLiveModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={() => setShowEndLiveModal(false)}>
            <div className="bg-white text-black p-6 rounded-lg text-center w-full max-w-sm animate-popup-in" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-2">Akhiri Sesi Live?</h2>
              <p className="text-neutral-600 mb-6">Apakah Anda yakin ingin mengakhiri siaran langsung ini?</p>
              <div className="flex justify-center gap-4"><Button variant="outline" onClick={() => setShowEndLiveModal(false)} className="flex-1">Batal</Button><Button onClick={handleEndLive} className="flex-1">Ya, Akhiri</Button></div>
            </div>
          </div>
        )}
      </div>
      <PermissionModal 
          isOpen={showPermissionModal}
          onClose={() => {
              setShowPermissionModal(false);
              navigate('/seller/live');
          }}
          onRetry={() => {
            if (isHost) {
              startBroadcast();
            }
          }}
          errorMessage={permissionError}
      />
    </>
  );
};

export default LiveDetailPage;