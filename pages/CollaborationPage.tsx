import React from 'react';

const helixData = [
  { name: 'Akademisi', role: 'Penelitian, inovasi, dan pelatihan untuk meningkatkan kapasitas UMKM.', partners: ['Universitas Karawang', 'Pusat Riset Teknologi Tepat Guna'] },
  { name: 'Pemerintah', role: 'Dukungan regulasi, perizinan, dan program pendampingan untuk menciptakan ekosistem yang kondusif.', partners: ['Dinas Koperasi & UMKM Karawang', 'Pemkab Karawang'] },
  { name: 'Bisnis', role: 'Pendanaan, investasi, kemitraan strategis, dan akses pasar yang lebih luas.', partners: ['Kamar Dagang dan Industri (KADIN)', 'Asosiasi Pengusaha Indonesia (APINDO)'] },
  { name: 'Komunitas', role: 'Promosi produk lokal, advokasi, dan membangun jaringan antar pelaku UMKM.', partners: ['Komunitas UMKM Karawang', 'Karawang Creative Hub'] },
  { name: 'Media', role: 'Publikasi digital, kampanye, dan penyebaran informasi untuk meningkatkan visibilitas produk UMKM.', partners: ['Media Lokal Karawang', 'Influencer Lokal'] },
];

const CollaborationPage: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Kolaborasi Quintuple Helix</h1>
      <p className="text-center text-neutral-600 mb-10 max-w-3xl mx-auto">
        KODIK dibangun atas dasar sinergi lima pilar utama untuk memajukan ekosistem UMKM di Karawang.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helixData.map(item => (
          <div key={item.name} className="border border-primary/20 p-6 rounded-lg bg-primary/10">
            <h2 className="text-2xl font-bold text-primary-dark">{item.name}</h2>
            <p className="text-neutral-700 mt-2">{item.role}</p>
            <div className="mt-4">
              <h3 className="font-semibold text-neutral-800">Contoh Mitra:</h3>
              <ul className="list-disc list-inside text-sm text-neutral-600">
                {item.partners.map(partner => <li key={partner}>{partner}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationPage;