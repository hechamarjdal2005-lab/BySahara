import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchCategories, fetchCategoriesSection } from '../data';
import { Category } from '../types';

// ─── ICONS — thin outline, minimal style ─────────────────────

const IconDriedFruits = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <ellipse cx="32" cy="38" rx="10" ry="14" />
    <path d="M32 24 Q32 18 36 16" />
    <path d="M22 34 Q32 31 42 34" />
    <path d="M22 41 Q32 38 42 41" />
    <ellipse cx="32" cy="38" rx="3" ry="5" fill="currentColor" stroke="none" opacity="0.18" />
  </svg>
);

const IconSpices = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M16 42 Q14 56 32 56 Q50 56 48 42 Z" />
    <path d="M13 42 L51 42" />
    <path d="M36 24 L42 40" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M21 28 Q18 20 24 18 Q26 24 21 28Z" fill="currentColor" stroke="none" opacity="0.3" />
    <path d="M21 28 Q23 22 24 18" />
  </svg>
);

const IconTea = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M14 32 L18 54 Q18 56 32 56 Q46 56 46 54 L50 32 Z" />
    <path d="M12 32 L52 32" />
    <path d="M50 38 Q59 38 59 45 Q59 52 50 50" />
    <path d="M24 24 Q26 18 24 12" strokeWidth="1.2" />
    <path d="M32 22 Q34 16 32 10" strokeWidth="1.2" />
    <path d="M40 24 Q42 18 40 12" strokeWidth="1.2" />
  </svg>
);

const IconEssentialOils = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M26 28 Q21 30 21 40 L21 52 Q21 56 32 56 Q43 56 43 52 L43 40 Q43 30 38 28 Z" />
    <rect x="27" y="18" width="10" height="12" rx="2.5" />
    <rect x="26" y="12" width="12" height="8" rx="3" fill="currentColor" stroke="none" opacity="0.18" />
    <rect x="26" y="12" width="12" height="8" rx="3" />
    <path d="M22 42 Q32 39 42 42" />
  </svg>
);

const IconHoney = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M19 32 L19 52 Q19 56 32 56 Q45 56 45 52 L45 32 Z" />
    <path d="M15 32 Q15 26 32 26 Q49 26 49 32 Z" />
    <rect x="23" y="18" width="18" height="10" rx="3.5" />
    <path d="M32 26 L32 38 Q32 42 28 42 Q24 42 24 38" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M36 46 L38 44 L41 44 L42 46 L41 48 L38 48 Z" opacity="0.3" fill="currentColor" stroke="none" />
    <path d="M23 44 L25 42 L28 42 L29 44 L28 46 L25 46 Z" opacity="0.3" fill="currentColor" stroke="none" />
  </svg>
);

const IconOils = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M28 12 Q28 8 32 8 Q36 8 36 12 L38 22 Q44 26 44 36 L44 52 Q44 56 32 56 Q20 56 20 52 L20 36 Q20 26 26 22 Z" />
    <path d="M21 40 Q32 37 43 40" />
    <ellipse cx="32" cy="12" rx="5" ry="2.5" fill="currentColor" stroke="none" opacity="0.22" />
    <path d="M13 22 Q17 16 21 18" strokeWidth="1.2" />
    <ellipse cx="14" cy="18" rx="3.5" ry="2" transform="rotate(-30 14 18)" fill="currentColor" stroke="none" opacity="0.35" />
    <ellipse cx="19" cy="15" rx="3.5" ry="2" transform="rotate(-15 19 15)" fill="currentColor" stroke="none" opacity="0.35" />
  </svg>
);

const IconFlour = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <path d="M21 26 Q17 30 17 38 L17 52 Q17 56 32 56 Q47 56 47 52 L47 38 Q47 30 43 26 Z" />
    <path d="M25 26 Q29 18 32 20 Q35 18 39 26" />
    <path d="M30 20 Q32 14 34 20" />
    <path d="M20 38 Q32 35 44 38" />
    <path d="M19 46 Q32 43 45 46" />
    <circle cx="27" cy="50" r="1.2" fill="currentColor" stroke="none" opacity="0.35" />
    <circle cx="32" cy="52" r="1.2" fill="currentColor" stroke="none" opacity="0.35" />
    <circle cx="37" cy="50" r="1.2" fill="currentColor" stroke="none" opacity="0.35" />
  </svg>
);

const IconBeauty = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    <ellipse cx="32" cy="50" rx="18" ry="8" />
    <path d="M14 50 L14 44 Q14 40 32 40 Q50 40 50 44 L50 50" />
    <ellipse cx="32" cy="44" rx="18" ry="6" fill="currentColor" stroke="none" opacity="0.12" />
    <ellipse cx="32" cy="44" rx="18" ry="6" />
    <path d="M32 40 L32 30" />
    <path d="M32 34 Q26 30 25 24 Q31 24 32 30" fill="currentColor" stroke="none" opacity="0.28" />
    <path d="M32 32 Q38 28 40 22 Q34 22 32 28" fill="currentColor" stroke="none" opacity="0.28" />
    <path d="M32 34 Q26 30 25 24" />
    <path d="M32 32 Q38 28 40 22" />
  </svg>
);

// ─── NEW: Clothing & Accessories Icon ────────────────────────
const IconClothing = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
    {/* hanger hook */}
    <path d="M32 10 Q32 7 35 7 Q39 7 39 11 Q39 14 32 19" />
    {/* djellaba / robe silhouette */}
    <path d="M32 19 L18 28 L22 35 L26 32 L26 56 L38 56 L38 32 L42 35 L46 28 Z" />
    {/* subtle embroidery hint on chest */}
    <path d="M29 36 Q32 34 35 36" strokeWidth="1" opacity="0.5" />
    <path d="M30 39 Q32 37.5 34 39" strokeWidth="1" opacity="0.5" />
    <path d="M31 42 Q32 41 33 42" strokeWidth="1" opacity="0.5" />
  </svg>
);

// ─── Get Icon by Category ID ─────────────────────────────────
const getCategoryIcon = (categoryId: string) => {
  const icons: Record<string, JSX.Element> = {
    'dried-fruits':    <IconDriedFruits />,
    'spices':          <IconSpices />,
    'tea':             <IconTea />,
    'distilled-water': <IconEssentialOils />,
    'honey':           <IconHoney />,
    'oils':            <IconOils />,
    'flour':           <IconFlour />,
    'beauty':          <IconBeauty />,
    'clothing':        <IconClothing />,   // ← جديد
  };
  return icons[categoryId] || <IconSpices />;
};

// ─── Category Card ────────────────────────────────────────────
const CategoryCard: React.FC<{ category: Category; language: string }> = ({ category, language }) => {
  const name = typeof category.name === 'string'
    ? category.name
    : (language === 'ar' ? category.name.ar : category.name.en);
  const icon = getCategoryIcon(category.id);

  return (
    <Link
      to={`/shop?category=${category.id}`}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
      style={{ background: '#fff', border: '1.5px solid #F0E4CC', minHeight: '108px' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = '#FDF5E8';
        el.style.borderColor = '#CC8F57';
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 8px 20px rgba(204,143,87,0.16)';
        const iconEl = el.querySelector('.cat-icon') as HTMLElement;
        if (iconEl) iconEl.style.color = '#CC8F57';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = '#fff';
        el.style.borderColor = '#F0E4CC';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
        const iconEl = el.querySelector('.cat-icon') as HTMLElement;
        if (iconEl) iconEl.style.color = '#617131';
      }}
    >
      <div className="cat-icon transition-colors duration-300" style={{ color: '#617131' }}>
        {icon}
      </div>
      <span className="text-xs text-center font-semibold leading-snug" style={{ color: '#455324' }}>
        {name}
      </span>
    </Link>
  );
};

// ─── Section ──────────────────────────────────────────────────
const CategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [categories, setCategories] = useState<Category[]>([]);
  const [sectionContent, setSectionContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catsData, sectionData] = await Promise.all([
          fetchCategories(),
          fetchCategoriesSection(),
        ]);
        setCategories(catsData);
        setSectionContent(sectionData[0] || null);
      } catch (err) {
        console.error('Error loading categories section:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-16" style={{ background: '#fff' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#455324' }} />
        </div>
      </section>
    );
  }

  const title = sectionContent?.title_en
    ? (isRtl ? sectionContent.title_ar : sectionContent.title_en)
    : tr('تصفح حسب الفئة', 'Browse by Category');

  const description = sectionContent?.subtitle_en
    ? (isRtl ? sectionContent.subtitle_ar : sectionContent.subtitle_en)
    : tr(
        'اكتشف منتجاتنا المحلية الأصيلة المعتمدة من تعاونيات كلميم-واد نون',
        'Discover authentic certified local products from Guelmim-Oued Noun cooperatives'
      );

  const buttonText = sectionContent?.button_text_en
    ? (isRtl ? sectionContent.button_text_ar : sectionContent.button_text_en)
    : tr('عرض الكل', 'View all');

  const buttonLink = sectionContent?.button_link || '/shop';

  const mobileVisible = showAll ? categories : categories.slice(0, 4);

  return (
    <section className="py-16" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* ── DESKTOP: 4 | center | 4 ── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} language={language} />
            ))}
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
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight mb-2" style={{ color: '#455324' }}>
              {title}
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#763C19' }}>
              {description}
            </p>
            <Link
              to={buttonLink}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #455324, #617131)' }}
            >
              {isRtl ? `${buttonText} ←` : `${buttonText} →`}
            </Link>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#CC8F57' }} />
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {categories.slice(4, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} language={language} />
            ))}
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-1" style={{ color: '#455324' }}>{title}</h2>
            <p className="text-xs leading-relaxed px-4" style={{ color: '#763C19' }}>{description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {mobileVisible.map((cat) => (
              <CategoryCard key={cat.id} category={cat} language={language} />
            ))}
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
              {showAll
                ? (isRtl ? 'عرض أقل ↑' : 'Show less ↑')
                : (isRtl ? 'عرض المزيد ↓' : 'Show more ↓')}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;