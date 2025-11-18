import { Product, Category, Article, Seller, Review, Order, Post, LiveSession, VirtualGift, Conversation, ChatMessage, FinancialTransaction, Promotion, Comment, Influencer } from '../types';

export const categories: Category[] = [
  { id: 'kuliner', name: 'Kuliner' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'kerajinan', name: 'Kerajinan' },
  { id: 'pertanian', name: 'Pertanian' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'jasa', name: 'Jasa' },
  { id: 'edukasi', name: 'Edukasi' },
];

export let sellers: Seller[] = [
  { id: 1, name: 'UMKM Serabi Maknyus', description: 'Pelopor serabi hijau dengan resep warisan keluarga. Selalu menggunakan bahan-bahan alami dan berkualitas tinggi.', rating: 4.8, phone: '081234567890', email: 'penjual@example.com', imageUrl: 'https://images.unsplash.com/photo-1598103366923-3cec45511c34?w=200&h=200&fit=crop' },
  { id: 2, name: 'Batik Jaya', description: 'Pengrajin batik tulis asli Karawang dengan motif yang terinspirasi dari kekayaan alam lokal. Setiap kain adalah karya seni.', rating: 4.9, email: 'info@batikjaya.id', imageUrl: 'https://images.unsplash.com/photo-1551954228-636442b51253?w=200&h=200&fit=crop' },
  { id: 3, name: 'Kreasi Bambu', description: 'Mengubah bambu menjadi karya seni fungsional. Produk kami ramah lingkungan dan dibuat dengan tangan terampil.', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=200&h=200&fit=crop' },
  { id: 4, name: 'Tani Sejahtera', description: 'Kelompok tani yang berkomitmen pada pertanian organik dan berkelanjutan untuk menghasilkan produk pangan terbaik.', rating: 4.9, phone: '085678901234', imageUrl: 'https://images.unsplash.com/photo-1492496913945-4b95394244d8?w=200&h=200&fit=crop' },
  { id: 5, name: 'Inovasi Digital Tani', description: 'Startup teknologi yang berfokus pada modernisasi pertanian melalui solusi IoT yang mudah digunakan.', rating: 5.0, email: 'support@inovasitani.tech', imageUrl: 'https://images.unsplash.com/photo-1579567761406-461487c3c188?w=200&h=200&fit=crop' },
  { id: 6, name: 'Lensa Kreatif', description: 'Menyediakan jasa profesional untuk membantu UMKM tampil lebih menarik di dunia digital.', rating: 4.8, phone: '089876543210', imageUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=200&h=200&fit=crop' },
  { id: 7, name: 'Akademi Karawang', description: 'Pusat pelatihan untuk meningkatkan skill dan pengetahuan para pelaku UMKM di Karawang.', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200&h=200&fit=crop' },
  { id: 8, name: 'Dodol Ibu Entin', description: 'Meneruskan tradisi dodol Karawang yang legit dan lezat sejak tahun 1980.', rating: 4.9, email: 'pesan@dodolibuentin.com', imageUrl: 'https://images.unsplash.com/photo-1567197991922-35805f42040d?w=200&h=200&fit=crop' },
  { id: 9, name: 'Distro Karawang', description: 'Merek fashion lokal yang mengangkat kebanggaan dan identitas Karawang melalui desain yang modern.', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop' },
  { id: 10, name: 'Seni Tanah Liat', description: 'Studio gerabah yang memadukan teknik tradisional dengan desain kontemporer.', rating: 4.8, phone: '081122334455', imageUrl: 'https://images.unsplash.com/photo-1565015926312-a161a455a303?w=200&h=200&fit=crop' },
];

export const updateSellerDetails = (sellerId: number, newDetails: Partial<Seller>): boolean => {
  const sellerIndex = sellers.findIndex(s => s.id === sellerId);
  if (sellerIndex !== -1) {
    sellers[sellerIndex] = { ...sellers[sellerIndex], ...newDetails };
    return true;
  }
  return false;
};

export let products: Product[] = [
  { id: 1, name: 'Serabi Hijau Khas Karawang', price: 15000, category: 'Kuliner', description: 'Serabi hijau otentik dengan saus kinca durian.', stock: 50, sellerId: 1, discount: 10, imageUrls: ['https://images.unsplash.com/photo-1631214081273-55a693b38153?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Fisik' },
  { id: 2, name: 'Batik Karawang Motif Padi', price: 250000, category: 'Fashion', description: 'Kain batik tulis dengan motif padi khas lumbung padi Jawa Barat.', stock: 20, sellerId: 2, imageUrls: ['https://images.unsplash.com/photo-1551954228-636442b51253?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Fisik' },
  { id: 3, name: 'Anyaman Bambu Hias', price: 75000, category: 'Kerajinan', description: 'Hiasan dinding dari anyaman bambu asli Karawang.', stock: 0, sellerId: 3, discount: 25, imageUrls: ['https://images.unsplash.com/photo-1618218701019-a1b40c749b73?w=600&h=600&fit=crop'], status: 'habis stok', type: 'Produk Fisik' },
  { id: 4, name: 'Beras Pandan Wangi Organik', price: 80000, category: 'Pertanian', description: 'Beras organik 5kg, pulen dan wangi alami.', stock: 100, sellerId: 4, imageUrls: ['https://images.unsplash.com/photo-1586201375765-c12251368925?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Fisik' },
  { id: 5, name: 'IoT Sawah Pintar Kit', price: 1500000, category: 'Teknologi', description: 'Kit sensor untuk memantau kondisi sawah secara real-time.', stock: 10, sellerId: 5, imageUrls: ['https://images.unsplash.com/photo-1579567761406-461487c3c188?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Digital' },
  { id: 6, name: 'Jasa Foto Produk UMKM', price: 500000, category: 'Jasa', description: 'Paket jasa foto produk profesional untuk 20 item.', stock: 99, sellerId: 6, imageUrls: ['https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=600&h=600&fit=crop'], status: 'aktif', type: 'Jasa' },
  { id: 7, name: 'Pelatihan UMKM Go Digital', price: 300000, category: 'Edukasi', description: 'Workshop 2 hari tentang pemasaran digital untuk UMKM.', stock: 99, sellerId: 7, imageUrls: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop'], status: 'nonaktif', type: 'Jasa' },
  { id: 8, name: 'Dodol Karawang Premium', price: 45000, category: 'Kuliner', description: 'Dodol legit dengan bahan pilihan dan resep turun-temurun.', stock: 80, sellerId: 1, discount: 15, imageUrls: ['https://images.unsplash.com/photo-1622337742254-0a3a79779264?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Fisik' },
  { id: 9, name: 'Kaos Lokal "Karawang Pride"', price: 120000, category: 'Fashion', description: 'Kaos katun combed 30s dengan sablon desain lokal.', stock: 6, sellerId: 9, imageUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Fisik' },
  { id: 10, name: 'Gerabah Artistik', price: 150000, category: 'Kerajinan', description: 'Vas gerabah dengan ukiran tangan yang unik.', stock: 25, sellerId: 10, imageUrls: ['https://images.unsplash.com/photo-1610732840420-d99672e811f0?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Fisik' },
  { id: 11, name: 'Pupuk Cair Organik Super', price: 50000, category: 'Pertanian', description: 'Pupuk cair organik 1 liter untuk kesuburan tanaman.', stock: 200, sellerId: 4, discount: 5, imageUrls: ['https://images.unsplash.com/photo-1593751282939-f2596481a1a6?w=600&h=600&fit=crop'], status: 'aktif', type: 'Produk Fisik' },
  { id: 12, name: 'Jasa Desain Logo UMKM', price: 400000, category: 'Jasa', description: 'Jasa desain logo profesional termasuk 3 revisi.', stock: 0, sellerId: 6, imageUrls: ['https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=600&fit=crop'], status: 'habis stok', type: 'Jasa' }
];

export const addProduct = (product: Omit<Product, 'id' | 'status'>) => {
  const newId = Math.max(...products.map(p => p.id)) + 1;
  const newProduct: Product = { id: newId, ...product, status: 'aktif' };
  products.unshift(newProduct); // Add to the beginning of the array
};

export const articles: Article[] = [
  { 
    id: 1, 
    title: 'Inovasi UMKM Karawang di Era Digital: Kunci Sukses Bertahan dan Berkembang', 
    summary: 'Di tengah gempuran persaingan global, UMKM Karawang menunjukkan taringnya dengan adopsi teknologi digital yang kreatif dan efektif.', 
    author: 'Tim KODIK News',
    publishDate: '2024-07-25T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop',
    content: `Karawang, yang dikenal sebagai lumbung padi nasional dan kota industri, kini menyaksikan gelombang baru transformasi ekonomi di tingkat akar rumput. Para pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) tidak lagi hanya mengandalkan etalase fisik. Mereka kini merambah dunia digital untuk menjangkau pasar yang lebih luas dan meningkatkan efisiensi operasional.\n\nSalah satu contohnya adalah Ibu Entin, pemilik 'Dodol Ibu Entin' yang legendaris. Jika dulu pemasarannya hanya dari mulut ke mulut dan terbatas di sekitar toko, kini produknya bisa dipesan oleh pelanggan di seluruh Indonesia melalui platform KODIK. "Awalnya saya gaptek, tapi setelah dibantu anak saya dan tim KODIK, ternyata jualan online itu membuka pintu rezeki yang tidak terduga. Omzet saya naik hampir 80%," ujarnya sambil tersenyum.\n\nKisah sukses tidak hanya datang dari sektor kuliner. 'Batik Jaya', pengrajin batik tulis khas Karawang, juga merasakan dampak positif digitalisasi. Melalui sesi live shopping di KODIK, mereka dapat menceritakan filosofi di balik setiap motif batik, menciptakan koneksi emosional dengan pembeli. "Live shopping itu seperti membuka workshop kami untuk semua orang. Pembeli jadi lebih menghargai proses dan nilai dari sehelai kain batik," tutur Bapak Agus, sang pemilik.\n\nTransformasi ini bukan tanpa tantangan. Keterbatasan literasi digital, modal untuk perangkat, dan persaingan di pasar online yang ketat menjadi beberapa kendala utama. Namun, dengan semangat kolaborasi antara pemerintah daerah, komunitas, dan platform seperti KODIK, para pelaku UMKM Karawang perlahan tapi pasti berhasil mengatasi rintangan tersebut, membuktikan bahwa inovasi adalah kunci untuk tidak hanya bertahan, tetapi juga berkembang di era digital.` 
  },
  { 
    id: 2, 
    title: 'Mengenal Batik Khas Karawang: Goresan Canting Penuh Makna dan Sejarah', 
    summary: 'Lebih dari sekadar kain, setiap motif batik Karawang menyimpan cerita tentang kekayaan alam, budaya, dan kearifan lokal.', 
    author: 'Budaya Karawang',
    publishDate: '2024-07-22T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1583311833017-11202e2e935b?w=600&h=400&fit=crop',
    content: `Ketika berbicara tentang batik, banyak yang langsung teringat pada kota-kota seperti Pekalongan, Solo, atau Yogyakarta. Namun, Karawang juga memiliki warisan budaya batik yang tak kalah kaya dan unik. Batik Karawang, atau yang sering disebut Batik Tarawang, memiliki ciri khas pada motif-motifnya yang terinspirasi dari lingkungan agraris dan maritim.\n\nSalah satu motif yang paling ikonik adalah motif 'padi'. Sebagai lumbung padi nasional, motif ini merepresentasikan kemakmuran, kesuburan, dan rasa syukur masyarakat Karawang. Goresan bulir-bulir padi yang merunduk menjadi pengingat akan filosofi hidup untuk tetap rendah hati meskipun memiliki banyak kelebihan.\n\nSelain motif padi, ada pula motif 'Citarum' yang menggambarkan aliran sungai terbesar di Jawa Barat yang melintasi Karawang. Motif ini melambangkan kehidupan yang terus mengalir, dinamis, dan memberikan manfaat bagi sekitarnya. Palet warna batik Karawang juga cenderung lebih berani, seringkali menggunakan warna-warna cerah seperti hijau, kuning, dan merah, yang mencerminkan semangat masyarakatnya yang ekspresif.\n\nProses pembuatannya pun masih banyak yang mempertahankan teknik batik tulis tradisional. Para pengrajin dengan telaten menggoreskan canting berisi malam panas di atas kain, sebuah proses yang membutuhkan kesabaran, ketelitian, dan jiwa seni yang tinggi. Dengan membeli sehelai batik Karawang, kita tidak hanya mendapatkan produk fashion, tetapi juga turut serta melestarikan sebuah mahakarya budaya yang sarat akan nilai dan sejarah.` 
  },
  { 
    id: 3, 
    title: 'Potensi Pertanian Organik di Karawang: Peluang Emas Menuju Pasar Modern', 
    summary: 'Beralih dari pertanian konvensional, para petani muda di Karawang mulai melirik pertanian organik sebagai solusi untuk keberlanjutan dan peningkatan nilai jual produk.', 
    author: 'Agro Inspirasi',
    publishDate: '2024-07-20T09:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=400&fit=crop',
    content: `Sebagai salah satu sentra produksi beras terbesar di Indonesia, Karawang memiliki potensi luar biasa dalam pengembangan sektor pertanian. Kini, sebuah tren positif mulai berkembang di kalangan petani, khususnya generasi muda: peralihan ke sistem pertanian organik.\n\nPertanian organik menawarkan berbagai keuntungan jangka panjang, baik bagi lingkungan maupun bagi petani itu sendiri. Dengan tidak menggunakan pestisida dan pupuk kimia, kesuburan tanah dapat terjaga secara alami, menghasilkan ekosistem yang lebih seimbang. Dari sisi ekonomi, produk organik memiliki nilai jual yang lebih tinggi di pasaran karena permintaan dari konsumen sadar kesehatan yang terus meningkat.\n\n'Tani Sejahtera', salah satu kelompok tani di Karawang yang menjadi pelopor pertanian organik, telah membuktikannya. "Awalnya banyak yang ragu, karena masa transisi ke organik itu butuh waktu dan hasil panen sempat sedikit menurun. Tapi setelah tanahnya pulih, hasilnya luar biasa. Beras kami lebih pulen, lebih wangi, dan harganya bisa dua kali lipat dari beras biasa," ungkap Kang Asep, ketua kelompok tani.\n\nPlatform digital seperti KODIK memainkan peran penting dalam menghubungkan petani organik dengan konsumen akhir. Melalui KODIK, 'Tani Sejahtera' dapat menjual produk mereka langsung ke konsumen di perkotaan, memotong rantai pasok yang panjang dan memastikan petani mendapatkan harga yang lebih adil. Ini adalah langkah strategis untuk menjadikan Karawang tidak hanya sebagai lumbung padi nasional, tetapi juga sebagai pusat pertanian organik modern yang berkelanjutan.` 
  }
];

export const reviews: Review[] = [
// FIX: Added missing userId property to match the Review type.
  { id: 1, productId: 1, userId: 101, userName: 'Budi Santoso', userEmail: 'budi@example.com', rating: 5, comment: 'Serabinya juara! Saus kinca duriannya bikin nagih. Wajib coba!', date: '2024-05-20T10:00:00Z' },
  { id: 2, productId: 1, userId: 102, userName: 'Citra Lestari', userEmail: 'citra@example.com', rating: 4, comment: 'Enak banget, tapi antrenya lumayan. Mungkin bisa diperbaiki sistem pemesanannya.', date: '2024-05-19T14:30:00Z' },
  { id: 3, productId: 2, userId: 103, userName: 'Agus Wijaya', userEmail: 'agus@example.com', rating: 5, comment: 'Kain batiknya halus, motifnya juga unik dan khas Karawang. Bangga pakai produk lokal!', date: '2024-05-18T09:15:00Z' },
  { id: 4, productId: 4, userId: 104, userName: 'Dewi Anggraini', userEmail: 'dewi@example.com', rating: 5, comment: 'Berasnya pulen dan wangi. Sehat karena organik. Keluarga jadi suka makan di rumah.', date: '2024-05-21T11:00:00Z' },
  { id: 5, productId: 4, userId: 105, userName: 'Eko Prasetyo', userEmail: 'eko@example.com', rating: 5, comment: 'Pengiriman cepat, kualitas berasnya konsisten. Sudah langganan di sini.', date: '2024-05-15T18:00:00Z' },
  { id: 6, productId: 1, userId: 106, userName: 'Fitriani', userEmail: 'fitri@example.com', rating: 5, comment: 'The best serabi in town!', date: '2024-07-28T08:45:00Z' },
];

export let orders: Order[] = [
  {
    id: 'KODIK-7892A',
    customerName: 'Budi Santoso',
    items: [
      { product: products.find(p => p.id === 1)!, quantity: 2 },
      { product: products.find(p => p.id === 8)!, quantity: 1 }
    ],
    total: (15000 * 0.9 * 2) + (45000 * 0.85 * 1),
    date: '2024-07-28T10:30:00Z',
    status: 'dikemas',
    shippingAddress: { name: 'Budi Santoso', address: 'Jl. Pangkal Perjuangan No. 1, Karawang Barat', phone: '081234567890' },
  },
    {
    id: 'KODIK-7891B',
    customerName: 'Citra Lestari',
    items: [
      { product: products.find(p => p.id === 9)!, quantity: 1 }
    ],
    total: 120000,
    date: '2024-07-28T09:15:00Z',
    status: 'menunggu pembayaran',
    shippingAddress: { name: 'Citra Lestari', address: 'Perumahan Gading Elok, Karawang Timur', phone: '081234567891' },
  },
  {
    id: 'KODIK-7890C',
    customerName: 'Agus Wijaya',
    items: [
      { product: products.find(p => p.id === 2)!, quantity: 1 }
    ],
    total: 250000,
    date: '2024-07-27T14:00:00Z',
    status: 'dikirim',
    shippingAddress: { name: 'Agus Wijaya', address: 'Jl. Tuparev No. 101, Karawang Tengah', phone: '081234567892' },
  },
    {
    id: 'KODIK-7889D',
    customerName: 'Dewi Anggraini',
    items: [
      { product: products.find(p => p.id === 4)!, quantity: 1 },
      { product: products.find(p => p.id === 11)!, quantity: 3 }
    ],
    total: 80000 + (50000 * 0.95 * 3),
    date: '2024-07-26T18:45:00Z',
    status: 'selesai',
    shippingAddress: { name: 'Dewi Anggraini', address: 'Cluster Kertabumi Indah, Karawang Kota', phone: '081234567893' },
  },
   {
    id: 'KODIK-7888E',
    customerName: 'Eko Prasetyo',
    items: [
      { product: products.find(p => p.id === 10)!, quantity: 2 }
    ],
    total: 150000 * 2,
    date: '2024-07-25T11:20:00Z',
    status: 'selesai',
    shippingAddress: { name: 'Eko Prasetyo', address: 'Jl. Raya Kosambi No. 55, Klari', phone: '081234567894' },
  }
];

export const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    return true;
  }
  return false;
};

export let posts: Post[] = [
  {
    id: 1,
    sellerId: 1, // UMKM Serabi Maknyus
    content: 'Pagi KODIKers! Serabi hijau siap menemani sarapanmu. Baru matang, anget-anget, saus kincanya lumer banget di mulut. Yuk, diorder!',
    mediaUrl: 'https://images.unsplash.com/photo-1631214081273-55a693b38153?w=600&h=600&fit=crop',
    mediaType: 'image',
    timestamp: '2024-07-29T08:00:00Z',
    likes: 125,
    comments: [
      { id: 1, userName: 'Budi Santoso', userEmail: 'budi@example.com', text: 'Langganan tiap pagi nih!' },
      { id: 2, userName: 'Citra Lestari', userEmail: 'citra@example.com', text: 'Kincanya emang juara! 👍' },
      { id: 4, parentId: 1, userName: 'UMKM Serabi Maknyus', userEmail: 'penjual@example.com', text: 'Terima kasih Kak Budi! 🙏' }
    ]
  },
  {
    id: 2,
    sellerId: 2, // Batik Jaya
    content: 'Proses membatik itu butuh kesabaran dan cinta. Setiap goresan canting adalah doa. Inilah salah satu motif terbaru kami, terinspirasi dari Sungai Citarum.',
    mediaUrl: 'https://images.unsplash.com/photo-1583311833017-11202e2e935b?w=600&h=600&fit=crop',
    mediaType: 'image',
    timestamp: '2024-07-28T15:30:00Z',
    likes: 210,
    comments: [
      { id: 3, userName: 'Agus Wijaya', userEmail: 'agus@example.com', text: 'Keren banget filosofinya. Makin bangga sama batik Karawang.' },
    ]
  },
  {
    id: 3,
    sellerId: 9, // Distro Karawang
    content: 'Stok kaos "Karawang Pride" ready lagi! Bahan katun combed 30s, adem dan nyaman. Desain simpel tapi ngena. Sikat sebelum kehabisan!',
    mediaUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    mediaType: 'image',
    timestamp: '2024-07-28T11:00:00Z',
    likes: 88,
    comments: []
  },
];

export const addPost = (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
  const newId = Math.max(...posts.map(p => p.id)) + 1;
  const newPost: Post = { 
    id: newId, 
    ...post, 
    likes: 0, 
    comments: [],
    timestamp: new Date().toISOString()
  };
  posts.unshift(newPost); // Add to the beginning of the array
};

export const addComment = (postId: number, comment: Omit<Comment, 'id'>) => {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        const post = posts[postIndex];
        const newId = Math.max(0, ...post.comments.map(c => c.id)) + 1;
        const newComment: Comment = { id: newId, ...comment };
        post.comments.push(newComment);
    }
};

export let liveSessions: LiveSession[] = [
  { id: 1, sellerId: 1, title: 'Promo Serabi Kinca Durian!', status: 'live', thumbnailUrl: 'https://images.unsplash.com/photo-1631214081273-55a693b38153?w=600&h=600&fit=crop', productIds: [1, 8], likes: 7200, viewers: 226 },
  { id: 2, sellerId: 9, title: 'Unboxing Kaos Karawang Pride Edisi Baru', status: 'live', thumbnailUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', productIds: [9], likes: 5100, viewers: 189 },
  { id: 3, sellerId: 2, title: 'Proses Membatik Langsung dari Studio', status: 'replay', thumbnailUrl: 'https://images.unsplash.com/photo-1551954228-636442b51253?w=600&h=600&fit=crop', productIds: [2], likes: 12000, viewers: 450 },
  { id: 4, sellerId: 10, title: 'Workshop Membuat Gerabah Unik', status: 'replay', thumbnailUrl: 'https://images.unsplash.com/photo-1610732840420-d99672e811f0?w=600&h=600&fit=crop', productIds: [10], likes: 3400, viewers: 150 },
];

export const addLiveSession = (session: Omit<LiveSession, 'id' | 'status'>): LiveSession => {
  const newId = Math.max(0, ...liveSessions.map(s => s.id)) + 1;
  const newSession: LiveSession = {
    id: newId,
    ...session,
    status: 'live',
  };
  liveSessions.unshift(newSession);
  return newSession;
};

export const addOrUpdateLiveSession = (session: LiveSession): void => {
  const index = liveSessions.findIndex(s => s.id === session.id);
  if (index !== -1) {
    liveSessions[index] = session; // Update existing
  } else {
    liveSessions.unshift(session); // Add new
  }
};

export const endLiveSession = (sessionId: number): boolean => {
  const sessionIndex = liveSessions.findIndex(s => s.id === sessionId);
  if (sessionIndex !== -1) {
    liveSessions[sessionIndex].status = 'replay';
    return true;
  }
  return false;
};

export const virtualGifts: VirtualGift[] = [
    { id: 1, name: 'Rose', icon: '🌹', price: 10 },
    { id: 2, name: 'Like', icon: '👍', price: 25 },
    { id: 3, name: 'KODIK Love', icon: '💚', price: 50 },
    { id: 4, name: 'Diamond', icon: '💎', price: 100 },
    { id: 5, name: 'Crown', icon: '👑', price: 500 },
];

export let conversations: Conversation[] = [
    {
        id: 1,
        customerId: 101,
        customerName: 'Budi Santoso',
        lastMessage: 'Oke, ditunggu ya kak barangnya.',
        timestamp: '10:35',
        unreadCount: 1,
        messages: [
            { sender: 'pembeli', text: 'Halo, Kak. Pesanan saya KODIK-7892A sudah dikirim?', timestamp: '10:30' },
            { sender: 'penjual', text: 'Halo, Kak Budi. Sudah kami terima pesanannya, sedang disiapkan untuk dikemas hari ini ya.', timestamp: '10:31' },
            { sender: 'pembeli', text: 'Oke, ditunggu ya kak barangnya.', timestamp: '10:35' },
        ]
    },
    {
        id: 2,
        customerId: 102,
        customerName: 'Citra Lestari',
        lastMessage: 'Bisa custom ukuran tidak ya?',
        timestamp: 'Kemarin',
        unreadCount: 0,
        messages: [
            { sender: 'pembeli', text: 'Kak, kaosnya ready?', timestamp: 'Kemarin' },
            { sender: 'penjual', text: 'Ready semua ukuran, Kak. Silakan diorder.', timestamp: 'Kemarin' },
            { sender: 'pembeli', text: 'Bisa custom ukuran tidak ya?', timestamp: 'Kemarin' },
        ]
    },
    {
        id: 3,
        customerId: 103,
        customerName: 'Agus Wijaya',
        lastMessage: 'Siap, terima kasih.',
        timestamp: '2 hari lalu',
        unreadCount: 0,
        messages: [
             { sender: 'penjual', text: 'Terima kasih telah berbelanja di toko kami!', timestamp: '2 hari lalu' },
             { sender: 'pembeli', text: 'Sama-sama. Batiknya bagus banget!', timestamp: '2 hari lalu' },
             { sender: 'penjual', text: 'Siap, terima kasih.', timestamp: '2 hari lalu' },
        ]
    }
];

export const addMessageToConversation = (conversationId: number, message: ChatMessage) => {
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
        conversations[convIndex].messages.push(message);
        conversations[convIndex].lastMessage = message.text;
        conversations[convIndex].timestamp = message.timestamp;
        if (message.sender === 'pembeli') {
            conversations[convIndex].unreadCount += 1;
        }
    }
};

export const financialTransactions: FinancialTransaction[] = [
    { id: 'TRX001', date: '2024-07-28T10:35:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7892A', amount: 65250, status: 'Selesai' },
    { id: 'TRX002', date: '2024-07-27T14:05:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7890C', amount: 250000, status: 'Selesai' },
    { id: 'WD001', date: '2024-07-26T09:00:00Z', type: 'Pencairan Dana', description: 'Pencairan ke Bank ABC', amount: -5000000, status: 'Selesai' },
    { id: 'TRX003', date: '2024-07-26T18:50:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7889D', amount: 222500, status: 'Selesai' },
    { id: 'TRX004', date: '2024-07-25T11:25:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7888E', amount: 300000, status: 'Selesai' },
];

export let promotions: Promotion[] = [
// FIX: Added missing sellerId property to match the Promotion type.
    { id: 1, sellerId: 1, type: 'Voucher', code: 'UMKMHEBAT', title: 'Diskon 10% Akhir Bulan', discountValue: 10, discountType: 'persen', minPurchase: 50000, startDate: '2024-07-25T00:00:00Z', endDate: '2024-07-31T23:59:59Z', status: 'Aktif' },
    { id: 2, sellerId: 1, type: 'Voucher', code: 'KODIKSERU', title: 'Potongan Harga Rp15.000', discountValue: 15000, discountType: 'nominal', minPurchase: 100000, startDate: '2024-08-01T00:00:00Z', endDate: '2024-08-10T23:59:59Z', status: 'Akan Datang' },
    { id: 3, sellerId: 2, type: 'Voucher', code: 'HEMATJULI', title: 'Diskon Spesial Juli', discountValue: 20, discountType: 'persen', minPurchase: 75000, startDate: '2024-07-01T00:00:00Z', endDate: '2024-07-15T23:59:59Z', status: 'Kadaluarsa' },
];

export const addPromotion = (promo: Omit<Promotion, 'id' | 'status'>) => {
  const newId = Math.max(0, ...promotions.map(p => p.id)) + 1;
  const newPromo: Promotion = { 
    id: newId, 
    ...promo,
    status: 'Aktif' // Assume new promos are active
  };
  promotions.unshift(newPromo);
};

export const influencers: Influencer[] = [
  { id: 1, name: 'Karawang Foodie', category: 'Kuliner', followers: { instagram: 25400, tiktok: 55100 }, bio: 'Menjelajahi semua rasa otentik Karawang!', profileImageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop' },
  { id: 2, name: 'Gaya Lokal KRW', category: 'Fashion', followers: { instagram: 12100, tiktok: 8200 }, bio: 'Tampil gaya dengan brand lokal Karawang.', profileImageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872d24?w=200&h=200&fit=crop' },
  { id: 3, name: 'Crafty Hands ID', category: 'Kerajinan', followers: { instagram: 8500, tiktok: 15600 }, bio: 'DIY & review kerajinan tangan unik dan estetik.', profileImageUrl: 'https://images.unsplash.com/photo-1596496181848-30175b228f4c?w=200&h=200&fit=crop' },
  { id: 4, name: 'Tani Muda Digital', category: 'Pertanian', followers: { instagram: 18000, tiktok: 32000 }, bio: 'Inovasi pertanian dari lahan Karawang.', profileImageUrl: 'https://images.unsplash.com/photo-1627913382333-a6b13a70768e?w=200&h=200&fit=crop' },
  { id: 5, name: 'Dapur Neng Cici', category: 'Kuliner', followers: { instagram: 48000, tiktok: 120000 }, bio: 'Resep masakan rumahan khas Karawang yang bikin nagih.', profileImageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=200&fit=crop' },
  { id: 6, name: 'OOTD Karawang', category: 'Fashion', followers: { instagram: 5200, tiktok: 9800 }, bio: 'Inspirasi outfit harian dari sudut kota Karawang.', profileImageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa6ce67c43?w=200&h=200&fit=crop' },
  { id: 7, name: 'Karawang Tech', category: 'Teknologi', followers: { instagram: 2200, tiktok: 3100 }, bio: 'Review gadget dan inovasi teknologi lokal.', profileImageUrl: 'https://images.unsplash.com/photo-1591012982992-1205a9689f18?w=200&h=200&fit=crop' },
  { id: 8, name: 'Jelajah Jasa KRW', category: 'Jasa', followers: { instagram: 6100, tiktok: 4500 }, bio: 'Rekomendasi jasa terbaik di sekitar Karawang.', profileImageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=200&h=200&fit=crop' },
];
