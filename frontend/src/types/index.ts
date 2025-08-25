export interface Product {
  _id?: string;
  id?: string; // Optional if your DB uses _id or id
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  compatibility: string[];
  images: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  isAdmin: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: Address;
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface Ad {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  active: boolean;
  createdAt: Date;
}