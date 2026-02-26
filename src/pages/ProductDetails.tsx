import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft, ArrowRight, MapPin, Users, Award, Package } from 'lucide-react';
import { products, cooperatives } from '../data';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

type Tab = 'description' | 'details' | 'reviews';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);
  const lang = (field: { en: string; ar: string }) => (isRtl ? field.ar : field.en);

  const product = products.find((p) => p.id === id);

  // ── Not found ──────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
        dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: '#F8D197' }}>
          <Package className="w-9 h-9" style={{ color: '#455324' }} />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: '#455324' }}>
          {tr('المنتج غير موجود', 'Product not found')}
        </h2>
        <Link to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#455324' }}>
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {tr('العودة للمتجر', 'Back to Shop')}
        </Link>
      </div>
    );
  }

  const cooperative = cooperatives.find((c) => c.id === product.cooperativeId);
  const name        = lang(product.name);
  const description = lang(product.description);
  const unit        = product.unit ? lang(product.unit) : '';
  const origin      = product.origin ? lang(product.origin) : null;
  const coopName    = cooperative ? lang(cooperative.name) : '';
  const coopCity    = cooperative ? lang(cooperative.city) : '';

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'description', label: tr('الوصف',       'Description') },
    { id: 'details',     label: tr('التفاصيل',     'Details')     },
    { id: 'reviews',     label: tr('التقييمات',    'Reviews')     },
  ];

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#F7E5CD20' }}>

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: '#BA8944' }}>
          <Link to="/" className="hover:underline" style={{ color: '#BA8944' }}>
            {tr('الرئيسية', 'Home')}
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:underline" style={{ color: '#BA8944' }}>
            {tr('المتجر', 'Shop')}
          </Link>
          <span>/</span>
          <span style={{ color: '#455324', fontWeight: 600 }}>{name}</span>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">

        {/* LEFT — Image ───────────────────────────────────── */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-lg"
            style={{ aspectRatio: '1/1', border: '2px solid #F8D197' }}>
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
            />
            {/* badges */}
            <div className="absolute top-4 start-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: '#9FA93D', color: '#fff' }}>
                  {tr('جديد', 'New')}
                </span>
              )}
              {product.isFeatured && (
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: '#CC8F57', color: '#fff' }}>
                  {tr('مميز', 'Featured')}
                </span>
              )}
            </div>
            {/* rating */}
            <div className="absolute top-4 end-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold shadow backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.92)', color: '#BA8944' }}>
              <Star className="w-4 h-4 fill-current" />
              {product.rating}
            </div>
          </div>

          {/* cooperative mini card */}
          {cooperative && (
            <Link to={`/cooperatives/${cooperative.id}`}
              className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:shadow-md"
              style={{ background: '#fff', border: '1.5px solid #F8D197' }}>
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img src={cooperative.image} alt={coopName}
                  className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                  style={{ color: '#9FA93D' }}>
                  {tr('التعاونية', 'Cooperative')}
                </p>
                <p className="font-bold text-sm" style={{ color: '#455324' }}>{coopName}</p>
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: '#BA8944' }}>
                  <MapPin className="w-3 h-3" />
                  {coopCity}
                </div>
              </div>
              <div className="flex-shrink-0">
                {isRtl
                  ? <ArrowLeft className="w-4 h-4" style={{ color: '#CC8F57' }} />
                  : <ArrowRight className="w-4 h-4" style={{ color: '#CC8F57' }} />}
              </div>
            </Link>
          )}
        </div>

        {/* RIGHT — Info ────────────────────────────────────── */}
        <div className="flex flex-col">

          {/* category + origin */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{ background: '#F8D197', color: '#763C19' }}>
              {product.category}
            </span>
            {origin && (
              <span className="text-xs flex items-center gap-1" style={{ color: '#BA8944' }}>
                <MapPin className="w-3 h-3" /> {origin}
              </span>
            )}
          </div>

          {/* name */}
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ color: '#455324' }}>
            {name}
          </h1>

          {/* unit */}
          {unit && (
            <p className="text-sm mb-3" style={{ color: '#BA8944' }}>{unit}</p>
          )}

          {/* rating row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-4 h-4"
                  style={{
                    fill: s <= Math.round(product.rating) ? '#CC8F57' : 'transparent',
                    color: '#CC8F57',
                  }} />
              ))}
            </div>
            <span className="font-bold text-sm" style={{ color: '#455324' }}>
              {product.rating}
            </span>
            {product.reviewCount && (
              <span className="text-xs" style={{ color: '#BA894480' }}>
                ({product.reviewCount} {tr('تقييم', 'reviews')})
              </span>
            )}
          </div>

          {/* description preview */}
          <p className="text-base leading-relaxed mb-6 line-clamp-3" style={{ color: '#763C19' }}>
            {description}
          </p>

          {/* divider */}
          <div className="mb-6" style={{ borderTop: '1px solid #F8D197' }} />

          {/* price + qty + add to cart */}
          <div className="rounded-2xl p-5 mb-5"
            style={{ background: '#fff', border: '1.5px solid #F8D197' }}>

            {/* price */}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-bold" style={{ color: '#455324' }}>
                {product.price.toFixed(2)}
              </span>
              <span className="text-lg font-semibold" style={{ color: '#CC8F57' }}>MAD</span>
            </div>

            {/* qty stepper */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-semibold" style={{ color: '#763C19' }}>
                {tr('الكمية', 'Quantity')}
              </span>
              <div className="flex items-center rounded-xl overflow-hidden"
                style={{ border: '1.5px solid #F8D197' }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center transition-colors text-lg font-bold"
                  style={{ color: '#455324' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8D197')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  −
                </button>
                <span className="w-10 h-9 flex items-center justify-center font-bold text-sm"
                  style={{ color: '#455324', borderLeft: '1px solid #F8D197', borderRight: '1px solid #F8D197' }}>
                  {qty}
                </span>
                <button onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center transition-colors text-lg font-bold"
                  style={{ color: '#455324' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8D197')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  +
                </button>
              </div>
              <span className="text-xs" style={{ color: '#9FA93D' }}>
                {tr('المجموع:', 'Total:')} {(product.price * qty).toFixed(2)} MAD
              </span>
            </div>

            {/* add to cart btn */}
            <button onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-white transition-all duration-300 active:scale-95"
              style={{
                background: added
                  ? 'linear-gradient(135deg, #9FA93D, #617131)'
                  : 'linear-gradient(135deg, #455324, #617131)',
                boxShadow: '0 6px 20px #45532440',
              }}>
              <ShoppingBag className="w-5 h-5" />
              {added
                ? tr('✓ تمت الإضافة!', '✓ Added!')
                : t('product.addToCart', tr('أضف للسلة', 'Add to Cart'))}
            </button>
          </div>

          {/* guarantees */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Truck className="w-5 h-5" />,        text: tr('شحن مجاني', 'Free Shipping') },
              { icon: <ShieldCheck className="w-5 h-5" />,  text: tr('منتج أصيل مضمون', 'Authenticity Guaranteed') },
              { icon: <Award className="w-5 h-5" />,        text: tr('جودة معتمدة', 'Certified Quality') },
              { icon: <Users className="w-5 h-5" />,        text: tr('دعم التعاونيات', 'Supports Cooperatives') },
            ].map((g) => (
              <div key={g.text}
                className="flex items-center gap-2 p-3 rounded-xl text-xs font-medium"
                style={{ background: '#F7E5CD', color: '#455324' }}>
                <span style={{ color: '#CC8F57' }}>{g.icon}</span>
                {g.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: '#fff', border: '1.5px solid #F8D197' }}>

          {/* tab headers */}
          <div className="flex" style={{ borderBottom: '1.5px solid #F8D197' }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-4 text-sm font-bold transition-all duration-200"
                style={{
                  color: activeTab === tab.id ? '#455324' : '#BA8944',
                  background: activeTab === tab.id ? '#F8D197' : 'transparent',
                  borderBottom: activeTab === tab.id ? '2.5px solid #CC8F57' : '2.5px solid transparent',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="p-8">

            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-base leading-relaxed" style={{ color: '#442413' }}>
                  {description}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#763C19' }}>
                  {tr(
                    `صُنع بعناية فائقة على يد حرفيي ${coopName}. بشرائك لهذا المنتج، تدعم مباشرة سبل العيش المستدامة في المنطقة.`,
                    `Handcrafted with care by the artisans of ${coopName}. By purchasing this product, you directly support sustainable livelihoods in the region.`
                  )}
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: tr('المنتج', 'Product'),       value: name },
                  { label: tr('التعاونية', 'Cooperative'), value: coopName },
                  { label: tr('المدينة', 'City'),          value: coopCity },
                  { label: tr('الوحدة', 'Unit'),           value: unit || '—' },
                  { label: tr('المصدر', 'Origin'),         value: origin || '—' },
                  { label: tr('التصنيف', 'Category'),      value: product.category },
                  { label: tr('التقييم', 'Rating'),        value: `${product.rating} / 5` },
                  { label: tr('المكونات', 'Ingredients'),  value: tr('طبيعية 100%', '100% Natural') },
                ].map((row) => (
                  <div key={row.label}
                    className="flex justify-between items-center p-3 rounded-xl text-sm"
                    style={{ background: '#F7E5CD' }}>
                    <span className="font-semibold" style={{ color: '#763C19' }}>{row.label}</span>
                    <span style={{ color: '#442413' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#F8D197' }}>
                  <Star className="w-7 h-7" style={{ color: '#CC8F57' }} />
                </div>
                <p className="font-semibold mb-1" style={{ color: '#455324' }}>
                  {tr('لا توجد تقييمات بعد', 'No reviews yet')}
                </p>
                <p className="text-sm" style={{ color: '#BA8944' }}>
                  {tr('كن أول من يقيم هذا المنتج!', 'Be the first to review this product!')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;