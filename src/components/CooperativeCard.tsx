import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Cooperative } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CooperativeCardProps {
  cooperative: Cooperative;
}

const CooperativeCard: React.FC<CooperativeCardProps> = ({ cooperative }) => {
  const { language } = useLanguage();

  const name = language === 'ar' ? cooperative.name.ar : cooperative.name.en;
  const location = language === 'ar' ? cooperative.location.ar : cooperative.location.en;
  const description = language === 'ar' ? cooperative.description.ar : cooperative.description.en;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-sahara-terracotta/10 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={cooperative.image}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-serif text-xl font-bold truncate">{name}</h3>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-sahara-terracotta text-sm mb-3">
          <MapPin className="w-4 h-4 ltr:mr-1 rtl:ml-1" />
          <span>{location}</span>
        </div>
        
        <p className="text-sahara-blue/70 text-sm line-clamp-3 mb-4 flex-grow">
          {description}
        </p>
        
        <Link
          to={`/cooperatives/${cooperative.id}`}
          className="inline-flex items-center text-sahara-blue font-medium hover:text-sahara-terracotta transition-colors mt-auto group"
        >
          <span className="ltr:mr-2 rtl:ml-2">{language === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
          <ArrowRight className="w-4 h-4 transform ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
};

export default CooperativeCard;
