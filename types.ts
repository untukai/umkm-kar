
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