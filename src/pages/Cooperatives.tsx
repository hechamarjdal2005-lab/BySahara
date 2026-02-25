import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { cooperatives } from '../data';
import { useLanguage } from '../context/LanguageContext';
import GuelmimMap from '../components/GuelmimMap';

const provinceNames: Record<string, { en: string; ar: string; fr: string }> = {
  'sidi-ifni': { en: 'Sidi Ifni', ar: 'سيدي إفني', fr: 'Sidi Ifni' },
  'guelmim':   { en: 'Guelmim',   ar: 'كلميم',     fr: 'Guelmim' },
  'tan-tan':   { en: 'Tan-Tan',   ar: 'طانطان',    fr: 'Tan-Tan' },
  'assa-zag':  { en: 'Assa-Zag',  ar: 'أسا الزاك', fr: 'Assa-Zag' },
};

const Cooperatives: React.FC = () => {
  const { language } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const isRtl = language === 'ar';

  // Provinces li 3ndhom cooperatives
  const activeProvinces = [...new Set(cooperatives.map((c) => c.province))];

  // Filter
  const filteredCoops = selectedProvince
    ? cooperatives.filter((c) => c.province === selectedProvince)
    : cooperatives;

  const getProvinceName = (id: string) => {
    const p = provinceNames[id];
    if (!p) return id;
    return language === 'ar' ? p.ar : language === 'fr' ? p.fr : p.en;
  };

  return (
    <div className="pb-16" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Hero Header */}
      <section className="bg-sahara-sand py-16 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sahara-blue mb-4">
          {language === 'ar' ? 'التعاونيات' : language === 'fr' ? 'Les Coopératives' : 'Cooperatives'}
        </h1>
        <p className="text-sahara-blue/70 max-w-xl mx-auto text-lg">
          {language === 'ar'
            ? 'تمكين النساء والحرفيين في مجتمعات جهة كلميم واد نون'
            : language === 'fr'
            ? 'Autonomisation des femmes et artisans de la région Guelmim-Oued Noun'
            : 'Empowering women and artisans across the Guelmim-Oued Noun region'}
        </p>
      </section>

      {/* Map + Cooperatives Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* MAP — left/right side */}
          <div className="lg:col-span-5 sticky top-8">
            <h2 className="font-serif text-2xl font-bold text-sahara-blue mb-2 text-center">
              {language === 'ar'
                ? 'اختر المقاطعة'
                : language === 'fr'
                ? 'Choisir une province'
                : 'Select a Province'}
            </h2>
            <p className="text-sm text-gray-400 text-center mb-5">
              {language === 'ar'
                ? 'انقر على المقاطعة لعرض تعاونياتها'
                : language === 'fr'
                ? 'Cliquez sur une province pour voir ses coopératives'
                : 'Click on a province to see its cooperatives'}
            </p>

            <GuelmimMap
              selectedProvince={selectedProvince}
              onSelectProvince={setSelectedProvince}
              activeProvinces={activeProvinces}
            />

            {/* Active filter badge */}
            {selectedProvince && (
              <div className="flex justify-center mt-4">
                <div className="inline-flex items-center gap-2 bg-sahara-terracotta/10 text-sahara-terracotta px-4 py-2 rounded-full text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{getProvinceName(selectedProvince)}</span>
                  <button
                    onClick={() => setSelectedProvince(null)}
                    className="hover:bg-sahara-terracotta/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* COOPERATIVES LIST */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-sahara-blue">
                {selectedProvince
                  ? getProvinceName(selectedProvince)
                  : language === 'ar' ? 'كل التعاونيات' : language === 'fr' ? 'Toutes les coopératives' : 'All Cooperatives'}
              </h2>
              <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {filteredCoops.length} {language === 'ar' ? 'تعاونية' : language === 'fr' ? 'coopérative(s)' : 'cooperative(s)'}
              </span>
            </div>

            {filteredCoops.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>
                  {language === 'ar'
                    ? 'لا توجد تعاونيات في هذه المقاطعة'
                    : language === 'fr'
                    ? 'Aucune coopérative dans cette province'
                    : 'No cooperatives in this province'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredCoops.map((coop) => {
                  const name = language === 'ar' ? coop.name.ar : coop.name.en;
                  const location = language === 'ar' ? coop.location.ar : coop.location.en;
                  const description = language === 'ar' ? coop.description.ar : coop.description.en;

                  return (
                    <div
                      key={coop.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={coop.image}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className="absolute bottom-3 left-3 right-3 text-white font-bold text-lg leading-tight">
                          {name}
                        </h3>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-sahara-terracotta text-sm font-medium mb-3">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{location}</span>
                        </div>
                        <p className="text-sahara-blue/70 text-sm line-clamp-2 mb-4">
                          {description}
                        </p>
                        <Link
                          to={`/cooperatives/${coop.id}`}
                          className="inline-flex items-center gap-1.5 text-sahara-blue font-medium text-sm hover:text-sahara-terracotta transition-colors"
                        >
                          {language === 'ar' ? 'اقرأ المزيد' : language === 'fr' ? 'Lire plus' : 'Read more'}
                          {isRtl
                            ? <ArrowLeft className="w-4 h-4" />
                            : <ArrowRight className="w-4 h-4" />}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cooperatives;