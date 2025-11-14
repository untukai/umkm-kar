
import { Product, Category, Article, Seller, Review } from '../types';

export const categories: Category[] = [
  { id: 'kuliner', name: 'Kuliner' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'kerajinan', name: 'Kerajinan' },
  { id: 'pertanian', name: 'Pertanian' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'jasa', name: 'Jasa' },
  { id: 'edukasi', name: 'Edukasi' },
];

export const sellers: Seller[] = [
  { id: 1, name: 'UMKM Serabi Maknyus', description: 'Pelopor serabi hijau dengan resep warisan keluarga. Selalu menggunakan bahan-bahan alami dan berkualitas tinggi.', rating: 4.8, phone: '081234567890', email: 'kontak@serabimaknyus.com' },
  { id: 2, name: 'Batik Jaya', description: 'Pengrajin batik tulis asli Karawang dengan motif yang terinspirasi dari kekayaan alam lokal. Setiap kain adalah karya seni.', rating: 4.9, email: 'info@batikjaya.id' },
  { id: 3, name: 'Kreasi Bambu', description: 'Mengubah bambu menjadi karya seni fungsional. Produk kami ramah lingkungan dan dibuat dengan tangan terampil.', rating: 4.7 },
  { id: 4, name: 'Tani Sejahtera', description: 'Kelompok tani yang berkomitmen pada pertanian organik dan berkelanjutan untuk menghasilkan produk pangan terbaik.', rating: 4.9, phone: '085678901234' },
  { id: 5, name: 'Inovasi Digital Tani', description: 'Startup teknologi yang berfokus pada modernisasi pertanian melalui solusi IoT yang mudah digunakan.', rating: 5.0, email: 'support@inovasitani.tech' },
  { id: 6, name: 'Lensa Kreatif', description: 'Menyediakan jasa profesional untuk membantu UMKM tampil lebih menarik di dunia digital.', rating: 4.8, phone: '089876543210' },
  { id: 7, name: 'Akademi Karawang', description: 'Pusat pelatihan untuk meningkatkan skill dan pengetahuan para pelaku UMKM di Karawang.', rating: 4.7 },
  { id: 8, name: 'Dodol Ibu Entin', description: 'Meneruskan tradisi dodol Karawang yang legit dan lezat sejak tahun 1980.', rating: 4.9, email: 'pesan@dodolibuentin.com' },
  { id: 9, name: 'Distro Karawang', description: 'Merek fashion lokal yang mengangkat kebanggaan dan identitas Karawang melalui desain yang modern.', rating: 4.6 },
  { id: 10, name: 'Seni Tanah Liat', description: 'Studio gerabah yang memadukan teknik tradisional dengan desain kontemporer.', rating: 4.8, phone: '081122334455' },
];

export const products: Product[] = [
  { id: 1, name: 'Serabi Hijau Khas Karawang', price: 15000, category: 'Kuliner', description: 'Serabi hijau otentik dengan saus kinca durian.', stock: 50, sellerId: 1, discount: 10, imageUrls: ['https://images.unsplash.com/photo-1563889958723-5a507119999a?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1598103366923-387b92f44146?w=600&h=600&fit=crop'] },
  { id: 2, name: 'Batik Karawang Motif Padi', price: 250000, category: 'Fashion', description: 'Kain batik tulis dengan motif padi khas lumbung padi Jawa Barat.', stock: 20, sellerId: 2, imageUrls: ['https://images.unsplash.com/photo-1622542910436-15772a153257?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583311833017-11202e2e935b?w=600&h=600&fit=crop'] },
  { id: 3, name: 'Anyaman Bambu Hias', price: 75000, category: 'Kerajinan', description: 'Hiasan dinding dari anyaman bambu asli Karawang.', stock: 30, sellerId: 3, discount: 25, imageUrls: ['https://images.unsplash.com/photo-1618221628462-b75b0a373523?w=600&h=600&fit=crop'] },
  { id: 4, name: 'Beras Pandan Wangi Organik', price: 80000, category: 'Pertanian', description: 'Beras organik 5kg, pulen dan wangi alami.', stock: 100, sellerId: 4, imageUrls: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a7?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1586201375823-3cec45511c34?w=600&h=600&fit=crop'] },
  { id: 5, name: 'IoT Sawah Pintar Kit', price: 1500000, category: 'Teknologi', description: 'Kit sensor untuk memantau kondisi sawah secara real-time.', stock: 10, sellerId: 5, imageUrls: ['https://images.unsplash.com/photo-1586798273330-3363d6505a49?w=600&h=600&fit=crop'] },
  { id: 6, name: 'Jasa Foto Produk UMKM', price: 500000, category: 'Jasa', description: 'Paket jasa foto produk profesional untuk 20 item.', stock: 99, sellerId: 6, imageUrls: ['https://images.unsplash.com/photo-1599423524326-559d33230d7b?w=600&h=600&fit=crop'] },
  { id: 7, name: 'Pelatihan UMKM Go Digital', price: 300000, category: 'Edukasi', description: 'Workshop 2 hari tentang pemasaran digital untuk UMKM.', stock: 99, sellerId: 7, imageUrls: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop'] },
  { id: 8, name: 'Dodol Karawang Premium', price: 45000, category: 'Kuliner', description: 'Dodol legit dengan bahan pilihan dan resep turun-temurun.', stock: 80, sellerId: 8, discount: 15, imageUrls: ['https://images.unsplash.com/photo-1629233231398-922055652538?w=600&h=600&fit=crop'] },
  { id: 9, name: 'Kaos Lokal "Karawang Pride"', price: 120000, category: 'Fashion', description: 'Kaos katun combed 30s dengan sablon desain lokal.', stock: 60, sellerId: 9, imageUrls: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'] },
  { id: 10, name: 'Gerabah Artistik', price: 150000, category: 'Kerajinan', description: 'Vas gerabah dengan ukiran tangan yang unik.', stock: 25, sellerId: 10, imageUrls: ['https://images.unsplash.com/photo-1554228498-84752c288924?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1565015926312-a161a455a303?w=600&h=600&fit=crop'] },
  { id: 11, name: 'Pupuk Cair Organik Super', price: 50000, category: 'Pertanian', description: 'Pupuk cair organik 1 liter untuk kesuburan tanaman.', stock: 200, sellerId: 4, discount: 5, imageUrls: ['https://images.unsplash.com/photo-1615755718244-99385b73d7be?w=600&h=600&fit=crop'] },
  { id: 12, name: 'Jasa Desain Logo UMKM', price: 400000, category: 'Jasa', description: 'Jasa desain logo profesional termasuk 3 revisi.', stock: 99, sellerId: 6, imageUrls: ['https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=600&fit=crop'] }
];

export const articles: Article[] = [
  { id: 1, title: 'Inovasi UMKM Karawang di Era Digital', summary: 'Melihat bagaimana para pelaku UMKM lokal beradaptasi dengan teknologi...', content: 'Konten lengkap artikel Inovasi UMKM Karawang.' },
  { id: 2, title: 'Mengenal Batik Khas Karawang', summary: 'Setiap goresan canting pada batik Karawang memiliki makna tersendiri...', content: 'Konten lengkap artikel Batik Khas Karawang.' },
  { id: 3, title: 'Potensi Pertanian Organik di Karawang', summary: 'Karawang, lumbung padi nasional, kini mulai merambah pertanian organik...', content: 'Konten lengkap artikel Potensi Pertanian Organik.' }
];

export const reviews: Review[] = [
  { id: 1, productId: 1, userName: 'Budi Santoso', userEmail: 'budi@example.com', rating: 5, comment: 'Serabinya juara! Saus kinca duriannya bikin nagih. Wajib coba!', date: '2024-05-20T10:00:00Z' },
  { id: 2, productId: 1, userName: 'Citra Lestari', userEmail: 'citra@example.com', rating: 4, comment: 'Enak banget, tapi antrenya lumayan. Mungkin bisa diperbaiki sistem pemesanannya.', date: '2024-05-19T14:30:00Z' },
  { id: 3, productId: 2, userName: 'Agus Wijaya', userEmail: 'agus@example.com', rating: 5, comment: 'Kain batiknya halus, motifnya juga unik dan khas Karawang. Bangga pakai produk lokal!', date: '2024-05-18T09:15:00Z' },
  { id: 4, productId: 4, userName: 'Dewi Anggraini', userEmail: 'dewi@example.com', rating: 5, comment: 'Berasnya pulen dan wangi. Sehat karena organik. Keluarga jadi suka makan di rumah.', date: '2024-05-21T11:00:00Z' },
  { id: 5, productId: 4, userName: 'Eko Prasetyo', userEmail: 'eko@example.com', rating: 5, comment: 'Pengiriman cepat, kualitas berasnya konsisten. Sudah langganan di sini.', date: '2024-05-15T18:00:00Z' },
  { id: 6, productId: 1, userName: 'Fitriani', userEmail: 'fitri@example.com', rating: 5, comment: 'The best serabi in town!', date: '2024-05-22T08:45:00Z' },
];
