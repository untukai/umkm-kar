import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary">KODIK</h3>
            <p className="text-neutral-600 mt-2 max-w-sm">Wadah digital untuk produk UMKM lokal Karawang. Memajukan ekonomi lokal melalui teknologi dan kolaborasi.</p>
          </div>
          <div className="col-span-1">
            <h4 className="font-semibold text-neutral-800">Jelajahi</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/products" className="text-neutral-600 hover:text-primary">Produk</Link></li>
              <li><Link to="/articles" className="text-neutral-600 hover:text-primary">Artikel</Link></li>
              <li><Link to="/collaboration" className="text-neutral-600 hover:text-primary">Kolaborasi</Link></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Tentang Kami</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-semibold text-neutral-800">Bantuan</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-neutral-600 hover:text-primary">Hubungi Kami</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} KODIK (Karawang Online Digital Inovasi Karya). All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;