

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppData } from '../hooks/useAppData';
import Button from '../components/Button';
import { VideoCameraIcon } from '../components/Icons';
import { LiveSession } from '../types';

const LiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { liveSessions, isLoading: isAppLoading } = useAppData();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<LiveSession | undefined>(undefined);
  const [countdown, setCountdown] = useState(3);
  const [status, setStatus] = useState('loading'); // loading, redirecting, error

  useEffect(() => {
    if (!isAppLoading && id) {
        setSession(liveSessions.find(s => s._id === id))
    }
  }, [id, liveSessions, isAppLoading]);

  useEffect(() => {
    if (isAuthLoading || isAppLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=/live/${id}`);
      return;
    }

    if (session) {
      setStatus('redirecting');
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = session.google_meet_link;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (!isAppLoading) {
      setStatus('error');
    }

  }, [id, session, isAuthenticated, isAuthLoading, isAppLoading, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'redirecting':
        return (
          <>
            <VideoCameraIcon className="w-16 h-16 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold mt-4">Mengarahkan Anda ke Sesi Live...</h1>
            <p className="mt-2 text-neutral-600">Anda akan bergabung ke Google Meet dalam <span className="font-bold text-xl">{countdown}</span> detik.</p>
            <a href={session?.google_meet_link} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="mt-6">
                Klik di sini jika tidak diarahkan
              </Button>
            </a>
          </>
        );
      case 'error':
        return (
          <>
            <h1 className="text-2xl font-bold text-red-600">Sesi Live Tidak Ditemukan</h1>
            <p className="mt-2 text-neutral-600">Sesi ini mungkin sudah berakhir atau tidak ada.</p>
            <Button onClick={() => navigate('/live')} className="mt-6">
              Kembali ke Halaman Live
            </Button>
          </>
        );
      default: // loading
        return (
           <>
            <h1 className="text-2xl font-bold animate-pulse">Memverifikasi Sesi...</h1>
            <p className="mt-2 text-neutral-600">Harap tunggu sebentar.</p>
          </>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-100 text-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default LiveDetailPage;