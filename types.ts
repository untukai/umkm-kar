
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  sellerId: number; // Changed from seller: string
}

export interface Seller {
  id: number;
  name: string;
  description: string;
  rating: number;
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
  items: CartItem[];
  total: number;
  date: string;
  status: 'dikemas' | 'dikirim' | 'selesai';
  shippingAddress: {
    name: string;
    address: string;
    phone: string;
  };
}

export interface User {
  email: string;
}