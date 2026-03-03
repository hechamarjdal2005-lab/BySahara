import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon: React.ReactNode;
}

const IconDriedFruits = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <ellipse cx="22" cy="34" rx="9" ry="13" /><ellipse cx="42" cy="34" rx="9" ry="13" />
    <path d="M22 21 Q22 16 26 14" /><path d="M42 21 Q42 16 46 14" />
    <path d="M15 30 Q22 28 29 30" /><path d="M35 30 Q42 28 49 30" />
    <path d="M15 38 Q22 36 29 38" /><path d="M35 38 Q42 36 49 38" />
    <ellipse cx="22" cy="34" rx="2.5" ry="4" fill="currentColor" stroke="none" opacity="0.3"/>
    <ellipse cx="42" cy="34" rx="2.5" ry="4" fill="currentColor" stroke="none" opacity="0.3"/>
  </svg>
);
const IconSpices = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M16 38 Q14 52 32 52 Q50 52 48 38 Z" /><path d="M13 38 L51 38" />
    <path d="M38 20 L44 36" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="33" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="30" cy="31" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="36" cy="33" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M20 24 Q18 18 24 16 Q26 22 20 24Z" fill="currentColor" stroke="none" opacity="0.4"/>
    <path d="M20 24 Q22 20 24 16" />
  </svg>
);
const IconTea = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M14 30 L18 52 Q18 54 32 54 Q46 54 46 52 L50 30 Z" /><path d="M12 30 L52 30" />
    <path d="M50 36 Q58 36 58 42 Q58 48 50 46" />
    <path d="M24 22 Q26 16 24 10" strokeWidth="1.2"/><path d="M32 20 Q34 14 32 8" strokeWidth="1.2"/>
    <path d="M40 22 Q42 16 40 10" strokeWidth="1.2"/>
    <path d="M32 30 L32 38" strokeDasharray="2 2"/>
    <rect x="28" y="38" width="8" height="6" rx="1.5" fill="currentColor" stroke="none" opacity="0.3"/>
  </svg>
);
const IconEssentialOils = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M24 26 Q20 28 20 36 L20 48 Q20 52 32 52 Q44 52 44 48 L44 36 Q44 28 40 26 Z" />
    <rect x="27" y="18" width="10" height="10" rx="2" />
    <rect x="25" y="12" width="14" height="8" rx="3" fill="currentColor" stroke="none" opacity="0.25"/>
    <rect x="25" y="12" width="14" height="8" rx="3" />
    <path d="M21 40 Q32 37 43 40" />
    <rect x="23" y="30" width="18" height="10" rx="2" fill="currentColor" stroke="none" opacity="0.12"/>
  </svg>
);
const IconHoney = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M18 28 L18 50 Q18 54 32 54 Q46 54 46 50 L46 28 Z" />
    <path d="M14 28 Q14 22 32 22 Q50 22 50 28 Z" />
    <rect x="22" y="16" width="20" height="8" rx="3" fill="currentColor" stroke="none" opacity="0.2"/>
    <rect x="22" y="16" width="20" height="8" rx="3" />
    <path d="M32 22 L32 34 Q32 38 28 38 Q24 38 24 34" strokeWidth="3" strokeLinecap="round"/>
    <path d="M34 42 L37 40 L40 42 L40 46 L37 48 L34 46 Z" opacity="0.35" fill="currentColor" stroke="none"/>
    <path d="M24 44 L27 42 L30 44 L30 48 L27 50 L24 48 Z" opacity="0.35" fill="currentColor" stroke="none"/>
  </svg>
);
const IconOils = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M28 10 Q28 7 32 7 Q36 7 36 10 L38 20 Q44 24 44 34 L44 50 Q44 54 32 54 Q20 54 20 50 L20 34 Q20 24 26 20 Z" />
    <path d="M21 38 Q32 34 43 38" />
    <ellipse cx="32" cy="10" rx="5" ry="2.5" fill="currentColor" stroke="none" opacity="0.3"/>
    <path d="M12 20 Q16 14 20 16" />
    <ellipse cx="14" cy="16" rx="3" ry="2" transform="rotate(-30 14 16)" fill="currentColor" stroke="none" opacity="0.4"/>
    <ellipse cx="18" cy="14" rx="3" ry="2" transform="rotate(-10 18 14)" fill="currentColor" stroke="none" opacity="0.4"/>
  </svg>
);
const IconFlour = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M20 22 Q16 26 16 34 L16 50 Q16 54 32 54 Q48 54 48 50 L48 34 Q48 26 44 22 Z" />
    <path d="M24 22 Q28 16 32 18 Q36 16 40 22" /><path d="M30 18 Q32 12 34 18" />
    <path d="M22 34 Q32 30 42 34" /><path d="M20 42 Q32 38 44 42" />
    <circle cx="26" cy="46" r="1" fill="currentColor" stroke="none" opacity="0.4"/>
    <circle cx="32" cy="48" r="1" fill="currentColor" stroke="none" opacity="0.4"/>
    <circle cx="38" cy="46" r="1" fill="currentColor" stroke="none" opacity="0.4"/>
  </svg>
);
const IconBeauty = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <ellipse cx="32" cy="46" rx="18" ry="8" />
    <path d="M14 46 L14 40 Q14 36 32 36 Q50 36 50 40 L50 46" />
    <ellipse cx="32" cy="40" rx="18" ry="6" fill="currentColor" stroke="none" opacity="0.15"/>
    <ellipse cx="32" cy="40" rx="18" ry="6" />
    <path d="M32 36 L32 26" />
    <path d="M32 30 Q26 26 24 20 Q30 20 32 26" fill="currentColor" stroke="none" opacity="0.3"/>
    <path d="M32 28 Q38 24 40 18 Q34 18 32 24" fill="currentColor" stroke="none" opacity="0.3"/>
    <path d="M32 30 Q26 26 24 20" /><path d="M32 28 Q38 24 40 18" />
  </svg>
);

const categories: Category[] = [
  { id: "1", nameAr: "فواكه جافة",            nameEn: "Dried Fruits",        slug: "dried-fruits",   icon: <IconDriedFruits /> },
  { id: "2", nameAr: "توابل و بهارات",         nameEn: "Spices & Herbs",      slug: "spices",          icon: <IconSpices /> },
  { id: "3", nameAr: "شاي و أعشاب",            nameEn: "Teas & Herbs",        slug: "tea",             icon: <IconTea /> },
  { id: "4", nameAr: "مستخلصات وزيوت عطرية",   nameEn: "Essential Oils",      slug: "distilled-water", icon: <IconEssentialOils /> },
  { id: "5", nameAr: "عسل وأملو ومربى",        nameEn: "Honey, Amlou & Jams", slug: "honey",           icon: <IconHoney /> },
  { id: "6", nameAr: "زيوت غذائية",            nameEn: "Cooking Oils",        slug: "oils",            icon: <IconOils /> },
  { id: "7", nameAr: "دقيق و سميد",            nameEn: "Flour & Semolina",    slug: "flour",           icon: <IconFlour /> },
  { id: "8", nameAr: "صحة و جمال",             nameEn: "Health & Beauty",     slug: "beauty",          icon: <IconBeauty /> },
];

// ── Card — icon sans background ───────────────────────────────
const CategoryCard: React.FC<{ category: Category; language: string }> = ({ category, language }) => {
  const name = language === "ar" ? category.nameAr : category.nameEn;
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
      style={{ background: '#fff', border: '1.5px solid #F0E4CC', minHeight: '108px' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = '#FDF5E8';
        el.style.borderColor = '#CC8F57';
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 8px 20px rgba(204,143,87,0.16)';
        const icon = el.querySelector('.cat-icon') as HTMLElement;
        if (icon) icon.style.color = '#CC8F57';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = '#fff';
        el.style.borderColor = '#F0E4CC';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
        const icon = el.querySelector('.cat-icon') as HTMLElement;
        if (icon) icon.style.color = '#617131';
      }}
    >
      {/* Icon — no background wrapper */}
      <div className="cat-icon transition-colors duration-300" style={{ color: '#617131' }}>
        {category.icon}
      </div>
      <span className="text-xs text-center font-semibold leading-snug" style={{ color: '#455324' }}>
        {name}
      </span>
    </Link>
  );
};

// ── Section ───────────────────────────────────────────────────
const CategoriesSection: React.FC = () => {
  const { language } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const isRtl = language === "ar";

  const title       = isRtl ? "تصفح حسب الفئة" : "Browse by Category";
  const description = isRtl
    ? "اكتشف منتجاتنا المحلية الأصيلة المعتمدة من تعاونيات كلميم-واد نون"
    : "Discover authentic certified local products from Guelmim-Oued Noun cooperatives";

  const mobileVisible = showAll ? categories : categories.slice(0, 4);

  return (
    <section className="py-16" dir={isRtl ? "rtl" : "ltr"} style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* ── DESKTOP: 4 | center | 4 ── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat) => <CategoryCard key={cat.id} category={cat} language={language} />)}
          </div>

          <div className="lg:col-span-4 text-center px-2">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#CC8F57' }} />
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
            </div>
            <div className="flex justify-center mb-4">
              <img src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png" alt="By Sahara" className="h-14 object-contain" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight mb-2" style={{ color: '#455324' }}>{title}</h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#763C19' }}>{description}</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #455324, #617131)' }}
            >
              {isRtl ? "عرض الكل ←" : "View all →"}
            </Link>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#CC8F57' }} />
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {categories.slice(4, 8).map((cat) => <CategoryCard key={cat.id} category={cat} language={language} />)}
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-1" style={{ color: '#455324' }}>{title}</h2>
            <p className="text-xs leading-relaxed px-4" style={{ color: '#763C19' }}>{description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {mobileVisible.map((cat) => <CategoryCard key={cat.id} category={cat} language={language} />)}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200"
              style={{
                background: showAll ? '#F7E5CD' : 'linear-gradient(135deg, #455324, #617131)',
                color: showAll ? '#455324' : '#fff',
                border: showAll ? '1.5px solid #CC8F57' : 'none',
              }}
            >
              {showAll ? (isRtl ? "عرض أقل ↑" : "Show less ↑") : (isRtl ? "عرض المزيد ↓" : "Show more ↓")}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;