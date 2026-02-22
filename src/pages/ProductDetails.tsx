import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { products, cooperatives } from '../data';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');

  const product = products.find((p) => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-sahara-blue mb-4">Product not found</h2>
        <Link to="/shop" className="text-sahara-terracotta hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const cooperative = cooperatives.find((c) => c.id === product.cooperativeId);
  const name = language === 'ar' ? product.name.ar : product.name.en;
  const description = language === 'ar' ? product.description.ar : product.description.en;
  const coopName = cooperative ? (language === 'ar' ? cooperative.name.ar : cooperative.name.en) : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/shop" 
        className="inline-flex items-center text-sahara-blue/60 hover:text-sahara-terracotta mb-8 transition-colors"
      >
        {language === 'ar' ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
        {language === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-sahara-terracotta/10">
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-sahara-terracotta bg-sahara-terracotta/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {cooperative && (
              <Link to={`/cooperatives/${cooperative.id}`} className="text-sm text-sahara-blue/60 hover:text-sahara-blue underline decoration-dotted">
                {t('product.cooperative')}: {coopName}
              </Link>
            )}
          </div>

          <h1 className="font-serif text-4xl font-bold text-sahara-blue mb-4">{name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-sahara-blue">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-sahara-blue">{product.rating}</span>
              <span className="text-sahara-blue/40 text-sm">(124 reviews)</span>
            </div>
          </div>

          <p className="text-sahara-blue/80 text-lg leading-relaxed mb-8">
            {description}
          </p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-sahara-terracotta text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-sahara-blue transition-colors shadow-lg shadow-sahara-terracotta/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              {t('product.addToCart')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-sahara-blue/70">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-sahara-terracotta/10">
              <Truck className="w-6 h-6 text-sahara-terracotta" />
              <span>Free worldwide shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-sahara-terracotta/10">
              <ShieldCheck className="w-6 h-6 text-sahara-terracotta" />
              <span>Authentic product guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-sahara-terracotta/10 overflow-hidden">
        <div className="flex border-b border-sahara-terracotta/10">
          {(['description', 'ingredients', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-sahara-sand text-sahara-terracotta border-b-2 border-sahara-terracotta'
                  : 'text-sahara-blue/60 hover:text-sahara-blue hover:bg-gray-50'
              }`}
            >
              {t(`product.${tab}`)}
            </button>
          ))}
        </div>
        <div className="p-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-sahara-blue/80">
              <p>{description}</p>
              <p className="mt-4">
                Handcrafted with care by the artisans of {coopName}. By purchasing this product, you directly support sustainable livelihoods in the region.
              </p>
            </div>
          )}
          {activeTab === 'ingredients' && (
            <div className="prose max-w-none text-sahara-blue/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>100% Natural Ingredients</li>
                <li>No artificial preservatives</li>
                <li>Ethically sourced</li>
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-center py-8 text-sahara-blue/60">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
