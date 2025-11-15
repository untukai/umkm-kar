


import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  ClipboardListIcon,
  BoxIcon,
  CurrencyDollarIcon,
  UserIcon,
  VideoCameraIcon,
  ChatBubbleIcon, // Changed from UserIcon for Chat
} from '../Icons';

const navLinks = [
  { name: 'Dashboard', path: '/seller', icon: ChartBarIcon, end: true },
  { name: 'Pesanan', path: 'orders', icon: ClipboardListIcon },
  { name: 'Produk', path: 'products', icon: BoxIcon },
  { name: 'Live Jualan', path: 'live', icon: VideoCameraIcon },
  { name: 'Chat', path: 'chat', icon: ChatBubbleIcon },
];

const futureLinks = [
    { name: 'Keuangan', icon: CurrencyDollarIcon },
    { name: 'Promo & Marketing', icon: UserIcon },
    { name: 'Rating & Ulasan', icon: UserIcon },
    { name: 'Analitik Toko', icon: UserIcon },
    { name: 'Pengaturan Toko', icon: UserIcon },
];

const SellerSidebar: React.FC = () => {
  const activeLinkClass = 'bg-primary text-white';
  const defaultLinkClass = 'text-neutral-700 hover:bg-neutral-100';

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white p-4 rounded-lg shadow-lg sticky top-24">
        <h2 className="text-lg font-bold mb-4 px-2">Menu Penjual</h2>
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive ? activeLinkClass : defaultLinkClass
                }`
              }
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          ))}
          <div className="pt-2 mt-2 border-t">
            {futureLinks.map((link) => (
                <div key={link.name} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-neutral-400 cursor-not-allowed">
                    <link.icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 flex justify-between items-center">
                        <span>{link.name}</span>
                        <span className="text-xs bg-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded">Segera</span>
                    </div>
                </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default SellerSidebar;