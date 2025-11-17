import { Product, Category, Article, Seller, Review, Order, Post, LiveSession, VirtualGift, Conversation, ChatMessage, FinancialTransaction, Promotion, Comment, Influencer, User } from '../types';

// This file acts as an in-memory database.

// --- DATA STORE ---

let categories: Category[] = [
  { id: 'kuliner', name: 'Kuliner' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'kerajinan', name: 'Kerajinan' },
  { id: 'pertanian', name: 'Pertanian' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'jasa', name: 'Jasa' },
  { id: 'edukasi', name: 'Edukasi' },
];

let sellers: Seller[] = [
  { _id: '1', name: 'UMKM Serabi Maknyus', description: 'Pelopor serabi hijau dengan resep warisan keluarga. Selalu menggunakan bahan-bahan alami dan berkualitas tinggi.', rating: 4.8, phone: '081234567890', email: 'penjual.google@example.com' },
  { _id: '2', name: 'Batik Jaya', description: 'Pengrajin batik tulis asli Karawang dengan motif yang terinspirasi dari kekayaan alam lokal. Setiap kain adalah karya seni.', rating: 4.9, email: 'info@batikjaya.id' },
  { _id: '3', name: 'Kreasi Bambu', description: 'Mengubah bambu menjadi karya seni fungsional. Produk kami ramah lingkungan dan dibuat dengan tangan terampil.', rating: 4.7 },
  { _id: '4', name: 'Tani Sejahtera', description: 'Kelompok tani yang berkomitmen pada pertanian organik dan berkelanjutan untuk menghasilkan produk pangan terbaik.', rating: 4.9, phone: '085678901234' },
  { _id: '5', name: 'Inovasi Digital Tani', description: 'Startup teknologi yang berfokus pada modernisasi pertanian melalui solusi IoT yang mudah digunakan.', rating: 5.0, email: 'support@inovasitani.tech' },
  { _id: '6', name: 'Lensa Kreatif', description: 'Menyediakan jasa profesional untuk membantu UMKM tampil lebih menarik di dunia digital.', rating: 4.8, phone: '089876543210' },
  { _id: '7', name: 'Akademi Karawang', description: 'Pusat pelatihan untuk meningkatkan skill dan pengetahuan para pelaku UMKM di Karawang.', rating: 4.7 },
  { _id: '8', name: 'Dodol Ibu Entin', description: 'Meneruskan tradisi dodol Karawang yang legit dan lezat sejak tahun 1980.', rating: 4.9, email: 'pesan@dodolibuentin.com' },
  { _id: '9', name: 'Distro Karawang', description: 'Merek fashion lokal yang mengangkat kebanggaan dan identitas Karawang melalui desain yang modern.', rating: 4.6 },
  { _id: '10', name: 'Seni Tanah Liat', description: 'Studio gerabah yang memadukan teknik tradisional dengan desain kontemporer.', rating: 4.8, phone: '081122334455' },
];

let products: Product[] = [
  { _id: '1', name: 'Serabi Hijau Khas Karawang', price: 15000, category: 'Kuliner', description: 'Serabi hijau otentik dengan saus kinca durian.', stock: 50, sellerId: '1', discount: 10, imageUrls: ['https://images.unsplash.com/photo-1563889958723-5a507119999a?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1598103366923-3cec45511c34?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '2', name: 'Batik Karawang Motif Padi', price: 250000, category: 'Fashion', description: 'Kain batik tulis dengan motif padi khas lumbung padi Jawa Barat.', stock: 20, sellerId: '2', imageUrls: ['https://images.unsplash.com/photo-1622542910436-15772a153257?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583311833017-11202e2e935b?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '3', name: 'Anyaman Bambu Hias', price: 75000, category: 'Kerajinan', description: 'Hiasan dinding dari anyaman bambu asli Karawang.', stock: 0, sellerId: '3', discount: 25, imageUrls: ['https://images.unsplash.com/photo-1618221628462-b75b0a373523?w=600&h=600&fit=crop'], status: 'habis stok' },
  { _id: '4', name: 'Beras Pandan Wangi Organik', price: 80000, category: 'Pertanian', description: 'Beras organik 5kg, pulen dan wangi alami.', stock: 100, sellerId: '4', imageUrls: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a7?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1586201375823-3cec45511c34?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '5', name: 'IoT Sawah Pintar Kit', price: 1500000, category: 'Teknologi', description: 'Kit sensor untuk memantau kondisi sawah secara real-time.', stock: 10, sellerId: '5', imageUrls: ['https://images.unsplash.com/photo-1586798273330-3363d6505a49?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '6', name: 'Jasa Foto Produk UMKM', price: 500000, category: 'Jasa', description: 'Paket jasa foto produk profesional untuk 20 item.', stock: 99, sellerId: '6', imageUrls: ['https://images.unsplash.com/photo-1599423524326-559d33230d7b?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '7', name: 'Pelatihan UMKM Go Digital', price: 300000, category: 'Edukasi', description: 'Workshop 2 hari tentang pemasaran digital untuk UMKM.', stock: 99, sellerId: '7', imageUrls: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop'], status: 'nonaktif' },
  { _id: '8', name: 'Dodol Karawang Premium', price: 45000, category: 'Kuliner', description: 'Dodol legit dengan bahan pilihan dan resep turun-temurun.', stock: 80, sellerId: '1', discount: 15, imageUrls: ['https://images.unsplash.com/photo-1629233231398-922055652538?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '9', name: 'Kaos Lokal "Karawang Pride"', price: 120000, category: 'Fashion', description: 'Kaos katun combed 30s dengan sablon desain lokal.', stock: 6, sellerId: '9', imageUrls: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '10', name: 'Gerabah Artistik', price: 150000, category: 'Kerajinan', description: 'Vas gerabah dengan ukiran tangan yang unik.', stock: 25, sellerId: '10', imageUrls: ['https://images.unsplash.com/photo-1554228498-84752c288924?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1565015926312-a161a455a303?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '11', name: 'Pupuk Cair Organik Super', price: 50000, category: 'Pertanian', description: 'Pupuk cair organik 1 liter untuk kesuburan tanaman.', stock: 200, sellerId: '4', discount: 5, imageUrls: ['https://images.unsplash.com/photo-1615755718244-99385b73d7be?w=600&h=600&fit=crop'], status: 'aktif' },
  { _id: '12', name: 'Jasa Desain Logo UMKM', price: 400000, category: 'Jasa', description: 'Jasa desain logo profesional termasuk 3 revisi.', stock: 0, sellerId: '6', imageUrls: ['https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=600&fit=crop'], status: 'habis stok' }
];

let articles: Article[] = [
  { 
    _id: '1', 
    title: 'Inovasi UMKM Karawang di Era Digital: Kunci Sukses Bertahan dan Berkembang', 
    summary: 'Di tengah gempuran persaingan global, UMKM Karawang menunjukkan taringnya dengan adopsi teknologi digital yang kreatif dan efektif.', 
    author: 'Tim KODIK News',
    publishDate: '2024-07-25T10:00:00Z',
    content: `Karawang, yang dikenal sebagai lumbung padi nasional dan kota industri, kini menyaksikan gelombang baru transformasi ekonomi di tingkat akar rumput. Para pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) tidak lagi hanya mengandalkan etalase fisik. Mereka kini merambah dunia digital untuk menjangkau pasar yang lebih luas dan meningkatkan efisiensi operasional.\n\nSalah satu contohnya adalah Ibu Entin, pemilik 'Dodol Ibu Entin' yang legendaris. Jika dulu pemasarannya hanya dari mulut ke mulut dan terbatas di sekitar toko, kini produknya bisa dipesan oleh pelanggan di seluruh Indonesia melalui platform KODIK. "Awalnya saya gaptek, tapi setelah dibantu anak saya dan tim KODIK, ternyata jualan online itu membuka pintu rezeki yang tidak terduga. Omzet saya naik hampir 80%," ujarnya sambil tersenyum.\n\nKisah sukses tidak hanya datang dari sektor kuliner. 'Batik Jaya', pengrajin batik tulis khas Karawang, juga merasakan dampak positif digitalisasi. Melalui sesi live shopping di KODIK, mereka dapat menceritakan filosofi di balik setiap motif batik, menciptakan koneksi emosional dengan pembeli. "Live shopping itu seperti membuka workshop kami untuk semua orang. Pembeli jadi lebih menghargai proses dan nilai dari sehelai kain batik," tutur Bapak Agus, sang pemilik.\n\nTransformasi ini bukan tanpa tantangan. Keterbatasan literasi digital, modal untuk perangkat, dan persaingan di pasar online yang ketat menjadi beberapa kendala utama. Namun, dengan semangat kolaborasi antara pemerintah daerah, komunitas, dan platform seperti KODIK, para pelaku UMKM Karawang perlahan tapi pasti berhasil mengatasi rintangan tersebut, membuktikan bahwa inovasi adalah kunci untuk tidak hanya bertahan, tetapi juga berkembang di era digital.` 
  },
  { 
    _id: '2', 
    title: 'Mengenal Batik Khas Karawang: Goresan Canting Penuh Makna dan Sejarah', 
    summary: 'Lebih dari sekadar kain, setiap motif batik Karawang menyimpan cerita tentang kekayaan alam, budaya, dan kearifan lokal.', 
    author: 'Budaya Karawang',
    publishDate: '2024-07-22T14:30:00Z',
    content: `Ketika berbicara tentang batik, banyak yang langsung teringat pada kota-kota seperti Pekalongan, Solo, atau Yogyakarta. Namun, Karawang juga memiliki warisan budaya batik yang tak kalah kaya dan unik. Batik Karawang, atau yang sering disebut Batik Tarawang, memiliki ciri khas pada motif-motifnya yang terinspirasi dari lingkungan agraris dan maritim.\n\nSalah satu motif yang paling ikonik adalah motif 'padi'. Sebagai lumbung padi nasional, motif ini merepresentasikan kemakmuran, kesuburan, dan rasa syukur masyarakat Karawang. Goresan bulir-bulir padi yang merunduk menjadi pengingat akan filosofi hidup untuk tetap rendah hati meskipun memiliki banyak kelebihan.\n\nSelain motif padi, ada pula motif 'Citarum' yang menggambarkan aliran sungai terbesar di Jawa Barat yang melintasi Karawang. Motif ini melambangkan kehidupan yang terus mengalir, dinamis, dan memberikan manfaat bagi sekitarnya. Palet warna batik Karawang juga cenderung lebih berani, seringkali menggunakan warna-warna cerah seperti hijau, kuning, dan merah, yang mencerminkan semangat masyarakatnya yang ekspresif.\n\nProses pembuatannya pun masih banyak yang mempertahankan teknik batik tulis tradisional. Para pengrajin dengan telaten menggoreskan canting berisi malam panas di atas kain, sebuah proses yang membutuhkan kesabaran, ketelitian, dan jiwa seni yang tinggi. Dengan membeli sehelai batik Karawang, kita tidak hanya mendapatkan produk fashion, tetapi juga turut serta melestarikan sebuah mahakarya budaya yang sarat akan nilai dan sejarah.` 
  },
  { 
    _id: '3', 
    title: 'Potensi Pertanian Organik di Karawang: Peluang Emas Menuju Pasar Modern', 
    summary: 'Beralih dari pertanian konvensional, para petani muda di Karawang mulai melirik pertanian organik sebagai solusi untuk keberlanjutan dan peningkatan nilai jual produk.', 
    author: 'Agro Inspirasi',
    publishDate: '2024-07-20T09:00:00Z',
    content: `Sebagai salah satu sentra produksi beras terbesar di Indonesia, Karawang memiliki potensi luar biasa dalam pengembangan sektor pertanian. Kini, sebuah tren positif mulai berkembang di kalangan petani, khususnya generasi muda: peralihan ke sistem pertanian organik.\n\nPertanian organik menawarkan berbagai keuntungan jangka panjang, baik bagi lingkungan maupun bagi petani itu sendiri. Dengan tidak menggunakan pestisida dan pupuk kimia, kesuburan tanah dapat terjaga secara alami, menghasilkan ekosistem yang lebih seimbang. Dari sisi ekonomi, produk organik memiliki nilai jual yang lebih tinggi di pasaran karena permintaan dari konsumen sadar kesehatan yang terus meningkat.\n\n'Tani Sejahtera', salah satu kelompok tani di Karawang yang menjadi pelopor pertanian organik, telah membuktikannya. "Awalnya banyak yang ragu, karena masa transisi ke organik itu butuh waktu dan hasil panen sempat sedikit menurun. Tapi setelah tanahnya pulih, hasilnya luar biasa. Beras kami lebih pulen, lebih wangi, dan harganya bisa dua kali lipat dari beras biasa," ungkap Kang Asep, ketua kelompok tani.\n\nPlatform digital seperti KODIK memainkan peran penting dalam menghubungkan petani organik dengan konsumen akhir. Melalui KODIK, 'Tani Sejahtera' dapat menjual produk mereka langsung ke konsumen di perkotaan, memotong rantai pasok yang panjang dan memastikan petani mendapatkan harga yang lebih adil. Ini adalah langkah strategis untuk menjadikan Karawang tidak hanya sebagai lumbung padi nasional, tetapi juga sebagai pusat pertanian organik modern yang berkelanjutan.` 
  }
];

let reviews: Review[] = [
  { _id: '1', productId: '1', userName: 'Budi Santoso', userEmail: 'budi@example.com', rating: 5, comment: 'Serabinya juara! Saus kinca duriannya bikin nagih. Wajib coba!', date: '2024-05-20T10:00:00Z' },
  { _id: '2', productId: '1', userName: 'Citra Lestari', userEmail: 'citra@example.com', rating: 4, comment: 'Enak banget, tapi antrenya lumayan. Mungkin bisa diperbaiki sistem pemesanannya.', date: '2024-05-19T14:30:00Z' },
  { _id: '3', productId: '2', userName: 'Agus Wijaya', userEmail: 'agus@example.com', rating: 5, comment: 'Kain batiknya halus, motifnya juga unik dan khas Karawang. Bangga pakai produk lokal!', date: '2024-05-18T09:15:00Z' },
  { _id: '4', productId: '4', userName: 'Dewi Anggraini', userEmail: 'dewi@example.com', rating: 5, comment: 'Berasnya pulen dan wangi. Sehat karena organik. Keluarga jadi suka makan di rumah.', date: '2024-05-21T11:00:00Z' },
  { _id: '5', productId: '4', userName: 'Eko Prasetyo', userEmail: 'eko@example.com', rating: 5, comment: 'Pengiriman cepat, kualitas berasnya konsisten. Sudah langganan di sini.', date: '2024-05-15T18:00:00Z' },
  { _id: '6', productId: '1', userName: 'Fitriani', userEmail: 'fitri@example.com', rating: 5, comment: 'The best serabi in town!', date: '2024-07-28T08:45:00Z' },
];

let orders: Order[] = [
  {
    _id: 'KODIK-7892A',
    customerName: 'Budi Santoso',
    items: [
      { product: products.find(p => p._id === '1')!, quantity: 2 },
      { product: products.find(p => p._id === '8')!, quantity: 1 }
    ],
    total: (15000 * 0.9 * 2) + (45000 * 0.85 * 1),
    date: '2024-07-28T10:30:00Z',
    status: 'dikemas',
    shippingAddress: { name: 'Budi Santoso', address: 'Jl. Pangkal Perjuangan No. 1, Karawang Barat', phone: '081234567890' },
  },
    {
    _id: 'KODIK-7891B',
    customerName: 'Citra Lestari',
    items: [
      { product: products.find(p => p._id === '9')!, quantity: 1 }
    ],
    total: 120000,
    date: '2024-07-28T09:15:00Z',
    status: 'menunggu pembayaran',
    shippingAddress: { name: 'Citra Lestari', address: 'Perumahan Gading Elok, Karawang Timur', phone: '081234567891' },
  },
  {
    _id: 'KODIK-7890C',
    customerName: 'Agus Wijaya',
    items: [
      { product: products.find(p => p._id === '2')!, quantity: 1 }
    ],
    total: 250000,
    date: '2024-07-27T14:00:00Z',
    status: 'dikirim',
    shippingAddress: { name: 'Agus Wijaya', address: 'Jl. Tuparev No. 101, Karawang Tengah', phone: '081234567892' },
  },
    {
    _id: 'KODIK-7889D',
    customerName: 'Dewi Anggraini',
    items: [
      { product: products.find(p => p._id === '4')!, quantity: 1 },
      { product: products.find(p => p._id === '11')!, quantity: 3 }
    ],
    total: 80000 + (50000 * 0.95 * 3),
    date: '2024-07-26T18:45:00Z',
    status: 'selesai',
    shippingAddress: { name: 'Dewi Anggraini', address: 'Cluster Kertabumi Indah, Karawang Kota', phone: '081234567893' },
  },
   {
    _id: 'KODIK-7888E',
    customerName: 'Eko Prasetyo',
    items: [
      { product: products.find(p => p._id === '10')!, quantity: 2 }
    ],
    total: 150000 * 2,
    date: '2024-07-25T11:20:00Z',
    status: 'selesai',
    shippingAddress: { name: 'Eko Prasetyo', address: 'Jl. Raya Kosambi No. 55, Klari', phone: '081234567894' },
  }
];

let posts: Post[] = [
  {
    _id: '1',
    sellerId: '1', // UMKM Serabi Maknyus
    content: 'Pagi KODIKers! Serabi hijau siap menemani sarapanmu. Baru matang, anget-anget, saus kincanya lumer banget di mulut. Yuk, diorder!',
    imageUrl: 'https://images.unsplash.com/photo-1563889958723-5a507119999a?w=600&h=600&fit=crop',
    timestamp: '2024-07-29T08:00:00Z',
    likes: 125,
    comments: [
      { _id: '1', userName: 'Budi Santoso', userEmail: 'budi@example.com', text: 'Langganan tiap pagi nih!' },
      { _id: '2', userName: 'Citra Lestari', userEmail: 'citra@example.com', text: 'Kincanya emang juara! 👍' },
      { _id: '4', parentId: '1', userName: 'UMKM Serabi Maknyus', userEmail: 'penjual@example.com', text: 'Terima kasih Kak Budi! 🙏' }
    ]
  },
  {
    _id: '2',
    sellerId: '2', // Batik Jaya
    content: 'Proses membatik itu butuh kesabaran dan cinta. Setiap goresan canting adalah doa. Inilah salah satu motif terbaru kami, terinspirasi dari Sungai Citarum.',
    imageUrl: 'https://images.unsplash.com/photo-1583311833017-11202e2e935b?w=600&h=600&fit=crop',
    timestamp: '2024-07-28T15:30:00Z',
    likes: 210,
    comments: [
      { _id: '3', userName: 'Agus Wijaya', userEmail: 'agus@example.com', text: 'Keren banget filosofinya. Makin bangga sama batik Karawang.' },
    ]
  },
  {
    _id: '3',
    sellerId: '9', // Distro Karawang
    content: 'Stok kaos "Karawang Pride" ready lagi! Bahan katun combed 30s, adem dan nyaman. Desain simpel tapi ngena. Sikat sebelum kehabisan!',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    timestamp: '2024-07-28T11:00:00Z',
    likes: 88,
    comments: []
  },
];

let liveSessions: LiveSession[] = [
  { _id: '1', seller_id: '1', title: 'Promo Serabi Kinca Durian!', status: 'ongoing', thumbnailUrl: 'https://images.unsplash.com/photo-1563889958723-5a507119999a?w=600&h=600&fit=crop', product_ids: ['1', '8'], google_calendar_event_id: 'evt_1', google_meet_link: 'https://meet.google.com/abc-def-ghi', start_time: new Date().toISOString(), end_time: '' },
  { _id: '2', seller_id: '9', title: 'Unboxing Kaos Karawang Pride Edisi Baru', status: 'ongoing', thumbnailUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop', product_ids: ['9'], google_calendar_event_id: 'evt_2', google_meet_link: 'https://meet.google.com/jkl-mno-pqr', start_time: new Date().toISOString(), end_time: '' },
  { _id: '3', seller_id: '2', title: 'Proses Membatik Langsung dari Studio', status: 'finished', thumbnailUrl: 'https://images.unsplash.com/photo-1622542910436-15772a153257?w=600&h=600&fit=crop', product_ids: ['2'], google_calendar_event_id: 'evt_3', google_meet_link: 'https://meet.google.com/stu-vwx-yza', start_time: new Date().toISOString(), end_time: new Date().toISOString() },
  { _id: '4', seller_id: '10', title: 'Workshop Membuat Gerabah Unik', status: 'finished', thumbnailUrl: 'https://images.unsplash.com/photo-1554228498-84752c288924?w=600&h=600&fit=crop', product_ids: ['10'], google_calendar_event_id: 'evt_4', google_meet_link: 'https://meet.google.com/bcd-efg-hij', start_time: new Date().toISOString(), end_time: new Date().toISOString() },
];

let virtualGifts: VirtualGift[] = [
    { id: 1, name: 'Rose', icon: '🌹', price: 10 },
    { id: 2, name: 'Like', icon: '👍', price: 25 },
    { id: 3, name: 'KODIK Love', icon: '💚', price: 50 },
    { id: 4, name: 'Diamond', icon: '💎', price: 100 },
    { id: 5, name: 'Crown', icon: '👑', price: 500 },
];

let conversations: Conversation[] = [
    {
        _id: '1',
        customerId: '101',
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
        _id: '2',
        customerId: '102',
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
        _id: '3',
        customerId: '103',
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

let financialTransactions: FinancialTransaction[] = [
    { _id: 'TRX001', date: '2024-07-28T10:35:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7892A', amount: 65250, status: 'Selesai' },
    { _id: 'TRX002', date: '2024-07-27T14:05:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7890C', amount: 250000, status: 'Selesai' },
    { _id: 'WD001', date: '2024-07-26T09:00:00Z', type: 'Pencairan Dana', description: 'Pencairan ke Bank ABC', amount: -5000000, status: 'Selesai' },
    { _id: 'TRX003', date: '2024-07-26T18:50:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7889D', amount: 222500, status: 'Selesai' },
    { _id: 'TRX004', date: '2024-07-25T11:25:00Z', type: 'Penjualan', description: 'Pesanan #KODIK-7888E', amount: 300000, status: 'Selesai' },
];

let promotions: Promotion[] = [
    { _id: '1', type: 'Voucher', code: 'UMKMHEBAT', title: 'Diskon 10% Akhir Bulan', discountValue: 10, discountType: 'persen', minPurchase: 50000, startDate: '2024-07-25T00:00:00Z', endDate: '2024-07-31T23:59:59Z', status: 'Aktif' },
    { _id: '2', type: 'Voucher', code: 'KODIKSERU', title: 'Potongan Harga Rp15.000', discountValue: 15000, discountType: 'nominal', minPurchase: 100000, startDate: '2024-08-01T00:00:00Z', endDate: '2024-08-10T23:59:59Z', status: 'Akan Datang' },
    { _id: '3', type: 'Voucher', code: 'HEMATJULI', title: 'Diskon Spesial Juli', discountValue: 20, discountType: 'persen', minPurchase: 75000, startDate: '2024-07-01T00:00:00Z', endDate: '2024-07-15T23:59:59Z', status: 'Kadaluarsa' },
];

let influencers: Influencer[] = [
  { _id: '1', name: 'Karawang Foodie', category: 'Kuliner', followers: { instagram: 25400, tiktok: 55100 }, bio: 'Menjelajahi semua rasa otentik Karawang!' },
  { _id: '2', name: 'Gaya Lokal KRW', category: 'Fashion', followers: { instagram: 12100, tiktok: 8200 }, bio: 'Tampil gaya dengan brand lokal Karawang.' },
  { _id: '3', name: 'Crafty Hands ID', category: 'Kerajinan', followers: { instagram: 8500, tiktok: 15600 }, bio: 'DIY & review kerajinan tangan unik dan estetik.' },
  { _id: '4', name: 'Tani Muda Digital', category: 'Pertanian', followers: { instagram: 18000, tiktok: 32000 }, bio: 'Inovasi pertanian dari lahan Karawang.' },
  { _id: '5', name: 'Dapur Neng Cici', category: 'Kuliner', followers: { instagram: 48000, tiktok: 120000 }, bio: 'Resep masakan rumahan khas Karawang yang bikin nagih.' },
  { _id: '6', name: 'OOTD Karawang', category: 'Fashion', followers: { instagram: 5200, tiktok: 9800 }, bio: 'Inspirasi outfit harian dari sudut kota Karawang.' },
  { _id: '7', name: 'Karawang Tech', category: 'Teknologi', followers: { instagram: 2200, tiktok: 3100 }, bio: 'Review gadget dan inovasi teknologi lokal.' },
  { _id: '8', name: 'Jelajah Jasa KRW', category: 'Jasa', followers: { instagram: 6100, tiktok: 4500 }, bio: 'Rekomendasi jasa terbaik di sekitar Karawang.' },
];

// --- DATABASE FUNCTIONS ---

// GETTERS
export const db_getCategories = () => categories;
export const db_getSellers = () => sellers;
export const db_getProducts = () => products;
export const db_getArticles = () => articles;
export const db_getReviews = () => reviews;
export const db_getOrders = () => orders;
export const db_getPosts = () => posts;
export const db_getLiveSessions = () => liveSessions;
export const db_getVirtualGifts = () => virtualGifts;
export const db_getConversations = () => conversations;
export const db_getFinancialTransactions = () => financialTransactions;
export const db_getPromotions = () => promotions;
export const db_getInfluencers = () => influencers;

// MUTATIONS
export const db_addProduct = (product: Omit<Product, '_id' | 'status'>) => {
  const newId = (Math.max(...products.map(p => parseInt(p._id))) + 1).toString();
  const newProduct: Product = { _id: newId, ...product, status: 'aktif' };
  products.unshift(newProduct);
  return newProduct;
};

export const db_addArticle = (article: Omit<Article, '_id'>) => {
  const newId = (Math.max(0, ...articles.map(a => parseInt(a._id))) + 1).toString();
  const newArticle: Article = { _id: newId, ...article };
  articles.unshift(newArticle);
  return newArticle;
}

export const db_addReview = (review: Omit<Review, '_id'>) => {
    const newId = (Math.max(0, ...reviews.map(r => parseInt(r._id))) + 1).toString();
    const newReview: Review = { _id: newId, ...review };
    reviews.unshift(newReview);
    return newReview;
}

export const db_addOrder = (order: Omit<Order, '_id'>) => {
    const newId = `KODIK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const newOrder: Order = { _id: newId, ...order };
    orders.unshift(newOrder);
    return newOrder;
}

export const db_updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
  const orderIndex = orders.findIndex(o => o._id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    return orders[orderIndex];
  }
  return null;
};

export const db_addPost = (post: Omit<Post, '_id' | 'likes' | 'comments' | 'timestamp'>) => {
  const newId = (Math.max(...posts.map(p => parseInt(p._id))) + 1).toString();
  const newPost: Post = { 
    _id: newId, 
    ...post, 
    likes: 0, 
    comments: [],
    timestamp: new Date().toISOString()
  };
  posts.unshift(newPost);
  return newPost;
};

export const db_addComment = (postId: string, comment: Omit<Comment, '_id'>) => {
    const postIndex = posts.findIndex(p => p._id === postId);
    if (postIndex !== -1) {
        const post = posts[postIndex];
        const allCommentIds = post.comments.map(c => parseInt(c._id));
        const newId = (Math.max(0, ...allCommentIds) + 1).toString();
        const newComment: Comment = { _id: newId, ...comment };
        post.comments.push(newComment);
        return newComment;
    }
    return null;
};

export const db_addLiveSession = (session: Omit<LiveSession, '_id' | 'status' | 'start_time' | 'end_time' | 'google_calendar_event_id' | 'google_meet_link' >): LiveSession => {
  const newId = (Math.max(0, ...liveSessions.map(s => parseInt(s._id))) + 1).toString();
  const newSession: LiveSession = {
    _id: newId,
    ...session,
    status: 'ongoing',
    start_time: new Date().toISOString(),
    end_time: '',
    google_calendar_event_id: `evt_${newId}`,
    google_meet_link: `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`
  };
  liveSessions.unshift(newSession);
  return newSession;
};

export const db_addMessageToConversation = (conversationId: string, message: ChatMessage) => {
    const convIndex = conversations.findIndex(c => c._id === conversationId);
    if (convIndex !== -1) {
        conversations[convIndex].messages.push(message);
        conversations[convIndex].lastMessage = message.text;
        conversations[convIndex].timestamp = message.timestamp;
        return conversations[convIndex];
    }
    return null;
};

export const db_addPromotion = (promo: Omit<Promotion, '_id' | 'status'>) => {
  const newId = (Math.max(0, ...promotions.map(p => parseInt(p._id))) + 1).toString();
  const newPromo: Promotion = { 
    _id: newId, 
    ...promo,
    status: 'Aktif'
  };
  promotions.unshift(newPromo);
  return newPromo;
};

export const db_updateSellerDetails = (sellerId: string, newDetails: Partial<Seller>): Seller | null => {
  const sellerIndex = sellers.findIndex(s => s._id === sellerId);
  if (sellerIndex !== -1) {
    sellers[sellerIndex] = { ...sellers[sellerIndex], ...newDetails };
    return sellers[sellerIndex];
  }
  return null;
};