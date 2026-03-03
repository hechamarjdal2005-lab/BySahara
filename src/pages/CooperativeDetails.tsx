import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, ArrowRight, Users, Leaf, Award, Phone, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { cooperatives, products } from '../data';
import { useLanguage } from '../context/LanguageContext';

const CooperativeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const t = (ar: string, en: string) => (isRtl ? ar : en);
  const lang = (field: { en: string; ar: string }) => (isRtl ? field.ar : field.en);

  const cooperative = cooperatives.find((c) => c.id === id);

  if (!cooperative) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#F8D197' }}>
          <MapPin className="w-7 h-7" style={{ color: '#455324' }} />
        </div>
        <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#455324' }}>
          {t('التعاونية غير موجودة', 'Cooperative not found')}
        </h2>
        <Link to="/cooperatives"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-white text-sm"
          style={{ background: '#455324' }}>
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t('العودة', 'Back')}
        </Link>
      </div>
    );
  }

  const coopProducts = products.filter((p) => p.cooperativeId === cooperative.id);
  const name        = lang(cooperative.name);
  const city        = lang(cooperative.city);
  const province    = lang(cooperative.province);
  const description = lang(cooperative.description);

  const impactItems = [
    { icon: <Users className="w-4 h-4" />,  title: t('التمكين', 'Empowerment'), desc: t('أجور عادلة واستقلالية', 'Fair wages & independence') },
    { icon: <Leaf className="w-4 h-4" />,   title: t('الاستدامة', 'Sustainability'), desc: t('مواد صديقة للبيئة', 'Eco-friendly materials') },
    { icon: <Award className="w-4 h-4" />,  title: t('الجودة', 'Quality'), desc: t('رقابة صارمة للجودة', 'Rigorous quality control') },
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

      {/* ── Hero — compact on mobile ──────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-3">
        <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ height: '200px' }}>
          <img src={cooperative.image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {cooperative.certifications && cooperative.certifications.length > 0 && (
            <div className="absolute top-3 start-3 flex gap-1.5">
              {cooperative.certifications.map((cert) => (
                <span key={cert} className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#9FA93D', color: '#fff' }}>
                  {cert}
                </span>
              ))}
            </div>
          )}

          <div className="absolute bottom-0 start-0 end-0 px-4 py-3">
            <h1 className="font-serif text-xl font-bold text-white leading-tight mb-1">{name}</h1>
            <div className="flex items-center gap-1.5 text-white/85">
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#F8D197' }} />
              <span className="text-xs font-medium">{city}</span>
              <span style={{ color: '#F8D197' }}>·</span>
              <span className="text-xs opacity-80">{province}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">

        {/* ── Info strip (mobile: horizontal scroll pills) ────── */}
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
            {coopProducts.length} {t('منتج', 'products')}
          </div>
          {cooperative.certifications?.map((cert) => (
            <span key={cert} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#9FA93D20', color: '#617131' }}>
              ✓ {cert}
            </span>
          ))}
        </div>

        {/* ── Desktop: 2-col layout / Mobile: stacked ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Description */}
          <div className="lg:col-span-2 rounded-2xl p-4 sm:p-6" style={{ background: '#fff', border: '1px solid #F0E4CC' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
              <h2 className="font-semibold text-base" style={{ color: '#455324' }}>
                {t('عن التعاونية', 'About the Cooperative')}
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#442413' }}>{description}</p>
          </div>

          {/* Location card — hidden on mobile (info already in pills) */}
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

        {/* ── Impact — 3 small cards ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {impactItems.map((item) => (
            <div key={item.title} className="rounded-xl p-3 text-center" style={{ background: '#455324' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5" style={{ background: '#F8D197', color: '#455324' }}>
                {item.icon}
              </div>
              <h4 className="font-bold text-xs mb-0.5" style={{ color: '#F8D197' }}>{item.title}</h4>
              <p className="leading-tight" style={{ fontSize: '0.6rem', color: '#F7E5CD' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Products ────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
            <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
              {t('المنتجات', 'Products')}
            </h2>
          </div>
          {coopProducts.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#F8D197', color: '#763C19' }}>
              {coopProducts.length} {t('منتج', 'products')}
            </span>
          )}
        </div>

        {coopProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {coopProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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