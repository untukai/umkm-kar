

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  sellerId: number; // Changed from seller: string
  discount?: number; // Percentage off
  imageUrls: string[];
  status: 'aktif' | 'nonaktif' | 'habis stok';
}

export interface Seller {
  id: number;
  name: string;
  description: string;
  rating: number;
  phone?: string;
  email?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string; // ISO 8601 format
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'menunggu pembayaran' | 'dikemas' | 'dikirim' | 'selesai';
  shippingAddress: {
    name: string;
    address: string;
    phone: string;
  };
}

export interface User {
  email: string;
  role: 'pembeli' | 'penjual';
  name?: string; // Added for Google Sign-In
  picture?: string; // Added for Google Sign-In
  coins?: number;
  balance?: number;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO 8601 format
}

export interface Comment {
  id: number;
  parentId?: number | null;
  userName: string;
  userEmail: string;
  text: string;
}

export interface Post {
  id: number;
  sellerId: number;
  content: string;
  imageUrl?: string;
  timestamp: string; // ISO 8601 format
  likes: number;
  comments: Comment[];
}

export interface LiveChatMessage {
  id: number;
  userName: string;
  text: string;
  isGift?: boolean;
  giftIcon?: string;
}

export interface LiveSession {
  id: number;
  sellerId: number;
  title: string;
  status: 'live' | 'replay';
  thumbnailUrl: string;
  productIds: number[];
  meetUrl: string; // Added to replace Jitsi
  likes?: number;
  viewers?: number;
}

export interface VirtualGift {
  id: number;
  name: string;
  icon: string;
  price: number; // in coins
}

export interface ChatMessage {
  sender: 'penjual' | 'pembeli';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  customerId: number; // Assuming a customer ID exists, can link to a future customer type
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'Penjualan' | 'Pencairan Dana' | 'Refund';
  description: string;
  amount: number; // positive for income, negative for outcome
  status: 'Selesai' | 'Tertunda';
}

export interface Promotion {
  id: number;
  type: 'Voucher' | 'Diskon Produk';
  code?: string; // for vouchers
  title: string;
  discountValue: number; // percentage or fixed amount
  discountType: 'persen' | 'nominal';
  minPurchase: number;
  startDate: string;
  endDate: string;
  status: 'Aktif' | 'Kadaluarsa' | 'Akan Datang';
}

export interface Influencer {
  id: number;
  name: string;
  category: string;
  followers: {
    instagram: number;
    tiktok: number;
  };
  bio: string;
  profileImageUrl?: string;
}