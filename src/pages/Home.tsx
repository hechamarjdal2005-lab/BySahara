import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Truck, ShieldCheck, Users, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CooperativeCard from '../components/CooperativeCard';
import CategoriesSection from '../components/CategoriesSection';
import { 
  fetchFeaturedProducts, 
  fetchCooperatives,
  fetchHeroSlides,
  fetchPromotions,
  fetchCooperativeAds,
  fetchBrandAds,
  fetchPartners,
  fetchFeatures,
  fetchStats,
  fetchPromoBanners,
} from '../data';
import { useLanguage } from '../context/LanguageContext';
import { Product, Cooperative, BilingualText } from '../types';

// ─── Types for Dynamic Content ──────────────────────────────
interface HeroSlide {
  id: number;
  image_url: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  order_index: number;
}

interface Promotion {
  id: number;
  image_url: string;
  badge_en: string;
  badge_ar: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  discount: string;
  expires_en: string;
  expires_ar: string;
  cta_en: string;
  cta_ar: string;
  cta_link: string;
  accent_bg: string;
  accent_text: string;
  gradient_from: string;
  gradient_to: string;
  order_index: number;
}

interface CooperativeAd {
  id: number;
  image_url: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  link_url: string;
  order_index: number;
}

interface BrandAd {
  id: number;
  image_url: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  badge_text: string;
  badge_color: string;
  link_url: string;
  order_index: number;
}

interface Partner {
  id: number;
  name_en: string;
  name_ar: string;
  logo_url: string;
  order_index: number;
}

interface Feature {
  id: number;
  icon_key: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  order_index: number;
}

interface Stat {
  id: number;
  value_en: string;
  value_ar: string;
  label_en: string;
  label_ar: string;
  order_index: number;
}

interface PromoBanner {
  id: number;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  cta_text_en: string;
  cta_text_ar: string;
  cta_link: string;
  background_color: string;
  is_active: boolean;
  order_index: number;
}

// ─── Feature Icons Mapping ──────────────────────────────────
const featureIcons: Record<string, React.ReactNode> = {
  quality: <ShieldCheck className="w-6 h-6" />,
  cooperatives: <Users className="w-6 h-6" />,
  delivery: <Truck className="w-6 h-6" />,
};

// ─── Main Component ─────────────────────────────────────────
const Home: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  // ─── State for Dynamic Content ────────────────────────────
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coopAds, setCoopAds] = useState<CooperativeAd[]>([]);
  const [brandAds, setBrandAds] = useState<BrandAd[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredCooperatives, setFeaturedCooperatives] = useState<Cooperative[]>([]);
  
  const [loading, setLoading] = useState(true);

  // ─── Carousel States ──────────────────────────────────────
  const [slide, setSlide] = useState(0);
  const [promoCurrent, setPromoCurrent] = useState(0);
  const [promoAnimating, setPromoAnimating] = useState(false);
  const [coopCurrent, setCoopCurrent] = useState(0);
  const [coopFade, setCoopFade] = useState(true);
  const [brandCurrent, setBrandCurrent] = useState(0);
  const [brandFade, setBrandFade] = useState(true);

  const productsScrollRef = useRef<HTMLDivElement>(null);

  // ─── Fetch All Data on Mount ──────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          slides, promos, cAds, bAds, pts, feats, sts, pbns,
          products, cooperatives,
        ] = await Promise.all([
          fetchHeroSlides(),
          fetchPromotions(),
          fetchCooperativeAds(),
          fetchBrandAds(),
          fetchPartners(),
          fetchFeatures(),
          fetchStats(),
          fetchPromoBanners(),
          fetchFeaturedProducts(8),
          fetchCooperatives(),
        ]);

        console.log('🔍 Cooperative Ads:', cAds);
        console.log('🔍 Brand Ads:', bAds);

        setHeroSlides(slides);
        setPromotions(promos);
        setCoopAds(cAds);
        setBrandAds(bAds);
        setPartners(pts);
        setFeatures(feats);
        setStats(sts);
        setPromoBanners(pbns);
        setFeaturedProducts(products);
        setFeaturedCooperatives(cooperatives.slice(0, 3));
      } catch (err) {
        console.error('Error loading home page:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ─── Auto-Slide Effects ───────────────────────────────────
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (promotions.length === 0) return;
    const timer = setInterval(() => goToPromo((promoCurrent + 1) % promotions.length), 5500);
    return () => clearInterval(timer);
  }, [promoCurrent, promotions.length]);

  useEffect(() => {
    if (coopAds.length === 0) return;
    const timer = setInterval(() => {
      setCoopFade(false);
      setTimeout(() => { setCoopCurrent(p => (p + 1) % coopAds.length); setCoopFade(true); }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [coopAds.length]);

  useEffect(() => {
    if (brandAds.length === 0) return;
    const timer = setInterval(() => {
      setBrandFade(false);
      setTimeout(() => { setBrandCurrent(p => (p + 1) % brandAds.length); setBrandFade(true); }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [brandAds.length]);

  // ─── Carousel Handlers ────────────────────────────────────
  const goToPromo = (i: number) => {
    if (promoAnimating) return;
    setPromoAnimating(true);
    setTimeout(() => { setPromoCurrent(i); setPromoAnimating(false); }, 400);
  };
  const goToCoop = (i: number) => { setCoopFade(false); setTimeout(() => { setCoopCurrent(i); setCoopFade(true); }, 300); };
  const goToBrand = (i: number) => { setBrandFade(false); setTimeout(() => { setBrandCurrent(i); setBrandFade(true); }, 300); };

  // ─── Mobile Scroll ────────────────────────────────────────
  const scrollProducts = (dir: 'left' | 'right') => {
    if (!productsScrollRef.current) return;
    productsScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  // ─── Helpers ──────────────────────────────────────────────
  const lang = (field: BilingualText | string | undefined | null): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return isRtl ? field.ar : field.en;
  };

  const getCooperativeName = (cooperativeId: string) => {
    const coop = featuredCooperatives.find(c => c.id === cooperativeId);
    return coop ? lang(coop.name) : undefined;
  };

  // ─── Get Current Items (with fallbacks) ───────────────────
  const current = heroSlides[slide] ?? heroSlides[0] ?? null;
  const promo = promotions[promoCurrent] ?? promotions[0] ?? null;
  const coopAd = coopAds[coopCurrent] ?? coopAds[0] ?? null;
  const brandAd = brandAds[brandCurrent] ?? brandAds[0] ?? null;
  const promoBanner = promoBanners[0] ?? null;

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#455324' }} />
          <p className="text-sm" style={{ color: '#763C19' }}>{tr('جاري التحميل...', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="pb-20">

      {/* ══ GLOBAL STYLES ════════════════════════════════════ */}
      <style>{`
        @keyframes adProgress { from{width:0%} to{width:100%} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes marqueeRtl { 0%{transform:translateX(0)} 100%{transform:translateX(50%)} }
        .marquee-track { animation: marquee 22s linear infinite; }
        .marquee-track-rtl { animation: marqueeRtl 22s linear infinite; }
        .marquee-track:hover, .marquee-track-rtl:hover { animation-play-state: paused; }
        .products-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .products-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      {heroSlides.length > 0 && current && (
        <section className="w-full">
          <div className="relative overflow-hidden" style={{ minHeight: '300px' }}>
            {heroSlides.map((s, i) => (
              <div key={s.id} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === slide ? 1 : 0 }}>
                <img src={s.image_url} alt="" className="w-full h-full object-cover absolute inset-0" />
              </div>
            ))}
            <div className="absolute inset-0" style={{ background: isRtl
              ? 'linear-gradient(to left,rgba(45,60,20,0.72) 35%,rgba(45,60,20,0.30) 65%,rgba(0,0,0,0.05) 100%)'
              : 'linear-gradient(to right,rgba(45,60,20,0.72) 35%,rgba(45,60,20,0.30) 65%,rgba(0,0,0,0.05) 100%)' }} />

            <div className="relative z-10 flex flex-col justify-center min-h-[300px] px-6 md:px-14 py-8"
              style={{ alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-5 rounded" style={{ background: '#F8D197' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#F8D197' }}>
                  {tr('بيصحراء', 'By Sahara')}
                </span>
              </div>
              <img src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png" alt="By Sahara" className="h-9 object-contain mb-3"
                style={{ filter: 'brightness(0) invert(1)' }} />
              <h1 key={slide} className="font-serif text-2xl md:text-4xl font-bold text-white mb-2 leading-snug max-w-md"
                style={{ whiteSpace: 'pre-line', animation: 'fadeSlideIn 0.6s ease forwards' }}>
                {isRtl ? current.title_ar : current.title_en}
              </h1>
              <p className="text-sm mb-4 font-light max-w-xs" style={{ color: '#F7E5CD' }}>
                {isRtl ? current.subtitle_ar : current.subtitle_en}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 shadow-md"
                  style={{ background: '#CC8F57', color: '#fff' }}>
                  {t('hero.cta', tr('تسوق الآن', 'Shop Now'))}
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
                <Link to="/cooperatives"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(8px)' }}>
                  {tr('تعاونياتنا', 'Cooperatives')}
                </Link>
              </div>
              <div className="flex gap-2 mt-4">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} className="rounded-full transition-all duration-300"
                    style={{ width: i === slide ? '18px' : '6px', height: '6px', background: i === slide ? '#F8D197' : 'rgba(255,255,255,0.35)' }} />
                ))}
              </div>
            </div>

            <button onClick={() => setSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute start-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setSlide(s => (s + 1) % heroSlides.length)}
              className="absolute end-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ══ FEATURES ═════════════════════════════════════════ */}
      {features.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid #F8D197' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F8D197', color: '#455324' }}>
                  {featureIcons[f.icon_key] || <ShieldCheck className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5" style={{ color: '#455324' }}>{isRtl ? f.title_ar : f.title_en}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#763C19' }}>{isRtl ? f.description_ar : f.description_en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ CATEGORIES ═══════════════════════════════════════ */}
      <CategoriesSection />

      {/* ══ BEST SELLERS ═════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9FA93D' }}>
              {tr('الأكثر مبيعاً', 'Best Sellers')}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold" style={{ color: '#455324' }}>
              {tr('منتجات مميزة', 'Featured Products')}
            </h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold" style={{ color: '#fff', background: '#CC8F57' }}>
            {tr('عرض الكل', 'View All')}
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map(p => (
            <ProductCard key={p.id} product={p} cooperativeName={getCooperativeName(p.cooperativeId)} />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="sm:hidden relative">
          <div ref={productsScrollRef}
            className="products-scroll flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
            {featuredProducts.map(p => (
              <div key={p.id} className="snap-start flex-shrink-0" style={{ width: '160px' }}>
                <ProductCard product={p} cooperativeName={getCooperativeName(p.cooperativeId)} />
              </div>
            ))}
          </div>
          <button onClick={() => scrollProducts(isRtl ? 'right' : 'left')}
            className="absolute start-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{ background: '#fff', color: '#455324', border: '1px solid #F8D197' }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => scrollProducts(isRtl ? 'left' : 'right')}
            className="absolute end-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{ background: '#fff', color: '#455324', border: '1px solid #F8D197' }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ══ PROMO BANNER ══════════════════════════════════════ */}
      {promoBanner && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
          <Link to={promoBanner.cta_link || '/shop'}>
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ 
                background: `linear-gradient(135deg,${promoBanner.background_color || '#455324'} 0%,#617131 60%,#9FA93D 100%)`, 
                minHeight: '160px' 
              }}>
              <div className="absolute -top-8 -end-8 w-36 h-36 rounded-full opacity-10" style={{ background: '#F8D197' }} />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
                    {tr('عرض خاص', 'Special Offer')}
                  </p>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1">
                    {isRtl ? promoBanner.title_ar : promoBanner.title_en}
                  </h3>
                  <p className="text-sm" style={{ color: '#F7E5CD' }}>
                    {isRtl ? (promoBanner.subtitle_ar || '') : (promoBanner.subtitle_en || '')}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 group-hover:scale-105"
                  style={{ background: '#F8D197', color: '#455324' }}>
                  {isRtl ? (promoBanner.cta_text_ar || 'تسوق الآن') : (promoBanner.cta_text_en || 'Shop Now')}
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ══ COOPERATIVE ADS ══════════════════════════════════ */}
      {coopAds.length > 0 && coopAd && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9FA93D' }}>
                {tr('تعاونياتنا', 'Nos Coopératives')}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold" style={{ color: '#455324' }}>
                {tr('اكتشف منتجاتهم', 'Leurs produits')}
              </h2>
            </div>
            <Link to="/cooperatives" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold" style={{ color: '#fff', background: '#9FA93D' }}>
              {tr('الكل', 'Toutes')}
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          <Link to={coopAd.link_url || `/cooperatives/${coopAd.id}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              style={{ height: '240px', opacity: coopFade ? 1 : 0, transition: 'opacity 0.4s ease' }}>
              <img src={coopAd.image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: isRtl ? 'linear-gradient(to left,rgba(69,83,36,0.85) 40%,rgba(0,0,0,0.05) 100%)' : 'linear-gradient(to right,rgba(69,83,36,0.85) 40%,rgba(0,0,0,0.05) 100%)' }} />
              <span className="absolute top-4 text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
                style={{ background: '#455324', border: '1px solid #F8D19760', [isRtl ? 'right' : 'left']: '16px' }}>
                🤝 {tr('تعاونية شريكة', 'Coopérative partenaire')}
              </span>
              <div className="absolute bottom-0 p-6" style={{ [isRtl ? 'right' : 'left']: 0 }}>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{isRtl ? coopAd.title_ar : coopAd.title_en}</h3>
                <p className="text-sm mb-4" style={{ color: '#F7E5CD' }}>{isRtl ? coopAd.subtitle_ar : coopAd.subtitle_en}</p>
                <span className="inline-block text-xs font-bold px-5 py-2 rounded-full" style={{ background: '#F8D197', color: '#455324' }}>
                  {isRtl ? '← اكتشف المنتجات' : 'Voir les produits →'}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div key={coopCurrent} className="h-full" style={{ background: '#F8D197', animation: 'adProgress 5s linear forwards' }} />
              </div>
            </div>
          </Link>
          <div className="flex justify-center gap-2 mt-3">
            {coopAds.map((_, i) => (
              <button key={i} onClick={() => goToCoop(i)} className="rounded-full transition-all duration-300"
                style={{ width: i === coopCurrent ? '20px' : '7px', height: '7px', background: i === coopCurrent ? '#455324' : '#d6b896' }} />
            ))}
          </div>
        </section>
      )}

      {/* ══ BRAND ADS ════════════════════════════════════════ */}
      {brandAds.length > 0 && brandAd && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9FA93D' }}>
                {tr('شراكات', 'Partenaires')}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold" style={{ color: '#455324' }}>
                {tr('إعلانات', 'Publicités')}
              </h2>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold" style={{ color: '#fff', background: '#CC8F57' }}>
              {tr('اعلن معنا', 'Annoncez')}
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          <a href={brandAd.link_url || '#'} target="_blank" rel="noopener noreferrer">
            <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              style={{ height: '240px', opacity: brandFade ? 1 : 0, transition: 'opacity 0.4s ease' }}>
              <img src={brandAd.image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: isRtl ? 'linear-gradient(to left,rgba(0,0,0,0.85) 40%,rgba(0,0,0,0.05) 100%)' : 'linear-gradient(to right,rgba(0,0,0,0.85) 40%,rgba(0,0,0,0.05) 100%)' }} />
              <span className="absolute top-4 text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
                style={{ background: brandAd.badge_color || '#CC8F57', [isRtl ? 'right' : 'left']: '16px' }}>
                {brandAd.badge_text || 'Sponsorisé'}
              </span>
              <span className="absolute top-4 text-white text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', [isRtl ? 'left' : 'right']: '16px' }}>
                {tr('إعلان', 'Sponsorisé')}
              </span>
              <div className="absolute bottom-0 p-6" style={{ [isRtl ? 'right' : 'left']: 0 }}>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{isRtl ? brandAd.title_ar : brandAd.title_en}</h3>
                <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>{isRtl ? brandAd.subtitle_ar : brandAd.subtitle_en}</p>
                <span className="inline-block text-xs font-bold px-5 py-2 rounded-full" style={{ background: '#fff', color: '#1a1a1a' }}>
                  {isRtl ? '← اكتشف' : 'Découvrir →'}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div key={brandCurrent} className="h-full" style={{ background: brandAd.badge_color || '#CC8F57', animation: 'adProgress 5s linear forwards' }} />
              </div>
            </div>
          </a>
          <div className="flex justify-center gap-2 mt-3">
            {brandAds.map((_, i) => (
              <button key={i} onClick={() => goToBrand(i)} className="rounded-full transition-all duration-300"
                style={{ width: i === brandCurrent ? '20px' : '7px', height: '7px', background: i === brandCurrent ? '#455324' : '#d6b896' }} />
            ))}
          </div>
        </section>
      )}

      {/* ══ COOPERATIVES CARDS ═══════════════════════════════ */}
      {featuredCooperatives.length > 0 && (
        <section className="mt-8 py-10" style={{ background: '#F7E5CD40' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-7">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>{tr('شركاؤنا', 'Our Partners')}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2" style={{ color: '#455324' }}>{tr('التعاونيات المميزة', 'Featured Cooperatives')}</h2>
            </div>

            {/* Desktop: 3 cards grid */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-6">
              {featuredCooperatives.map(c => <CooperativeCard key={c.id} cooperative={c} />)}
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="sm:hidden flex gap-3 overflow-x-auto products-scroll snap-x snap-mandatory pb-2">
              {featuredCooperatives.map(c => (
                <div key={c.id} className="snap-start flex-shrink-0" style={{ width: '240px' }}>
                  <CooperativeCard cooperative={c} />
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link to="/cooperatives"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:opacity-90"
                style={{ background: '#455324', color: '#fff' }}>
                {tr('كل التعاونيات', 'All Cooperatives')}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ STATS ════════════════════════════════════════════ */}
      {stats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {stats.map(s => (
              <div key={s.id} className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid #F8D197' }}>
                <p className="font-serif text-3xl font-bold mb-0.5" style={{ color: '#455324' }}>{isRtl ? s.value_ar : s.value_en}</p>
                <p className="text-xs font-medium" style={{ color: '#CC8F57' }}>{isRtl ? s.label_ar : s.label_en}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ PARTNERS MARQUEE ═════════════════════════════════ */}
      {partners.length > 0 && (
        <section className="py-8 overflow-hidden" style={{ background: '#F7F3EE' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
              {tr('داعمونا', 'Nos Soutiens')}
            </p>
            <h2 className="font-serif text-xl md:text-2xl font-bold" style={{ color: '#455324' }}>
              {tr('بدعم من', 'Soutenus par')}
            </h2>
          </div>

          <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right,transparent,black 10%,black 90%,transparent)' }}>
            <div 
              className={`flex gap-6 w-max ${isRtl ? 'marquee-track-rtl' : 'marquee-track'}`}
              style={{ 
                margin: '0 auto',
                paddingLeft: '50%',
                paddingRight: '50%',
              }}
            >
              {[...partners, ...partners].map((p, i) => (
                <div key={`${p.id}-${i}`} className="flex flex-col items-center gap-2 flex-shrink-0" style={{ width: '110px' }}>
                  <div className="flex items-center justify-center rounded-xl transition-all duration-300 hover:shadow-md"
                    style={{ width: '80px', height: '60px', background: '#fff', border: '1px solid #E5D4B8', padding: '8px' }}>
                    <img src={p.logo_url} alt={isRtl ? p.name_ar : p.name_en} className="max-w-full max-h-full object-contain" />
                  </div>
                  <p className="text-xs font-semibold text-center leading-tight" style={{ color: '#617131' }}>
                    {isRtl ? p.name_ar : p.name_en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;