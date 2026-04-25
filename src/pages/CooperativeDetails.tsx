// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  Users,
  Leaf,
  Award,
  Phone,
  Package,
  Loader2,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import PacksSection from '../components/PacksSection';
import { getPacksByCooperative } from '../data/packsData';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(10,6,2,0.92)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 end-4 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute start-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Image */}
      <img
        src={images[current]}
        alt={`gallery-${current}`}
        className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid rgba(255,255,255,0.10)' }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute end-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-5 flex gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                background: i === current ? '#F8D197' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Gallery Section ───────────────────────────────────────────────────────────
const GallerySection = ({ images, isRtl }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Fallback test photos (remove these once Supabase gallery column is ready)
  const TEST_PHOTOS = [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
  ];

  // Take max 3 photos — use test photos if gallery is empty
  const photos = (images.length > 0 ? images : TEST_PHOTOS).slice(0, 3);

  const t = (ar, en) => (isRtl ? ar : en);

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 mb-2">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
          <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
            {t('صور التعاونية', 'Gallery')}
          </h2>
          <div
            className="ms-auto flex items-center gap-1 text-xs font-medium"
            style={{ color: '#BA8944' }}
          >
            <Images className="w-3.5 h-3.5" />
            {photos.length} {t('صور', 'photos')}
          </div>
        </div>

        {/* Grid: 1 big + 2 small (or 2 equal, or 1 alone) */}
        {photos.length === 1 && (
          <div
            className="rounded-2xl overflow-hidden cursor-zoom-in"
            style={{ height: '240px' }}
            onClick={() => setLightboxIndex(0)}
          >
            <img
              src={photos[0]}
              alt="gallery-0"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        {photos.length === 2 && (
          <div className="grid grid-cols-2 gap-2" style={{ height: '220px' }}>
            {photos.map((src, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={src}
                  alt={`gallery-${i}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        {photos.length >= 3 && (
          <div className="grid grid-cols-2 gap-2" style={{ height: '320px' }}>
            {/* Large left */}
            <div
              className="rounded-2xl overflow-hidden cursor-zoom-in"
              style={{ height: '320px' }}
              onClick={() => setLightboxIndex(0)}
            >
              <img
                src={photos[0]}
                alt="gallery-0"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Right column: 2 stacked */}
            <div className="grid grid-rows-2 gap-2" style={{ height: '320px' }}>
              <div
                className="rounded-2xl overflow-hidden cursor-zoom-in"
                style={{ height: '156px' }}
                onClick={() => setLightboxIndex(1)}
              >
                <img
                  src={photos[1]}
                  alt="gallery-1"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div
                className="rounded-2xl overflow-hidden cursor-zoom-in relative"
                style={{ height: '156px' }}
                onClick={() => setLightboxIndex(2)}
              >
                <img
                  src={photos[2]}
                  alt="gallery-2"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CooperativeDetails = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const t = (ar, en) => (isRtl ? ar : en);

  const lang = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return isRtl ? field.ar : field.en;
  };

  const [cooperative, setCooperative] = useState(null);
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setError('Invalid cooperative');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let coopData = null;
        let coopErr = null;

        const { data: slugData, error: slugError } = await supabase
          .from('cooperatives')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (slugData) {
          coopData = slugData;
        } else {
          const { data: idData, error: idError } = await supabase
            .from('cooperatives')
            .select('*')
            .eq('id', slug)
            .maybeSingle();

          coopData = idData;
          coopErr = idError;
        }

        if (slugError && !coopData) coopErr = slugError;

        if (coopErr && !coopData) {
          console.error('Error loading cooperative:', coopErr);
        }

        if (!coopData) {
          setError('Cooperative not found');
          setLoading(false);
          return;
        }

        const coop = {
          ...coopData,
          name: { en: coopData.name_en, ar: coopData.name_ar },
          description: { en: coopData.description_en, ar: coopData.description_ar },
          shortDescription: {
            en: coopData.short_description_en,
            ar: coopData.short_description_ar,
          },
          city: { en: coopData.city_en, ar: coopData.city_ar },
          province: { en: coopData.province_en, ar: coopData.province_ar },
          region: { en: coopData.region_en, ar: coopData.region_ar },
          memberCount: coopData.member_count,
          foundedYear: coopData.founded_year,
          // gallery: expects an array of image URLs from Supabase column "gallery"
          gallery: Array.isArray(coopData.gallery) ? coopData.gallery : [],
        };

        const { data: prodsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('cooperative_id', coopData.id);

        if (productsError) console.error('Error loading products:', productsError);

        const transformedProducts = (prodsData || []).map((p) => ({
          ...p,
          name: { en: p.name_en, ar: p.name_ar },
          description: { en: p.description_en, ar: p.description_ar },
          unit: { en: p.unit_en, ar: p.unit_ar },
          cooperativeId: p.cooperative_id,
        }));

        setCooperative(coop);
        setProducts(transformedProducts);

        const packsData = await getPacksByCooperative(coopData.id);
        setPacks(packsData || []);
      } catch (err) {
        console.error('Failed to load cooperative:', err);
        setError('Failed to load cooperative.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  // ─── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#455324' }} />
          <p className="text-sm" style={{ color: '#763C19' }}>
            {t('جاري التحميل...', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  // ─── Error ───────────────────────────────────────────────────
  if (error || !cooperative) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: '#F8D197' }}
        >
          <MapPin className="w-7 h-7" style={{ color: '#455324' }} />
        </div>
        <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#455324' }}>
          {t('التعاونية غير موجودة', 'Cooperative not found')}
        </h2>
        <Link
          to="/cooperatives"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-white text-sm"
          style={{ background: '#455324' }}
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t('العودة', 'Back')}
        </Link>
      </div>
    );
  }

  const name        = lang(cooperative.name);
  const city        = lang(cooperative.city);
  const province    = lang(cooperative.province);
  const description = lang(cooperative.description);

  const impactItems = [
    {
      icon: <Users className="w-4 h-4" />,
      title: t('التمكين', 'Empowerment'),
      desc: t('أجور عادلة واستقلالية', 'Fair wages & independence'),
    },
    {
      icon: <Leaf className="w-4 h-4" />,
      title: t('الاستدامة', 'Sustainability'),
      desc: t('مواد صديقة للبيئة', 'Eco-friendly materials'),
    },
    {
      icon: <Award className="w-4 h-4" />,
      title: t('الجودة', 'Quality'),
      desc: t('رقابة صارمة للجودة', 'Rigorous quality control'),
    },
  ];

  return (
    <div className="min-h-screen pb-16" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#FDFAF5' }}>

      {/* ── Back ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <Link
          to="/cooperatives"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: '#BA8944' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#455324')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#BA8944')}
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t('العودة للتعاونيات', 'Back to Cooperatives')}
        </Link>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-3">
        <div
          className="relative rounded-2xl overflow-hidden shadow-md"
          style={{ height: '260px' }}
        >
          <img src={cooperative.image} alt={name} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(20,12,2,0.88) 0%, rgba(15,9,2,0.50) 35%, transparent 65%)',
            }}
          />
          {cooperative.certifications && cooperative.certifications.length > 0 && (
            <div className="absolute top-3 start-3 flex gap-1.5">
              {cooperative.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#9FA93D', color: '#fff' }}
                >
                  {cert}
                </span>
              ))}
            </div>
          )}
          <div className="absolute bottom-0 start-0 end-0 px-5 pb-5 flex items-end gap-4">
            <div
              className="flex-shrink-0 rounded-full overflow-hidden"
              style={{
                width: '76px', height: '76px',
                border: '3px solid rgba(255,255,255,0.22)',
                background: '#F8D197',
                boxShadow: '0 4px 16px rgba(0,0,0,0.40)',
              }}
            >
              {cooperative.logo ? (
                <img src={cooperative.logo} alt={`${name} logo`} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-bold"
                  style={{ fontSize: '1.9rem', color: '#455324', background: '#F8D197' }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 pb-1">
              <h1
                className="font-serif font-bold text-white leading-tight"
                style={{ fontSize: '1.25rem', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
              >
                {name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#F8D197' }} />
                <span className="text-xs font-semibold" style={{ color: '#F8D197' }}>{city}</span>
                <span style={{ color: 'rgba(255,255,255,0.40)' }}>·</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>{province}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">

        {/* Info strip */}
        <div className="flex flex-wrap gap-2 mb-4">
          {cooperative.memberCount && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#F8D197', color: '#455324' }}>
              <Users className="w-3.5 h-3.5" />
              {cooperative.memberCount} {t('عضو', 'members')}
            </div>
          )}
          {cooperative.foundedYear && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#F8D197', color: '#455324' }}>
              <Award className="w-3.5 h-3.5" />
              {t('منذ', 'Since')} {cooperative.foundedYear}
            </div>
          )}
          {cooperative.phone && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#F8D197', color: '#455324' }}>
              <Phone className="w-3.5 h-3.5" />
              {cooperative.phone}
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#F8D197', color: '#455324' }}>
            <Package className="w-3.5 h-3.5" />
            {products.length} {t('منتج', 'products')}
          </div>
          {cooperative.certifications?.map((cert) => (
            <span key={cert} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#9FA93D20', color: '#617131' }}>
              ✓ {cert}
            </span>
          ))}
        </div>

        {/* About + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 rounded-2xl p-4 sm:p-6" style={{ background: '#fff', border: '1px solid #F0E4CC' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
              <h2 className="font-semibold text-base" style={{ color: '#455324' }}>
                {t('عن التعاونية', 'About the Cooperative')}
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#442413' }}>{description}</p>
          </div>
          <div className="hidden lg:block rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #F0E4CC' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: '#455324' }}>
              {t('معلومات التعاونية', 'Cooperative Info')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#CC8F57' }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: '#442413' }}>{city}</p>
                  <p className="text-xs" style={{ color: '#BA8944' }}>{province}</p>
                  <p className="text-xs" style={{ color: '#BA8944' }}>{lang(cooperative.region)}</p>
                </div>
              </div>
              {cooperative.memberCount && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 flex-shrink-0" style={{ color: '#CC8F57' }} />
                  <p className="text-xs" style={{ color: '#442413' }}>{cooperative.memberCount} {t('عضو', 'members')}</p>
                </div>
              )}
              {cooperative.foundedYear && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 flex-shrink-0" style={{ color: '#CC8F57' }} />
                  <p className="text-xs" style={{ color: '#442413' }}>{t('تأسست', 'Founded')} {cooperative.foundedYear}</p>
                </div>
              )}
              {cooperative.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#CC8F57' }} />
                  <p className="text-xs" style={{ color: '#442413' }}>{cooperative.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Impact cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {impactItems.map((item) => (
            <div key={item.title} className="rounded-xl p-3 text-center" style={{ background: '#455324' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5" style={{ background: '#F8D197', color: '#455324' }}>
                {item.icon}
              </div>
              <h4 className="font-bold text-xs mb-0.5" style={{ color: '#F8D197' }}>{item.title}</h4>
              <p style={{ fontSize: '0.6rem', color: '#F7E5CD', lineHeight: 1.3 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ GALLERY ══════════════════════════════════════════ */}
      <GallerySection images={cooperative.gallery || []} isRtl={isRtl} />

      {/* ══ PACKS ════════════════════════════════════════════ */}
      {packs.length > 0 && (
        <div className="mt-2 mb-2">
          <PacksSection
            packs={packs}
            variant="cooperative"
            isRtl={isRtl}
            title={t('عروض الباقات', 'Promo Packs')}
          />
        </div>
      )}

      {/* ══ PRODUCTS ════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
            <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
              {t('المنتجات', 'Products')}
            </h2>
          </div>
          {products.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#F8D197', color: '#763C19' }}>
              {products.length} {t('منتج', 'products')}
            </span>
          )}
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} cooperativeName={name} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl" style={{ background: '#fff', border: '1px solid #F8D197' }}>
            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: '#CC8F57' }} />
            <p className="text-sm" style={{ color: '#BA8944' }}>
              {t('لا توجد منتجات متاحة', 'No products available')}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default CooperativeDetails;