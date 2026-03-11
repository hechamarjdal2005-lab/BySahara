import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star } from 'lucide-react';
import { Product, VolumeOption } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import VolumeSelector from './VolumeSelector';

// ─── Interactive Star Rating ─────────────────────────────────
interface StarRatingProps {
  productId: string;
  baseRating: number;
  isRtl: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ productId, baseRating, isRtl }) => {
  const storageKey = `rating_${productId}`;
  const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

  const [userRating, setUserRating] = useState<number | null>(saved ? parseInt(saved) : null);
  const [hovered, setHovered]       = useState<number | null>(null);
  const [showThank, setShowThank]   = useState(false);

  const displayRating = userRating ?? baseRating;
  const activeStars   = hovered ?? userRating ?? Math.round(baseRating);

  const handleRate = (e: React.MouseEvent, star: number) => {
    e.preventDefault();
    e.stopPropagation();
    setUserRating(star);
    localStorage.setItem(storageKey, String(star));
    setShowThank(true);
    setTimeout(() => setShowThank(false), 1800);
  };

  return (
    <div
      className="absolute bottom-2 end-2 flex flex-col items-end gap-1"
      onClick={(e) => e.preventDefault()}
    >
      {/* Thank you toast */}
      {showThank && (
        <div
          className="px-2 py-0.5 rounded-full text-xs font-bold shadow-md"
          style={{
            background: '#455324',
            color: '#F8D197',
            animation: 'fadeSlideIn 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {isRtl ? '🙏 شكراً!' : '🙏 Merci!'}
        </div>
      )}

      {/* Stars row */}
      <div
        className="flex items-center gap-0.5 px-2 py-1 rounded-full shadow-sm backdrop-blur-sm"
        style={{ background: 'rgba(255,255,255,0.95)' }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={(e) => handleRate(e, star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="transition-transform duration-100 hover:scale-125 active:scale-110"
            style={{ lineHeight: 1, padding: '1px' }}
            aria-label={`Rate ${star} star`}
          >
            <Star
              className="w-3 h-3"
              style={{
                fill: star <= activeStars ? '#BA8944' : 'transparent',
                color: star <= activeStars ? '#BA8944' : '#D4C5A0',
                transition: 'fill 0.15s, color 0.15s',
              }}
            />
          </button>
        ))}
        <span className="text-xs font-bold ms-1" style={{ color: '#BA8944' }}>
          {userRating ? userRating.toFixed(1) : baseRating}
        </span>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  cooperativeName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cooperativeName }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const name = isRtl ? product.name.ar : product.name.en;
  const origin = product.origin ? (isRtl ? product.origin.ar : product.origin.en) : null;

  const [selectedVolume, setSelectedVolume] = useState<VolumeOption | null>(
    product.volumes && product.volumes.length > 0 ? product.volumes[0] : null
  );

  const currentPrice = selectedVolume ? selectedVolume.price : product.price;
  const currentUnit = selectedVolume
    ? (isRtl ? selectedVolume.label.ar : selectedVolume.label.en)
    : (product.unit ? (isRtl ? product.unit.ar : product.unit.en) : '');

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: '#FDFAF5',
        border: '1.5px solid #F8D197',
        boxShadow: '0 2px 12px #F8D19730',
        height: '100%',
      }}
    >
      {/* ── Image ── */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden flex-shrink-0"
        style={{ height: '180px' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #F7F1E8 0%, #EDD9AA25 100%)' }}
        />
        <img
          src={product.image}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-3"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {cooperativeName && (
          <div className="absolute top-0 start-0 end-0 flex justify-center pt-2.5 pointer-events-none">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm truncate max-w-[85%] text-center"
              style={{ background: 'rgba(69, 83, 36, 0.82)', color: '#F8D197' }}
            >
              {cooperativeName}
            </span>
          </div>
        )}

        <StarRating productId={product.id} baseRating={product.rating} isRtl={isRtl} />

        {product.isNew && (
          <div className="absolute bottom-2 start-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#9FA93D', color: '#fff' }}>
            {isRtl ? 'جديد' : 'New'}
          </div>
        )}
        {product.isFeatured && !product.isNew && (
          <div className="absolute bottom-2 start-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#CC8F57', color: '#fff' }}>
            {isRtl ? 'مميز' : 'Featured'}
          </div>
        )}
      </Link>

      {/* ── Content ── */}
      <div className="flex flex-col flex-grow" dir={isRtl ? 'rtl' : 'ltr'}>

        {/* Info */}
        <div className="px-3 pt-3 pb-2 flex flex-col flex-grow">
          {origin && (
            <span className="text-xs mb-1 block" style={{ color: '#BA8944' }}>📍 {origin}</span>
          )}

          <Link to={`/product/${product.id}`}>
            <h3
              className="font-serif font-bold leading-snug line-clamp-2 mb-2 transition-colors"
              style={{ color: '#455324', fontSize: '0.875rem', minHeight: '2.5rem' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#CC8F57')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#455324')}
            >
              {name}
            </h3>
          </Link>

          {product.volumes && product.volumes.length > 0 && (
            <div className="mb-2">
              <VolumeSelector
                volumes={product.volumes}
                selected={selectedVolume}
                onChange={setSelectedVolume}
                size="sm"
              />
            </div>
          )}

          {(!product.volumes || product.volumes.length === 0) && currentUnit && (
            <p className="text-xs mb-2" style={{ color: '#BA894480' }}>{currentUnit}</p>
          )}

          {/* Price */}
          <div className="mt-auto pt-2 pb-1" style={{ borderTop: '1px solid #F8D197' }}>
            <span className="text-lg font-bold" style={{ color: '#455324' }}>
              {currentPrice.toFixed(2)}
            </span>
            <span className="text-xs ms-1 font-medium" style={{ color: '#CC8F57' }}>MAD</span>
            {selectedVolume && (
              <span className="text-xs ms-1" style={{ color: '#BA894480' }}>
                / {isRtl ? selectedVolume.label.ar : selectedVolume.label.en}
              </span>
            )}
          </div>
        </div>

        {/* ── Add to Cart – full width f bas ── */}
        <div className="px-3 pb-3">
          <button
            onClick={() => addToCart(product, selectedVolume ?? undefined)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
            style={{ background: '#CC8F57', color: '#fff' }}
            aria-label={t('product.addToCart', 'Add to cart')}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#b87d4a'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#CC8F57'; }}
          >
            <ShoppingBag className="w-4 h-4" />
            {isRtl ? 'أضف للسلة' : 'Add to cart'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;