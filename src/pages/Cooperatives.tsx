import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, X, Users, Award } from 'lucide-react';
import { cooperatives } from '../data';
import { useLanguage } from '../context/LanguageContext';
import GuelmimMap from '../components/GuelmimMap';

// ── Province display names ─────────────────────────────────────
const provinceNames: Record<string, { en: string; ar: string }> = {
  'sidi-ifni': { en: 'Sidi Ifni', ar: 'سيدي إفني' },
  'guelmim':   { en: 'Guelmim',   ar: 'كلميم'     },
  'tan-tan':   { en: 'Tan-Tan',   ar: 'طانطان'    },
  'assa-zag':  { en: 'Assa-Zag',  ar: 'أسا الزاك' },
};

const Cooperatives: React.FC = () => {
  const { language } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const isRtl = language === 'ar';

  // helper: get bilingual field safely
  const lang = (field: { en: string; ar: string }) =>
    language === 'ar' ? field.ar : field.en;

  const getProvinceName = (id: string) => {
    const p = provinceNames[id];
    return p ? lang(p) : id;
  };

  // provinces that have cooperatives
  const activeProvinces = [...new Set(
    cooperatives.map((c) =>
      typeof c.province === 'object' ? (language === 'ar' ? (c.province as any).ar : (c.province as any).en) : c.province
    )
  )];

  // Filter by province id (stored as string key in data)
  const getProvinceId = (c: typeof cooperatives[0]): string =>
    typeof c.province === 'object' ? '' : (c.province as string);

  const filteredCoops = selectedProvince
    ? cooperatives.filter((c) => getProvinceId(c) === selectedProvince)
    : cooperatives;

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#F7E5CD20' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 60%, #9FA93D 100%)' }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: '#F8D197' }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 pointer-events-none"
          style={{ background: '#9FA93D' }} />

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="uppercase tracking-widest text-xs font-semibold mb-3"
            style={{ color: '#F8D197' }}>
            {t('منطقة كلميم-واد نون', 'Guelmim-Oued Noun Region')}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            {t('التعاونيات', 'Cooperatives')}
          </h1>
          <div className="w-20 h-1 mx-auto rounded-full mb-6"
            style={{ background: '#F8D197' }} />
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#F7E5CD' }}>
            {t(
              'تمكين النساء والحرفيين في مجتمعات جهة كلميم واد نون',
              'Empowering women and artisans across the Guelmim-Oued Noun region'
            )}
          </p>

          {/* stats pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: '🏡', val: cooperatives.length, label: t('تعاونية', 'Cooperatives') },
              { icon: '👩', val: '100+',               label: t('صانعة', 'Artisans') },
              { icon: '📍', val: '3',                  label: t('أقاليم', 'Provinces') },
            ].map((s) => (
              <div key={s.label}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
                <span>{s.icon}</span>
                <span style={{ color: '#F8D197' }}>{s.val}</span>
                <span style={{ color: '#F7E5CD' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map + List ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* MAP ───────────────────────────────────────────────── */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="rounded-2xl p-6 shadow-sm"
              style={{ background: '#fff', border: '1px solid #F8D197' }}>

              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
                <h2 className="font-serif text-xl font-bold" style={{ color: '#455324' }}>
                  {t('اختر الإقليم', 'Select a Province')}
                </h2>
              </div>
              <p className="text-xs mb-5 ms-3" style={{ color: '#BA8944' }}>
                {t('انقر على الإقليم لعرض تعاونياته', 'Click on a province to see its cooperatives')}
              </p>

              <GuelmimMap
                selectedProvince={selectedProvince}
                onSelectProvince={setSelectedProvince}
                activeProvinces={activeProvinces}
              />

              {/* active filter badge */}
              {selectedProvince && (
                <div className="flex justify-center mt-5">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: '#F8D197', color: '#455324' }}
                  >
                    <MapPin className="w-4 h-4" style={{ color: '#CC8F57' }} />
                    <span>{getProvinceName(selectedProvince)}</span>
                    <button
                      onClick={() => setSelectedProvince(null)}
                      className="rounded-full p-0.5 transition-colors hover:bg-amber-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COOPERATIVES LIST ─────────────────────────────────── */}
          <div className="lg:col-span-7">

            {/* list header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold" style={{ color: '#455324' }}>
                {selectedProvince
                  ? getProvinceName(selectedProvince)
                  : t('كل التعاونيات', 'All Cooperatives')}
              </h2>
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: '#F8D197', color: '#763C19' }}
              >
                {filteredCoops.length} {t('تعاونية', 'cooperative(s)')}
              </span>
            </div>

            {/* empty */}
            {filteredCoops.length === 0 ? (
              <div
                className="text-center py-20 rounded-2xl"
                style={{ background: '#fff', border: '1px solid #F8D197' }}
              >
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30"
                  style={{ color: '#CC8F57' }} />
                <p style={{ color: '#BA8944' }}>
                  {t('لا توجد تعاونيات في هذا الإقليم', 'No cooperatives in this province')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredCoops.map((coop) => {
                  const name        = lang(coop.name);
                  const city        = lang(coop.city);
                  const province    = lang(
                    typeof coop.province === 'object'
                      ? coop.province as { en: string; ar: string }
                      : { en: coop.province as string, ar: coop.province as string }
                  );
                  const description = lang(coop.description);

                  return (
                    <div
                      key={coop.id}
                      className="rounded-2xl overflow-hidden shadow-sm group transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                      style={{ background: '#fff', border: '1px solid #F8D197' }}
                    >
                      {/* image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={coop.image}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* certifications badges */}
                        {coop.certifications && coop.certifications.length > 0 && (
                          <div className="absolute top-3 start-3 flex gap-1.5 flex-wrap">
                            {coop.certifications.map((cert) => (
                              <span
                                key={cert}
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ background: '#9FA93D', color: '#fff' }}
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="absolute bottom-3 start-3 end-3 text-white font-bold text-lg leading-tight">
                          {name}
                        </h3>
                      </div>

                      {/* content */}
                      <div className="p-5">
                        {/* location */}
                        <div className="flex items-center gap-1.5 text-sm font-medium mb-1"
                          style={{ color: '#CC8F57' }}>
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{city}</span>
                          <span style={{ color: '#F8D197' }}>·</span>
                          <span className="text-xs" style={{ color: '#BA8944' }}>{province}</span>
                        </div>

                        {/* member count */}
                        {coop.memberCount && (
                          <div className="flex items-center gap-1.5 text-xs mb-3"
                            style={{ color: '#9FA93D' }}>
                            <Users className="w-3 h-3" />
                            <span>
                              {coop.memberCount} {t('عضو', 'members')}
                            </span>
                            {coop.foundedYear && (
                              <>
                                <span>·</span>
                                <Award className="w-3 h-3" />
                                <span>{t('منذ', 'since')} {coop.foundedYear}</span>
                              </>
                            )}
                          </div>
                        )}

                        <p className="text-sm leading-relaxed line-clamp-2 mb-4"
                          style={{ color: '#763C19' }}>
                          {description}
                        </p>

                        <Link
                          to={`/cooperatives/${coop.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group/link"
                          style={{ color: '#455324' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#CC8F57')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#455324')}
                        >
                          {t('اكتشف التعاونية', 'Explore Cooperative')}
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