import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { cooperatives } from '../data';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const name   = isRtl ? product.name.ar   : product.name.en;
  const unit   = product.unit   ? (isRtl ? product.unit.ar   : product.unit.en)   : '';
  const origin = product.origin ? (isRtl ? product.origin.ar : product.origin.en) : null;

  // ── Resolve cooperative name ──────────────────────────────
  const cooperative = cooperatives.find((c) => c.id === product.cooperativeId);
  const cooperativeName = cooperative
    ? (isRtl ? cooperative.name.ar : cooperative.name.en)
    : null;

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: '#fff',
        border: '1.5px solid #F8D197',
        boxShadow: '0 2px 12px #F8D19730',
      }}
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
        <img
          src={product.image}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* dark gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ── Cooperative badge – TOP CENTER ──────────────── */}
        {cooperativeName && (
          <div
            className="absolute top-0 start-0 end-0 flex justify-center pt-2.5 pointer-events-none"
          >
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm truncate max-w-[85%] text-center"
              style={{
                background: 'rgba(69, 83, 36, 0.82)',
                color: '#F8D197',
                letterSpacing: '0.01em',
              }}
            >
              {cooperativeName}
            </span>
          </div>
        )}

        {/* rating badge */}
        <div
          className="absolute bottom-3 end-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.92)', color: '#BA8944' }}
        >
          <Star className="w-3 h-3 fill-current" />
          {product.rating}
        </div>

        {/* NEW badge */}
        {product.isNew && (
          <div
            className="absolute bottom-3 start-3 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: '#9FA93D', color: '#fff' }}
          >
            {isRtl ? 'جديد' : 'New'}
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && !product.isNew && (
          <div
            className="absolute bottom-3 start-3 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: '#CC8F57', color: '#fff' }}
          >
            {isRtl ? 'مميز' : 'Featured'}
          </div>
        )}
      </Link>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-grow">

        {/* origin */}
        {origin && (
          <div className="flex items-center justify-end mb-1.5">
            <span className="text-xs" style={{ color: '#BA8944' }}>
              📍 {origin}
            </span>
          </div>
        )}

        {/* name */}
        <Link to={`/product/${product.id}`}>
          <h3
            className="font-serif font-bold leading-snug line-clamp-1 mb-1 transition-colors"
            style={{ color: '#455324', fontSize: '1rem' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#CC8F57')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#455324')}
          >
            {name}
          </h3>
        </Link>

        {/* unit */}
        {unit && (
          <p className="text-xs mb-3" style={{ color: '#BA894480' }}>
            {unit}
          </p>
        )}

        {/* divider + price + cart */}
        <div className="mt-auto pt-3" style={{ borderTop: '1px solid #F8D197' }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold" style={{ color: '#455324' }}>
                {product.price.toFixed(2)}
              </span>
              <span className="text-xs ms-1 font-medium" style={{ color: '#CC8F57' }}>MAD</span>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 active:scale-95"
              style={{ background: '#455324', color: '#fff' }}
              aria-label={t('product.addToCart', 'Add to cart')}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#CC8F57'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#455324'; }}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;