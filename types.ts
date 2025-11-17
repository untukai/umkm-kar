

export interface Product {
  _id: string; 
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  sellerId: string; 
  discount?: number; 
  imageUrls: string[];
  status: 'aktif' | 'nonaktif' | 'habis stok';
}

export interface Seller {
  _id: string; 
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
  _id: string; 
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string; 
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string; 
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

// Updated User type for Google OAuth and MongoDB
export interface User {
  google_id: string;
  role: 'buyer' | 'seller';
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Review {
  _id: string; 
  productId: string; 
  userName: string;
  userEmail: string;
  rating: number; 
  comment: string;
  date: string; 
}

export interface Comment {
  _id: string; 
  parentId?: string | null; 
  userName:string;
  userEmail: string;
  text: string;
}

export interface Post {
  _id: string; 
  sellerId: string; 
  content: string;
  imageUrl?: string;
  timestamp: string; 
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

// Updated LiveSession to match MongoDB schema
export interface LiveSession {
  _id: string;
  seller_id: string;
  title: string;
  product_ids: string[];
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'ongoing' | 'finished';
  google_calendar_event_id: string;
  google_meet_link: string;
  thumbnail_url: string;
  seller_name?: string; 
}


export interface VirtualGift {
  id: number;
  name: string;
  icon: string;
  price: number; 
}

export interface ChatMessage {
  sender: 'penjual' | 'pembeli';
  text: string;
  timestamp: string;
}

export interface Conversation {
  _id: string; 
  customerId: string; 
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface FinancialTransaction {
  _id: string; 
  date: string;
  type: 'Penjualan' | 'Pencairan Dana' | 'Refund';
  description: string;
  amount: number; 
  status: 'Selesai' | 'Tertunda';
}

export interface Promotion {
  _id: string; 
  type: 'Voucher' | 'Diskon Produk';
  code?: string; 
  title: string;
  discountValue: number; 
  discountType: 'persen' | 'nominal';
  minPurchase: number;
  startDate: string;
  endDate: string;
  status: 'Aktif' | 'Kadaluarsa' | 'Akan Datang';
}

export interface Influencer {
  _id: string; 
  name: string;
  category: string;
  followers: {
    instagram: number;
    tiktok: number;
  };
  bio: string;
  profileImageUrl?: string;
}