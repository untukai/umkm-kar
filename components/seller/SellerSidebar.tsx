

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  ClipboardListIcon,
  BoxIcon,
  VideoCameraIcon,
  ChatBubbleIcon,
  CurrencyDollarIcon,
  TagIcon,
  StarIcon,
  ChartPieIcon,
  CogIcon,
} from '../Icons';

const navLinks = [
  { name: 'Dashboard', path: '/seller', icon: ChartBarIcon, end: true },
  { name: 'Pesanan', path: 'orders', icon: ClipboardListIcon },
  { name: 'Produk', path: 'products', icon: BoxIcon },
  { name: 'Live Jualan', path: 'live', icon: VideoCameraIcon },
  { name: 'Chat', path: 'chat', icon: ChatBubbleIcon },
];

const mainToolsLinks = [
    { name: 'Keuangan', path: 'finance', icon: CurrencyDollarIcon },
    { name: 'Promo & Marketing', path: 'promo', icon: TagIcon },
    { name: 'Rating & Ulasan', path: 'reviews', icon: StarIcon },
];

const improvementLinks = [
    { name: 'Analitik Toko', path: 'analytics', icon: ChartPieIcon },
    { name: 'Pengaturan Toko', path: 'settings', icon: CogIcon },
];

const SellerSidebar: React.FC = () => {
  const activeLinkClass = 'bg-primary text-white';
  const defaultLinkClass = 'text-neutral-700 hover:bg-neutral-100';

  const renderLinks = (links: typeof navLinks) => (
    links.map((link) => (
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
    ))
  );

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white p-4 rounded-lg shadow-lg sticky top-24">
        <h2 className="text-lg font-bold mb-4 px-2">Menu Penjual</h2>
        <nav className="space-y-1">
          {renderLinks(navLinks)}
          
          <div className="pt-2 mt-2 border-t">
            <h3 className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Manajemen Toko</h3>
            {renderLinks(mainToolsLinks)}
          </div>
          
          <div className="pt-2 mt-2 border-t">
            <h3 className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Peningkatan</h3>
            {renderLinks(improvementLinks)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default SellerSidebar;
