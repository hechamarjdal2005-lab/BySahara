import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Truck, ShieldCheck, Users } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CooperativeCard from '../components/CooperativeCard';
import { products, cooperatives } from '../data';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const featuredProducts = products.slice(0, 4);
  const featuredCooperatives = cooperatives.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=2000"
            alt="Sahara Desert"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light opacity-90 animate-fade-in-up delay-100">
            {t('hero.subtitle')}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-sahara-terracotta text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-sahara-terracotta transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up delay-200"
          >
            <span className="ltr:mr-2 rtl:ml-2">{t('hero.cta')}</span>
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-sahara-terracotta/10 text-center hover:shadow-md transition-shadow">
            <div className="bg-sahara-sand w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-sahara-terracotta">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2 text-sahara-blue">{t('features.quality.title')}</h3>
            <p className="text-sahara-blue/70">{t('features.quality.desc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-sahara-terracotta/10 text-center hover:shadow-md transition-shadow">
            <div className="bg-sahara-sand w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-sahara-terracotta">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2 text-sahara-blue">{t('features.cooperatives.title')}</h3>
            <p className="text-sahara-blue/70">{t('features.cooperatives.desc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-sahara-terracotta/10 text-center hover:shadow-md transition-shadow">
            <div className="bg-sahara-sand w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-sahara-terracotta">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2 text-sahara-blue">{t('features.delivery.title')}</h3>
            <p className="text-sahara-blue/70">{t('features.delivery.desc')}</p>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-sahara-blue">
            {t('sections.bestSellers')}
          </h2>
          <Link to="/shop" className="text-sahara-terracotta hover:text-sahara-blue font-medium flex items-center transition-colors">
            <span className="ltr:mr-1 rtl:ml-1">{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Cooperatives */}
      <section className="bg-sahara-sand py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-sahara-blue mb-4">
              {t('sections.featuredCooperatives')}
            </h2>
            <p className="text-sahara-blue/70 max-w-2xl mx-auto">
              {t('features.cooperatives.desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCooperatives.map((coop) => (
              <CooperativeCard key={coop.id} cooperative={coop} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
