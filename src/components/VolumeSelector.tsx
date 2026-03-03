import React from 'react';
import { VolumeOption } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface VolumeSelectorProps {
  volumes: VolumeOption[];
  selected: VolumeOption;
  onChange: (volume: VolumeOption) => void;
  size?: 'sm' | 'md'; // sm = ProductCard, md = ProductDetails
}

const VolumeSelector: React.FC<VolumeSelectorProps> = ({
  volumes,
  selected,
  onChange,
  size = 'md',
}) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const isSm = size === 'sm';

  return (
    <div className="flex flex-wrap gap-1.5" dir={isRtl ? 'rtl' : 'ltr'}>
      {volumes.map((vol) => {
        const isActive = vol.value === selected.value && vol.unit === selected.unit;
        const label = isRtl ? vol.label.ar : vol.label.en;

        return (
          <button
            key={`${vol.value}-${vol.unit}`}
            onClick={(e) => {
              e.preventDefault();   // la y-navigate-sh f ProductCard
              e.stopPropagation();
              onChange(vol);
            }}
            className="rounded-lg font-semibold transition-all duration-200 active:scale-95 select-none"
            style={{
              padding: isSm ? '2px 8px' : '5px 14px',
              fontSize: isSm ? '0.65rem' : '0.78rem',
              border: isActive
                ? '1.5px solid #455324'
                : '1.5px solid #F0E4CC',
              background: isActive ? '#455324' : '#FDFAF5',
              color: isActive ? '#F8D197' : '#763C19',
              boxShadow: isActive ? '0 2px 8px #45532430' : 'none',
            }}
            title={`${label} — ${vol.price.toFixed(2)} MAD`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default VolumeSelector;