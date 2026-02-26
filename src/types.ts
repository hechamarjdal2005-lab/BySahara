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
  icon: string; // emoji or icon name
  productCount?: number;
}

// ─── Product ─────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: BilingualText;
  description: BilingualText;
  price: number;
  unit: BilingualText;        // e.g. "kg" / "كغ" or "250ml" / "250مل"
  category: CategoryId;
  image: string;
  images?: string[];          // gallery images
  cooperativeId: string;
  rating: number;             // 0–5
  reviewCount?: number;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  weight?: string;            // packaging info
  origin?: BilingualText;     // e.g. "Guelmim" / "كلميم"
}

// ─── Cooperative ─────────────────────────────────────────────────
export interface Cooperative {
  id: string;
  name: BilingualText;
  description: BilingualText;
  shortDescription?: BilingualText;
  image: string;
  logo?: string;

  // Location details
  city: BilingualText;        // e.g. "Guelmim" / "كلميم"
  province: BilingualText;    // e.g. "Guelmim Province" / "إقليم كلميم"
  region: BilingualText;      // e.g. "Guelmim-Oued Noun" / "كلميم-واد نون"
  address?: BilingualText;    // full address if available
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Contact
  phone?: string;
  email?: string;
  website?: string;

  // Meta
  foundedYear?: number;
  memberCount?: number;
  certifications?: string[];  // e.g. ["Bio", "Fair Trade"]
  categories?: CategoryId[];  // which categories they produce
}

// ─── Cart ────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
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