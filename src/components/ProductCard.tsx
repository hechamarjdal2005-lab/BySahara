import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const name = language === 'ar' ? product.name.ar : product.name.en;
  const price = product.price.toFixed(2);

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-sahara-terracotta/10">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-sahara-terracotta shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {product.rating}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-sahara-terracotta uppercase tracking-wider font-medium">
            {product.category}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-serif font-bold text-sahara-blue mt-1 group-hover:text-sahara-terracotta transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-sahara-blue">${price}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-sahara-blue text-white p-2 rounded-full hover:bg-sahara-terracotta transition-colors shadow-sm active:scale-95 transform"
            aria-label={t('product.addToCart')}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
