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

// ── Advertisement data ─────────────────────────────────────────
const ads = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
    titleAr: 'زيوت عطرية طبيعية',
    titleEn: 'Pure Essential Oils',
    subtitleAr: '100% طبيعية من قلب الصحراء المغربية',
    subtitleEn: '100% natural from the heart of the Moroccan Sahara',
    badge: 'New',
    link: '/shop',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80',
    titleAr: 'عسل وأملو أصيل',
    titleEn: 'Authentic Honey & Amlou',
    subtitleAr: 'مباشرة من مناحل كلميم-واد نون',
    subtitleEn: 'Directly from Guelmim-Oued Noun apiaries',
    badge: 'Best Seller',
    link: '/shop',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80',
    titleAr: 'توابل وأعشاب مغربية',
    titleEn: 'Moroccan Spices & Herbs',
    subtitleAr: 'مختارة ومعتمدة — نكهات أصيلة',
    subtitleEn: 'Selected & certified — authentic flavors',
    badge: 'Promo',
    link: '/shop',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=1200&q=80',
    titleAr: 'تمور وفواكه مجففة',
    titleEn: 'Dates & Dried Fruits',
    subtitleAr: 'محصودة من قلب الصحراء، تُشحن إلى بيتك',
    subtitleEn: 'Harvested from the desert, shipped to your door',
    badge: 'Saison',
    link: '/shop',
  },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [slide, setSlide] = React.useState(0);
  const [adCurrent, setAdCurrent] = React.useState(0);
  const [adFade, setAdFade] = React.useState(true);
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const featuredProducts     = getFeaturedProducts().slice(0, 4);
  const featuredCooperatives = cooperatives.slice(0, 3);

  // auto-slide hero
  React.useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // auto-slide ads
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAdFade(false);
      setTimeout(() => {
        setAdCurrent((prev) => (prev + 1) % ads.length);
        setAdFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToAd = (i: number) => {
    setAdFade(false);
    setTimeout(() => {
      setAdCurrent(i);
      setAdFade(true);
    }, 300);
  };

  const current = heroSlides[slide];
  const ad = ads[adCurrent];

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

      {/* ── ADVERTISEMENT BANNER ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
              {tr('إعلاناتنا', 'Publicités')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#455324' }}>
              {tr('عروض مميزة', 'Nos Promotions')}
            </h2>
          </div>
        </div>

        {/* Banner */}
        <Link to={ad.link}>
          <div
            className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            style={{
              height: '300px',
              opacity: adFade ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            {/* Image */}
            <img
              src={ad.image}
              alt={isRtl ? ad.titleAr : ad.titleEn}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: isRtl
                  ? 'linear-gradient(to left, rgba(69,83,36,0.78) 40%, rgba(0,0,0,0.05) 100%)'
                  : 'linear-gradient(to right, rgba(69,83,36,0.78) 40%, rgba(0,0,0,0.05) 100%)',
              }}
            />

            {/* Badge */}
            <span
              className="absolute top-5 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{
                background: '#CC8F57',
                [isRtl ? 'right' : 'left']: '20px',
              }}
            >
              {ad.badge}
            </span>

            {/* Text */}
            <div
              className="absolute bottom-0 p-8"
              style={{ [isRtl ? 'right' : 'left']: 0 }}
            >
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-1">
                {isRtl ? ad.titleAr : ad.titleEn}
              </h3>
              <p className="text-sm md:text-base mb-5" style={{ color: '#F7E5CD' }}>
                {isRtl ? ad.subtitleAr : ad.subtitleEn}
              </p>
              <span
                className="inline-block text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
                style={{ background: '#F8D197', color: '#455324' }}
              >
                {isRtl ? '← اكتشف الآن' : 'Découvrir →'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                key={adCurrent}
                className="h-full"
                style={{
                  background: '#F8D197',
                  animation: 'adProgress 5s linear forwards',
                }}
              />
            </div>
          </div>
        </Link>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => goToAd(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === adCurrent ? '24px' : '8px',
                height: '8px',
                background: i === adCurrent ? '#455324' : '#d6b896',
              }}
            />
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

      {/* ── PROVINCES ─────────────────────────────────────────── */}
      <section className="py-12 overflow-hidden" style={{ background: '#F7F3EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
            {tr('داعمونا', 'Nos Partenaires')}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold" style={{ color: '#455324' }}>
            {tr('بدعم من', 'Soutenus par')}
          </h2>
        </div>

        {/* Infinite scroll track */}
        <div className="relative">
          {/* fade edges */}
          <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #F7F3EE, transparent)' }} />
          <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #F7F3EE, transparent)' }} />

          <div className="flex" style={{ animation: isRtl ? 'scrollRtl 28s linear infinite' : 'scrollLtr 28s linear infinite' }}>
            {/* duplicate x2 for seamless loop */}
            {[...Array(2)].map((_, dupIdx) => (
              <div key={dupIdx} className="flex items-center gap-10 flex-shrink-0 px-5">
                {[
                  { nameAr: 'إقليم كلميم',   nameEn: 'Province de Guelmim',  abbr: 'GUE', color: '#455324' },
                  { nameAr: 'إقليم أسا-الزاك', nameEn: 'Province d\'Assa-Zag', abbr: 'ASZ', color: '#763C19' },
                  { nameAr: 'إقليم طانطان',  nameEn: 'Province de Tan-Tan',   abbr: 'TAN', color: '#CC8F57' },
                  { nameAr: 'وزارة الفلاحة', nameEn: 'Min. Agriculture',      abbr: 'AGR', color: '#9FA93D' },
                  { nameAr: 'تعاونية نسائية', nameEn: 'Coopérative Féminine', abbr: 'COF', color: '#455324' },
                  { nameAr: 'المبادرة الوطنية', nameEn: 'Initiative Nationale', abbr: 'INI', color: '#763C19' },
                ].map((partner, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl px-8 py-5 shadow-sm"
                    style={{
                      background: '#fff',
                      border: '1.5px solid #F8D197',
                      minWidth: '160px',
                      minHeight: '90px',
                    }}
                  >
                    {/* Placeholder logo — abbr inside colored circle */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm mb-2"
                      style={{ background: partner.color }}
                    >
                      {partner.abbr}
                    </div>
                    <p className="text-xs font-semibold text-center leading-tight" style={{ color: '#455324' }}>
                      {isRtl ? partner.nameAr : partner.nameEn}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes scrollLtr {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes scrollRtl {
            from { transform: translateX(0); }
            to   { transform: translateX(50%); }
          }
        `}</style>
      </section>

    </div>
  );
};

export default Home;