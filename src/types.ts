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
// kola produit 3ando list dyal volumes li ikhtar menhom l'client
export interface VolumeOption {
  label: BilingualText;   // ex: { en: '250ml', ar: '250مل' }
  value: number;          // ex: 250  (always in base unit: ml, g, etc.)
  unit: string;           // ex: 'ml' | 'g' | 'kg' | 'L'
  price: number;          // prix spécifique à ce volume
}

// ─── Product ─────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: BilingualText;
  description: BilingualText;
  price: number;            // prix de base (= premier volume si volumes défini)
  unit: BilingualText;      // e.g. "250ml bottle" / "زجاجة 250مل"
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
  volumes?: VolumeOption[]; // ← JDID: options de volume disponibles
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

// ─── Cart ────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVolume?: VolumeOption; // ← JDID: volume li khtaro l'client
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ─── Filters (for Shop page) ─────────────────────────────────────
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