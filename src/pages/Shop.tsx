import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data';
import { useLanguage } from '../context/LanguageContext';

const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sahara-terracotta/10 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-sahara-blue">
              <Filter className="w-5 h-5" />
              <h3 className="font-serif text-xl font-bold">{t('sections.categories')}</h3>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left rtl:text-right px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-sahara-terracotta text-white font-medium'
                      : 'text-sahara-blue hover:bg-sahara-sand'
                  }`}
                >
                  {category === 'All' ? (language === 'ar' ? 'الكل' : 'All') : category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold text-sahara-blue mb-2">
              {selectedCategory === 'All' ? (language === 'ar' ? 'كل المنتجات' : 'All Products') : selectedCategory}
            </h1>
            <p className="text-sahara-blue/60">
              {filteredProducts.length} {language === 'ar' ? 'منتجات' : 'products found'}
            </p>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-sahara-terracotta/30">
              <p className="text-lg text-sahara-blue/60">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
