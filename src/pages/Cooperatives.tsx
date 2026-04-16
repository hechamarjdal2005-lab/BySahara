import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, X, Users, Award, Loader2, Search } from 'lucide-react';
import { fetchCooperatives, fetchCooperativesPage, fetchCooperativesStats } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { Cooperative, BilingualText } from '../types';
import GuelmimMap from '../components/GuelmimMap';

/* ─── colour tokens ─────────────────────────────────────────────────── */
const C = {
  oliveDark:   '#3A4A10',
  oliveMid:    '#4F6218',
  oliveLight:  '#7A8C2F',
  oliveXLight: '#C8D06E',
  amber:       '#C8870A',
  amberLight:  '#F0C050',
  amberXLight: '#FAE8A0',
  cream:       '#F9F4EC',
  creamDark:   '#F0E8D6',
  brown:       '#6B3A1F',
  brownLight:  '#A0622A',
  white:       '#FFFFFF',
  textMuted:   '#8A7050',
} as const;

/* ─── province maps ─────────────────────────────────────────────────── */
const provinceNames: Record<string, { en: string; ar: string }> = {
  'sidi-ifni': { en: 'Sidi Ifni', ar: 'سيدي إفني' },
  'guelmim':   { en: 'Guelmim',   ar: 'كلميم'     },
  'tan-tan':   { en: 'Tan-Tan',   ar: 'طانطان'    },
  'assa-zag':  { en: 'Assa-Zag',  ar: 'أسا الزاك' },
};

const provinceNameToId: Record<string, string> = {
  'كلميم': 'guelmim', 'إقليم كلميم': 'guelmim',
  'طانطان': 'tan-tan', 'إقليم طانطان': 'tan-tan',
  'سيدي إفني': 'sidi-ifni', 'إقليم سيدي إفني': 'sidi-ifni',
  'أسا الزاك': 'assa-zag', 'إقليم أسا الزاك': 'assa-zag',
  'Guelmim': 'guelmim', 'Guelmim Province': 'guelmim',
  'Tan-Tan': 'tan-tan', 'Tan-Tan Province': 'tan-tan',
  'Sidi Ifni': 'sidi-ifni', 'Sidi Ifni Province': 'sidi-ifni',
  'Assa-Zag': 'assa-zag', 'Assa-Zag Province': 'assa-zag',
  'guelmim': 'guelmim', 'tan-tan': 'tan-tan',
  'sidi-ifni': 'sidi-ifni', 'assa-zag': 'assa-zag',
};

/* ─── tiny reusable pieces ──────────────────────────────────────────── */
const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h2
      className="font-serif text-3xl font-bold mb-2"
      style={{ color: C.oliveDark }}
    >
      {title}
    </h2>
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className="block h-px w-12" style={{ background: C.amberLight }} />
      <span className="block w-2 h-2 rounded-full" style={{ background: C.amber }} />
      <span className="block h-px w-12" style={{ background: C.amberLight }} />
    </div>
    {subtitle && (
      <p className="text-sm" style={{ color: C.brownLight }}>{subtitle}</p>
    )}
  </div>
);

/* ─── main component ────────────────────────────────────────────────── */
const Cooperatives: React.FC = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const lang = (field: BilingualText | string | undefined | null): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return isRtl ? field.ar : field.en;
  };

  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [pageContent, setPageContent] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coopsData, pageData, statsData] = await Promise.all([
          fetchCooperatives(),
          fetchCooperativesPage(),
          fetchCooperativesStats(),
        ]);
        setCooperatives(coopsData);
        setPageContent(pageData);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading cooperatives:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getPageSection = (key: string) => pageContent.find(c => c.section_key === key);
  const heroSection      = getPageSection('hero');
  const mapTitleSection  = getPageSection('map_title');
  const searchSection    = getPageSection('search_title');
  const allCoopsSection  = getPageSection('all_cooperatives_title');

  const getProvinceName = (id: string) => {
    const p = provinceNames[id];
    return p ? lang(p) : id;
  };

  const getProvinceId = (coop: Cooperative): string => {
    const provinceKey = lang(coop.province);
    const lower = provinceKey.toLowerCase();
    for (const [id, names] of Object.entries(provinceNames)) {
      if (lower.includes(names.en.toLowerCase()) || lower.includes(names.ar.toLowerCase())) {
        return id;
      }
    }
    return '';
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
        return lang(c.name).toLowerCase().includes(query)
          || c.name.ar.toLowerCase().includes(query);
      })
    : filteredCoops;

  const getStatValue = (stat: any) => {
    if (stat.value_dynamic) {
      if (stat.label_en === 'Cooperatives') return cooperatives.length.toString();
      if (stat.label_en === 'Provinces')    return activeProvinces.length.toString();
    }
    return stat.value_static || '0';
  };

  /* ── loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.cream }}>
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mx-auto"
            style={{ borderColor: `${C.oliveMid} transparent ${C.oliveMid} ${C.oliveMid}` }}
          />
          <p className="text-sm font-medium tracking-wide" style={{ color: C.brownLight }}>
            {tr('جاري التحميل…', 'Loading…')}
          </p>
        </div>
      </div>
    );
  }

  /* ── page ── */
  return (
    <div className="min-h-screen" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: C.cream }}>

      {/* ════════════════════ HERO ════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${C.oliveDark} 0%, ${C.oliveMid} 55%, ${C.oliveLight} 100%)`,
          minHeight: 380,
        }}
      >
        {/* decorative circles */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 480, height: 480,
            top: -160, right: -120,
            background: `radial-gradient(circle, ${C.amberXLight}22 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320, height: 320,
            bottom: -120, left: -80,
            background: `radial-gradient(circle, ${C.oliveXLight}20 0%, transparent 70%)`,
          }}
        />
        {/* subtle geometric pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${C.amberXLight} 0, ${C.amberXLight} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center text-white">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(255,255,255,0.1)', color: C.amberXLight, border: `1px solid ${C.amberLight}44` }}>
            <span
              className="block w-1.5 h-1.5 rounded-full"
              style={{ background: C.amberLight }}
            />
            {tr('منطقة كلميم-واد نون', 'Guelmim-Oued Noun Region')}
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-5 leading-tight"
            style={{ letterSpacing: '-0.02em' }}>
            {heroSection
              ? (isRtl ? heroSection.title_ar : heroSection.title_en)
              : tr('التعاونيات', 'Cooperatives')}
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block h-px w-16 opacity-40" style={{ background: C.amberLight }} />
            <span className="block w-1.5 h-1.5 rounded-full" style={{ background: C.amberLight }} />
            <span className="block h-px w-16 opacity-40" style={{ background: C.amberLight }} />
          </div>

          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: 'rgba(255,255,255,0.78)' }}>
            {heroSection
              ? (isRtl ? heroSection.subtitle_ar : heroSection.subtitle_en)
              : tr(
                'تمكين النساء والحرفيين في مجتمعات جهة كلميم واد نون',
                'Empowering women and artisans across the Guelmim-Oued Noun region',
              )}
          </p>

          {/* stat pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="text-base">{stat.icon_emoji}</span>
                <span style={{ color: C.amberXLight }}>{getStatValue(stat)}</span>
                <span style={{ color: 'rgba(255,255,255,0.72)' }}>
                  {isRtl ? stat.label_ar : stat.label_en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 40 }}>
          <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '100%' }}>
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill={C.white} />
          </svg>
        </div>
      </section>

      {/* ════════════════════ MAP ════════════════════ */}
      <section style={{ background: C.white }}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <SectionHeading
            title={mapTitleSection
              ? (isRtl ? mapTitleSection.title_ar : mapTitleSection.title_en)
              : tr('اختر الإقليم', 'Select a Province')}
            subtitle={mapTitleSection
              ? (isRtl ? mapTitleSection.subtitle_ar : mapTitleSection.subtitle_en)
              : tr('انقر على الإقليم لعرض تعاونياته', 'Click on a province to see its cooperatives')}
          />

          {/* map container */}
          <div
            className="rounded-3xl p-6 sm:p-10"
            style={{
              background: C.cream,
              border: `1.5px solid ${C.creamDark}`,
              boxShadow: `0 2px 32px 0 ${C.oliveDark}0d`,
            }}
          >
            <GuelmimMap
              selectedProvince={selectedProvince}
              onSelectProvince={setSelectedProvince}
              activeProvinces={activeProvinces}
              language={language}
              variant="full"
            />
          </div>

          {/* active filter chip */}
          {selectedProvince && (
            <div className="flex justify-center mt-6">
              <div
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{
                  background: C.oliveMid,
                  color: C.white,
                  boxShadow: `0 4px 16px ${C.oliveMid}44`,
                }}
              >
                <MapPin className="w-4 h-4" style={{ color: C.amberXLight }} />
                <span>{getProvinceName(selectedProvince)}</span>
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="rounded-full p-0.5 transition-opacity hover:opacity-70 ms-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* wave between sections */}
      <div style={{ background: C.white, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: 32 }}>
          <path d="M0,0 C480,32 960,0 1440,16 L1440,32 L0,32 Z" fill={C.cream} />
        </svg>
      </div>

      {/* ════════════════════ SEARCH ════════════════════ */}
      <section style={{ background: C.cream }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-4">
          <SectionHeading
            title={searchSection
              ? (isRtl ? searchSection.title_ar : searchSection.title_en)
              : tr('ابحث عن تعاونية', 'Search for a Cooperative')}
            subtitle={searchSection
              ? (isRtl ? searchSection.subtitle_ar : searchSection.subtitle_en)
              : tr('اكتب اسم التعاونية للبحث', 'Type the cooperative name to search')}
          />

          <div className="max-w-lg mx-auto relative">
            <Search
              className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none"
              style={{
                color: C.amber,
                [isRtl ? 'right' : 'left']: '1.25rem',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr('ابحث عن التعاونية...', 'Search cooperative...')}
              style={{
                width: '100%',
                padding: isRtl
                  ? '0.875rem 3rem 0.875rem 3.5rem'
                  : '0.875rem 3.5rem 0.875rem 3rem',
                borderRadius: 9999,
                border: `2px solid ${C.creamDark}`,
                background: C.white,
                color: C.oliveDark,
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxShadow: `0 2px 12px ${C.oliveDark}08`,
              }}
              onFocus={(e)  => (e.currentTarget.style.borderColor = C.amber)}
              onBlur={(e)   => (e.currentTarget.style.borderColor = C.creamDark)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors hover:bg-gray-100"
                style={{ [isRtl ? 'left' : 'right']: '1rem' }}
              >
                <X className="w-4 h-4" style={{ color: C.brownLight }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════ GRID ════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 pb-20">
        {/* grid header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold" style={{ color: C.oliveDark }}>
            {searchQuery.trim()
              ? tr('نتائج البحث', 'Search Results')
              : selectedProvince
                ? getProvinceName(selectedProvince)
                : (allCoopsSection
                    ? (isRtl ? allCoopsSection.title_ar : allCoopsSection.title_en)
                    : tr('كل التعاونيات', 'All Cooperatives'))}
          </h2>
          <span
            className="text-xs font-bold px-3.5 py-1.5 rounded-full"
            style={{ background: C.amberXLight, color: C.brown }}
          >
            {finalFilteredCoops.length} {tr('تعاونية', 'cooperative(s)')}
          </span>
        </div>

        {/* empty state */}
        {finalFilteredCoops.length === 0 ? (
          <div
            className="text-center py-24 rounded-2xl"
            style={{ background: C.white, border: `1.5px dashed ${C.creamDark}` }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: C.creamDark }}
            >
              <MapPin className="w-6 h-6" style={{ color: C.amber }} />
            </div>
            <p className="font-medium" style={{ color: C.brownLight }}>
              {tr('لا توجد تعاونيات في هذا التصفية', 'No cooperatives found for this filter')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {finalFilteredCoops.map((coop) => {
              const name        = lang(coop.name);
              const city        = lang(coop.city);
              const province    = lang(coop.province);
              const description = lang(coop.description);
              const provinceId  = getProvinceId(coop);

              return (
                <div
                  key={coop.id}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: C.white,
                    border: `1.5px solid ${C.creamDark}`,
                    boxShadow: `0 2px 12px ${C.oliveDark}08`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 12px 36px ${C.oliveDark}1a`;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 2px 12px ${C.oliveDark}08`;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  {/* image */}
                  <div className="relative overflow-hidden" style={{ height: 200 }}>
                    <img
                      src={coop.image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    {/* gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(20,28,6,0.75) 0%, rgba(20,28,6,0.1) 55%, transparent 100%)',
                      }}
                    />
                    {/* certifications */}
                    {coop.certifications && coop.certifications.length > 0 && (
                      <div className="absolute top-3 start-3 flex gap-1.5 flex-wrap">
                        {coop.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: C.oliveLight, color: C.white }}
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* title over image */}
                    <h3
                      className="absolute bottom-3 start-3 end-3 text-white font-bold text-base sm:text-lg leading-snug"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                    >
                      {name}
                    </h3>
                  </div>

                  {/* body */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* location row */}
                    <div className="flex items-center gap-1.5 text-sm mb-2" style={{ color: C.amber }}>
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate font-medium">{city}</span>
                      <span className="opacity-40">·</span>
                      <button
                        onClick={() =>
                          setSelectedProvince(selectedProvince === provinceId ? null : provinceId)
                        }
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full transition-all"
                        style={{
                          background: selectedProvince === provinceId
                            ? C.oliveMid
                            : C.amberXLight,
                          color: selectedProvince === provinceId ? C.white : C.brown,
                        }}
                      >
                        {province}
                      </button>
                    </div>

                    {/* members / year */}
                    {coop.memberCount && (
                      <div
                        className="flex items-center gap-1.5 text-xs mb-3"
                        style={{ color: C.oliveLight }}
                      >
                        <Users className="w-3 h-3" />
                        <span>
                          {coop.memberCount} {tr('عضو', 'members')}
                        </span>
                        {coop.foundedYear && (
                          <>
                            <span className="opacity-40">·</span>
                            <Award className="w-3 h-3" />
                            <span>
                              {tr('منذ', 'since')} {coop.foundedYear}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* description */}
                    <p
                      className="text-sm leading-relaxed line-clamp-2 flex-1 mb-4"
                      style={{ color: C.textMuted }}
                    >
                      {description}
                    </p>

                    {/* divider */}
                    <div
                      className="mb-4"
                      style={{ height: 1, background: C.creamDark }}
                    />

                    {/* CTA */}
                    <Link
                      to={`/cooperatives/${coop.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors w-fit"
                      style={{ color: C.oliveMid }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.amber)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.oliveMid)}
                    >
                      {tr('اكتشف التعاونية', 'Explore Cooperative')}
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
      </section>
    </div>
  );
};

export default Cooperatives;