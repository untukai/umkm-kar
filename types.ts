
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
  coins?: number;
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