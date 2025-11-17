
import React from 'react';
import { Link } from 'react-router-dom';
import { liveSessions, sellers } from '../data/dummyData';
import { LiveSession } from '../types';
import { StoreIcon } from '../components/Icons';

const LiveSessionCard: React.FC<{ session: LiveSession }> = ({ session }) => {
  const seller = sellers.find(s => s.id === session.sellerId);

  return (
    <Link to={`/live/${session.id}`} className="block bg-white rounded-lg overflow-hidden transition-all duration-300 border border-neutral-200 hover:shadow-xl hover:-translate-y-1 group">
      <div className="w-full aspect-[9/12] bg-neutral-300 relative">
        <img src={session.thumbnailUrl} alt={session.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {session.status === 'live' && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md animate-pulse">
            LIVE
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">{session.title}</h3>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <StoreIcon className="w-4 h-4 text-primary" />
          </div>
          <p className="font-medium text-neutral-700 truncate">{seller?.name || 'Penjual'}</p>
        </div>
      </div>
    </Link>
  );
};


const LivePage: React.FC = () => {
  const ongoingSessions = liveSessions.filter(s => s.status === 'live');
  const replaySessions = liveSessions.filter(s => s.status === 'replay');

  return (
    <div className="space-y-12">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold">KODIK Live Shopping</h1>
        <p className="text-neutral-600 mt-2 max-w-2xl mx-auto">
          Temukan produk favoritmu dan berinteraksi langsung dengan penjual.
        </p>
      </div>

      {ongoingSessions.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Sedang Berlangsung</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {ongoingSessions.map(session => (
              <LiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}

      {replaySessions.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Siaran Ulang</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {replaySessions.map(session => (
              <LiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default LivePage;