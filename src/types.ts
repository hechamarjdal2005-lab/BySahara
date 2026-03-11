// ============================================
// BY SAHARA - Types & Interfaces
// ============================================

export type Language = 'en' | 'ar';

export type CategoryId =
  | 'honey'
  | 'oils'
  | 'flour'
  | 'tea'
  | 'spices'
  | 'dried-fruits'
  | 'distilled-water'
  | 'beauty';

// ─── Bilingual Text ───────────────────────────────────────────────
export interface BilingualText {
  en: string;
  ar: string;
}

// ─── Category ────────────────────────────────────────────────────
export interface Category {
  id: CategoryId;
  name: BilingualText;
  icon: string;
  productCount?: number;
}

// ─── Volume Option ────────────────────────────────────────────────
export interface VolumeOption {
  label: BilingualText;
  value: number;
  unit: string;
  price: number;
}

// ─── Product ─────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: BilingualText;
  description: BilingualText;
  price: number;
  unit: BilingualText;
  category: CategoryId;
  image: string;
  images?: string[];
  cooperativeId: string;
  rating: number;
  reviewCount?: number;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  weight?: string;
  origin?: BilingualText;
  volumes?: VolumeOption[];
}

// ─── Cooperative ─────────────────────────────────────────────────
export interface Cooperative {
  id: string;
  name: BilingualText;
  description: BilingualText;
  shortDescription?: BilingualText;
  image: string;
  logo?: string;
  city: BilingualText;
  province: BilingualText;
  region: BilingualText;
  address?: BilingualText;
  coordinates?: { lat: number; lng: number };
  phone?: string;
  email?: string;
  website?: string;
  foundedYear?: number;
  memberCount?: number;
  certifications?: string[];
  categories?: CategoryId[];
}

// ─── Pack ────────────────────────────────────────────────────────
export interface PackItem {
  product_id: string;
  product_name: string;
  product_name_ar?: string;
  quantity: number;
  unit?: string;
  is_free: boolean;
  original_price: number;
  pack_price: number;
}

export interface Pack {
  id: string;
  cooperative_id: string;
  cooperative_name?: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  items: PackItem[];
  total_original_price: number;
  pack_price: number;
  savings: number;
  badge?: string;
  badge_ar?: string;
  image_url?: string;
  is_active: boolean;
  stock?: number;
  created_at?: string;
}

// ─── Cart ────────────────────────────────────────────────────────
export type CartItemType = 'product' | 'pack';

export interface CartItem {
  cartKey: string;
  type: CartItemType;
  id: string;
  name: BilingualText;
  image: string;
  category: string;
  price: number;
  quantity: number;
  // product-only
  selectedVolume?: VolumeOption;
  product?: Product;
  // pack-only
  pack?: Pack;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ─── Filters ─────────────────────────────────────────────────────
export interface ShopFilters {
  category?: CategoryId | 'all';
  cooperativeId?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  search?: string;
}

// ─── Review ──────────────────────────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: BilingualText;
  date: string;
}

// ─── Page Content Types ───────────────────────────────────────────
export interface PageSection {
  id: string;
  section_key: string;
  title: BilingualText;
  subtitle?: BilingualText;
  description?: BilingualText;
  image_url?: string;
  link_url?: string;
  order_index: number;
  is_active: boolean;
}

export interface PageStat {
  id: string;
  icon_emoji: string;
  value_dynamic: boolean;
  value_static?: string;
  label: BilingualText;
  order_index: number;
  is_active: boolean;
}