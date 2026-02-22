import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { cooperatives, products } from '../data';
import { useLanguage } from '../context/LanguageContext';

const CooperativeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const cooperative = cooperatives.find((c) => c.id === id);
  
  if (!cooperative) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-sahara-blue mb-4">Cooperative not found</h2>
        <Link to="/cooperatives" className="text-sahara-terracotta hover:underline">
          Back to Cooperatives
        </Link>
      </div>
    );
  }

  const coopProducts = products.filter((p) => p.cooperativeId === cooperative.id);
  const name = language === 'ar' ? cooperative.name.ar : cooperative.name.en;
  const location = language === 'ar' ? cooperative.location.ar : cooperative.location.en;
  const description = language === 'ar' ? cooperative.description.ar : cooperative.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/cooperatives" 
        className="inline-flex items-center text-sahara-blue/60 hover:text-sahara-terracotta mb-8 transition-colors"
      >
        {language === 'ar' ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
        {language === 'ar' ? 'العودة للتعاونيات' : 'Back to Cooperatives'}
      </Link>

      {/* Hero / Header */}
      <div className="relative rounded-3xl overflow-hidden mb-12 h-[400px]">
        <img
          src={cooperative.image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
          <h1 className="text-white font-serif text-4xl md:text-5xl font-bold mb-4">{name}</h1>
          <div className="flex items-center text-white/90 text-lg">
            <MapPin className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-3xl font-bold text-sahara-blue mb-6">About the Cooperative</h2>
          <div className="prose prose-lg text-sahara-blue/80">
            <p>{description}</p>
            <p className="mt-4">
              Founded with a mission to preserve traditional craftsmanship, {name} brings together skilled artisans from the {location} region. By supporting this cooperative, you are helping to sustain local economies and keep ancient traditions alive.
            </p>
          </div>
        </div>
        <div className="bg-sahara-sand p-8 rounded-2xl h-fit">
          <h3 className="font-serif text-xl font-bold text-sahara-blue mb-4">Impact</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-sahara-terracotta/10 p-2 rounded-full text-sahara-terracotta">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold block text-sahara-blue">Empowerment</span>
                <span className="text-sm text-sahara-blue/70">Providing fair wages and independence to local artisans.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-sahara-terracotta/10 p-2 rounded-full text-sahara-terracotta">
                <LeafIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold block text-sahara-blue">Sustainability</span>
                <span className="text-sm text-sahara-blue/70">Using eco-friendly materials and traditional methods.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-sahara-blue mb-8">Products by {name}</h2>
        {coopProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coopProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sahara-blue/60">No products currently available from this cooperative.</p>
        )}
      </div>
    </div>
  );
};

// Simple icons for this component
const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
);

export default CooperativeDetails;
