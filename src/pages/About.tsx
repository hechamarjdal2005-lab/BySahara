import React from 'react';
import { useTranslation } from 'react-i18next';

const stats = [
  { value: '4',   labelKey: 'about.stats.cooperatives' },
  { value: '16+', labelKey: 'about.stats.products'     },
  { value: '100+',labelKey: 'about.stats.artisans'     },
  { value: '3',   labelKey: 'about.stats.provinces'    },
];

const values = [
  { icon: '🌿', titleKey: 'about.values.authenticity.title', descKey: 'about.values.authenticity.desc' },
  { icon: '✋', titleKey: 'about.values.quality.title',       descKey: 'about.values.quality.desc'       },
  { icon: '🤝', titleKey: 'about.values.impact.title',        descKey: 'about.values.impact.desc'        },
];

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#F7E5CD20' }} className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 60%, #9FA93D 100%)' }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: '#9FA93D' }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: '#F8D197' }} />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="uppercase tracking-widest text-sm mb-4" style={{ color: '#F8D197' }}>
            {t('about.eyebrow', 'Our Story')}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('nav.about')}
          </h1>
          <div className="w-20 h-1 mx-auto rounded-full mb-8" style={{ background: '#F8D197' }} />
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#F7E5CD' }}>
            {t(
              'about.hero.subtitle',
              'BySahara is more than a marketplace — it\'s a bridge connecting the living heritage of southern Morocco with the world.'
            )}
          </p>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section className="border-b" style={{ background: '#fff', borderColor: '#F8D197' }}>
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.labelKey}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#455324' }}>{s.value}</p>
              <p className="text-sm font-medium" style={{ color: '#CC8F57' }}>
                {t(s.labelKey, s.labelKey.split('.').pop())}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-14 items-center ${isRtl ? 'md:flex-row-reverse' : ''}`}>

          {/* image */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-2xl translate-x-3 translate-y-3"
              style={{ background: '#F8D197', zIndex: 0 }}
            />
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ zIndex: 1 }}>
              <img
                src="https://images.unsplash.com/photo-1531513603004-927375276633?auto=format&fit=crop&q=80&w=800"
                alt="Moroccan Artisan"
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
            {/* badge */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full flex items-center justify-center shadow-lg text-white text-center text-xs font-bold leading-tight"
              style={{ background: '#CC8F57', zIndex: 2 }}
            >
              <span>100%<br />Authentic</span>
            </div>
          </div>

          {/* text */}
          <div>
            <p className="uppercase tracking-widest text-xs font-semibold mb-3" style={{ color: '#9FA93D' }}>
              {t('about.mission.eyebrow', 'Who We Are')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-5 leading-snug" style={{ color: '#455324' }}>
              {t('about.mission.title', 'Our Mission')}
            </h2>
            <div className="w-12 h-1 rounded-full mb-6" style={{ background: '#CC8F57' }} />
            <p className="leading-relaxed mb-5" style={{ color: '#442413' }}>
              {t(
                'about.mission.p1',
                'We empower local cooperatives — especially those led by women — by giving them a global stage to share their authentic products. Every purchase sustains a livelihood and preserves centuries-old traditions.'
              )}
            </p>
            <p className="leading-relaxed" style={{ color: '#763C19' }}>
              {t(
                'about.mission.p2',
                'From the oases of Assa-Zag to the argan forests of Guelmim, we curate only the finest goods straight from the cooperatives of the Guelmim-Oued Noun region.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#455324' }}>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="uppercase tracking-widest text-xs font-semibold mb-3" style={{ color: '#9FA93D' }}>
            {t('about.values.eyebrow', 'What Drives Us')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            {t('about.values.title', 'Why Choose BySahara?')}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.titleKey}
              className="rounded-2xl p-8 text-center transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#617131' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-5"
                style={{ background: '#F8D197' }}
              >
                {v.icon}
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#F8D197' }}>
                {t(v.titleKey, v.titleKey.split('.').slice(-2, -1)[0])}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#F7E5CD' }}>
                {t(v.descKey, '—')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Region Banner ─────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div
          className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
          style={{ background: '#F8D197' }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"
            style={{ background: '#CC8F57' }}
          />
          <p className="uppercase tracking-widest text-xs font-semibold mb-3" style={{ color: '#763C19' }}>
            {t('about.region.eyebrow', 'Our Roots')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-5" style={{ color: '#442413' }}>
            {t('about.region.title', 'Guelmim-Oued Noun')}
          </h2>
          <p className="max-w-xl mx-auto leading-relaxed" style={{ color: '#763C19' }}>
            {t(
              'about.region.desc',
              'All our cooperatives are rooted in the Guelmim-Oued Noun region — a land where Saharan, Berber, and Sahrawi cultures have blended for millennia to create unique artisanal traditions.'
            )}
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;