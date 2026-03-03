import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, X, Users, Award } from 'lucide-react';
import { cooperatives } from '../data';
import { useLanguage } from '../context/LanguageContext';
import GuelmimMap from '../components/GuelmimMap';

const provinceNames: Record<string, { en: string; ar: string }> = {
  'sidi-ifni': { en: 'Sidi Ifni', ar: 'سيدي إفني' },
  'guelmim':   { en: 'Guelmim',   ar: 'كلميم'     },
  'tan-tan':   { en: 'Tan-Tan',   ar: 'طانطان'    },
  'assa-zag':  { en: 'Assa-Zag',  ar: 'أسا الزاك' },
};

// ✅ FIX: أضفنا "إقليم ..." و "... Province" باش يتطابق مع data/index.ts
const provinceNameToId: Record<string, string> = {
  // عربي
  'كلميم': 'guelmim',
  'إقليم كلميم': 'guelmim',
  'طانطان': 'tan-tan',
  'إقليم طانطان': 'tan-tan',
  'سيدي إفني': 'sidi-ifni',
  'إقليم سيدي إفني': 'sidi-ifni',
  'أسا الزاك': 'assa-zag',
  'إقليم أسا الزاك': 'assa-zag',
  // إنجليزي
  'Guelmim': 'guelmim',
  'Guelmim Province': 'guelmim',
  'Tan-Tan': 'tan-tan',
  'Tan-Tan Province': 'tan-tan',
  'Sidi Ifni': 'sidi-ifni',
  'Sidi Ifni Province': 'sidi-ifni',
  'Assa-Zag': 'assa-zag',
  'Assa-Zag Province': 'assa-zag',
  // ids مباشرة
  'guelmim': 'guelmim',
  'tan-tan': 'tan-tan',
  'sidi-ifni': 'sidi-ifni',
  'assa-zag': 'assa-zag',
};

const Cooperatives: React.FC = () => {
  const { language } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isRtl = language === 'ar';

  const lang = (field: { en: string; ar: string }) =>
    language === 'ar' ? field.ar : field.en;

  const getProvinceName = (id: string) => {
    const p = provinceNames[id];
    return p ? lang(p) : id;
  };

  const getProvinceId = (c: typeof cooperatives[0]): string => {
    if (typeof c.province === 'object') {
      const p = c.province as { en: string; ar: string };
      return (
        provinceNameToId[p.ar] ||
        provinceNameToId[p.en] ||
        ''
      );
    }
    const s = c.province as string;
    return provinceNameToId[s] || '';
  };

  const activeProvinces = [...new Set(
    cooperatives.map((c) => getProvinceId(c)).filter(Boolean)
  )];

  const filteredCoops = selectedProvince
    ? cooperatives.filter((c) => getProvinceId(c) === selectedProvince)
    : cooperatives;

  const finalFilteredCoops = searchQuery.trim()
    ? filteredCoops.filter((c) => {
        const query = searchQuery.toLowerCase();
        const nameEn = lang(c.name).toLowerCase();
        const nameAr = c.name.ar.toLowerCase();
        return nameEn.includes(query) || nameAr.includes(query);
      })
    : filteredCoops;

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#FDFAF5' }}>

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
          <div className="w-20 h-1 mx-auto rounded-full mb-6" style={{ background: '#F8D197' }} />
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#F7E5CD' }}>
            {t(
              'تمكين النساء والحرفيين في مجتمعات جهة كلميم واد نون',
              'Empowering women and artisans across the Guelmim-Oued Noun region'
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: '🏡', val: cooperatives.length, label: t('تعاونية', 'Cooperatives') },
              { icon: '👩', val: '100+', label: t('صانعة', 'Artisans') },
              { icon: '📍', val: '4', label: t('أقاليم', 'Provinces') },
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

      {/* ── Map Section ───────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #F8D197' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
              <h2 className="font-serif text-2xl font-bold" style={{ color: '#455324' }}>
                {t('اختر الإقليم', 'Select a Province')}
              </h2>
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
            </div>
            <p className="text-sm" style={{ color: '#BA8944' }}>
              {t('انقر على الإقليم لعرض تعاونياته', 'Click on a province to see its cooperatives')}
            </p>
          </div>

          {/* Map */}
          <GuelmimMap
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
            activeProvinces={activeProvinces}
            language={language}
            variant="full"
          />

          {/* Active filter badge */}
          {selectedProvince && (
            <div className="flex justify-center mt-6">
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow-sm"
                style={{ background: '#F8D197', color: '#455324' }}
              >
                <MapPin className="w-4 h-4" style={{ color: '#CC8F57' }} />
                <span>{getProvinceName(selectedProvince)}</span>
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="rounded-full p-0.5 transition-colors hover:bg-amber-300 ms-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Search Section ────────────────────────────────────── */}
      <section style={{ background: '#FDFAF5' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
              <h2 className="font-serif text-2xl font-bold" style={{ color: '#455324' }}>
                {t('البحث عن تعاونية', 'Search for a Cooperative')}
              </h2>
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
            </div>
            <p className="text-sm" style={{ color: '#BA8944' }}>
              {t('اكتب اسم التعاونية للبحث', 'Type the cooperative name to search')}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ابحث عن التعاونية...', 'Search cooperative...')}
                className="w-full px-5 py-3 rounded-full text-sm sm:text-base border-2"
                style={{
                  borderColor: '#F8D197',
                  background: '#fff',
                  color: '#455324',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors hover:bg-gray-100"
                >
                  <X className="w-4 h-4" style={{ color: '#BA8944' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cooperatives List ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12">

        {/* Introduction */}
        <div className="mb-12 text-center">
          <p className="text-sm sm:text-base leading-relaxed max-w-3xl mx-auto" style={{ color: '#BA8944' }}>
            {t(
              'اكتشف التعاونيات النسويّة والحرفيّة بمنطقة كلميم-واد نون. تجمع هذه التعاونيات بين التقاليد العريقة والابتكار الحديث لإنتاج منتجات طبيعية عالية الجودة. كل تعاونية متخصصة في مجال معيّن وتعمل على تمكين المرأة والحفاظ على الموارد الطبيعية.',
              'Discover women and artisan cooperatives in the Guelmim-Oued Noun region. These cooperatives combine ancient traditions with modern innovation to produce high-quality natural products. Each cooperative specializes in a specific field and works to empower women and preserve natural resources.'
            )}
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold" style={{ color: '#455324' }}>
            {searchQuery.trim()
              ? t('نتائج البحث', 'Search Results')
              : selectedProvince
              ? getProvinceName(selectedProvince)
              : t('كل التعاونيات', 'All Cooperatives')}
          </h2>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: '#F8D197', color: '#763C19' }}
          >
            {finalFilteredCoops.length} {t('تعاونية', 'cooperative(s)')}
          </span>
        </div>

        {/* Empty state */}
        {finalFilteredCoops.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ background: '#fff', border: '1px solid #F8D197' }}
          >
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: '#CC8F57' }} />
            <p style={{ color: '#BA8944' }}>
              {t('لا توجد تعاونيات في هذا التصفية', 'No cooperatives found for this filter')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {finalFilteredCoops.map((coop) => {
              const name        = lang(coop.name);
              const city        = lang(coop.city);
              const province    = lang(
                typeof coop.province === 'object'
                  ? coop.province as { en: string; ar: string }
                  : { en: coop.province as string, ar: coop.province as string }
              );
              const description = lang(coop.description);
              const provinceId  = getProvinceId(coop);

              return (
                <div
                  key={coop.id}
                  className="rounded-xl sm:rounded-2xl overflow-hidden shadow-sm group transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                  style={{ background: '#fff', border: '1px solid #F8D197' }}
                >
                  {/* Image */}
                  <div className="relative h-32 sm:h-48 overflow-hidden">
                    <img
                      src={coop.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {coop.certifications && coop.certifications.length > 0 && (
                      <div className="absolute top-2 sm:top-3 start-2 sm:start-3 flex gap-1 sm:gap-1.5 flex-wrap">
                        {coop.certifications.map((cert) => (
                          <span key={cert}
                            className="text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full"
                            style={{ background: '#9FA93D', color: '#fff' }}>
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="absolute bottom-2 sm:bottom-3 start-2 sm:start-3 end-2 sm:end-3 text-white font-bold text-xs sm:text-lg leading-tight">
                      {name}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-2.5 sm:p-5">
                    {/*location  */}
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-medium mb-1"
                      style={{ color: '#CC8F57' }}>
                      <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="truncate">{city}</span>
                      <span style={{ color: '#F8D197' }}>·</span>
                      <button
                        onClick={() => setSelectedProvince(
                          selectedProvince === provinceId ? null : provinceId
                        )}
                        className="text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full transition-all"
                        style={{
                          background: selectedProvince === provinceId ? '#455324' : '#F8D197',
                          color: selectedProvince === provinceId ? '#fff' : '#763C19',
                        }}
                      >
                        {province}
                      </button>
                    </div>

                    {/* Members + year */}
                    {coop.memberCount && (
                      <div className="flex items-center gap-1 text-xs mb-2 sm:mb-3"
                        style={{ color: '#9FA93D' }}>
                        <Users className="w-2.5 h-2.5" />
                        <span>{coop.memberCount} {t('عضو', 'members')}</span>
                        {coop.foundedYear && (
                          <>
                            <span>·</span>
                            <Award className="w-2.5 h-2.5" />
                            <span className="hidden sm:inline">{t('منذ', 'since')} {coop.foundedYear}</span>
                          </>
                        )}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-2 sm:mb-4"
                      style={{ color: '#763C19' }}>
                      {description}
                    </p>

                    <Link
                      to={`/cooperatives/${coop.id}`}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold transition-colors group/link"
                      style={{ color: '#455324' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#CC8F57')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#455324')}
                    >
                      {t('اكتشف التعاونية', 'Explore Cooperative')}
                      {isRtl
                        ? <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        : <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Cooperatives;