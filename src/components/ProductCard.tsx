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
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: 'auto', paddingBottom: '120%' }}>
        <img
          src={product.image}
          alt={name}
          className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* dark gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ── Cooperative badge – TOP CENTER ──────────────── */}
        {cooperativeName && (
          <div
            className="absolute top-0 start-0 end-0 flex justify-center pt-0.5 sm:pt-1.5 pointer-events-none"
          >
            <span
              className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-md backdrop-blur-sm truncate max-w-[80%] text-center"
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
          className="absolute bottom-1 sm:bottom-2 end-1 sm:end-2 flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.92)', color: '#BA8944' }}
        >
          <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
          {product.rating}
        </div>

        {/* NEW badge */}
        {product.isNew && (
          <div
            className="absolute bottom-1 sm:bottom-2 start-1 sm:start-2 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
            style={{ background: '#9FA93D', color: '#fff' }}
          >
            {isRtl ? 'جديد' : 'New'}
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && !product.isNew && (
          <div
            className="absolute bottom-1 sm:bottom-2 start-1 sm:start-2 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
            style={{ background: '#CC8F57', color: '#fff' }}
          >
            {isRtl ? 'مميز' : 'Featured'}
          </div>
        )}
      </Link>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="px-1.5 py-1.5 sm:p-2 md:p-3 flex flex-col flex-grow">

        {/* origin */}
        {origin && (
          <div className="flex items-center justify-end mb-0.5">
            <span className="text-xs" style={{ color: '#BA8944' }}>
              📍 {origin}
            </span>
          </div>
        )}

        {/* name */}
        <Link to={`/product/${product.id}`}>
          <h3
            className="font-serif font-bold leading-tight line-clamp-1 mb-0.5 transition-colors text-[11px] sm:text-xs md:text-sm"
            style={{ color: '#455324' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#CC8F57')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#455324')}
          >
            {name}
          </h3>
        </Link>

        {/* unit */}
        {unit && (
          <p className="text-[10px] sm:text-xs mb-1" style={{ color: '#BA894480' }}>
            {unit}
          </p>
        )}

        {/* divider + price + cart */}
        <div className="mt-auto pt-1" style={{ borderTop: '1px solid #F8D197' }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#455324' }}>
                {product.price.toFixed(2)}
              </span>
              <span className="text-[10px] sm:text-xs ms-0.5 font-medium" style={{ color: '#CC8F57' }}>MAD</span>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg transition-all duration-200 active:scale-95"
              style={{ background: '#455324', color: '#fff' }}
              aria-label={t('product.addToCart', 'Add to cart')}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#CC8F57'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#455324'; }}
            >
              <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;