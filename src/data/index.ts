import { Product, Cooperative } from '../types';

export const cooperatives: Cooperative[] = [
  {
    id: 'coop-1',
    name: { en: 'Atlas Women Cooperative', ar: 'تعاونية نساء الأطلس' },
    region: 'guelmim-oued-noun',
    province: 'guelmim',
    location: { en: 'Guelmim', ar: 'كلميم' },
    image: 'https://images.unsplash.com/photo-1590412613626-4444634710f3?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Dedicated to producing high-quality Argan oil and empowering local women through sustainable employment.',
      ar: 'مكرسة لإنتاج زيت الأركان عالي الجودة وتمكين النساء المحليات من خلال التوظيف المستدام.',
    },
  },
  {
    id: 'coop-2',
    name: { en: 'Sahara Weavers', ar: 'نساجو الصحراء' },
    region: 'guelmim-oued-noun',
    province: 'tan-tan',
    location: { en: 'Tan-Tan', ar: 'طانطان' },
    image: 'https://images.unsplash.com/photo-1544211075-c99008940843?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Preserving the ancient art of Berber carpet weaving using traditional techniques and natural dyes.',
      ar: 'الحفاظ على الفن القديم لنسج السجاد البربري باستخدام التقنيات التقليدية والأصباغ الطبيعية.',
    },
  },
  {
    id: 'coop-3',
    name: { en: 'Oasis Dates', ar: 'تمور الواحة' },
    region: 'guelmim-oued-noun',
    province: 'assa-zag',
    location: { en: 'Assa-Zag', ar: 'أسا الزاك' },
    image: 'https://images.unsplash.com/photo-1603775020644-e08f68305c47?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Harvesting the finest Medjool dates from the palm groves of the region.',
      ar: 'حصد أجود تمور المجهول من بساتين النخيل في المنطقة.',
    },
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: { en: 'Pure Organic Argan Oil', ar: 'زيت أركان عضوي نقي' },
    price: 25.0,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=80&w=800',
    description: {
      en: '100% pure, cold-pressed Argan oil rich in Vitamin E and essential fatty acids.',
      ar: 'زيت أركان نقي 100٪، معصور على البارد وغني بفيتامين E.',
    },
    cooperativeId: 'coop-1',
    rating: 4.8,
  },
  {
    id: 'prod-2',
    name: { en: 'Handwoven Berber Rug', ar: 'سجادة بربرية منسوجة يدوياً' },
    price: 150.0,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Authentic wool rug featuring traditional geometric patterns.',
      ar: 'سجادة صوفية أصلية تتميز بأنماط هندسية تقليدية.',
    },
    cooperativeId: 'coop-2',
    rating: 5.0,
  },
  {
    id: 'prod-3',
    name: { en: 'Premium Medjool Dates', ar: 'تمور المجهول الفاخرة' },
    price: 18.0,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1575808142341-e39853744dbd?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Large, sweet dates known as the "King of Dates".',
      ar: 'تمور كبيرة وحلوة تُعرف باسم "ملك التمور".',
    },
    cooperativeId: 'coop-3',
    rating: 4.9,
  },
  {
    id: 'prod-4',
    name: { en: 'Moroccan Mint Tea Set', ar: 'طقم شاي بالنعناع المغربي' },
    price: 45.0,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1565462900100-36f272a9e99a?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Traditional silver-plated teapot with 6 glasses.',
      ar: 'إبريق شاي تقليدي مطلي بالفضة مع 6 أكواب.',
    },
    cooperativeId: 'coop-2',
    rating: 4.7,
  },
  {
    id: 'prod-5',
    name: { en: 'Saffron Spice (1g)', ar: 'زعفران (1 غرام)' },
    price: 12.0,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1598511726623-d219904a53a8?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Premium red gold saffron from the region.',
      ar: 'زعفران الذهب الأحمر الفاخر من المنطقة.',
    },
    cooperativeId: 'coop-3',
    rating: 4.6,
  },
  {
    id: 'prod-6',
    name: { en: 'Ceramic Tagine Pot', ar: 'طاجين خزفي' },
    price: 35.0,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    description: {
      en: 'Hand-painted ceramic tagine for slow-cooking traditional Moroccan stews.',
      ar: 'طاجين خزفي مرسوم يدوياً لطهي اليخنات المغربية.',
    },
    cooperativeId: 'coop-2',
    rating: 4.8,
  },
];