import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, X, Users, Award, Loader2 } from 'lucide-react';
import { fetchCooperatives, fetchCooperativesPage, fetchCooperativesStats } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { Cooperative, BilingualText } from '../types';
import GuelmimMap from '../components/GuelmimMap';

const provinceNames: Record<string, { en: string; ar: string }> = {
  'sidi-ifni': { en: 'Sidi Ifni', ar: 'سيدي إفني' },
  'guelmim':   { en: 'Guelmim',   ar: 'كلميم'     },
  'tan-tan':   { en: 'Tan-Tan',   ar: 'طانطان'    },
  'assa-zag':  { en: 'Assa-Zag',  ar: 'أسا الزاك' },
};

const provinceNameToId: Record<string, string> = {
  'كلميم': 'guelmim',
  'إقليم كلميم': 'guelmim',
  'طانطان': 'tan-tan',
  'إقليم طانطان': 'tan-tan',
  'سيدي إفني': 'sidi-ifni',
  'إقليم سيدي إفني': 'sidi-ifni',
  'أسا الزاك': 'assa-zag',
  'إقليم أسا الزاك': 'assa-zag',
  'Guelmim': 'guelmim',
  'Guelmim Province': 'guelmim',
  'Tan-Tan': 'tan-tan',
  'Tan-Tan Province': 'tan-tan',
  'Sidi Ifni': 'sidi-ifni',
  'Sidi Ifni Province': 'sidi-ifni',
  'Assa-Zag': 'assa-zag',
  'Assa-Zag Province': 'assa-zag',
  'guelmim': 'guelmim',
  'tan-tan': 'tan-tan',
  'sidi-ifni': 'sidi-ifni',
  'assa-zag': 'assa-zag',
};

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
  const heroSection = getPageSection('hero');
  const mapTitleSection = getPageSection('map_title');
  const searchSection = getPageSection('search_title');
  const allCoopsSection = getPageSection('all_cooperatives_title');

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
        const nameEn = lang(c.name).toLowerCase();
        const nameAr = c.name.ar.toLowerCase();
        return nameEn.includes(query) || nameAr.includes(query);
      })
    : filteredCoops;

  const getStatValue = (stat: any) => {
    if (stat.value_dynamic) {
      if (stat.label_en === 'Cooperatives') {
        return cooperatives.length.toString();
      } else if (stat.label_en === 'Provinces') {
        return activeProvinces.length.toString();
      }
    }
    return stat.value_static || '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#455324' }} />
          <p className="text-sm" style={{ color: '#763C19' }}>{tr('جاري التحميل...', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#FDFAF5' }}>

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 60%, #9FA93D 100%)' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 pointer-events-none" style={{ background: '#F8D197' }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 pointer-events-none" style={{ background: '#9FA93D' }} />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="uppercase tracking-widest text-xs font-semibold mb-3" style={{ color: '#F8D197' }}>
            {tr('منطقة كلميم-واد نون', 'Guelmim-Oued Noun Region')}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            {heroSection ? (isRtl ? heroSection.title_ar : heroSection.title_en) : tr('التعاونيات', 'Cooperatives')}
          </h1>
          <div className="w-20 h-1 mx-auto rounded-full mb-6" style={{ background: '#F8D197' }} />
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#F7E5CD' }}>
            {heroSection ? (isRtl ? heroSection.subtitle_ar : heroSection.subtitle_en) : tr('تمكين النساء والحرفيين في مجتمعات جهة كلميم واد نون', 'Empowering women and artisans across the Guelmim-Oued Noun region')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {stats.map((stat) => (
              <div key={stat.id} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
                <span>{stat.icon_emoji}</span>
                <span style={{ color: '#F8D197' }}>{getStatValue(stat)}</span>
                <span style={{ color: '#F7E5CD' }}>{isRtl ? stat.label_ar : stat.label_en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ background: '#fff', borderBottom: '1px solid #F8D197' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
              <h2 className="font-serif text-2xl font-bold" style={{ color: '#455324' }}>
                {mapTitleSection ? (isRtl ? mapTitleSection.title_ar : mapTitleSection.title_en) : tr('اختر الإقليم', 'Select a Province')}
              </h2>
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
            </div>
            <p className="text-sm" style={{ color: '#BA8944' }}>
              {mapTitleSection ? (isRtl ? mapTitleSection.subtitle_ar : mapTitleSection.subtitle_en) : tr('انقر على الإقليم لعرض تعاونياته', 'Click on a province to see its cooperatives')}
            </p>
          </div>
          <GuelmimMap selectedProvince={selectedProvince} onSelectProvince={setSelectedProvince} activeProvinces={activeProvinces} language={language} variant="full" />
          {selectedProvince && (
            <div className="flex justify-center mt-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow-sm" style={{ background: '#F8D197', color: '#455324' }}>
                <MapPin className="w-4 h-4" style={{ color: '#CC8F57' }} />
                <span>{getProvinceName(selectedProvince)}</span>
                <button onClick={() => setSelectedProvince(null)} className="rounded-full p-0.5 transition-colors hover:bg-amber-300 ms-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section style={{ background: '#FDFAF5' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
              <h2 className="font-serif text-2xl font-bold" style={{ color: '#455324' }}>
                {searchSection ? (isRtl ? searchSection.title_ar : searchSection.title_en) : tr('البحث عن تعاونية', 'Search for a Cooperative')}
              </h2>
              <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
            </div>
            <p className="text-sm" style={{ color: '#BA8944' }}>
              {searchSection ? (isRtl ? searchSection.subtitle_ar : searchSection.subtitle_en) : tr('اكتب اسم التعاونية للبحث', 'Type the cooperative name to search')}
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={tr('ابحث عن التعاونية...', 'Search cooperative...')} className="w-full px-5 py-3 rounded-full text-sm sm:text-base border-2" style={{ borderColor: '#F8D197', background: '#fff', color: '#455324' }} />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute end-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors hover:bg-gray-100">
                  <X className="w-4 h-4" style={{ color: '#BA8944' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cooperatives List */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold" style={{ color: '#455324' }}>
            {searchQuery.trim()
              ? tr('نتائج البحث', 'Search Results')
              : selectedProvince
              ? getProvinceName(selectedProvince)
              : (allCoopsSection ? (isRtl ? allCoopsSection.title_ar : allCoopsSection.title_en) : tr('كل التعاونيات', 'All Cooperatives'))}
          </h2>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: '#F8D197', color: '#763C19' }}>
            {finalFilteredCoops.length} {tr('تعاونية', 'cooperative(s)')}
          </span>
        </div>
        {finalFilteredCoops.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: '#fff', border: '1px solid #F8D197' }}>
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: '#CC8F57' }} />
            <p style={{ color: '#BA8944' }}>{tr('لا توجد تعاونيات في هذا التصفية', 'No cooperatives found for this filter')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {finalFilteredCoops.map((coop) => {
              const name = lang(coop.name);
              const city = lang(coop.city);
              const province = lang(coop.province);
              const description = lang(coop.description);
              const provinceId = getProvinceId(coop);
              return (
                <div key={coop.id} className="rounded-xl sm:rounded-2xl overflow-hidden shadow-sm group transition-all duration-200 hover:shadow-lg hover:-translate-y-1" style={{ background: '#fff', border: '1px solid #F8D197' }}>
                  <div className="relative h-32 sm:h-48 overflow-hidden">
                    <img src={coop.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {coop.certifications && coop.certifications.length > 0 && (
                      <div className="absolute top-2 sm:top-3 start-2 sm:start-3 flex gap-1 sm:gap-1.5 flex-wrap">
                        {coop.certifications.map((cert) => (
                          <span key={cert} className="text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full" style={{ background: '#9FA93D', color: '#fff' }}>{cert}</span>
                        ))}
                      </div>
                    )}
                    <h3 className="absolute bottom-2 sm:bottom-3 start-2 sm:start-3 end-2 sm:end-3 text-white font-bold text-xs sm:text-lg leading-tight">{name}</h3>
                  </div>
                  <div className="p-2.5 sm:p-5">
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-medium mb-1" style={{ color: '#CC8F57' }}>
                      <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="truncate">{city}</span>
                      <span style={{ color: '#F8D197' }}>·</span>
                      <button onClick={() => setSelectedProvince(selectedProvince === provinceId ? null : provinceId)} className="text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full transition-all" style={{ background: selectedProvince === provinceId ? '#455324' : '#F8D197', color: selectedProvince === provinceId ? '#fff' : '#763C19' }}>{province}</button>
                    </div>
                    {coop.memberCount && (
                      <div className="flex items-center gap-1 text-xs mb-2 sm:mb-3" style={{ color: '#9FA93D' }}>
                        <Users className="w-2.5 h-2.5" />
                        <span>{coop.memberCount} {tr('عضو', 'members')}</span>
                        {coop.foundedYear && (<><span>·</span><Award className="w-2.5 h-2.5" /><span className="hidden sm:inline">{tr('منذ', 'since')} {coop.foundedYear}</span></>)}
                      </div>
                    )}
                    <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-2 sm:mb-4" style={{ color: '#763C19' }}>{description}</p>
                    <Link to={`/cooperatives/${coop.id}`} className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold transition-colors group/link" style={{ color: '#455324' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#CC8F57')} onMouseLeave={(e) => (e.currentTarget.style.color = '#455324')}>
                      {tr('اكتشف التعاونية', 'Explore Cooperative')}
                      {isRtl ? <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />}
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