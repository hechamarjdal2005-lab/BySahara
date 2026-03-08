import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Search, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCooperatives, fetchCategories } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { CategoryId, Product, Cooperative, Category } from '../types';

// ── Category Icons ────────────────────────────────────────────
const CategoryIcon: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-6 h-6' }) => {
  const props = {
    viewBox: '0 0 56 56', fill: 'none', stroke: 'currentColor',
    strokeWidth: '1.6', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className,
  };
  switch (id) {
    case 'honey':           return <svg {...props}><path d="M22 18 Q18 26 18 34 Q18 46 28 46 Q38 46 38 34 Q38 26 34 18 Z" /><path d="M28 10 L28 18" /><path d="M23 12 L33 12" /><path d="M24 32 Q28 37 32 32" /><circle cx="28" cy="25" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'oils':            return <svg {...props}><path d="M26 10 Q26 7 28 7 Q30 7 30 10 L32 18 Q37 20 37 28 L37 44 Q37 48 28 48 Q19 48 19 44 L19 28 Q19 20 24 18 Z" /><path d="M23 33 Q28 30 33 33" /><circle cx="28" cy="24" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'flour':           return <svg {...props}><path d="M16 26 Q18 16 28 14 Q38 16 40 26 L38 48 Q38 50 28 50 Q18 50 18 48 Z" /><path d="M23 14 L23 9 Q28 7 33 9 L33 14" /><path d="M21 32 L35 32" /><path d="M21 40 L35 40" /><circle cx="28" cy="22" r="2.5" fill="currentColor" stroke="none"/></svg>;
    case 'tea':             return <svg {...props}><path d="M14 26 Q14 46 28 46 Q42 46 42 26 Z" /><path d="M42 32 Q50 32 50 38 Q50 44 42 42" /><path d="M14 26 L42 26" /><path d="M22 16 Q24 10 28 12 Q32 10 34 16" /><path d="M28 12 L28 26" /></svg>;
    case 'spices':          return <svg {...props}><path d="M18 46 L22 20 Q28 12 34 20 L38 46 Z" /><path d="M20 30 L36 30" /><path d="M19 38 L37 38" /><path d="M28 12 Q30 7 35 9" /><circle cx="28" cy="20" r="2" fill="currentColor" stroke="none"/></svg>;
    case 'dried-fruits':    return <svg {...props}><ellipse cx="22" cy="26" rx="8" ry="10" /><ellipse cx="34" cy="26" rx="8" ry="10" /><path d="M26 18 Q28 14 30 18" /><circle cx="22" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="34" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="28" cy="30" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'distilled-water': return <svg {...props}><rect x="20" y="22" width="16" height="24" rx="3" /><path d="M23 22 L23 17 L33 17 L33 22" /><path d="M26 13 L30 13" /><path d="M23 31 Q28 28 33 31" /><path d="M23 38 Q28 35 33 38" /><circle cx="28" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'beauty':          return <svg {...props}><circle cx="28" cy="22" r="10" /><path d="M21 17 Q25 13 28 15 Q31 13 35 17" /><path d="M24 25 Q28 29 32 25" /><path d="M19 32 Q13 38 17 46 Q24 51 28 48 Q32 51 39 46 Q43 38 37 32" /></svg>;
    default:                return <span className="text-lg">🌿</span>;
  }
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

const CATS_INITIAL     = 5;
const PRODUCTS_INITIAL = 6;

// ── Colors ────────────────────────────────────────────────────
const G = {
  outerBg:      '#4e6e1e',
  cardBg:       '#5d7f28',
  cardHover:    '#4a6820',
  activeCard:   '#ffffff',
  activeBorder: '#F8D197',
  activeText:   '#4e6e1e',
  normalText:   '#ffffff',
};

// ── Mobile tile (uniform grid) ────────────────────────────────
const MobileTile: React.FC<{ id: string; name: string; count: number; active: boolean; onClick: () => void }> = ({ id, name, count, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-200 active:scale-95 py-3 px-1"
    style={{
      background:  active ? G.activeCard : G.cardBg,
      border:      active ? `2.5px solid ${G.activeBorder}` : '2px solid rgba(255,255,255,0.08)',
      minHeight:   '72px',
      boxShadow:   active ? '0 4px 16px rgba(0,0,0,0.18)' : 'none',
    }}
    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = G.cardHover; }}
    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = G.cardBg; }}
  >
    <span style={{ color: active ? G.activeText : G.normalText }}>
      {id === 'all' ? <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🌿</span> : <CategoryIcon id={id} className="w-6 h-6" />}
    </span>
    <span className="font-semibold leading-tight text-center" style={{ fontSize: '0.65rem', color: active ? G.activeText : G.normalText, maxWidth: '72px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={name}>
      {name}
    </span>
    <span style={{ fontSize: '0.6rem', color: active ? '#617131' : 'rgba(255,255,255,0.55)' }}>{count}</span>
  </button>
);

// ── Desktop card (horizontal scroll) ─────────────────────────
const DesktopCard: React.FC<{ id: string; name: string; count: number; active: boolean; onClick: () => void }> = ({ id, name, count, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-200 flex-shrink-0"
    style={{
      background: active ? 'linear-gradient(135deg, #455324 0%, #617131 100%)' : '#F7F1E8',
      border: active ? '1.5px solid #455324' : '1.5px solid #EDD9AA',
      boxShadow: active ? '0 4px 14px rgba(69,83,36,0.25)' : 'none',
      minWidth: id === 'all' ? '120px' : '140px',
    }}
    onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F0E4CC'; (e.currentTarget as HTMLElement).style.borderColor = '#CC8F57'; } }}
    onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F7F1E8'; (e.currentTarget as HTMLElement).style.borderColor = '#EDD9AA'; } }}
  >
    <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: active ? 'rgba(255,255,255,0.18)' : (id === 'all' ? '#EDD9AA' : '#fff'), color: active ? '#fff' : '#617131', boxShadow: active ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>
      {id === 'all' ? <span style={{ fontSize: '1.4rem' }}>🌿</span> : <CategoryIcon id={id} className="w-7 h-7" />}
    </span>
    <div className="text-start">
      <p className="text-xs font-bold leading-tight" style={{ color: active ? '#fff' : '#455324', maxWidth: '90px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={name}>
        {name}
      </p>
      <p className="text-xs leading-tight mt-0.5" style={{ color: active ? 'rgba(255,255,255,0.7)' : '#BA8944' }}>
        {count} {id === 'all' ? 'items' : 'items'}
      </p>
    </div>
  </button>
);

// ── Main Component ───────────────────────────────────────────
const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const location = useLocation();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  // ─── State for Dynamic Data ─────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── UI State ───────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [showAllCats, setShowAllCats] = useState(false);
  const [showAllProds, setShowAllProds] = useState(false);

  // ─── Fetch Data on Mount ────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, cooperativesData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCooperatives(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCooperatives(cooperativesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error loading shop data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ─── Handle URL Category Parameter ──────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      const matched = categories.find((c) => c.id === cat);
      if (matched) {
        setSelectedCategory(matched.id as CategoryId);
        const idx = categories.findIndex((c) => c.id === cat);
        if (idx >= CATS_INITIAL) setShowAllCats(true);
      } else {
        setSelectedCategory('all');
      }
    } else {
      setSelectedCategory('all');
    }
  }, [location.search, categories]);

  // ─── Reset "Show All" on Filter Change ──────────────────────
  useEffect(() => { setShowAllProds(false); }, [selectedCategory, search, sort]);

  // ─── Helpers ────────────────────────────────────────────────
  const getCategoryCount = (categoryId: CategoryId | 'all') => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  // ─── Filter & Sort Products ─────────────────────────────────
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

  const visibleCats = showAllCats ? categories : categories.slice(0, CATS_INITIAL);
  const hasMoreCats = categories.length > CATS_INITIAL;
  const shownProds = showAllProds ? filtered : filtered.slice(0, PRODUCTS_INITIAL);
  const hasMoreProds = filtered.length > PRODUCTS_INITIAL;

  // ─── Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#455324' }} />
          <p className="text-sm" style={{ color: '#763C19' }}>{tr('جاري التحميل...', 'Loading products...')}</p>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FDFAF5' }}>
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#455324', color: '#fff' }}
          >
            {tr('إعادة المحاولة', 'Retry')}
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Render ────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#FDFAF5' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-7 sm:py-10">
          <p className="uppercase tracking-widest text-xs font-semibold mb-1" style={{ color: '#9FA93D' }}>
            {tr('تعاونيات كلميم-واد نون', 'Guelmim-Oued Noun Cooperatives')}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-5">
            {tr('تسوق المنتجات', 'Shop Products')}
          </h1>
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 pointer-events-none" style={{ color: '#BA8944' }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={tr('ابحث عن منتج...', 'Search products...')}
              className="w-full ps-10 pe-10 py-2.5 sm:py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute top-1/2 -translate-y-1/2 end-3">
                <X className="w-4 h-4" style={{ color: '#F8D197' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES — MOBILE: green grid ─────────────────── */}
      <div className="sm:hidden px-4 py-4">
        <div className="rounded-2xl p-3" style={{ background: G.outerBg }}>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <MobileTile id="all" name={tr('الكل', 'Tous')} count={getCategoryCount('all')} active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} />
            {visibleCats.map((cat) => (
              <MobileTile key={cat.id} id={cat.id} name={isRtl ? cat.name.ar : cat.name.en} count={getCategoryCount(cat.id as CategoryId)} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id as CategoryId)} />
            ))}
          </div>
          {hasMoreCats && (
            <div className="flex justify-center mt-3">
              <button onClick={() => setShowAllCats((v) => !v)}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #e8943a, #d4791f)', color: '#fff', boxShadow: '0 4px 14px rgba(232,148,58,0.45)' }}>
                {showAllCats ? tr('عرض أقل', 'Voir Moins') : tr('عرض المزيد', 'Voir Plus')}
                {showAllCats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CATEGORIES — DESKTOP: sticky horizontal scroll ───── */}
      <div className="hidden sm:block sticky top-16 z-40"
        style={{ background: '#fff', borderBottom: '1.5px solid #F0E4CC', boxShadow: '0 4px 16px rgba(69,83,36,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-3 min-w-max">
              {/* All */}
              <DesktopCard id="all" name={tr('الكل', 'All')} count={getCategoryCount('all')} active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} />
              <div className="w-px h-14 flex-shrink-0" style={{ background: '#EDD9AA' }} />
              {/* Cats */}
              {categories.map((cat) => (
                <DesktopCard key={cat.id} id={cat.id} name={isRtl ? cat.name.ar : cat.name.en} count={getCategoryCount(cat.id as CategoryId)} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id as CategoryId)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3 flex-wrap">
          <p className="text-sm font-medium" style={{ color: '#455324' }}>
            <span className="font-bold text-base">{filtered.length}</span>{' '}
            {tr('منتج', 'produits')}
            {selectedCategory !== 'all' && (
              <button onClick={() => setSelectedCategory('all')}
                className="ms-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: '#F8D197', color: '#763C19' }}>
                {isRtl ? categories.find((c) => c.id === selectedCategory)?.name.ar : categories.find((c) => c.id === selectedCategory)?.name.en}
                <X className="w-3 h-3" />
              </button>
            )}
          </p>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold outline-none cursor-pointer"
            style={{ background: '#fff', color: '#455324', border: '1.5px solid #F8D197' }}>
            <option value="default">{tr('الافتراضي', 'Par défaut')}</option>
            <option value="price-asc">{tr('السعر: الأقل أولاً', 'Prix croissant')}</option>
            <option value="price-desc">{tr('السعر: الأعلى أولاً', 'Prix décroissant')}</option>
            <option value="rating">{tr('الأعلى تقييماً', 'Mieux notés')}</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <>
            {/* Mobile: 2 cols | Desktop: 4 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-5 sm:mb-8">
              {shownProds.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMoreProds && (
              <div className="flex justify-center">
                <button onClick={() => setShowAllProds((v) => !v)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95"
                  style={{
                    background: showAllProds ? '#F7E5CD' : 'linear-gradient(135deg, #e8943a, #d4791f)',
                    color: showAllProds ? '#455324' : '#fff',
                    border: showAllProds ? '1.5px solid #CC8F57' : 'none',
                    boxShadow: showAllProds ? 'none' : '0 4px 14px rgba(232,148,58,0.40)',
                  }}>
                  {showAllProds ? tr('عرض أقل', 'Voir Moins') : tr(`عرض الكل (${filtered.length})`, `Voir tout (${filtered.length})`)}
                  {showAllProds ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px dashed #F8D197' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F8D197' }}>
              <Search className="w-6 h-6" style={{ color: '#CC8F57' }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#455324' }}>{tr('لا توجد منتجات', 'Aucun produit trouvé')}</p>
            <p className="text-sm" style={{ color: '#BA8944' }}>{tr('جرب تصنيفاً آخر', 'Try a different category')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;