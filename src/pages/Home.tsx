import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Truck, ShieldCheck, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CooperativeCard from '../components/CooperativeCard';
import CategoriesSection from '../components/CategoriesSection';
import { cooperatives, getFeaturedProducts } from '../data';
import { useLanguage } from '../context/LanguageContext';

// ── Hero slides ────────────────────────────────────────────────
const heroSlides = [
  {
    image: 'https://i.ibb.co/YYm6q7q/1.jpg',
    titleAr: 'منتجات أصيلة\nمن قلب الصحراء',
    titleEn: 'Authentic Products\nfrom the Heart of the Sahara',
    subtitleAr: 'مباشرة من تعاونيات كلميم-واد نون إلى بيتك',
    subtitleEn: 'Directly from Guelmim-Oued Noun cooperatives to your door',
  },
  {
    image: 'https://i.ibb.co/1GySNNWG/24.jpg',
    titleAr: 'دعم المرأة\nالحرفية المغربية',
    titleEn: 'Supporting Moroccan\nWomen Artisans',
    subtitleAr: 'كل منتج يحكي قصة امرأة صانعة',
    subtitleEn: 'Every product tells the story of a woman artisan',
  },
];

// ── Promotions ─────────────────────────────────────────────────
const promotions = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80',
    badgeAr: 'رمضان كريم', badgeEn: 'Ramadan Special',
    titleAr: 'جلابيات مصنوعة يدوياً', titleEn: 'Handwoven Djellabas',
    subtitleAr: 'تصاميم حصرية من تعاونياتنا — مخزون محدود',
    subtitleEn: 'Exclusive designs by our cooperatives — limited stock',
    discount: '-20%', expiresAr: 'ينتهي 30 مارس', expiresEn: 'Ends March 30',
    ctaAr: 'تسوق', ctaEn: 'Shop', ctaLink: '/shop',
    accentBg: '#F8D197', accentText: '#455324',
    gradientFrom: 'rgba(69,83,36,0.88)', gradientTo: 'rgba(69,83,36,0.08)',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&q=80',
    badgeAr: 'وصل حديثاً', badgeEn: 'New Arrival',
    titleAr: 'مجموعات هدايا زيت الأرغان', titleEn: 'Argan Oil Gift Sets',
    subtitleAr: 'زيت أرغان نقي معصور على البارد', subtitleEn: 'Pure cold-pressed argan oil',
    discount: 'Bundle', expiresAr: 'حتى نفاد الكمية', expiresEn: 'While stocks last',
    ctaAr: 'اكتشف', ctaEn: 'Discover', ctaLink: '/shop',
    accentBg: '#9FA93D', accentText: '#fff',
    gradientFrom: 'rgba(40,70,30,0.88)', gradientTo: 'rgba(40,70,30,0.08)',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1400&q=80',
    badgeAr: 'أسبوع الحرفيين', badgeEn: 'Artisan Week',
    titleAr: 'توابل وأعشاب صحراوية', titleEn: 'Saharan Spices & Herbs',
    subtitleAr: 'منتجات طبيعية معتمدة من الصحراء المغربية',
    subtitleEn: 'Certified natural products from the Moroccan Sahara',
    discount: '-15%', expiresAr: 'هذا الأسبوع فقط', expiresEn: 'This week only',
    ctaAr: 'استكشف', ctaEn: 'Explore', ctaLink: '/shop',
    accentBg: '#CC8F57', accentText: '#fff',
    gradientFrom: 'rgba(118,60,25,0.88)', gradientTo: 'rgba(118,60,25,0.08)',
  },
];

// ── Coop ads ───────────────────────────────────────────────────
const coopAds = [
  { id: 1, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80', titleAr: 'تعاونية نور الصحراء', titleEn: 'Coopérative Nour Sahara', subtitleAr: 'عسل طبيعي وأملو أصيل', subtitleEn: 'Miel naturel et amlou authentique', link: '/cooperatives/1' },
  { id: 2, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80', titleAr: 'تعاونية أرض النون', titleEn: 'Coopérative Ard Noun', subtitleAr: 'توابل وأعشاب طبيعية معتمدة', subtitleEn: 'Épices et herbes naturelles certifiées', link: '/cooperatives/2' },
  { id: 3, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80', titleAr: 'تعاونية زيت الأرغان', titleEn: "Coopérative Huile d'Argan", subtitleAr: 'زيوت عطرية طبيعية 100%', subtitleEn: "Huiles essentielles 100% naturelles", link: '/cooperatives/3' },
];

// ── Brand ads ──────────────────────────────────────────────────
const brandAds = [
  { id: 1, image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&q=80', titleAr: 'إنوي — معك في كل مكان', titleEn: 'Inwi — Avec vous partout', subtitleAr: 'تغطية شاملة في جنوب المغرب', subtitleEn: 'Couverture complète dans le sud du Maroc', badge: 'Inwi', badgeBg: '#8B008B', link: 'https://inwi.ma' },
  { id: 2, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80', titleAr: 'أورانج — الإنترنت الأسرع', titleEn: 'Orange — Internet ultra rapide', subtitleAr: 'عروض الألياف الضوئية', subtitleEn: 'Offres fibre optique', badge: 'Orange', badgeBg: '#FF6600', link: 'https://orange.ma' },
  { id: 3, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80', titleAr: 'سكودا — المجموعة الجديدة', titleEn: 'Škoda — Nouvelle gamme', subtitleAr: 'تجربة قيادة استثنائية', subtitleEn: 'Une expérience de conduite exceptionnelle', badge: 'Škoda', badgeBg: '#1a7a3a', link: 'https://skoda.ma' },
];

// ── Partners (logos) ───────────────────────────────────────────
const partners = [
  { nameAr: 'وزارة الفلاحة',    nameEn: 'Agriculture',    logo: 'https://i.ibb.co/Y0ZJ3nQ/agriculture.png' },
  { nameAr: 'وزارة الصناعة',    nameEn: 'Industrie',      logo: 'https://i.ibb.co/x3VdLQm/industrie.png' },
  { nameAr: 'المبادرة الوطنية', nameEn: 'INDH',           logo: 'https://i.ibb.co/pzLvQBq/indh.png' },
  { nameAr: 'جهة كلميم',        nameEn: 'Guelmim Region', logo: 'https://i.ibb.co/tBs7KyZ/guelmim.png' },
  { nameAr: 'OFPPT',             nameEn: 'OFPPT',          logo: 'https://i.ibb.co/RgYq7mp/ofppt.png' },
];

// ─────────────────────────────────────────────────────────────
const Home: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [slide, setSlide]                   = React.useState(0);
  const [promoCurrent, setPromoCurrent]     = React.useState(0);
  const [promoAnimating, setPromoAnimating] = React.useState(false);
  const [coopCurrent, setCoopCurrent]       = React.useState(0);
  const [coopFade, setCoopFade]             = React.useState(true);
  const [brandCurrent, setBrandCurrent]     = React.useState(0);
  const [brandFade, setBrandFade]           = React.useState(true);

  const productsScrollRef = useRef<HTMLDivElement>(null);
  const featuredProducts     = getFeaturedProducts().slice(0, 8);
  const featuredCooperatives = cooperatives.slice(0, 3);

  // auto-slides
  React.useEffect(() => { const t = setInterval(() => setSlide(s => (s+1)%heroSlides.length), 5000); return ()=>clearInterval(t); }, []);
  React.useEffect(() => { const t = setInterval(() => goToPromo((promoCurrent+1)%promotions.length), 5500); return ()=>clearInterval(t); }, [promoCurrent]);
  React.useEffect(() => { const t = setInterval(() => { setCoopFade(false); setTimeout(()=>{ setCoopCurrent(p=>(p+1)%coopAds.length); setCoopFade(true); },400); }, 5000); return ()=>clearInterval(t); }, []);
  React.useEffect(() => { const t = setInterval(() => { setBrandFade(false); setTimeout(()=>{ setBrandCurrent(p=>(p+1)%brandAds.length); setBrandFade(true); },400); }, 5000); return ()=>clearInterval(t); }, []);

  const goToPromo = (i: number) => {
    if (promoAnimating) return;
    setPromoAnimating(true);
    setTimeout(() => { setPromoCurrent(i); setPromoAnimating(false); }, 400);
  };
  const goToCoop  = (i: number) => { setCoopFade(false);  setTimeout(()=>{ setCoopCurrent(i);  setCoopFade(true);  },300); };
  const goToBrand = (i: number) => { setBrandFade(false); setTimeout(()=>{ setBrandCurrent(i); setBrandFade(true); },300); };

  // scroll products left/right on mobile
  const scrollProducts = (dir: 'left'|'right') => {
    if (!productsScrollRef.current) return;
    productsScrollRef.current.scrollBy({ left: dir==='left' ? -200 : 200, behavior: 'smooth' });
  };

  const current  = heroSlides[slide];
  const promo    = promotions[promoCurrent];
  const coopAd   = coopAds[coopCurrent];
  const brandAd  = brandAds[brandCurrent];

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

      {/* ══ PROMOTIONS — top of page ════════════════════════ */}
      <section className="w-full px-3 sm:px-6 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-sm font-bold" style={{ color: '#455324' }}>
            {tr('عروض حصرية', 'Exclusive Promotions')}
          </span>
          <Link to="/shop" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ color: '#fff', background: '#CC8F57' }}>
            {tr('كل العروض', 'All Offers')}
            {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </Link>
        </div>

        <div className="relative w-full overflow-hidden shadow-xl" style={{ height: '160px', borderRadius: '16px' }}>
          {promotions.map((p, i) => (
            <div key={p.id} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: i===promoCurrent ? 1 : 0 }}>
              <img src={p.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: isRtl ? `linear-gradient(to left,${p.gradientFrom} 45%,${p.gradientTo} 100%)` : `linear-gradient(to right,${p.gradientFrom} 45%,${p.gradientTo} 100%)` }} />
            </div>
          ))}

          <div className="absolute inset-0 z-10 flex items-center px-6 md:px-10"
            style={{ opacity: promoAnimating?0:1, transform: promoAnimating?(isRtl?'translateX(16px)':'translateX(-16px)'):'translateX(0)', transition:'opacity 0.4s ease,transform 0.4s ease' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: promo.accentBg, color: promo.accentText }}>
                  {isRtl ? promo.badgeAr : promo.badgeEn}
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  {isRtl ? promo.expiresAr : promo.expiresEn}
                </span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-white mb-1 leading-tight" style={{ textShadow:'0 2px 12px rgba(0,0,0,0.35)' }}>
                {isRtl ? promo.titleAr : promo.titleEn}
              </h2>
              <p className="text-xs mb-3 max-w-xs hidden sm:block" style={{ color:'rgba(255,255,255,0.75)' }}>
                {isRtl ? promo.subtitleAr : promo.subtitleEn}
              </p>
              {/* ── Small CTA button ── */}
              <Link to={promo.ctaLink}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-xs transition-all duration-200 hover:scale-105 shadow-md"
                style={{ background: promo.accentBg, color: promo.accentText }}>
                {isRtl ? promo.ctaAr : promo.ctaEn}
                {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 z-20" style={{ background:'rgba(255,255,255,0.12)' }}>
            <div key={promoCurrent} className="h-full" style={{ background: promo.accentBg, animation:'adProgress 5.5s linear forwards' }} />
          </div>

          <button onClick={() => goToPromo((promoCurrent-1+promotions.length)%promotions.length)}
            className="absolute start-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)', color:'#fff', backdropFilter:'blur(4px)' }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => goToPromo((promoCurrent+1)%promotions.length)}
            className="absolute end-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)', color:'#fff', backdropFilter:'blur(4px)' }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-2">
          {promotions.map((_,i) => (
            <button key={i} onClick={() => goToPromo(i)} className="rounded-full transition-all duration-300"
              style={{ width: i===promoCurrent?'18px':'6px', height:'6px', background: i===promoCurrent?'#CC8F57':'#d6b896' }} />
          ))}
        </div>
      </section>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <section className="w-full">
        <div className="relative overflow-hidden" style={{ minHeight:'300px' }}>
          {heroSlides.map((s,i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity:i===slide?1:0 }}>
              <img src={s.image} alt="" className="w-full h-full object-cover absolute inset-0" />
            </div>
          ))}
          <div className="absolute inset-0" style={{ background: isRtl
            ? 'linear-gradient(to left,rgba(45,60,20,0.72) 35%,rgba(45,60,20,0.30) 65%,rgba(0,0,0,0.05) 100%)'
            : 'linear-gradient(to right,rgba(45,60,20,0.72) 35%,rgba(45,60,20,0.30) 65%,rgba(0,0,0,0.05) 100%)' }} />

          <div className="relative z-10 flex flex-col justify-center min-h-[300px] px-6 md:px-14 py-8"
            style={{ alignItems: isRtl?'flex-end':'flex-start' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-5 rounded" style={{ background:'#F8D197' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:'#F8D197' }}>
                {tr('بيصحراء','By Sahara')}
              </span>
            </div>
            <img src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png" alt="By Sahara" className="h-9 object-contain mb-3"
              style={{ filter:'brightness(0) invert(1)' }} />
            <h1 key={slide} className="font-serif text-2xl md:text-4xl font-bold text-white mb-2 leading-snug max-w-md"
              style={{ whiteSpace:'pre-line', animation:'fadeSlideIn 0.6s ease forwards' }}>
              {isRtl ? current.titleAr : current.titleEn}
            </h1>
            <p className="text-sm mb-4 font-light max-w-xs" style={{ color:'#F7E5CD' }}>
              {isRtl ? current.subtitleAr : current.subtitleEn}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 shadow-md"
                style={{ background:'#CC8F57', color:'#fff' }}>
                {t('hero.cta', tr('تسوق الآن','Shop Now'))}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link to="/cooperatives"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300"
                style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.30)', backdropFilter:'blur(8px)' }}>
                {tr('تعاونياتنا','Cooperatives')}
              </Link>
            </div>
            <div className="flex gap-2 mt-4">
              {heroSlides.map((_,i) => (
                <button key={i} onClick={() => setSlide(i)} className="rounded-full transition-all duration-300"
                  style={{ width:i===slide?'18px':'6px', height:'6px', background:i===slide?'#F8D197':'rgba(255,255,255,0.35)' }} />
              ))}
            </div>
          </div>

          <button onClick={() => setSlide(s=>(s-1+heroSlides.length)%heroSlides.length)}
            className="absolute start-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)', color:'#fff', backdropFilter:'blur(4px)' }}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setSlide(s=>(s+1)%heroSlides.length)}
            className="absolute end-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)', color:'#fff', backdropFilter:'blur(4px)' }}>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ══ FEATURES ═════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon:<ShieldCheck className="w-6 h-6"/>, ar:['جودة مضمونة','منتجات معتمدة ومفحوصة'], en:['Guaranteed Quality','Certified & carefully checked'] },
            { icon:<Users className="w-6 h-6"/>,       ar:['دعم التعاونيات','كل شراء يدعم الحرفيين'], en:['Support Cooperatives','Every purchase supports artisans'] },
            { icon:<Truck className="w-6 h-6"/>,       ar:['توصيل سريع','شحن آمن لجميع أنحاء المغرب'], en:['Fast Delivery','Safe shipping across Morocco'] },
          ].map((f,i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background:'#fff', border:'1px solid #F8D197' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'#F8D197', color:'#455324' }}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-0.5" style={{ color:'#455324' }}>{isRtl?f.ar[0]:f.en[0]}</h3>
                <p className="text-xs leading-relaxed" style={{ color:'#763C19' }}>{isRtl?f.ar[1]:f.en[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CATEGORIES ═══════════════════════════════════════ */}
      <CategoriesSection />

      {/* ══ BEST SELLERS ═════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color:'#9FA93D' }}>
              {tr('الأكثر مبيعاً','Best Sellers')}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold" style={{ color:'#455324' }}>
              {tr('منتجات مميزة','Featured Products')}
            </h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold" style={{ color:'#fff', background:'#CC8F57' }}>
            {tr('عرض الكل','View All')}
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {/* ── Desktop: grid ── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* ── Mobile: horizontal scroll snap with small cards ── */}
        <div className="sm:hidden relative">
          <div ref={productsScrollRef}
            className="products-scroll flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
            {featuredProducts.map(p => (
              <div key={p.id} className="snap-start flex-shrink-0" style={{ width:'160px' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          {/* Mobile scroll arrows */}
          <button onClick={() => scrollProducts(isRtl?'right':'left')}
            className="absolute start-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{ background:'#fff', color:'#455324', border:'1px solid #F8D197' }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => scrollProducts(isRtl?'left':'right')}
            className="absolute end-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{ background:'#fff', color:'#455324', border:'1px solid #F8D197' }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ══ COOPERATIVE ADS ══════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color:'#9FA93D' }}>{tr('تعاونياتنا','Nos Coopératives')}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold" style={{ color:'#455324' }}>{tr('اكتشف منتجاتهم','Leurs produits')}</h2>
          </div>
          <Link to="/cooperatives" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold" style={{ color:'#fff', background:'#9FA93D' }}>
            {tr('الكل','Toutes')}
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <Link to={coopAd.link}>
          <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            style={{ height:'240px', opacity:coopFade?1:0, transition:'opacity 0.4s ease' }}>
            <img src={coopAd.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: isRtl?'linear-gradient(to left,rgba(69,83,36,0.85) 40%,rgba(0,0,0,0.05) 100%)':'linear-gradient(to right,rgba(69,83,36,0.85) 40%,rgba(0,0,0,0.05) 100%)' }} />
            <span className="absolute top-4 text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
              style={{ background:'#455324', border:'1px solid #F8D19760', [isRtl?'right':'left']:'16px' }}>
              🤝 {tr('تعاونية شريكة','Coopérative partenaire')}
            </span>
            <div className="absolute bottom-0 p-6" style={{ [isRtl?'right':'left']:0 }}>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{isRtl?coopAd.titleAr:coopAd.titleEn}</h3>
              <p className="text-sm mb-4" style={{ color:'#F7E5CD' }}>{isRtl?coopAd.subtitleAr:coopAd.subtitleEn}</p>
              <span className="inline-block text-xs font-bold px-5 py-2 rounded-full" style={{ background:'#F8D197', color:'#455324' }}>
                {isRtl?'← اكتشف المنتجات':'Voir les produits →'}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background:'rgba(255,255,255,0.15)' }}>
              <div key={coopCurrent} className="h-full" style={{ background:'#F8D197', animation:'adProgress 5s linear forwards' }} />
            </div>
          </div>
        </Link>
        <div className="flex justify-center gap-2 mt-3">
          {coopAds.map((_,i) => (
            <button key={i} onClick={() => goToCoop(i)} className="rounded-full transition-all duration-300"
              style={{ width:i===coopCurrent?'20px':'7px', height:'7px', background:i===coopCurrent?'#455324':'#d6b896' }} />
          ))}
        </div>
      </section>

      {/* ══ BRAND ADS ════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color:'#9FA93D' }}>{tr('شراكات','Partenaires')}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold" style={{ color:'#455324' }}>{tr('إعلانات','Publicités')}</h2>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold" style={{ color:'#fff', background:'#CC8F57' }}>
            {tr('اعلن معنا','Annoncez')}
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <a href={brandAd.link} target="_blank" rel="noopener noreferrer">
          <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            style={{ height:'240px', opacity:brandFade?1:0, transition:'opacity 0.4s ease' }}>
            <img src={brandAd.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: isRtl?'linear-gradient(to left,rgba(0,0,0,0.85) 40%,rgba(0,0,0,0.05) 100%)':'linear-gradient(to right,rgba(0,0,0,0.85) 40%,rgba(0,0,0,0.05) 100%)' }} />
            <span className="absolute top-4 text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
              style={{ background:brandAd.badgeBg, [isRtl?'right':'left']:'16px' }}>{brandAd.badge}</span>
            <span className="absolute top-4 text-white text-xs px-3 py-1 rounded-full"
              style={{ background:'rgba(255,255,255,0.15)', [isRtl?'left':'right']:'16px' }}>{tr('إعلان','Sponsorisé')}</span>
            <div className="absolute bottom-0 p-6" style={{ [isRtl?'right':'left']:0 }}>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{isRtl?brandAd.titleAr:brandAd.titleEn}</h3>
              <p className="text-sm mb-4" style={{ color:'#e2e8f0' }}>{isRtl?brandAd.subtitleAr:brandAd.subtitleEn}</p>
              <span className="inline-block text-xs font-bold px-5 py-2 rounded-full" style={{ background:'#fff', color:'#1a1a1a' }}>
                {isRtl?'← اكتشف':'Découvrir →'}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background:'rgba(255,255,255,0.15)' }}>
              <div key={brandCurrent} className="h-full" style={{ background:brandAd.badgeBg, animation:'adProgress 5s linear forwards' }} />
            </div>
          </div>
        </a>
        <div className="flex justify-center gap-2 mt-3">
          {brandAds.map((_,i) => (
            <button key={i} onClick={() => goToBrand(i)} className="rounded-full transition-all duration-300"
              style={{ width:i===brandCurrent?'20px':'7px', height:'7px', background:i===brandCurrent?'#455324':'#d6b896' }} />
          ))}
        </div>
      </section>

      {/* ══ FREE SHIPPING BANNER ══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        <Link to="/shop">
          <div className="relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ background:'linear-gradient(135deg,#455324 0%,#617131 60%,#9FA93D 100%)', minHeight:'160px' }}>
            <div className="absolute -top-8 -end-8 w-36 h-36 rounded-full opacity-10" style={{ background:'#F8D197' }} />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:'#9FA93D' }}>{tr('عرض خاص','Special Offer')}</p>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1">{tr('شحن مجاني على كل الطلبات','Free Shipping on All Orders')}</h3>
                <p className="text-sm" style={{ color:'#F7E5CD' }}>{tr('اطلب الآن واستمتع بتوصيل مجاني','Order now and enjoy free delivery')}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 group-hover:scale-105"
                style={{ background:'#F8D197', color:'#455324' }}>
                {tr('تسوق الآن','Shop Now')}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ══ COOPERATIVES CARDS ═══════════════════════════════ */}
      <section className="mt-8 py-10" style={{ background:'#F7E5CD40' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:'#9FA93D' }}>{tr('شركاؤنا','Our Partners')}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2" style={{ color:'#455324' }}>{tr('التعاونيات المميزة','Featured Cooperatives')}</h2>
          </div>

          {/* Desktop: 3 cards grid */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-6">
            {featuredCooperatives.map(c => <CooperativeCard key={c.id} cooperative={c} />)}
          </div>

          {/* Mobile: horizontal scroll — smaller cards */}
          <div className="sm:hidden flex gap-3 overflow-x-auto products-scroll snap-x snap-mandatory pb-2">
            {featuredCooperatives.map(c => (
              <div key={c.id} className="snap-start flex-shrink-0" style={{ width:'240px' }}>
                <CooperativeCard cooperative={c} />
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/cooperatives"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ background:'#455324', color:'#fff' }}>
              {tr('كل التعاونيات','All Cooperatives')}
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { val:'4',    label:tr('تعاونية','Cooperatives') },
            { val:'16+',  label:tr('منتج','Products')        },
            { val:'100+', label:tr('حرفية','Artisans')       },
            { val:'3',    label:tr('أقاليم','Provinces')     },
          ].map(s => (
            <div key={s.label} className="p-5 rounded-2xl" style={{ background:'#fff', border:'1px solid #F8D197' }}>
              <p className="font-serif text-3xl font-bold mb-0.5" style={{ color:'#455324' }}>{s.val}</p>
              <p className="text-xs font-medium" style={{ color:'#CC8F57' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PARTNERS MARQUEE ═════════════════════════════════ */}
      <section className="py-8 overflow-hidden" style={{ background:'#F7F3EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:'#9FA93D' }}>{tr('داعمونا','Nos Soutiens')}</p>
          <h2 className="font-serif text-xl md:text-2xl font-bold" style={{ color:'#455324' }}>{tr('بدعم من','Soutenus par')}</h2>
        </div>

        {/* Auto-scroll marquee */}
        <div className="relative overflow-hidden" style={{ maskImage:'linear-gradient(to right,transparent,black 10%,black 90%,transparent)' }}>
          <div className={`flex gap-6 w-max ${isRtl ? 'marquee-track-rtl' : 'marquee-track'}`}>
            {/* Duplicate for seamless loop */}
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0" style={{ width:'110px' }}>
                <div className="flex items-center justify-center rounded-xl transition-all duration-300 hover:shadow-md"
                  style={{ width:'80px', height:'60px', background:'#fff', border:'1px solid #E5D4B8', padding:'8px' }}>
                  <img src={p.logo} alt={isRtl?p.nameAr:p.nameEn} className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-xs font-semibold text-center leading-tight" style={{ color:'#617131' }}>
                  {isRtl?p.nameAr:p.nameEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;