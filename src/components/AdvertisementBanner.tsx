import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ads = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
    titleAr: 'زيوت عطرية طبيعية',
    titleEn: 'Pure Essential Oils',
    subtitleAr: '100% طبيعية من قلب الصحراء المغربية',
    subtitleEn: '100% natural from the heart of the Moroccan Sahara',
    badge: 'New',
    link: '/shop',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80',
    titleAr: 'عسل وأملو أصيل',
    titleEn: 'Authentic Honey & Amlou',
    subtitleAr: 'مباشرة من مناحل كلميم-واد نون',
    subtitleEn: 'Directly from Guelmim-Oued Noun apiaries',
    badge: 'Best Seller',
    link: '/shop',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80',
    titleAr: 'توابل وأعشاب مغربية',
    titleEn: 'Moroccan Spices & Herbs',
    subtitleAr: 'مختارة ومعتمدة — نكهات أصيلة',
    subtitleEn: 'Selected & certified — authentic flavors',
    badge: 'Promo',
    link: '/shop',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=1200&q=80',
    titleAr: 'تمور وفواكه مجففة',
    titleEn: 'Dates & Dried Fruits',
    subtitleAr: 'محصودة من قلب الصحراء، تُشحن إلى بيتك',
    subtitleEn: 'Harvested from the desert, shipped to your door',
    badge: 'Saison',
    link: '/shop',
  },
];

interface Props {
  isRtl: boolean;
}

export default function AdvertisementBanner({ isRtl }: Props) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % ads.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ad = ads[current];

  const goTo = (i: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(i);
      setFade(true);
    }, 300);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9FA93D' }}>
            {isRtl ? 'إعلاناتنا' : 'Publicités'}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#455324' }}>
            {isRtl ? 'عروض مميزة' : 'Nos Promotions'}
          </h2>
        </div>
      </div>

      {/* Banner */}
      <Link to={ad.link}>
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer"
          style={{
            height: '300px',
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Image */}
          <img
            src={ad.image}
            alt={isRtl ? ad.titleAr : ad.titleEn}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: isRtl
                ? 'linear-gradient(to left, rgba(69,83,36,0.78) 40%, rgba(0,0,0,0.05) 100%)'
                : 'linear-gradient(to right, rgba(69,83,36,0.78) 40%, rgba(0,0,0,0.05) 100%)',
            }}
          />

          {/* Badge */}
          <span
            className="absolute top-5 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
            style={{
              background: '#CC8F57',
              [isRtl ? 'right' : 'left']: '20px',
            }}
          >
            {ad.badge}
          </span>

          {/* Text */}
          <div
            className="absolute bottom-0 p-8"
            style={{ [isRtl ? 'right' : 'left']: 0 }}
          >
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-1">
              {isRtl ? ad.titleAr : ad.titleEn}
            </h3>
            <p className="text-sm md:text-base mb-5" style={{ color: '#F7E5CD' }}>
              {isRtl ? ad.subtitleAr : ad.subtitleEn}
            </p>
            <span
              className="inline-block text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
              style={{ background: '#F8D197', color: '#455324' }}
            >
              {isRtl ? 'اكتشف الآن ←' : 'Découvrir →'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              key={current}
              className="h-full"
              style={{
                background: '#F8D197',
                animation: 'adProgress 5s linear forwards',
              }}
            />
          </div>
        </div>
      </Link>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {ads.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? '#455324' : '#d6b896',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes adProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}