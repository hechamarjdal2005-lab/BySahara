// src/data/index.ts
// 100% Database-Driven Data Layer for BySahara

import { supabase } from '../lib/supabase';
import { 
  Product, Cooperative, Category, ShopFilters, VolumeOption 
} from '../types';
import { 
  mapProduct, mapCooperative, toBilingual 
} from '../lib/transformers';

// ─── CATEGORIES (Now from Database) ───────────────────────
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching categories:', error);
    // Fallback to hardcoded if DB fails
    return [
      { id: 'honey', name: { en: 'Honey & Jams', ar: 'عسل وأملو ومربى' }, icon: '🍯' },
      { id: 'oils', name: { en: 'Edible Oils', ar: 'زيوت غذائية' }, icon: '🫒' },
      { id: 'flour', name: { en: 'Flour & Semolina', ar: 'دقيق و سميد' }, icon: '🌾' },
      { id: 'tea', name: { en: 'Tea & Herbs', ar: 'شاي و أعشاب' }, icon: '🍵' },
      { id: 'spices', name: { en: 'Spices & Condiments', ar: 'توابل و بهارات' }, icon: '🌶️' },
      { id: 'dried-fruits', name: { en: 'Dried Fruits', ar: 'فواكه جافة' }, icon: '🫘' },
      { id: 'distilled-water', name: { en: 'Distilled Waters & Essential Oils', ar: 'مياه مقطرة وزيوت عطرية' }, icon: '💧' },
      { id: 'beauty', name: { en: 'Health & Beauty', ar: 'صحة وجمال' }, icon: '✨' },
    ];
  }
  
  return (data || []).map((c: any) => ({
    id: c.id,
    name: { en: c.name_en, ar: c.name_ar },
    icon: c.icon,
  }));
};

// For backward compatibility (loads on module init)
export let categories: Category[] = [];
fetchCategories().then(data => {
  categories = data;
});

// ─── COOPERATIVES ───────────────────────────────────────────────
export const fetchCooperatives = async (): Promise<Cooperative[]> => {
  const { data, error } = await supabase
    .from('cooperatives')
    .select('*');
  
  if (error) {
    console.error('Error fetching cooperatives:', error);
    return [];
  }
  
  return (data || []).map(mapCooperative);
};

export const fetchCooperativeById = async (id: string): Promise<Cooperative | null> => {
  const { data, error } = await supabase
    .from('cooperatives')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching cooperative:', error);
    return null;
  }
  
  return data ? mapCooperative(data) : null;
};

export const fetchCooperativesByProvince = async (provinceId: string): Promise<Cooperative[]> => {
  const { data, error } = await supabase
    .from('cooperatives')
    .select('*');
  
  if (error) {
    console.error('Error fetching cooperatives by province:', error);
    return [];
  }
  return (data || []).map(mapCooperative);
};

// ─── PRODUCTS ───────────────────────────────────────────────────
export const fetchProducts = async (filters?: ShopFilters): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select(`
      *,
      volumes:product_volumes(
        id,
        label_en,
        label_ar,
        value,
        unit,
        price
      )
    `);

  // Apply filters
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters?.cooperativeId) {
    query = query.eq('cooperative_id', filters.cooperativeId);
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.rating !== undefined) {
    query = query.gte('rating', filters.rating);
  }
  if (filters?.search?.trim()) {
    const search = `%${filters.search.trim()}%`;
    query = query.or(`name_en.ilike.${search},name_ar.ilike.${search}`);
  }

  // Apply sorting
  if (filters?.sortBy === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (filters?.sortBy === 'price-desc') {
    query = query.order('price', { ascending: false });
  } else if (filters?.sortBy === 'rating') {
    query = query.order('rating', { ascending: false });
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return (data || []).map(mapProduct);
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      volumes:product_volumes(
        id,
        label_en,
        label_ar,
        value,
        unit,
        price
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data ? mapProduct(data) : null;
};

export const fetchFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      volumes:product_volumes(
        id, label_en, label_ar, value, unit, price
      )
    `)
    .eq('is_featured', true)
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  return (data || []).map(mapProduct);
};

export const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return fetchProducts({ category: categoryId as any });
};

export const fetchProductsByCooperative = async (cooperativeId: string): Promise<Product[]> => {
  return fetchProducts({ cooperativeId });
};

// ─── BACKWARD COMPATIBILITY HELPERS ────────────
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return fetchProductsByCategory(categoryId);
};

export const getProductsByCooperative = async (cooperativeId: string): Promise<Product[]> => {
  return fetchProductsByCooperative(cooperativeId);
};

export const getCooperativeById = async (id: string): Promise<Cooperative | null> => {
  return fetchCooperativeById(id);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return fetchProductById(id);
};

export const getFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  return fetchFeaturedProducts(limit);
};

// ─── VOLUMES ─────────────────────────────────
export const fetchVolumesByProductId = async (productId: string): Promise<VolumeOption[]> => {
  const { data, error } = await supabase
    .from('product_volumes')
    .select('*')
    .eq('product_id', productId);
  
  if (error) {
    console.error('Error fetching volumes:', error);
    return [];
  }
  return (data || []).map((v: any) => ({
    label: toBilingual(v.label_en, v.label_ar),
    value: Number(v.value),
    unit: v.unit,
    price: Number(v.price)
  }));
};

// ─── HERO SLIDES (For Home Page) ───────────────────────────────
export const fetchHeroSlides = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
  return data || [];
};

// ─── PROMOTIONS (For Home Page) ────────────────────────────────
export const fetchPromotions = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
  return data || [];
};

// ─── COOPERATIVE ADS (For Home Page) ───────────────────────────
export const fetchCooperativeAds = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('cooperative_ads')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching cooperative ads:', error);
    return [];
  }
  return data || [];
};

// ─── BRAND ADS (For Home Page) ─────────────────────────────────
export const fetchBrandAds = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('brand_ads')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching brand ads:', error);
    return [];
  }
  return data || [];
};

// ─── PARTNERS (For Home Page) ──────────────────────────────────
export const fetchPartners = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
  return data || [];
};

// ─── FEATURES (For Home Page) ──────────────────────────────────
export const fetchFeatures = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching features:', error);
    return [];
  }
  return data || [];
};

// ─── STATS (For Home Page) ─────────────────────────────────────
export const fetchStats = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
  return data || [];
};

// ─── PROMO BANNERS (For Home Page) ─────────────────────────────
export const fetchPromoBanners = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('promo_banners')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching promo banners:', error);
    return [];
  }
  return data || [];
};

// ─── ABOUT PAGE CONTENT ──────────────────────────────────────
export const fetchAboutPage = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('about_page_content')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching about page:', error);
    return [];
  }
  return data || [];
};

// ─── CONTACT PAGE CONTENT ────────────────────────────────────
export const fetchContactPage = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('contact_page_content')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching contact page:', error);
    return [];
  }
  return data || [];
};

// ─── CONTACT INFO ──────────────────────────────────────────────
export const fetchContactInfo = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching contact info:', error);
    return [];
  }
  return data || [];
};

// ─── FOOTER CONTENT ──────────────────────────────────────────
export const fetchFooterContact = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('footer_contact')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching footer contact:', error);
    return [];
  }
  return data || [];
};

export const fetchFooterLinks = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('footer_links')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching footer links:', error);
    return [];
  }
  return data || [];
};

export const fetchFooterSocial = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('footer_social')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching footer social:', error);
    return [];
  }
  return data || [];
};

// ─── COOPERATIVES PAGE CONTENT ─────────────────────────────────
export const fetchCooperativesPage = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('cooperatives_page_content')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching cooperatives page:', error);
    return [];
  }
  return data || [];
};

// ─── COOPERATIVES STATS ──────────────────────────────────────
export const fetchCooperativesStats = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('cooperatives_stats')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching cooperatives stats:', error);
    return [];
  }
  return data || [];
};

// ─── FOOTER NEWSLETTER ─────────────────────────────────────
export const fetchFooterNewsletter = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('footer_newsletter')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching footer newsletter:', error);
    return [];
  }
  return data || [];
};

// ─── SITE SETTINGS (Logo, Branding, etc.) ───────────────────
export const fetchSiteSettings = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching site settings:', error);
    return [];
  }
  return data || [];
};

// Helper to get a specific setting by key
export const getSiteSetting = (settings: any[], key: string, language: string = 'en'): string => {
  const setting = settings.find(s => s.key === key);
  if (!setting) return '';
  return language === 'ar' ? (setting.value_ar || setting.value_en) : (setting.value_en || setting.value_ar);
};

// ─── CATEGORIES SECTION ────────────────────────────────────
export const fetchCategoriesSection = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('categories_section')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching categories section:', error);
    return [];
  }
  return data || [];
};