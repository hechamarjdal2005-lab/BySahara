import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, ArrowRight, Users, Leaf, Award, Phone, Mail, Package } from 'lucide-react';
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

  // ── Not Found ────────────────────────────────────────────────
  if (!cooperative) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 sm:px-6"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-6"
          style={{ background: '#F8D197' }}>
          <MapPin className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: '#455324' }} />
        </div>
        <h2 className="font-serif text-lg sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: '#455324' }}>
          {t('التعاونية غير موجودة', 'Cooperative not found')}
        </h2>
        <Link to="/cooperatives"
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base text-white transition-opacity hover:opacity-90"
          style={{ background: '#455324' }}>
          {isRtl ? <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          {t('العودة للتعاونيات', 'Back to Cooperatives')}
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
    {
      icon: <Users className="w-5 h-5" />,
      title: t('التمكين', 'Empowerment'),
      desc:  t('أجور عادلة واستقلالية للحرفيين المحليين', 'Fair wages and independence for local artisans.'),
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      title: t('الاستدامة', 'Sustainability'),
      desc:  t('مواد صديقة للبيئة وطرق تقليدية', 'Eco-friendly materials and traditional methods.'),
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: t('الجودة', 'Quality'),
      desc:  t('رقابة صارمة لضمان أعلى المعايير', 'Rigorous quality control ensuring the highest standards.'),
    },
  ];

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#F7E5CD20' }}>

      {/* ── Back link ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pt-6 sm:pt-8">
        <Link
          to="/cooperatives"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
          style={{ color: '#BA8944' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#455324')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#BA8944')}
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          {t('العودة للتعاونيات', 'Back to Cooperatives')}
        </Link>
      </div>

      {/* ── Hero Image ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 mt-4 sm:mt-6">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-40 sm:h-60 md:h-80 lg:h-[440px] shadow-xl">
          <img
            src={cooperative.image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* certifications */}
          {cooperative.certifications && cooperative.certifications.length > 0 && (
            <div className="absolute top-3 sm:top-5 start-3 sm:start-5 flex gap-1.5 sm:gap-2">
              {cooperative.certifications.map((cert) => (
                <span key={cert}
                  className="text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full"
                  style={{ background: '#9FA93D', color: '#fff' }}>
                  {cert}
                </span>
              ))}
            </div>
          )}

          {/* title overlay */}
          <div className="absolute bottom-0 start-0 end-0 p-4 sm:p-6 md:p-8 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-2"
              style={{ color: '#F8D197' }}>
              {t('تعاونية', 'Cooperative')}
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight">
              {name}
            </h1>
            <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#F8D197' }} />
              <span className="font-medium">{city}</span>
              <span style={{ color: '#F8D197' }}>·</span>
              <span className="opacity-80">{province}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">

        {/* Left: description ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">

          {/* about card */}
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm"
            style={{ background: '#fff', border: '1px solid #F8D197' }}>
            <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-5">
              <div className="w-0.5 sm:w-1 h-5 sm:h-6 rounded-full" style={{ background: '#CC8F57' }} />
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold" style={{ color: '#455324' }}>
                {t('عن التعاونية', 'About the Cooperative')}
              </h2>
            </div>
            <p className="leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#442413' }}>
              {description}
            </p>
            <p className="leading-relaxed text-xs sm:text-sm" style={{ color: '#763C19' }}>
              {t(
                `تأسست ${name} بهدف الحفاظ على الحرف التقليدية، وتجمع حرفيين ماهرين من منطقة ${city}. بدعمك لهذه التعاونية، تساهم في استدامة الاقتصاد المحلي والحفاظ على التراث العريق.`,
                `Founded with a mission to preserve traditional craftsmanship, ${name} brings together skilled artisans from the ${city} region. By supporting this cooperative, you help sustain local economies and keep ancient traditions alive.`
              )}
            </p>
          </div>

          {/* impact cards */}
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#455324' }}>
              {t('الأثر الاجتماعي', 'Social Impact')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {impactItems.map((item) => (
                <div key={item.title}
                  className="rounded-lg sm:rounded-2xl p-4 sm:p-5 text-center"
                  style={{ background: '#455324' }}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3"
                    style={{ background: '#F8D197', color: '#455324' }}>
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm mb-1" style={{ color: '#F8D197' }}>
                    {item.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: '#F7E5CD' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: info card ────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-sm sticky top-6 sm:top-8"
            style={{ border: '1px solid #F8D197' }}>

            {/* card header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ background: '#F8D197' }}>
              <h3 className="font-serif text-sm sm:text-lg font-bold" style={{ color: '#455324' }}>
                {t('معلومات التعاونية', 'Cooperative Info')}
              </h3>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4" style={{ background: '#fff' }}>
              {/* location */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#F8D197' }}>
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#CC8F57' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                    style={{ color: '#9FA93D' }}>
                    {t('الموقع', 'Localisation')}
                  </p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: '#442413' }}>
                    {city}
                  </p>
                  <p className="text-xs" style={{ color: '#BA8944' }}>{province}</p>
                  <p className="text-xs" style={{ color: '#BA8944' }}>
                    {lang(cooperative.region)}
                  </p>
                </div>
              </div>

              {/* members */}
              {cooperative.memberCount && (
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F8D197' }}>
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#CC8F57' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: '#9FA93D' }}>
                      {t('الأعضاء', 'Members')}
                    </p>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#442413' }}>
                      {cooperative.memberCount} {t('عضو', 'members')}
                    </p>
                  </div>
                </div>
              )}

              {/* founded */}
              {cooperative.foundedYear && (
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F8D197' }}>
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#CC8F57' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: '#9FA93D' }}>
                      {t('تأسست', 'Founded')}
                    </p>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#442413' }}>
                      {cooperative.foundedYear}
                    </p>
                  </div>
                </div>
              )}

              {/* phone */}
              {cooperative.phone && (
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F8D197' }}>
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#CC8F57' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: '#9FA93D' }}>
                      {t('الهاتف', 'Phone')}
                    </p>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#442413' }}>
                      {cooperative.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* products count */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#F8D197' }}>
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#CC8F57' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                    style={{ color: '#9FA93D' }}>
                    {t('المنتجات', 'Products')}
                  </p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: '#442413' }}>
                    {coopProducts.length} {t('منتج', 'products')}
                  </p>
                </div>
              </div>

              {/* certifications */}
              {cooperative.certifications && cooperative.certifications.length > 0 && (
                <div className="pt-2 border-t" style={{ borderColor: '#F8D197' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: '#9FA93D' }}>
                    {t('الشهادات', 'Certifications')}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {cooperative.certifications.map((cert) => (
                      <span key={cert}
                        className="text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                        style={{ background: '#9FA93D20', color: '#617131' }}>
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Products Section ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 rounded-full" style={{ background: '#CC8F57' }} />
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#455324' }}>
              {t(`منتجات ${name}`, `Products by ${name}`)}
            </h2>
          </div>
          {coopProducts.length > 0 && (
            <span className="text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
              style={{ background: '#F8D197', color: '#763C19' }}>
              {coopProducts.length} {t('منتج', 'products')}
            </span>
          )}
        </div>

        {coopProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {coopProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 rounded-xl sm:rounded-2xl"
            style={{ background: '#fff', border: '1px solid #F8D197' }}>
            <Package className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 opacity-30"
              style={{ color: '#CC8F57' }} />
            <p className="text-xs sm:text-sm" style={{ color: '#BA8944' }}>
              {t('لا توجد منتجات متاحة حالياً من هذه التعاونية', 'No products currently available from this cooperative.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CooperativeDetails;