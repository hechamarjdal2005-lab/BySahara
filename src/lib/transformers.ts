// src/lib/transformers.ts

import { Cooperative, Product, BilingualText, VolumeOption } from '../types';

export const toBilingual = (en: string | null | undefined, ar: string | null | undefined): BilingualText => ({
  en: en || '',
  ar: ar || ''
});

export const mapVolume = (volume: any): VolumeOption => ({
  label: toBilingual(volume.label_en, volume.label_ar),
  value: Number(volume.value),
  unit: volume.unit,
  price: Number(volume.price)
});

export const mapCooperative = (row: any): Cooperative => ({
  id: row.id,
  name: toBilingual(row.name_en, row.name_ar),
  description: toBilingual(row.description_en, row.description_ar),
  shortDescription: toBilingual(row.short_description_en, row.short_description_ar),
  image: row.image,
  logo: row.logo,
  city: toBilingual(row.city_en, row.city_ar),
  province: toBilingual(row.province_en, row.province_ar),
  region: toBilingual(row.region_en, row.region_ar),
  address: toBilingual(row.address_en, row.address_ar),
  coordinates: row.latitude && row.longitude 
    ? { lat: Number(row.latitude), lng: Number(row.longitude) } 
    : undefined,
  phone: row.phone,
  email: row.email,
  website: row.website,
  foundedYear: row.founded_year ? Number(row.founded_year) : undefined,
  memberCount: row.member_count ? Number(row.member_count) : undefined,
  certifications: Array.isArray(row.certifications) ? row.certifications : [],
  categories: Array.isArray(row.categories) ? row.categories : []
});

export const mapProduct = (row: any): Product => {
  const volumes = row.volumes 
    ? (Array.isArray(row.volumes) ? row.volumes.map(mapVolume) : [])
    : [];

  return {
    id: row.id,
    name: toBilingual(row.name_en, row.name_ar),
    description: toBilingual(row.description_en, row.description_ar),
    price: Number(row.price),
    unit: toBilingual(row.unit_en, row.unit_ar),
    category: row.category,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
    cooperativeId: row.cooperative_id,
    rating: Number(row.rating),
    reviewCount: row.review_count ? Number(row.review_count) : undefined,
    stock: row.stock ? Number(row.stock) : undefined,
    isNew: row.is_new === true,
    isFeatured: row.is_featured === true,
    weight: row.weight,
    origin: toBilingual(row.origin_en, row.origin_ar),
    volumes: volumes.length > 0 ? volumes : undefined
  };
};