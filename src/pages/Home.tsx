import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Truck, ShieldCheck, Users } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CooperativeCard from '../components/CooperativeCard';
import CategoriesSection from '../components/CategoriesSection';
import { products, cooperatives, getFeaturedProducts } from '../data';
import { useLanguage } from '../context/LanguageContext';

// ── Hero slides data ───────────────────────────────────────────
const heroSlides = [
  {
    image: 'https://i.ibb.co/vxhZ3Fwm/1.png',
    titleAr: 'منتجات أصيلة\nمن قلب الصحراء',
    titleEn: 'Authentic Products\nfrom the Heart of the Sahara',
    subtitleAr: 'مباشرة من تعاونيات كلميم-واد نون إلى بيتك',
    subtitleEn: 'Directly from Guelmim-Oued Noun cooperatives to your door',
  },
  {
    image: 'https://i.ibb.co/wZJtVwqY/2.png',
    titleAr: 'دعم المرأة\nالحرفية المغربية',
    titleEn: 'Supporting Moroccan\nWomen Artisans',
    subtitleAr: 'كل منتج يحكي قصة امرأة صانعة',
    subtitleEn: 'Every product tells the story of a woman artisan',
  },
];

// ── Cooperative ads ────────────────────────────────────────────
const coopAds = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80',
    titleAr: 'تعاونية نور الصحراء',
    titleEn: 'Coopérative Nour Sahara',
    subtitleAr: 'عسل طبيعي وأملو أصيل — مباشرة من مناحل كلميم',
    subtitleEn: 'Miel naturel et amlou authentique — directement de Guelmim',
    link: '/cooperatives/1',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80',
    titleAr: 'تعاونية أرض النون',
    titleEn: 'Coopérative Ard Noun',
    subtitleAr: 'توابل وأعشاب طبيعية معتمدة من قلب الصحراء',
    subtitleEn: 'Épices et herbes naturelles certifiées du cœur du Sahara',
    link: '/cooperatives/2',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
    titleAr: 'تعاونية زيت الأرغان',
    titleEn: "Coopérative Huile d'Argan",
    subtitleAr: 'زيوت عطرية طبيعية 100% من تعاونيات طانطان',
    subtitleEn: "Huiles essentielles 100% naturelles des coopératives de Tan-Tan",
    link: '/cooperatives/3',
  },
];

// ── External brand ads ─────────────────────────────────────────
const brandAds = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&q=80',
    titleAr: 'إنوي — معك في كل مكان',
    titleEn: 'Inwi — Avec vous partout',
    subtitleAr: 'تغطية شاملة في جنوب المغرب — اشترك الآن',
    subtitleEn: 'Couverture complète dans le sud du Maroc — abonnez-vous',
    badge: 'Inwi',
    badgeBg: '#8B008B',
    link: 'https://inwi.ma',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    titleAr: 'أورانج — الإنترنت الأسرع',
    titleEn: 'Orange — Internet ultra rapide',
    subtitleAr: 'عروض الألياف الضوئية — اكتشف الآن',
    subtitleEn: 'Offres fibre optique — découvrez maintenant',
    badge: 'Orange',
    badgeBg: '#FF6600',
    link: 'https://orange.ma',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80',
    titleAr: 'سكودا — اكتشف المجموعة الجديدة',
    titleEn: 'Škoda — Découvrez la nouvelle gamme',
    subtitleAr: 'تجربة قيادة استثنائية في جنوب المغرب',
    subtitleEn: 'Une expérience de conduite exceptionnelle au sud du Maroc',
    badge: 'Škoda',
    badgeBg: '#1a7a3a',
    link: 'https://skoda.ma',
  },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [slide, setSlide]               = React.useState(0);
  const [coopCurrent, setCoopCurrent]   = React.useState(0);
  const [coopFade, setCoopFade]         = React.useState(true);
  const [brandCurrent, setBrandCurrent] = React.useState(0);
  const [brandFade, setBrandFade]       = React.useState(true);
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const featuredProducts     = getFeaturedProducts().slice(0, 4);
  const featuredCooperatives = cooperatives.slice(0, 3);

  // auto-slide hero
  React.useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // auto-slide coop ads
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCoopFade(false);
      setTimeout(() => { setCoopCurrent((p) => (p + 1) % coopAds.length); setCoopFade(true); }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // auto-slide brand ads
  React.useEffect(() => {
    const timer = setInterval(() => {
      setBrandFade(false);
      setTimeout(() => { setBrandCurrent((p) => (p + 1) % brandAds.length); setBrandFade(true); }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToCoop  = (i: number) => { setCoopFade(false);  setTimeout(() => { setCoopCurrent(i);  setCoopFade(true);  }, 300); };
  const goToBrand = (i: number) => { setBrandFade(false); setTimeout(() => { setBrandCurrent(i); setBrandFade(true); }, 300); };

  const current  = heroSlides[slide];
  const coopAd   = coopAds[coopCurrent];
  const brandAd  = brandAds[brandCurrent];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="pb-20">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[88vh] overflow-hidden">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(69,83,36,0.82) 0%, rgba(69,83,36,0.45) 60%, rgba(0,0,0,0.1) 100%)' }} />

        <div className="absolute top-0 end-0 w-64 h-64 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F8D197 0%, transparent 70%)' }} />

        <div className="relative h-full flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 rounded" style={{ background: '#F8D197' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#F8D197' }}>
                {tr('بيصحراء', 'By Sahara')}
              </span>
            </div>

            <img
              src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png"
              alt="By Sahara"
              className="h-16 object-contain mb-6"
              style={{ filter: 'brightness(0) invert(1)' }}
            />

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ whiteSpace: 'pre-line' }}>
              {isRtl ? current.titleAr : current.titleEn}
            </h1>

            <p className="text-lg mb-8 font-light" style={{ color: '#F7E5CD' }}>
              {isRtl ? current.subtitleAr : current.subtitleEn}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg"
                style={{ background: '#CC8F57', color: '#fff', boxShadow: '0 6px 24px #CC8F5750' }}
              >
                {t('hero.cta', tr('تسوق الآن', 'Shop Now'))}
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </Link>
              <Link
                to="/cooperatives"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' }}
              >
                {tr('اكتشف التعاونيات', 'Our Cooperatives')}
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 start-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === slide ? '24px' : '8px',
                  height: '8px',
                  background: i === slide ? '#F8D197' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>

        {[
          { dir: -1, pos: 'start-4', icon: <ArrowLeft className="w-5 h-5" /> },
          { dir:  1, pos: 'end-4',   icon: <ArrowRight className="w-5 h-5" /> },
        ].map((btn) => (
          <button
            key={btn.pos}
            onClick={() => setSlide((s) => (s + btn.dir + heroSlides.length) % heroSlides.length)}
            className={`absolute top-1/2 -translate-y-1/2 ${btn.pos} w-10 h-10 rounded-full flex items-center justify-center transition-colors`}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {btn.icon}
          </button>
        ))}
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: <ShieldCheck className="w-7 h-7" />, titleKey: 'features.quality.title',      descKey: 'features.quality.desc',      ar: ['جودة مضمونة', 'منتجات معتمدة ومفحوصة بعناية'] },
            { icon: <Users className="w-7 h-7" />,       titleKey: 'features.cooperatives.title', descKey: 'features.cooperatives.desc', ar: ['دعم التعاونيات', 'كل شراء يدعم الحرفيين المحليين'] },
            { icon: <Truck className="w-7 h-7" />,       titleKey: 'features.delivery.title',     descKey: 'features.delivery.desc',     ar: ['توصيل سريع', 'شحن آمن لجميع أنحاء المغرب'] },
          ].map((f, i) => (
            <div key={i}
              className="flex items-start gap-4 p-6 rounded-2xl shadow-md transition-shadow hover:shadow-lg"
              style={{ background: '#fff', border: '1px solid #F8D197' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#F8D197', color: '#455324' }}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: '#455324' }}>
                  {isRtl ? f.ar[0] : t(f.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#763C19' }}>
                  {isRtl ? f.ar[1] : t(f.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <CategoriesSection />

      {/* ── BEST SELLERS ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
              {tr('الأكثر مبيعاً', 'Best Sellers')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#455324' }}>
              {t('sections.bestSellers', tr('منتجات مميزة', 'Featured Products'))}
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: '#CC8F57' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#455324')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#CC8F57')}
          >
            {tr('عرض الكل', 'View All')}
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── COOPERATIVE ADS ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
              {tr('تعاونياتنا', 'Nos Coopératives')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#455324' }}>
              {tr('اكتشف منتجاتهم', 'Découvrez leurs produits')}
            </h2>
          </div>
          <Link to="/cooperatives"
            className="text-sm font-semibold transition-colors"
            style={{ color: '#CC8F57' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#455324')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#CC8F57')}
          >
            {tr('كل التعاونيات ←', '← Toutes')}
          </Link>
        </div>

        <Link to={coopAd.link}>
          <div className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            style={{ height: '300px', opacity: coopFade ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <img src={coopAd.image} alt={isRtl ? coopAd.titleAr : coopAd.titleEn} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: isRtl
                ? 'linear-gradient(to left, rgba(69,83,36,0.85) 40%, rgba(0,0,0,0.05) 100%)'
                : 'linear-gradient(to right, rgba(69,83,36,0.85) 40%, rgba(0,0,0,0.05) 100%)',
            }} />
            <span className="absolute top-5 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{ background: '#455324', border: '1px solid #F8D19760', [isRtl ? 'right' : 'left']: '20px' }}>
              🤝 {tr('تعاونية شريكة', 'Coopérative partenaire')}
            </span>
            <div className="absolute bottom-0 p-8" style={{ [isRtl ? 'right' : 'left']: 0 }}>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-1">
                {isRtl ? coopAd.titleAr : coopAd.titleEn}
              </h3>
              <p className="text-sm md:text-base mb-5" style={{ color: '#F7E5CD' }}>
                {isRtl ? coopAd.subtitleAr : coopAd.subtitleEn}
              </p>
              <span className="inline-block text-sm font-bold px-6 py-2.5 rounded-full"
                style={{ background: '#F8D197', color: '#455324' }}>
                {isRtl ? '← اكتشف المنتجات' : 'Voir les produits →'}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div key={coopCurrent} className="h-full"
                style={{ background: '#F8D197', animation: 'adProgress 5s linear forwards' }} />
            </div>
          </div>
        </Link>

        <div className="flex justify-center gap-2 mt-4">
          {coopAds.map((_, i) => (
            <button key={i} onClick={() => goToCoop(i)} className="rounded-full transition-all duration-300"
              style={{ width: i === coopCurrent ? '24px' : '8px', height: '8px',
                background: i === coopCurrent ? '#455324' : '#d6b896' }} />
          ))}
        </div>
      </section>

      {/* ── EXTERNAL BRAND ADS ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
              {tr('شراكات', 'Partenaires')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#455324' }}>
              {tr('إعلانات', 'Publicités')}
            </h2>
          </div>
          <Link to="/contact"
            className="text-sm font-semibold transition-colors"
            style={{ color: '#CC8F57' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#455324')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#CC8F57')}
          >
            {tr('اعلن معنا ←', '→ Annoncez ici')}
          </Link>
        </div>

        <a href={brandAd.link} target="_blank" rel="noopener noreferrer">
          <div className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            style={{ height: '300px', opacity: brandFade ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <img src={brandAd.image} alt={isRtl ? brandAd.titleAr : brandAd.titleEn} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: isRtl
                ? 'linear-gradient(to left, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.05) 100%)'
                : 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.05) 100%)',
            }} />
            <span className="absolute top-5 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{ background: brandAd.badgeBg, [isRtl ? 'right' : 'left']: '20px' }}>
              {brandAd.badge}
            </span>
            <span className="absolute top-5 text-white text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', [isRtl ? 'left' : 'right']: '20px' }}>
              {tr('إعلان مدفوع', 'Sponsorisé')}
            </span>
            <div className="absolute bottom-0 p-8" style={{ [isRtl ? 'right' : 'left']: 0 }}>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-1">
                {isRtl ? brandAd.titleAr : brandAd.titleEn}
              </h3>
              <p className="text-sm md:text-base mb-5" style={{ color: '#e2e8f0' }}>
                {isRtl ? brandAd.subtitleAr : brandAd.subtitleEn}
              </p>
              <span className="inline-block text-sm font-bold px-6 py-2.5 rounded-full"
                style={{ background: '#fff', color: '#1a1a1a' }}>
                {isRtl ? '← اكتشف الآن' : 'Découvrir →'}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div key={brandCurrent} className="h-full"
                style={{ background: brandAd.badgeBg, animation: 'adProgress 5s linear forwards' }} />
            </div>
          </div>
        </a>

        <div className="flex justify-center gap-2 mt-4">
          {brandAds.map((_, i) => (
            <button key={i} onClick={() => goToBrand(i)} className="rounded-full transition-all duration-300"
              style={{ width: i === brandCurrent ? '24px' : '8px', height: '8px',
                background: i === brandCurrent ? '#455324' : '#d6b896' }} />
          ))}
        </div>

        <style>{`
          @keyframes adProgress {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </section>

      {/* ── PROMO BANNER ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        <Link to="/shop">
          <div
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 60%, #9FA93D 100%)', minHeight: '200px' }}
          >
            <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#F8D197' }} />
            <div className="absolute -bottom-8 -start-8 w-36 h-36 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#F8D197' }} />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9FA93D' }}>
                  {tr('عرض خاص', 'Special Offer')}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                  {tr('شحن مجاني على كل الطلبات', 'Free Shipping on All Orders')}
                </h3>
                <p style={{ color: '#F7E5CD' }}>
                  {tr('اطلب الآن واستمتع بتوصيل مجاني', 'Order now and enjoy free delivery')}
                </p>
              </div>
              <div
                className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all duration-300 group-hover:scale-105"
                style={{ background: '#F8D197', color: '#455324' }}
              >
                {tr('تسوق الآن', 'Shop Now')}
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ── COOPERATIVES ──────────────────────────────────────── */}
      <section className="mt-16 py-16" style={{ background: '#F7E5CD40' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9FA93D' }}>
              {tr('شركاؤنا', 'Our Partners')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3" style={{ color: '#455324' }}>
              {t('sections.featuredCooperatives', tr('التعاونيات المميزة', 'Featured Cooperatives'))}
            </h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: '#763C19' }}>
              {t('features.cooperatives.desc', tr(
                'تعاونيات تجمع نساء وحرفيين من كلميم-واد نون لإنتاج أجود المنتجات الطبيعية',
                'Cooperatives uniting women and artisans from Guelmim-Oued Noun to produce the finest natural products'
              ))}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCooperatives.map((coop) => (
              <CooperativeCard key={coop.id} cooperative={coop} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/cooperatives"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: '#455324', color: '#fff' }}
            >
              {tr('كل التعاونيات', 'All Cooperatives')}
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: '4',    label: tr('تعاونية', 'Cooperatives') },
            { val: '16+',  label: tr('منتج', 'Products')        },
            { val: '100+', label: tr('حرفية', 'Artisans')       },
            { val: '3',    label: tr('أقاليم', 'Provinces')     },
          ].map((s) => (
            <div key={s.label}
              className="p-6 rounded-2xl"
              style={{ background: '#fff', border: '1px solid #F8D197' }}
            >
              <p className="font-serif text-4xl font-bold mb-1" style={{ color: '#455324' }}>
                {s.val}
              </p>
              <p className="text-sm font-medium" style={{ color: '#CC8F57' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUPPORTERS ────────────────────────────────────────── */}
      <section className="py-14" style={{ background: '#F7F3EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9FA93D' }}>
              {tr('داعمونا', 'Nos Soutiens')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#455324' }}>
              {tr('بدعم من', 'Soutenus par')}
            </h2>
          </div>

          <div className="flex justify-center gap-10 flex-wrap">
            {[
              { nameAr: 'وزارة الفلاحة',        nameEn: 'Min. Agriculture',      abbr: '🌾', accentColor: '#455324', bgColor: '#EDF2E3' },
              { nameAr: 'وزارة الصناعة',         nameEn: 'Min. Industrie',        abbr: '⚙️', accentColor: '#763C19', bgColor: '#F5EDE6' },
              { nameAr: 'المبادرة الوطنية',       nameEn: 'INDH',                  abbr: '🤲', accentColor: '#CC8F57', bgColor: '#FDF5EC' },
              { nameAr: 'جهة كلميم-واد نون',     nameEn: 'Région Guelmim-O.Noun', abbr: '🗺️', accentColor: '#9FA93D', bgColor: '#F4F6E8' },
              { nameAr: 'مكتب التكوين المهني',   nameEn: 'OFPPT',                 abbr: '🎓', accentColor: '#455324', bgColor: '#EDF2E3' },
            ].map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-3 cursor-default group" style={{ width: '110px' }}>
                {/* Logo box — scales on hover */}
                <div
                  className="flex items-center justify-center transition-transform duration-300 group-hover:scale-125"
                  style={{
                    width: '72px', height: '72px', borderRadius: '20px',
                    background: p.bgColor,
                    border: `2px solid ${p.accentColor}35`,
                    fontSize: '28px',
                    boxShadow: `0 4px 16px ${p.accentColor}18`,
                  }}
                >
                  {p.abbr}
                </div>
                <p className="text-xs font-semibold text-center leading-tight"
                  style={{ color: p.accentColor }}>
                  {isRtl ? p.nameAr : p.nameEn}
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