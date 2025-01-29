export interface Product {
  name: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  shortId: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface UserProfile {
  name: string | null;
  email: string;
  bio: string | null;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  credit: number;
}
