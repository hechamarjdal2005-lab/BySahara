import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories as allCategories } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { CategoryId } from '../types';

// ── Category Icons ────────────────────────────────────────────
const CategoryIcon: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-6 h-6' }) => {
  const props = { viewBox: '0 0 56 56', fill: 'none', stroke: 'currentColor', strokeWidth: '1.4', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className };
  switch (id) {
    case 'honey': return <svg {...props}><path d="M22 18 Q18 26 18 34 Q18 46 28 46 Q38 46 38 34 Q38 26 34 18 Z" /><path d="M28 10 L28 18" /><path d="M23 12 L33 12" /><path d="M24 32 Q28 37 32 32" /><circle cx="28" cy="25" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'oils': return <svg {...props}><path d="M26 10 Q26 7 28 7 Q30 7 30 10 L32 18 Q37 20 37 28 L37 44 Q37 48 28 48 Q19 48 19 44 L19 28 Q19 20 24 18 Z" /><path d="M23 33 Q28 30 33 33" /><circle cx="28" cy="24" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'flour': return <svg {...props}><path d="M16 26 Q18 16 28 14 Q38 16 40 26 L38 48 Q38 50 28 50 Q18 50 18 48 Z" /><path d="M23 14 L23 9 Q28 7 33 9 L33 14" /><path d="M21 32 L35 32" /><path d="M21 40 L35 40" /><circle cx="28" cy="22" r="2.5" fill="currentColor" stroke="none"/></svg>;
    case 'tea': return <svg {...props}><path d="M14 26 Q14 46 28 46 Q42 46 42 26 Z" /><path d="M42 32 Q50 32 50 38 Q50 44 42 42" /><path d="M14 26 L42 26" /><path d="M22 16 Q24 10 28 12 Q32 10 34 16" /><path d="M28 12 L28 26" /></svg>;
    case 'spices': return <svg {...props}><path d="M18 46 L22 20 Q28 12 34 20 L38 46 Z" /><path d="M20 30 L36 30" /><path d="M19 38 L37 38" /><path d="M28 12 Q30 7 35 9" /><circle cx="28" cy="20" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'dried-fruits': return <svg {...props}><ellipse cx="22" cy="26" rx="8" ry="10" /><ellipse cx="34" cy="26" rx="8" ry="10" /><path d="M26 18 Q28 14 30 18" /><circle cx="22" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="34" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="28" cy="30" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'distilled-water': return <svg {...props}><rect x="20" y="22" width="16" height="24" rx="3" /><path d="M23 22 L23 17 L33 17 L33 22" /><path d="M26 13 L30 13" /><path d="M23 31 Q28 28 33 31" /><path d="M23 38 Q28 35 33 38" /><circle cx="28" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'beauty': return <svg {...props}><circle cx="28" cy="22" r="10" /><path d="M21 17 Q25 13 28 15 Q31 13 35 17" /><path d="M24 25 Q28 29 32 25" /><path d="M19 32 Q13 38 17 46 Q24 51 28 48 Q32 51 39 46 Q43 38 37 32" /></svg>;
    default: return <span className="text-lg">🌿</span>;
  }
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [search, setSearch]   = useState('');
  const [sort, setSort]       = useState<SortOption>('default');

  const filtered = products
    .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return p.name.en.toLowerCase().includes(q) || p.name.ar.includes(q);
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating')     return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#F7E5CD20' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <p className="uppercase tracking-widest text-xs font-semibold mb-1" style={{ color: '#9FA93D' }}>
            {tr('تعاونيات كلميم-واد نون', 'Guelmim-Oued Noun Cooperatives')}
          </p>
          <h1 className="font-serif text-4xl font-bold text-white mb-5">
            {tr('تسوق المنتجات', 'Shop Products')}
          </h1>
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 pointer-events-none"
              style={{ color: '#BA8944' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr('ابحث عن منتج...', 'Search products...')}
              className="w-full ps-10 pe-10 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute top-1/2 -translate-y-1/2 end-3">
                <X className="w-4 h-4" style={{ color: '#F8D197' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES TOP BAR ──────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1.5px solid #F8D197', position: 'sticky', top: 64, zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center justify-center gap-1 py-4 min-w-max mx-auto">

              {/* ALL */}
              <button
                onClick={() => setSelectedCategory('all')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 flex-shrink-0"
                style={{
                  background: selectedCategory === 'all' ? '#455324' : 'transparent',
                  color:      selectedCategory === 'all' ? '#fff' : '#617131',
                  border:     selectedCategory === 'all' ? '1.5px solid #455324' : '1.5px solid transparent',
                  minWidth: '76px',
                  width: '76px',
                }}
              >
                <span className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
                  style={{ background: selectedCategory === 'all' ? 'rgba(255,255,255,0.18)' : '#F7E5CD' }}>
                  🌿
                </span>
                <span className="text-xs font-bold">{tr('الكل', 'All')}</span>
              </button>

              <div className="w-px h-12 mx-2 flex-shrink-0" style={{ background: '#F8D197' }} />

              {allCategories.map((cat) => {
                const active = selectedCategory === cat.id;
                const name   = isRtl ? cat.name.ar : cat.name.en;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as CategoryId)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 flex-shrink-0"
                    style={{
                      background: active ? '#F8D197' : 'transparent',
                      color:      active ? '#455324' : '#617131',
                      border:     active ? '1.5px solid #CC8F57' : '1.5px solid transparent',
                      minWidth: '76px',
                      width: '76px',
                    }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = '#F7E5CD'; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span
                      className="w-11 h-11 rounded-full flex items-center justify-center"
                      style={{ background: active ? '#fff' : '#F7E5CD', color: active ? '#CC8F57' : '#617131' }}
                    >
                      <CategoryIcon id={cat.id} className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-bold text-center leading-tight"
                      style={{ maxWidth: '76px' }}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-sm font-medium" style={{ color: '#455324' }}>
            <span className="font-bold text-xl">{filtered.length}</span>{' '}
            {tr('منتج', 'products')}
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="ms-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: '#F8D197', color: '#763C19' }}
              >
                {isRtl
                  ? allCategories.find(c => c.id === selectedCategory)?.name.ar
                  : allCategories.find(c => c.id === selectedCategory)?.name.en}
                <X className="w-3 h-3" />
              </button>
            )}
          </p>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-4 py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer"
            style={{ background: '#fff', color: '#455324', border: '1.5px solid #F8D197' }}
          >
            <option value="default">{tr('الافتراضي', 'Default')}</option>
            <option value="price-asc">{tr('السعر: الأقل أولاً', 'Price: Low to High')}</option>
            <option value="price-desc">{tr('السعر: الأعلى أولاً', 'Price: High to Low')}</option>
            <option value="rating">{tr('الأعلى تقييماً', 'Top Rated')}</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: '#fff', border: '1.5px dashed #F8D197' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#F8D197' }}>
              <Search className="w-7 h-7" style={{ color: '#CC8F57' }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#455324' }}>
              {tr('لا توجد منتجات', 'No products found')}
            </p>
            <p className="text-sm" style={{ color: '#BA8944' }}>
              {tr('جرب تصنيفاً آخر أو كلمة بحث مختلفة', 'Try a different category or search term')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;