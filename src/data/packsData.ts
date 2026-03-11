// src/data/packsData.ts
import { Pack } from "../types";

export const MOCK_PACKS: Pack[] = [
  {
    id: "pack-001",
    cooperative_id: "coop-nour-sahara",
    cooperative_name: "Nour Sahara Cooperative",
    name: "Argan Beauty Duo",
    name_ar: "ثنائي الأرغان",
    description: "Pure Argan Oil 50ml + Argan Shampoo FREE",
    description_ar: "زيت الأرغان النقي 50مل + شامبو الأرغان مجاناً",
    image_url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
    items: [
      { product_id: "prod-argan-oil",     product_name: "Organic Argan Oil", quantity: 1, unit: "50ml",  is_free: false, original_price: 150, pack_price: 150 },
      { product_id: "prod-argan-shampoo", product_name: "Argan Shampoo",     quantity: 1, unit: "200ml", is_free: true,  original_price: 80,  pack_price: 0   },
    ],
    total_original_price: 230,
    pack_price: 150,
    savings: 80,
    badge: "Best Value",
    badge_ar: "أفضل قيمة",
    is_active: true,
    stock: 3,
  },
  {
    id: "pack-002",
    cooperative_id: "coop-nour-sahara",
    cooperative_name: "Nour Sahara Cooperative",
    name: "Full Argan Kit",
    name_ar: "طقم الأرغان الكامل",
    description: "Argan Oil 100ml + Argan Soap + Rose Water FREE",
    description_ar: "زيت أرغان 100مل + صابون أرغان + ماء الورد مجاناً",
    image_url: "https://images.unsplash.com/photo-1585178819718-5b8f40f3a8d7?w=600&q=80",
    items: [
      { product_id: "prod-argan-oil-100", product_name: "Argan Oil",   quantity: 1, unit: "100ml", is_free: false, original_price: 280, pack_price: 280 },
      { product_id: "prod-argan-soap",    product_name: "Argan Soap",  quantity: 1, unit: "100g",  is_free: false, original_price: 45,  pack_price: 20  },
      { product_id: "prod-rose-water",    product_name: "Rose Water",  quantity: 1, unit: "100ml", is_free: true,  original_price: 60,  pack_price: 0   },
    ],
    total_original_price: 385,
    pack_price: 300,
    savings: 85,
    badge: "New",
    badge_ar: "جديد",
    is_active: true,
    stock: 8,
  },
  {
    id: "pack-003",
    cooperative_id: "coop-al-amal",
    cooperative_name: "Cooperative Al Amal",
    name: "Honey Lovers Pack",
    name_ar: "عرض محبي العسل",
    description: "Saharan Honey 250g + Honey Soap FREE",
    description_ar: "عسل صحراوي 250غ + صابون العسل مجاناً",
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    items: [
      { product_id: "prod-honey-250",  product_name: "Saharan Honey", quantity: 1, unit: "250g", is_free: false, original_price: 180, pack_price: 180 },
      { product_id: "prod-honey-soap", product_name: "Honey Soap",    quantity: 1, unit: "80g",  is_free: true,  original_price: 35,  pack_price: 0   },
    ],
    total_original_price: 215,
    pack_price: 180,
    savings: 35,
    badge: "Limited",
    badge_ar: "محدود",
    is_active: true,
    stock: 20,
  },
  {
    id: "pack-004",
    cooperative_id: "coop-ocean",
    cooperative_name: "Cooperative Ocean",
    name: "Natural Henna Set",
    name_ar: "طقم الحناء الطبيعية",
    description: "Natural Henna 100g + Henna Cones FREE",
    description_ar: "حناء طبيعية 100غ + مخروط حناء مجاناً",
    image_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    items: [
      { product_id: "prod-henna-100",  product_name: "Natural Henna", quantity: 1, unit: "100g", is_free: false, original_price: 40, pack_price: 40 },
      { product_id: "prod-henna-cone", product_name: "Henna Cone x2", quantity: 2,               is_free: true,  original_price: 30, pack_price: 0  },
    ],
    total_original_price: 70,
    pack_price: 40,
    savings: 30,
    badge: "Best Value",
    badge_ar: "أفضل قيمة",
    is_active: true,
    stock: 25,
  },
];

export const getPacksByCooperative = (cooperativeId: string): Pack[] =>
  MOCK_PACKS.filter((p) => p.cooperative_id === cooperativeId && p.is_active);

export const getAllActivePacks = (): Pack[] =>
  MOCK_PACKS.filter((p) => p.is_active);