import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sahara-blue mb-6">
          {t('nav.about')}
        </h1>
        <div className="w-24 h-1 bg-sahara-terracotta mx-auto rounded-full"></div>
      </div>

      <div className="prose prose-lg mx-auto text-sahara-blue/80">
        <p className="lead text-xl text-center mb-12">
          BySahara is more than just a marketplace; it's a bridge connecting the rich heritage of Moroccan craftsmanship with the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1531513603004-927375276633?auto=format&fit=crop&q=80&w=800" 
              alt="Moroccan Artisan" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-sahara-blue mb-4">Our Mission</h2>
            <p className="mb-6">
              We aim to empower local cooperatives, particularly those led by women, by providing them with a global platform to showcase their authentic products. Every purchase supports sustainable livelihoods and preserves ancient traditions.
            </p>
            <p>
              From the golden dunes of Merzouga to the lush valleys of the Atlas Mountains, we curate only the finest, most authentic goods.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-sahara-terracotta/10">
          <h2 className="font-serif text-3xl font-bold text-sahara-blue mb-6 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-bold text-lg text-sahara-terracotta mb-2">Authenticity</h3>
              <p className="text-sm">Directly sourced from certified cooperatives.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-sahara-terracotta mb-2">Quality</h3>
              <p className="text-sm">Rigorous quality control for every item.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-sahara-terracotta mb-2">Impact</h3>
              <p className="text-sm">Fair trade practices that benefit artisans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
