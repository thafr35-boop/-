export type PriceTier = 'retail' | 'wholesale' | 'vip';
export type Currency = 'SAR' | 'USD' | 'YER';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  retailPrice: number;
  wholesalePrice: number;
  vipPrice: number;
  stock: number;
  moq: number;
  views: number;
  specs: string;
  images: string[]; // Multiple photos per product (Requirement 3)
  selectedForShare?: boolean;
  createdAt: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface CartItem {
  productId: string;
  qty: number;
  note?: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  payment: string;
  tier: string;
  itemsSummary: string;
  totalSAR: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  time: string;
}

export interface SharedImageItem {
  id: string;
  dataUrl: string;
  name?: string;
  size?: number;
}

export type ShareDestination = 'add_to_catalog' | 'new_product' | 'existing_product';
