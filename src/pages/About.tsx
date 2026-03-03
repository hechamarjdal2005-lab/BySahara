import React from 'react';
import { useTranslation } from 'react-i18next';

const values = [
  {
    titleAr: 'الأصالة',
    titleEn: 'Authenticity',
    descAr: 'كل منتج مصنوع يدوياً باستخدام تقنيات أجدادية توارثتها أجيال من الحرفيين الأمازيغ في منطقة كلميم.',
    descEn: 'Every product is handcrafted using ancestral techniques passed down through generations of Amazigh artisans in the Guelmim region.',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20 4 L24 14 L35 14 L26 21 L29 32 L20 26 L11 32 L14 21 L5 14 L16 14 Z" />
      </svg>
    ),
    accent: '#9FA93D', bg: 'rgba(159,169,61,0.13)',
  },
  {
    titleAr: 'جودة حرفية',
    titleEn: 'Artisan Quality',
    descAr: 'نختار فقط أجود المنتجات — زيوت معصورة على البارد، دقيق مطحون على الحجر، أعشاب برية — مباشرة من التعاونيات.',
    descEn: 'We select only the finest products — cold-pressed oils, stone-ground flour, wild herbs — sourced directly from the cooperatives.',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="20" cy="20" r="14" /><path d="M13 20 L18 25 L27 15" />
      </svg>
    ),
    accent: '#CC8F57', bg: 'rgba(204,143,87,0.13)',
  },
  {
    titleAr: 'أثر مجتمعي',
    titleEn: 'Social Impact',
    descAr: 'كل عملية شراء تدعم مباشرة التعاونيات التي تقودها المرأة وتحافظ على التراث الثقافي لكلميم-واد نون.',
    descEn: 'Every purchase directly supports women-led cooperatives and preserves the cultural heritage of Guelmim-Oued Noun.',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20 34 C20 34 6 26 6 16 A8 8 0 0 1 20 12 A8 8 0 0 1 34 16 C34 26 20 34 20 34 Z" />
        <circle cx="20" cy="19" r="3" />
      </svg>
    ),
    accent: '#BA8944', bg: 'rgba(186,137,68,0.13)',
  },
];

const GeometricPattern: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
    <defs>
      <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <polygon points="30,4 56,18 56,42 30,56 4,42 4,18" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="30" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo)" />
  </svg>
);

const About: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen" style={{ background: '#FDFAF5' }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d3a14 0%, #455324 55%, #617131 100%)' }}>
        <GeometricPattern opacity={0.07} />
        <div className="absolute top-0 start-0 end-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #F8D197, transparent)' }} />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-10 py-10 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(248,209,151,0.15)', color: '#F8D197', border: '1px solid rgba(248,209,151,0.3)' }}>
              {tr('قصتنا', 'Our Story')}
            </span>
            <h1 className="font-serif font-bold leading-tight mb-4 text-3xl sm:text-5xl" style={{ color: '#fff' }}>
              {tr('من نحن', 'About')}{' '}
              <span style={{ color: '#F8D197' }}>BySahara</span>
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(248,209,151,0.3)' }} />
              <span style={{ color: '#F8D197', opacity: 0.6 }}>✦</span>
              <div className="h-px flex-1" style={{ background: 'rgba(248,209,151,0.3)' }} />
            </div>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#F7E5CD', maxWidth: '38ch' }}>
              {tr(
                'BySahara أكثر من مجرد سوق — إنها جسر يربط التراث الحي لجنوب المغرب بالعالم.',
                "BySahara is more than a marketplace — it's a bridge connecting the living heritage of southern Morocco with the world."
              )}
            </p>
          </div>

          {/* Hero image — desktop only */}
          <div className="relative hidden md:block">
            <div className="absolute -inset-3 rounded-3xl" style={{ background: 'rgba(248,209,151,0.08)', border: '1px solid rgba(248,209,151,0.15)' }} />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img src="https://images.unsplash.com/photo-1509233725247-49e657319b85?auto=format&fit=crop&q=80&w=900" alt="Sahara desert Morocco" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,58,20,0.55) 0%, transparent 60%)' }} />
              <p className="absolute bottom-4 start-4 text-xs font-semibold" style={{ color: 'rgba(248,209,151,0.9)' }}>
                📍 {tr('كلميم-واد نون، المغرب', 'Guelmim-Oued Noun, Morocco')}
              </p>
            </div>
            <div className="absolute -bottom-5 -start-5 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl" style={{ background: '#F8D197' }}>
              <span className="text-xl">🏆</span>
              <div>
                <p className="text-xs font-bold" style={{ color: '#455324' }}>{tr('أصالة 100%', '100% Authentic')}</p>
                <p className="text-xs" style={{ color: '#763C19' }}>{tr('تأسست 2020', 'Est. 2020')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MISSION ═══════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 py-10 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-10 items-center">

          {/* Images — hidden on mobile to save space */}
          <div className="relative hidden md:block order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '4/5' }}>
              <img src="https://images.unsplash.com/photo-1590412613626-4444634710f3?auto=format&fit=crop&q=80&w=800" alt="Moroccan women cooperative" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -end-4 w-28 h-28 rounded-2xl overflow-hidden shadow-2xl" style={{ border: '3px solid #fff' }}>
              <img src="https://images.unsplash.com/photo-1575808142341-e39853744dbd?auto=format&fit=crop&q=80&w=300" alt="Medjool dates" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-1/2 -start-5 -translate-y-1/2 px-3 py-6 rounded-xl shadow-lg" style={{ background: '#455324', zIndex: 2, writingMode: 'vertical-rl' }}>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F8D197' }}>
                {tr('منتجات أصيلة', 'Authentic')}
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#9FA93D' }}>
              {tr('من نحن', 'Who We Are')}
            </p>
            <h2 className="font-serif font-bold leading-tight mb-4 text-2xl sm:text-4xl" style={{ color: '#2d3a14' }}>
              {tr('مهمتنا', 'Our Mission')}
            </h2>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-0.5 rounded-full" style={{ background: '#CC8F57' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#F8D197' }} />
            </div>
            <p className="leading-relaxed mb-4 text-sm sm:text-base" style={{ color: '#442413' }}>
              {tr(
                'نحن ندعم التعاونيات المحلية — خاصة التي تقودها المرأة — بإعطائها منصة عالمية لمشاركة منتجاتها الأصيلة. كل عملية شراء تُعيل أسرة وتحافظ على تقاليد عريقة.',
                'We empower local cooperatives — especially those led by women — by giving them a global stage to share their authentic products. Every purchase sustains a livelihood and preserves centuries-old traditions.'
              )}
            </p>
            <p className="leading-relaxed text-sm sm:text-base" style={{ color: '#763C19' }}>
              {tr(
                'من واحات أسا-الزاك إلى غابات أركان كلميم، نختار أجود المنتجات مباشرة من تعاونيات منطقة كلميم-واد نون.',
                'From the oases of Assa-Zag to the argan forests of Guelmim, we curate only the finest goods straight from the cooperatives of the Guelmim-Oued Noun region.'
              )}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                tr('عضوي 100%', '100% Organic'),
                tr('تجارة عادلة', 'Fair Trade'),
                tr('محلي الصنع', 'Locally Made'),
                tr('مستدام', 'Sustainable'),
              ].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#F7F1E8', color: '#617131', border: '1px solid #EDD9AA' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PHOTO BAND ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 pb-10 sm:pb-20">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { src: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=500', labelAr: 'زيوت الأركان', labelEn: 'Argan Oils' },
            { src: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=500', labelAr: 'توابل وأعشاب', labelEn: 'Spices & Herbs' },
            { src: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=500', labelAr: 'عسل بري', labelEn: 'Wild Honey' },
          ].map((img) => (
            <div key={img.src} className="relative overflow-hidden rounded-xl sm:rounded-2xl" style={{ aspectRatio: '3/4' }}>
              <img src={img.src} alt={tr(img.labelAr, img.labelEn)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-2 start-2 text-xs font-bold text-white">{tr(img.labelAr, img.labelEn)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-12 sm:py-20 px-5" style={{ background: '#2d3a14' }}>
        <GeometricPattern opacity={0.05} />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#9FA93D' }}>
              {tr('ما يحركنا', 'What Drives Us')}
            </p>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl" style={{ color: '#fff' }}>
              {tr('لماذا تختار BySahara؟', 'Why Choose BySahara?')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <div key={v.titleAr} className="group rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: i === 1 ? '#455324' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${i === 1 ? '#617131' : 'rgba(255,255,255,0.08)'}`,
                }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: v.bg, color: v.accent }}>
                  {v.svg}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: i === 1 ? '#F8D197' : '#fff' }}>
                  {tr(v.titleAr, v.titleEn)}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: i === 1 ? '#F7E5CD' : 'rgba(247,229,205,0.65)' }}>
                  {tr(v.descAr, v.descEn)}
                </p>
                <div className="mt-5 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-14" style={{ background: v.accent }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REGION BANNER ═════════════════════════════════════ */}
      <section className="px-5 py-10 sm:py-16">
        <div className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC8F57 0%, #BA8944 100%)' }}>
          <div className="absolute inset-0 opacity-10"><GeometricPattern opacity={1} /></div>
          <div className="absolute end-0 top-1/2 -translate-y-1/2 font-serif font-bold leading-none select-none pointer-events-none pe-4 sm:pe-6"
            style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: 'rgba(255,255,255,0.08)' }}>
            صحراء
          </div>
          <div className="relative px-6 sm:px-10 py-10 sm:py-16 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {tr('جذورنا', 'Our Roots')}
            </p>
            <h2 className="font-serif font-bold mb-4 text-2xl sm:text-4xl" style={{ color: '#fff' }}>
              {tr('كلميم-واد نون', 'Guelmim-Oued Noun')}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>✦</span>
              <div className="h-px w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
            </div>
            <p className="max-w-xl mx-auto leading-relaxed text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {tr(
                'جميع تعاونياتنا متجذرة في منطقة كلميم-واد نون — أرض تمازجت فيها الثقافات الصحراوية والأمازيغية لآلاف السنين لتخلق تقاليد حرفية فريدة.',
                'All our cooperatives are rooted in the Guelmim-Oued Noun region — a land where Saharan, Berber, and Sahrawi cultures have blended for millennia to create unique artisanal traditions.'
              )}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;