
import { Product, Category, Article } from '../types';

export const categories: Category[] = [
  { id: 'kuliner', name: 'Kuliner' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'kerajinan', name: 'Kerajinan' },
  { id: 'pertanian', name: 'Pertanian' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'jasa', name: 'Jasa' },
  { id: 'edukasi', name: 'Edukasi' },
];

export const products: Product[] = [
  { id: 1, name: 'Serabi Hijau Khas Karawang', price: 15000, category: 'Kuliner', description: 'Serabi hijau otentik dengan saus kinca durian.', stock: 50, seller: 'UMKM Serabi Maknyus' },
  { id: 2, name: 'Batik Karawang Motif Padi', price: 250000, category: 'Fashion', description: 'Kain batik tulis dengan motif padi khas lumbung padi Jawa Barat.', stock: 20, seller: 'Batik Jaya' },
  { id: 3, name: 'Anyaman Bambu Hias', price: 75000, category: 'Kerajinan', description: 'Hiasan dinding dari anyaman bambu asli Karawang.', stock: 30, seller: 'Kreasi Bambu' },
  { id: 4, name: 'Beras Pandan Wangi Organik', price: 80000, category: 'Pertanian', description: 'Beras organik 5kg, pulen dan wangi alami.', stock: 100, seller: 'Tani Sejahtera' },
  { id: 5, name: 'IoT Sawah Pintar Kit', price: 1500000, category: 'Teknologi', description: 'Kit sensor untuk memantau kondisi sawah secara real-time.', stock: 10, seller: 'Inovasi Digital Tani' },
  { id: 6, name: 'Jasa Foto Produk UMKM', price: 500000, category: 'Jasa', description: 'Paket jasa foto produk profesional untuk 20 item.', stock: 99, seller: 'Lensa Kreatif' },
  { id: 7, name: 'Pelatihan UMKM Go Digital', price: 300000, category: 'Edukasi', description: 'Workshop 2 hari tentang pemasaran digital untuk UMKM.', stock: 99, seller: 'Akademi Karawang' },
  { id: 8, name: 'Dodol Karawang Premium', price: 45000, category: 'Kuliner', description: 'Dodol legit dengan bahan pilihan dan resep turun-temurun.', stock: 80, seller: 'Dodol Ibu Entin' },
  { id: 9, name: 'Kaos Lokal "Karawang Pride"', price: 120000, category: 'Fashion', description: 'Kaos katun combed 30s dengan sablon desain lokal.', stock: 60, seller: 'Distro Karawang' },
  { id: 10, name: 'Gerabah Artistik', price: 150000, category: 'Kerajinan', description: 'Vas gerabah dengan ukiran tangan yang unik.', stock: 25, seller: 'Seni Tanah Liat' },
  { id: 11, name: 'Pupuk Cair Organik Super', price: 50000, category: 'Pertanian', description: 'Pupuk cair organik 1 liter untuk kesuburan tanaman.', stock: 200, seller: 'Tani Sejahtera' },
  { id: 12, name: 'Jasa Desain Logo UMKM', price: 400000, category: 'Jasa', description: 'Jasa desain logo profesional termasuk 3 revisi.', stock: 99, seller: 'Lensa Kreatif' }
];

export const articles: Article[] = [
  { id: 1, title: 'Inovasi UMKM Karawang di Era Digital', summary: 'Melihat bagaimana para pelaku UMKM lokal beradaptasi dengan teknologi...', content: 'Konten lengkap artikel Inovasi UMKM Karawang.' },
  { id: 2, title: 'Mengenal Batik Khas Karawang', summary: 'Setiap goresan canting pada batik Karawang memiliki makna tersendiri...', content: 'Konten lengkap artikel Batik Khas Karawang.' },
  { id: 3, title: 'Potensi Pertanian Organik di Karawang', summary: 'Karawang, lumbung padi nasional, kini mulai merambah pertanian organik...', content: 'Konten lengkap artikel Potensi Pertanian Organik.' }
];
