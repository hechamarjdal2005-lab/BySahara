import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { fetchAboutPage } from '../data';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [pageContent, setPageContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAboutPage();
        setPageContent(data);
      } catch (err) {
        console.error('Error loading about page:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getPageSection = (key: string) => pageContent.find(c => c.section_key === key);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#455324' }} />
      </div>
    );
  }

  const heroBadge = getPageSection('hero_badge');
  const heroTitle = getPageSection('hero_title');
  const heroDesc = getPageSection('hero_description');
  const heroBadgeMain = getPageSection('hero_badge_main');
  const missionTitle = getPageSection('mission_title');
  const missionContent = getPageSection('mission_content');
  const rootsBadge = getPageSection('roots_badge');
  const rootsTitle = getPageSection('roots_title');
  const rootsDesc = getPageSection('roots_description');

  return (
    <div className="min-h-screen" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#FDFAF5' }}>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #2d3a14 0%, #455324 55%, #617131 100%)' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-10 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            {heroBadge && (
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4"
                style={{ background: 'rgba(248,209,151,0.15)', color: '#F8D197', border: '1px solid rgba(248,209,151,0.3)' }}>
                {isRtl ? heroBadge.title_ar : heroBadge.title_en}
              </span>
            )}
            {heroTitle && (
              <h1 className="font-serif font-bold leading-tight mb-4 text-3xl sm:text-5xl" style={{ color: '#fff' }}>
                {isRtl ? heroTitle.title_ar : heroTitle.title_en}
              </h1>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(248,209,151,0.3)' }} />
              <span style={{ color: '#F8D197', opacity: 0.6 }}>✦</span>
              <div className="h-px flex-1" style={{ background: 'rgba(248,209,151,0.3)' }} />
            </div>
            {heroDesc && (
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#F7E5CD', maxWidth: '38ch' }}>
                {isRtl ? heroDesc.content_ar : heroDesc.content_en}
              </p>
            )}
          </div>

          {/* Hero Image */}
          <div className="relative hidden md:block">
            <div className="absolute -inset-3 rounded-3xl" style={{ background: 'rgba(248,209,151,0.08)', border: '1px solid rgba(248,209,151,0.15)' }} />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img src="https://images.unsplash.com/photo-1509233725247-49e657319b85?auto=format&fit=crop&q=80&w=900" alt="Sahara desert Morocco" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,58,20,0.55) 0%, transparent 60%)' }} />
              <p className="absolute bottom-4 start-4 text-xs font-semibold" style={{ color: 'rgba(248,209,151,0.9)' }}>
                📍 {tr('كلميم-واد نون، المغرب', 'Guelmim-Oued Noun, Morocco')}
              </p>
            </div>
            {heroBadgeMain && (
              <div className="absolute -bottom-5 -start-5 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl" style={{ background: '#F8D197' }}>
                <span className="text-xl">🏆</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: '#455324' }}>
                    {isRtl ? heroBadgeMain.badge_text_ar : heroBadgeMain.badge_text_en}
                  </p>
                  <p className="text-xs" style={{ color: '#763C19' }}>
                    {isRtl ? heroBadgeMain.badge_subtext_ar : heroBadgeMain.badge_subtext_en}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 py-10 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-10 items-center">
          {/* Image */}
          <div className="relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '4/5' }}>
              <img src="https://images.unsplash.com/photo-1590412613626-4444634710f3?auto=format&fit=crop&q=80&w=800" alt="Moroccan women cooperative" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -end-4 w-28 h-28 rounded-2xl overflow-hidden shadow-2xl" style={{ border: '3px solid #fff' }}>
              <img src="https://images.unsplash.com/photo-1575808142341-e39853744dbd?auto=format&fit=crop&q=80&w=300" alt="Medjool dates" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Text */}
          <div>
            {missionTitle && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#9FA93D' }}>
                {isRtl ? missionTitle.title_ar : missionTitle.title_en}
              </p>
            )}
            {missionContent && (
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: '#442413' }}>
                {isRtl ? missionContent.content_ar : missionContent.content_en}
              </p>
            )}
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

      {/* Roots Section */}
      <section className="px-5 py-10 sm:py-16">
        <div className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC8F57 0%, #BA8944 100%)' }}>
          <div className="relative px-6 sm:px-10 py-10 sm:py-16 text-center">
            {rootsBadge && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {isRtl ? rootsBadge.title_ar : rootsBadge.title_en}
              </p>
            )}
            {rootsTitle && (
              <h2 className="font-serif font-bold mb-4 text-2xl sm:text-4xl" style={{ color: '#fff' }}>
                {isRtl ? rootsTitle.title_ar : rootsTitle.title_en}
              </h2>
            )}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>✦</span>
              <div className="h-px w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
            </div>
            {rootsDesc && (
              <p className="max-w-xl mx-auto leading-relaxed text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.88)' }}>
                {isRtl ? rootsDesc.content_ar : rootsDesc.content_en}
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;