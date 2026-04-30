
export type Product = 'Laptop' | 'Monitor' | 'TV' | 'Headphones' | 'Keyboard';

export interface SalesRecord {
  id: string;
  userId?: string;
  date: string;
  product: Product;
  category: 'Electronics' | 'Accessories';
  price: number;
  quantity: number;
  total: number;
}

export interface DashboardSettings {
  currency: string;
  theme: 'light' | 'dark';
}

export type Page = 'Home' | 'Insights' | 'Predictions' | 'Settings' | 'Logout';
