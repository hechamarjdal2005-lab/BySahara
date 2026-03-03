import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories as allCategories } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { CategoryId } from '../types';

// ── Category Icons ────────────────────────────────────────────
const CategoryIcon: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-8 h-8' }) => {
  const props = {
    viewBox: '0 0 56 56',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.4',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (id) {
    case 'honey': return <svg {...props}><path d="M22 18 Q18 26 18 34 Q18 46 28 46 Q38 46 38 34 Q38 26 34 18 Z" /><path d="M28 10 L28 18" /><path d="M23 12 L33 12" /><path d="M24 32 Q28 37 32 32" /><circle cx="28" cy="25" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'oils': return <svg {...props}><path d="M26 10 Q26 7 28 7 Q30 7 30 10 L32 18 Q37 20 37 28 L37 44 Q37 48 28 48 Q19 48 19 44 L19 28 Q19 20 24 18 Z" /><path d="M23 33 Q28 30 33 33" /><circle cx="28" cy="24" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'flour': return <svg {...props}><path d="M16 26 Q18 16 28 14 Q38 16 40 26 L38 48 Q38 50 28 50 Q18 50 18 48 Z" /><path d="M23 14 L23 9 Q28 7 33 9 L33 14" /><path d="M21 32 L35 32" /><path d="M21 40 L35 40" /><circle cx="28" cy="22" r="2.5" fill="currentColor" stroke="none"/></svg>;
    case 'tea': return <svg {...props}><path d="M14 26 Q14 46 28 46 Q42 46 42 26 Z" /><path d="M42 32 Q50 32 50 38 Q50 44 42 42" /><path d="M14 26 L42 26" /><path d="M22 16 Q24 10 28 12 Q32 10 34 16" /><path d="M28 12 L28 26" /></svg>;
    case 'spices': return <svg {...props}><path d="M18 46 L22 20 Q28 12 34 20 L38 46 Z" /><path d="M20 30 L36 30" /><path d="M19 38 L37 38" /><path d="M28 12 Q30 7 35 9" /><circle cx="28" cy="20" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'dried-fruits': return <svg {...props}><ellipse cx="22" cy="26" rx="8" ry="10" /><ellipse cx="34" cy="26" rx="8" ry="10" /><path d="M26 18 Q28 14 30 18" /><circle cx="22" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="34" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="28" cy="30" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'distilled-water': return <svg {...props}><rect x="20" y="22" width="16" height="24" rx="3" /><path d="M23 22 L23 17 L33 17 L33 22" /><path d="M26 13 L30 13" /><path d="M23 31 Q28 28 33 31" /><path d="M23 38 Q28 35 33 38" /><circle cx="28" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'beauty': return <svg {...props}><circle cx="28" cy="22" r="10" /><path d="M21 17 Q25 13 28 15 Q31 13 35 17" /><path d="M24 25 Q28 29 32 25" /><path d="M19 32 Q13 38 17 46 Q24 51 28 48 Q32 51 39 46 Q43 38 37 32" /></svg>;
    default: return <span className="text-2xl">🌿</span>;
  }
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  // Get category from URL parameter
  const categoryFromUrl = searchParams.get('category');
  
  // Find the category ID that matches the slug from URL
  const initialCategory = categoryFromUrl
    ? allCategories.find((cat) => cat.id === categoryFromUrl)?.id || 'all'
    : 'all';

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryFromUrl) {
      const found = allCategories.find((cat) => cat.id === categoryFromUrl);
      if (found) {
        setSelectedCategory(found.id as CategoryId);
      }
    }
  }, [categoryFromUrl]);

  const categoriesToShow = showAllCategories ? allCategories : allCategories.slice(0, 4);

  const filtered = products
    .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return p.name.en.toLowerCase().includes(q) || p.name.ar.includes(q);
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#FDFAF5' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 100%)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10">
          <p className="uppercase tracking-widest text-xs font-semibold mb-1" style={{ color: '#9FA93D' }}>
            {tr('تعاونيات كلميم-واد نون', 'Guelmim-Oued Noun Cooperatives')}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-5">
            {tr('تسوق المنتجات', 'Shop Products')}
          </h1>
          {/* Search */}
          <div className="relative max-w-md w-full max-w-none sm:max-w-md">
            <Search
              className="absolute top-1/2 -translate-y-1/2 start-4 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none"
              style={{ color: '#BA8944' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr('ابحث عن منتج...', 'Search products...')}
              className="w-full ps-9 sm:ps-10 pe-9 sm:pe-10 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute top-1/2 -translate-y-1/2 end-3 p-1">
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#F8D197' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES HORIZONTAL CARDS ─────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1.5px solid #F0E4CC',
          position: 'sticky',
          top: 64,
          zIndex: 40,
          boxShadow: '0 4px 16px rgba(69,83,36,0.07)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-3">
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-max">

              {/* ALL card */}
              <button
                onClick={() => setSelectedCategory('all')}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 flex-shrink-0 group"
                style={{
                  background: selectedCategory === 'all'
                    ? 'linear-gradient(135deg, #455324 0%, #617131 100%)'
                    : '#F7F1E8',
                  border: selectedCategory === 'all' ? '1.5px solid #455324' : '1.5px solid #EDD9AA',
                  boxShadow: selectedCategory === 'all' ? '0 4px 14px rgba(69,83,36,0.25)' : 'none',
                  minWidth: '100px',
                }}
              >
                <span
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
                  style={{
                    background: selectedCategory === 'all' ? 'rgba(255,255,255,0.18)' : '#EDD9AA',
                  }}
                >
                  🌿
                </span>
                <div className="text-start hidden sm:block">
                  <p
                    className="text-xs font-bold leading-tight"
                    style={{ color: selectedCategory === 'all' ? '#fff' : '#455324' }}
                  >
                    {tr('الكل', 'All')}
                  </p>
                  <p
                    className="text-xs leading-tight mt-0.5"
                    style={{ color: selectedCategory === 'all' ? 'rgba(255,255,255,0.7)' : '#BA8944' }}
                  >
                    {products.length} {tr('منتج', 'items')}
                  </p>
                </div>
              </button>

              {/* Divider */}
              <div className="w-px h-12 sm:h-14 flex-shrink-0" style={{ background: '#EDD9AA' }} />

              {/* Category cards */}
              {categoriesToShow.map((cat) => {
                const active = selectedCategory === cat.id;
                const name = isRtl ? cat.name.ar : cat.name.en;
                const count = products.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as CategoryId)}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 flex-shrink-0"
                    style={{
                      background: active
                        ? 'linear-gradient(135deg, #CC8F57 0%, #BA8944 100%)'
                        : '#F7F1E8',
                      border: active ? '1.5px solid #CC8F57' : '1.5px solid #EDD9AA',
                      boxShadow: active ? '0 4px 14px rgba(204,143,87,0.30)' : 'none',
                      minWidth: '110px',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = '#F0E4CC';
                        (e.currentTarget as HTMLElement).style.borderColor = '#CC8F57';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = '#F7F1E8';
                        (e.currentTarget as HTMLElement).style.borderColor = '#EDD9AA';
                      }
                    }}
                  >
                    {/* Icon circle */}
                    <span
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        background: active ? 'rgba(255,255,255,0.22)' : '#fff',
                        color: active ? '#fff' : '#617131',
                        boxShadow: active ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                      }}
                    >
                      <CategoryIcon id={cat.id} className="w-6 h-6 sm:w-7 sm:h-7" />
                    </span>

                    {/* Text */}
                    <div className="text-start">
                      <p
                        className="text-xs font-bold leading-tight"
                        style={{
                          color: active ? '#fff' : '#455324',
                          maxWidth: '90px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={name}
                      >
                        {name}
                      </p>
                      <p
                        className="text-xs leading-tight mt-0.5"
                        style={{ color: active ? 'rgba(255,255,255,0.75)' : '#BA8944' }}
                      >
                        {count} {tr('منتج', 'items')}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* View All / Show Less button */}
              {allCategories.length > 4 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 flex-shrink-0 text-xs sm:text-sm font-semibold"
                  style={{
                    background: '#F7F1E8',
                    border: '1.5px solid #EDD9AA',
                    color: '#455324',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#F0E4CC';
                    (e.currentTarget as HTMLElement).style.borderColor = '#CC8F57';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#F7F1E8';
                    (e.currentTarget as HTMLElement).style.borderColor = '#EDD9AA';
                  }}
                >
                  {showAllCategories ? tr('عرض أقل', 'Show Less') : tr('عرض الكل', 'View All')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4 flex-wrap">
          <p className="text-xs sm:text-sm font-medium" style={{ color: '#455324' }}>
            <span className="font-bold text-lg sm:text-xl">{filtered.length}</span>{' '}
            {tr('منتج', 'products')}
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="ms-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: '#F8D197', color: '#763C19' }}
              >
                {isRtl
                  ? allCategories.find((c) => c.id === selectedCategory)?.name.ar
                  : allCategories.find((c) => c.id === selectedCategory)?.name.en}
                <X className="w-3 h-3" />
              </button>
            )}
          </p>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer"
            style={{ background: '#fff', color: '#455324', border: '1.5px solid #F8D197' }}
          >
            <option value="default">{tr('الافتراضي', 'Default')}</option>
            <option value="price-asc">{tr('السعر: الأقل أولاً', 'Price: Low to High')}</option>
            <option value="price-desc">{tr('السعر: الأعلى أولاً', 'Price: High to Low')}</option>
            <option value="rating">{tr('الأعلى تقييماً', 'Top Rated')}</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 sm:py-20 rounded-2xl"
            style={{ background: '#fff', border: '1.5px dashed #F8D197' }}
          >
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ background: '#F8D197' }}
            >
              <Search className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: '#CC8F57' }} />
            </div>
            <p className="font-semibold mb-1 text-sm sm:text-base" style={{ color: '#455324' }}>
              {tr('لا توجد منتجات', 'No products found')}
            </p>
            <p className="text-xs sm:text-sm" style={{ color: '#BA8944' }}>
              {tr('جرب تصنيفاً آخر أو كلمة بحث مختلفة', 'Try a different category or search term')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;