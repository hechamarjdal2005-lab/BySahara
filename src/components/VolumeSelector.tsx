import React from 'react';
import { VolumeOption } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface VolumeSelectorProps {
  volumes: VolumeOption[];
  selected: VolumeOption | null;
  onChange: (volume: VolumeOption) => void;
  size?: 'sm' | 'md' | 'lg';
}

const VolumeSelector: React.FC<VolumeSelectorProps> = ({ 
  volumes, 
  selected, 
  onChange,
  size = 'md' 
}) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {volumes.map((volume) => {
        const label = isRtl ? volume.label.ar : volume.label.en;
        const isSelected = selected?.value === volume.value;

        return (
          <button
            key={volume.value}
            onClick={() => onChange(volume)}
            className={`rounded-lg font-medium transition-all duration-200 ${sizeClasses[size]}`}
            style={{
              background: isSelected ? '#455324' : '#F7F1E8',
              color: isSelected ? '#fff' : '#455324',
              border: isSelected ? '1.5px solid #455324' : '1.5px solid #EDD9AA',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.background = '#F0E4CC';
                (e.currentTarget as HTMLElement).style.borderColor = '#CC8F57';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.background = '#F7F1E8';
                (e.currentTarget as HTMLElement).style.borderColor = '#EDD9AA';
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default VolumeSelector;