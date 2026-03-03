import { Product, Cooperative, Category } from '../types';

// ============================================
// CATEGORIES
// ============================================
export const categories: Category[] = [
  { id: 'honey',          name: { en: 'Honey & Jams',                    ar: 'عسل وأملو ومربى'           }, icon: '🍯' },
  { id: 'oils',           name: { en: 'Edible Oils',                     ar: 'زيوت غذائية'               }, icon: '🫒' },
  { id: 'flour',          name: { en: 'Flour & Semolina',                ar: 'دقيق و سميد'               }, icon: '🌾' },
  { id: 'tea',            name: { en: 'Tea & Herbs',                     ar: 'شاي و أعشاب'               }, icon: '🍵' },
  { id: 'spices',         name: { en: 'Spices & Condiments',             ar: 'توابل و بهارات'             }, icon: '🌶️' },
  { id: 'dried-fruits',   name: { en: 'Dried Fruits',                    ar: 'فواكه جافة'                }, icon: '🫘' },
  { id: 'distilled-water',name: { en: 'Distilled Waters & Essential Oils',ar: 'مياه مقطرة وزيوت عطرية'  }, icon: '💧' },
  { id: 'beauty',         name: { en: 'Health & Beauty',                 ar: 'صحة وجمال'                 }, icon: '✨' },
];

// ============================================
// COOPERATIVES
// ============================================
export const cooperatives: Cooperative[] = [
  {
    id: 'coop-1',
    name: { en: 'Atlas Women Cooperative', ar: 'تعاونية نساء الأطلس' },
    shortDescription: { en: 'Empowering women through Argan oil production', ar: 'تمكين المرأة من خلال إنتاج زيت الأركان' },
    description: {
      en: 'Dedicated to producing high-quality Argan oil and empowering local women through sustainable employment. Founded in 2005, this cooperative has grown to include over 40 women from the Guelmim region.',
      ar: 'مكرسة لإنتاج زيت الأركان عالي الجودة وتمكين النساء المحليات من خلال التوظيف المستدام. تأسست عام 2005 وتضم أكثر من 40 امرأة من منطقة كلميم.',
    },
    image: 'https://images.unsplash.com/photo-1590412613626-4444634710f3?auto=format&fit=crop&q=80&w=800',
    city: { en: 'Guelmim', ar: 'كلميم' },
    province: { en: 'Guelmim Province', ar: 'إقليم كلميم' },
    region: { en: 'Guelmim-Oued Noun', ar: 'كلميم-واد نون' },
    coordinates: { lat: 28.9864, lng: -10.0572 },
    phone: '+212 528 870 000',
    foundedYear: 2005,
    memberCount: 42,
    certifications: ['Bio', 'Fair Trade'],
    categories: ['oils', 'beauty'],
  },
  {
    id: 'coop-2',
    name: { en: 'Sahara Natural Products', ar: 'تعاونية منتجات الصحراء الطبيعية' },
    shortDescription: { en: 'Traditional herbs, teas & spices from the south', ar: 'أعشاب وشاي وتوابل تقليدية من الجنوب' },
    description: {
      en: 'A cooperative specializing in the collection and processing of medicinal herbs, aromatic teas, and traditional spices native to the Souss-Massa and Guelmim regions.',
      ar: 'تعاونية متخصصة في جمع ومعالجة الأعشاب الطبية والشاي العطري والتوابل التقليدية الأصيلة في منطقتي سوس ماسة وكلميم.',
    },
    image: 'https://images.unsplash.com/photo-1544211075-c99008940843?auto=format&fit=crop&q=80&w=800',
    city: { en: 'Tan-Tan', ar: 'طانطان' },
    province: { en: 'Tan-Tan Province', ar: 'إقليم طانطان' },
    region: { en: 'Guelmim-Oued Noun', ar: 'كلميم-واد نون' },
    coordinates: { lat: 28.4379, lng: -11.1033 },
    phone: '+212 528 870 111',
    foundedYear: 2010,
    memberCount: 28,
    certifications: ['Bio'],
    categories: ['tea', 'spices', 'distilled-water'],
  },
  {
    id: 'coop-3',
    name: { en: 'Oasis Dates & Honey', ar: 'تعاونية تمور وعسل الواحة' },
    shortDescription: { en: 'Premium dates & wild honey from Assa-Zag oases', ar: 'تمور وعسل بري فاخر من واحات أسا الزاك' },
    description: {
      en: 'Harvesting the finest Medjool dates from the palm groves of Assa-Zag and sourcing pure wild honey from local beekeepers.',
      ar: 'حصد أجود تمور المجهول من بساتين النخيل في أسا الزاك وتوفير عسل بري نقي من مربي النحل المحليين.',
    },
    image: 'https://images.unsplash.com/photo-1603775020644-e08f68305c47?auto=format&fit=crop&q=80&w=800',
    city: { en: 'Assa', ar: 'أسا' },
    province: { en: 'Assa-Zag Province', ar: 'إقليم أسا الزاك' },
    region: { en: 'Guelmim-Oued Noun', ar: 'كلميم-واد نون' },
    coordinates: { lat: 28.6073, lng: -9.4280 },
    phone: '+212 528 870 222',
    foundedYear: 2008,
    memberCount: 35,
    certifications: ['Bio', 'Fair Trade'],
    categories: ['honey', 'dried-fruits'],
  },
  {
    id: 'coop-4',
    name: { en: 'Tighmert Flour Mill Cooperative', ar: 'تعاونية طاحونة تيغمرت' },
    shortDescription: { en: 'Stone-ground barley flour & couscous from Tighmert', ar: 'دقيق الشعير والكسكس المطحون بالحجر من تيغمرت' },
    description: {
      en: 'Using ancient stone-grinding techniques passed down through generations, this cooperative produces premium whole-grain barley flour, fine semolina, and handmade couscous.',
      ar: 'باستخدام تقنيات الطحن بالحجر القديمة المتوارثة عبر الأجيال، تنتج هذه التعاونية دقيق الشعير الكامل الفاخر والسميد الناعم والكسكس اليدوي.',
    },
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    city: { en: 'Tighmert', ar: 'تيغمرت' },
    province: { en: 'Guelmim Province', ar: 'إقليم كلميم' },
    region: { en: 'Guelmim-Oued Noun', ar: 'كلميم-واد نون' },
    coordinates: { lat: 29.1020, lng: -10.1540 },
    foundedYear: 2015,
    memberCount: 20,
    categories: ['flour'],
  },
];

// ============================================
// PRODUCTS
// ============================================
export const products: Product[] = [

  // ── HONEY & JAMS ──────────────────────────────────────────────
  {
    id: 'prod-1',
    name: { en: 'Wild Sidr Honey', ar: 'عسل السدر البري' },
    description: {
      en: 'Raw, unfiltered wild Sidr honey harvested from the acacia and jujube trees of the Assa-Zag valley. Rich in antioxidants and renowned for its therapeutic properties.',
      ar: 'عسل السدر البري الخام غير المصفى، يُجمع من أشجار الأكاسيا والسدر في وادي أسا الزاك. غني بمضادات الأكسدة ومعروف بخصائصه العلاجية.',
    },
    price: 45,
    unit: { en: '250g jar', ar: 'برطمان 250غ' },
    category: 'honey',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-3',
    rating: 4.9,
    reviewCount: 124,
    isFeatured: true,
    origin: { en: 'Assa-Zag', ar: 'أسا الزاك' },
    volumes: [
      { label: { en: '250g', ar: '250غ' },  value: 250,  unit: 'g', price: 45  },
      { label: { en: '500g', ar: '500غ' },  value: 500,  unit: 'g', price: 85  },
      { label: { en: '1kg',  ar: '1كغ'  },  value: 1000, unit: 'g', price: 160 },
    ],
  },
  {
    id: 'prod-2',
    name: { en: 'Amlou – Argan Almond Spread', ar: 'أملو – مربى الأركان واللوز' },
    description: {
      en: 'Traditional Berber spread made from roasted almonds, pure argan oil, and raw honey. A breakfast staple of southern Morocco.',
      ar: 'مربى بربري تقليدي مصنوع من اللوز المحمص وزيت الأركان النقي والعسل الخام. من أساسيات فطور جنوب المغرب.',
    },
    price: 45,
    unit: { en: '300g jar', ar: 'برطمان 300غ' },
    category: 'honey',
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-1',
    rating: 4.8,
    reviewCount: 89,
    isFeatured: true,
    origin: { en: 'Guelmim', ar: 'كلميم' },
    volumes: [
      { label: { en: '300g', ar: '300غ' },  value: 300,  unit: 'g', price: 45  },
      { label: { en: '600g', ar: '600غ' },  value: 600,  unit: 'g', price: 80  },
      { label: { en: '1kg',  ar: '1كغ'  },  value: 1000, unit: 'g', price: 130 },
      { label: { en: '2kg',  ar: '2كغ'  },  value: 2000, unit: 'g', price: 250 },
    ],
  },

  // ── OILS ──────────────────────────────────────────────────────
  {
    id: 'prod-3',
    name: { en: 'Culinary Argan Oil', ar: 'زيت أركان للطهي' },
    description: {
      en: 'Toasted argan oil with a rich, nutty flavor. Cold-pressed from hand-cracked argan kernels. Ideal for salads, couscous, and dipping.',
      ar: 'زيت أركان محمص بنكهة غنية وجوزية. معصور على البارد من نواة الأركان المفتوحة يدوياً. مثالي للسلطات والكسكس.',
    },
    price: 55,
    unit: { en: '250ml bottle', ar: 'زجاجة 250مل' },
    category: 'oils',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-1',
    rating: 4.9,
    reviewCount: 201,
    isFeatured: true,
    origin: { en: 'Guelmim', ar: 'كلميم' },
    volumes: [
      { label: { en: '250ml', ar: '250مل' }, value: 250,  unit: 'ml', price: 55  },
      { label: { en: '500ml', ar: '500مل' }, value: 500,  unit: 'ml', price: 100 },
      { label: { en: '1L',    ar: '1ل'    }, value: 1000, unit: 'ml', price: 190 },
    ],
  },
  {
    id: 'prod-4',
    name: { en: 'Black Seed Oil (Nigella)', ar: 'زيت الحبة السوداء' },
    description: {
      en: 'Cold-pressed Nigella sativa oil, traditionally used for immunity, digestion, and overall wellness. 100% natural, no additives.',
      ar: 'زيت حبة البركة المعصور على البارد، يُستخدم تقليدياً لتعزيز المناعة والهضم والصحة العامة. طبيعي 100% بدون إضافات.',
    },
    price: 40,
    unit: { en: '200ml bottle', ar: 'زجاجة 200مل' },
    category: 'oils',
    image: 'https://images.unsplash.com/photo-1607290439763-2f2ba9e17a36?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-2',
    rating: 4.7,
    reviewCount: 67,
    origin: { en: 'Tan-Tan', ar: 'طانطان' },
    volumes: [
      { label: { en: '200ml', ar: '200مل' }, value: 200,  unit: 'ml', price: 40  },
      { label: { en: '500ml', ar: '500مل' }, value: 500,  unit: 'ml', price: 90  },
      { label: { en: '1L',    ar: '1ل'    }, value: 1000, unit: 'ml', price: 170 },
    ],
  },

  // ── FLOUR ─────────────────────────────────────────────────────
  {
    id: 'prod-5',
    name: { en: 'Stone-Ground Barley Flour', ar: 'دقيق الشعير المطحون بالحجر' },
    description: {
      en: 'Whole-grain barley flour stone-ground using traditional millstones. Rich in fiber and minerals. Perfect for Moroccan bread (khobz) and harira.',
      ar: 'دقيق الشعير الكامل المطحون بحجر الطاحونة التقليدي. غني بالألياف والمعادن. مثالي للخبز المغربي والحريرة.',
    },
    price: 18,
    unit: { en: '1kg bag', ar: 'كيس 1كغ' },
    category: 'flour',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-4',
    rating: 4.6,
    reviewCount: 43,
    origin: { en: 'Tighmert', ar: 'تيغمرت' },
    volumes: [
      { label: { en: '1kg',  ar: '1كغ'  }, value: 1,  unit: 'kg', price: 18  },
      { label: { en: '2kg',  ar: '2كغ'  }, value: 2,  unit: 'kg', price: 34  },
      { label: { en: '5kg',  ar: '5كغ'  }, value: 5,  unit: 'kg', price: 80  },
      { label: { en: '10kg', ar: '10كغ' }, value: 10, unit: 'kg', price: 150 },
    ],
  },
  {
    id: 'prod-6',
    name: { en: 'Fine Semolina (Semoule)', ar: 'سميد ناعم' },
    description: {
      en: 'Fine durum wheat semolina, stone-ground and sifted. Perfect for couscous, harcha, and traditional Moroccan pastries.',
      ar: 'سميد القمح الصلب الناعم، مطحون بالحجر ومنخول. مثالي للكسكس والحرشة والمعجنات المغربية التقليدية.',
    },
    price: 15,
    unit: { en: '1kg bag', ar: 'كيس 1كغ' },
    category: 'flour',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-4',
    rating: 4.5,
    reviewCount: 38,
    origin: { en: 'Tighmert', ar: 'تيغمرت' },
    volumes: [
      { label: { en: '1kg',  ar: '1كغ'  }, value: 1,  unit: 'kg', price: 15  },
      { label: { en: '2kg',  ar: '2كغ'  }, value: 2,  unit: 'kg', price: 28  },
      { label: { en: '5kg',  ar: '5كغ'  }, value: 5,  unit: 'kg', price: 65  },
      { label: { en: '10kg', ar: '10كغ' }, value: 10, unit: 'kg', price: 120 },
    ],
  },

  // ── TEA & HERBS ───────────────────────────────────────────────
  {
    id: 'prod-7',
    name: { en: 'Desert Thyme (Zaatar)', ar: 'زعتر الصحراء' },
    description: {
      en: 'Wild-harvested desert thyme from the rocky plains of Tan-Tan. Intensely aromatic with a robust, earthy flavor.',
      ar: 'زعتر صحراوي يُجمع من البراري الصخرية لطانطان. عطر قوي ونكهة ترابية.',
    },
    price: 12,
    unit: { en: '100g bag', ar: 'كيس 100غ' },
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-2',
    rating: 4.7,
    reviewCount: 55,
    origin: { en: 'Tan-Tan', ar: 'طانطان' },
    volumes: [
      { label: { en: '100g', ar: '100غ' }, value: 100, unit: 'g', price: 12 },
      { label: { en: '250g', ar: '250غ' }, value: 250, unit: 'g', price: 28 },
      { label: { en: '500g', ar: '500غ' }, value: 500, unit: 'g', price: 50 },
    ],
  },
  {
    id: 'prod-8',
    name: { en: 'Saharan Mint Tea Blend', ar: 'مزيج شاي النعناع الصحراوي' },
    description: {
      en: 'A traditional blend of Moroccan green tea leaves with sun-dried spearmint from the Saharan gardens.',
      ar: 'مزيج تقليدي من أوراق الشاي الأخضر المغربي مع النعناع المجفف في الشمس من حدائق الصحراء.',
    },
    price: 22,
    unit: { en: '150g tin', ar: 'علبة 150غ' },
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-2',
    rating: 4.8,
    reviewCount: 112,
    isFeatured: true,
    origin: { en: 'Tan-Tan', ar: 'طانطان' },
    volumes: [
      { label: { en: '150g', ar: '150غ' }, value: 150, unit: 'g', price: 22 },
      { label: { en: '300g', ar: '300غ' }, value: 300, unit: 'g', price: 40 },
      { label: { en: '500g', ar: '500غ' }, value: 500, unit: 'g', price: 65 },
    ],
  },

  // ── SPICES ────────────────────────────────────────────────────
  {
    id: 'prod-9',
    name: { en: 'Ras El Hanout Blend', ar: 'مزيج رأس الحانوت' },
    description: {
      en: 'A signature blend of over 20 hand-selected spices including cumin, coriander, cinnamon, and rose petals. The soul of Moroccan cuisine.',
      ar: 'مزيج مميز من أكثر من 20 توابل مختارة يدوياً تشمل الكمون والكزبرة والقرفة وبتلات الورد.',
    },
    price: 16,
    unit: { en: '80g bag', ar: 'كيس 80غ' },
    category: 'spices',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-2',
    rating: 4.9,
    reviewCount: 178,
    isFeatured: true,
    origin: { en: 'Tan-Tan', ar: 'طانطان' },
    volumes: [
      { label: { en: '80g',  ar: '80غ'  }, value: 80,  unit: 'g', price: 16 },
      { label: { en: '200g', ar: '200غ' }, value: 200, unit: 'g', price: 35 },
      { label: { en: '500g', ar: '500غ' }, value: 500, unit: 'g', price: 80 },
    ],
  },
  {
    id: 'prod-10',
    name: { en: 'Cumin Seeds', ar: 'بذور الكمون' },
    description: {
      en: 'Sun-dried whole cumin seeds with a warm, earthy aroma. A cornerstone of Moroccan cooking, harvested locally.',
      ar: 'بذور الكمون الكاملة المجففة في الشمس برائحة دافئة وترابية. ركيزة أساسية في الطبخ المغربي.',
    },
    price: 8,
    unit: { en: '100g bag', ar: 'كيس 100غ' },
    category: 'spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-2',
    rating: 4.6,
    reviewCount: 44,
    origin: { en: 'Tan-Tan', ar: 'طانطان' },
    volumes: [
      { label: { en: '100g', ar: '100غ' }, value: 100, unit: 'g', price: 8  },
      { label: { en: '250g', ar: '250غ' }, value: 250, unit: 'g', price: 18 },
      { label: { en: '500g', ar: '500غ' }, value: 500, unit: 'g', price: 32 },
    ],
  },

  // ── DRIED FRUITS ──────────────────────────────────────────────
  {
    id: 'prod-11',
    name: { en: 'Premium Medjool Dates', ar: 'تمور المجهول الفاخرة' },
    description: {
      en: 'Large, soft, caramel-sweet Medjool dates harvested from the palm groves of Assa-Zag. Naturally sun-dried, no preservatives.',
      ar: 'تمور المجهول الكبيرة الطرية ذات الطعم الكراميلي من بساتين النخيل في أسا الزاك.',
    },
    price: 32,
    unit: { en: '500g box', ar: 'علبة 500غ' },
    category: 'dried-fruits',
    image: 'https://images.unsplash.com/photo-1575808142341-e39853744dbd?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-3',
    rating: 4.9,
    reviewCount: 203,
    isFeatured: true,
    origin: { en: 'Assa-Zag', ar: 'أسا الزاك' },
    volumes: [
      { label: { en: '500g', ar: '500غ' }, value: 500,  unit: 'g', price: 32  },
      { label: { en: '1kg',  ar: '1كغ'  }, value: 1000, unit: 'g', price: 60  },
      { label: { en: '2kg',  ar: '2كغ'  }, value: 2000, unit: 'g', price: 115 },
      { label: { en: '5kg',  ar: '5كغ'  }, value: 5000, unit: 'g', price: 280 },
    ],
  },
  {
    id: 'prod-12',
    name: { en: 'Roasted Argan Almonds', ar: 'لوز الأركان المحمص' },
    description: {
      en: 'Wild almonds roasted with a touch of argan oil and sea salt. A crunchy, nutritious snack native to the argan forest belt.',
      ar: 'لوز بري محمص مع لمسة من زيت الأركان وملح البحر. وجبة خفيفة مقرمشة ومغذية.',
    },
    price: 28,
    unit: { en: '200g bag', ar: 'كيس 200غ' },
    category: 'dried-fruits',
    image: 'https://images.unsplash.com/photo-1574184864703-3487b13f0edd?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-1',
    rating: 4.7,
    reviewCount: 66,
    origin: { en: 'Guelmim', ar: 'كلميم' },
    volumes: [
      { label: { en: '200g', ar: '200غ' }, value: 200,  unit: 'g', price: 28  },
      { label: { en: '500g', ar: '500غ' }, value: 500,  unit: 'g', price: 65  },
      { label: { en: '1kg',  ar: '1كغ'  }, value: 1000, unit: 'g', price: 120 },
    ],
  },

  // ── DISTILLED WATERS & ESSENTIAL OILS ─────────────────────────
  {
    id: 'prod-13',
    name: { en: 'Rose Water (Floral Water)', ar: 'ماء الورد' },
    description: {
      en: 'Steam-distilled rose floral water from locally cultivated Damask roses. Used in cooking, skincare, and Moroccan pastry.',
      ar: 'ماء الورد المقطر بالبخار من ورود الدمشق المزروعة محلياً. يُستخدم في الطبخ والعناية بالبشرة والحلويات.',
    },
    price: 18,
    unit: { en: '200ml bottle', ar: 'زجاجة 200مل' },
    category: 'distilled-water',
    image: 'https://images.unsplash.com/photo-1547793549-70fbd13f8e76?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-2',
    rating: 4.7,
    reviewCount: 88,
    origin: { en: 'Tan-Tan', ar: 'طانطان' },
    volumes: [
      { label: { en: '100ml', ar: '100مل' }, value: 100, unit: 'ml', price: 10 },
      { label: { en: '200ml', ar: '200مل' }, value: 200, unit: 'ml', price: 18 },
      { label: { en: '500ml', ar: '500مل' }, value: 500, unit: 'ml', price: 40 },
      { label: { en: '1L',    ar: '1ل'    }, value: 1000,unit: 'ml', price: 75 },
    ],
  },
  {
    id: 'prod-14',
    name: { en: 'Orange Blossom Water', ar: 'ماء زهر البرتقال' },
    description: {
      en: 'Pure orange blossom distillate, hand-harvested in spring. A staple in Moroccan sweets, mint tea, and facial toning.',
      ar: 'مقطر زهر البرتقال النقي، مجموع يدوياً في الربيع. أساسي في الحلويات المغربية وشاي النعناع وتونر البشرة.',
    },
    price: 18,
    unit: { en: '200ml bottle', ar: 'زجاجة 200مل' },
    category: 'distilled-water',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-2',
    rating: 4.8,
    reviewCount: 72,
    origin: { en: 'Tan-Tan', ar: 'طانطان' },
    volumes: [
      { label: { en: '100ml', ar: '100مل' }, value: 100, unit: 'ml', price: 10 },
      { label: { en: '200ml', ar: '200مل' }, value: 200, unit: 'ml', price: 18 },
      { label: { en: '500ml', ar: '500مل' }, value: 500, unit: 'ml', price: 40 },
      { label: { en: '1L',    ar: '1ل'    }, value: 1000,unit: 'ml', price: 75 },
    ],
  },

  // ── BEAUTY ────────────────────────────────────────────────────
  {
    id: 'prod-15',
    name: { en: 'Cosmetic Argan Oil', ar: 'زيت أركان تجميلي' },
    description: {
      en: '100% pure cold-pressed cosmetic argan oil, rich in Vitamin E and omega fatty acids. Anti-aging, deeply moisturizing for face, hair, and nails.',
      ar: 'زيت أركان تجميلي نقي 100% معصور على البارد، غني بفيتامين E وأحماض أوميغا الدهنية.',
    },
    price: 65,
    unit: { en: '30ml bottle', ar: 'زجاجة 30مل' },
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-1',
    rating: 4.9,
    reviewCount: 315,
    isFeatured: true,
    origin: { en: 'Guelmim', ar: 'كلميم' },
    volumes: [
      { label: { en: '30ml',  ar: '30مل'  }, value: 30,  unit: 'ml', price: 65  },
      { label: { en: '60ml',  ar: '60مل'  }, value: 60,  unit: 'ml', price: 120 },
      { label: { en: '100ml', ar: '100مل' }, value: 100, unit: 'ml', price: 190 },
    ],
  },
  {
    id: 'prod-16',
    name: { en: 'Black Soap (Beldi Soap)', ar: 'صابون بلدي أسود' },
    description: {
      en: 'Traditional Moroccan black soap made from olive oil and eucalyptus. Used in hammam rituals to deeply cleanse and exfoliate the skin.',
      ar: 'صابون مغربي أسود تقليدي مصنوع من زيت الزيتون والكافور. يُستخدم في طقوس الحمام للتنظيف العميق وتقشير البشرة.',
    },
    price: 22,
    unit: { en: '200g tub', ar: 'علبة 200غ' },
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800',
    cooperativeId: 'coop-1',
    rating: 4.6,
    reviewCount: 98,
    isNew: true,
    origin: { en: 'Guelmim', ar: 'كلميم' },
    volumes: [
      { label: { en: '200g', ar: '200غ' }, value: 200,  unit: 'g', price: 22  },
      { label: { en: '500g', ar: '500غ' }, value: 500,  unit: 'g', price: 50  },
      { label: { en: '1kg',  ar: '1كغ'  }, value: 1000, unit: 'g', price: 95  },
    ],
  },
];

// ============================================
// HELPERS
// ============================================
export const getProductsByCategory  = (categoryId: string) => products.filter((p) => p.category === categoryId);
export const getProductsByCooperative = (cooperativeId: string) => products.filter((p) => p.cooperativeId === cooperativeId);
export const getCooperativeById     = (id: string) => cooperatives.find((c) => c.id === id);
export const getProductById         = (id: string) => products.find((p) => p.id === id);
export const getFeaturedProducts    = () => products.filter((p) => p.isFeatured);