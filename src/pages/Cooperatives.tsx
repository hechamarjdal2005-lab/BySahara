import React from 'react';
import { useTranslation } from 'react-i18next';
import CooperativeCard from '../components/CooperativeCard';
import { cooperatives } from '../data';

const Cooperatives: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sahara-blue mb-4">
          {t('nav.cooperatives')}
        </h1>
        <p className="text-xl text-sahara-blue/70 max-w-2xl mx-auto">
          {t('features.cooperatives.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cooperatives.map((coop) => (
          <CooperativeCard key={coop.id} cooperative={coop} />
        ))}
      </div>
    </div>
  );
};

export default Cooperatives;
