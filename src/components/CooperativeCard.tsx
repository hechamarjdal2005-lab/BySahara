import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, Users, Award } from 'lucide-react';
import { Cooperative } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CooperativeCardProps {
  cooperative: Cooperative;
}

const CooperativeCard: React.FC<CooperativeCardProps> = ({ cooperative }) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const lang = (field: { en: string; ar: string }) => (isRtl ? field.ar : field.en);
  const t = (ar: string, en: string) => (isRtl ? ar : en);

  const name        = lang(cooperative.name);
  const city        = lang(cooperative.city);
  const province    = lang(cooperative.province);
  const description = lang(cooperative.shortDescription ?? cooperative.description);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col h-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: '#fff', border: '1px solid #F8D197', boxShadow: '0 2px 12px #F8D19730' }}
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={cooperative.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* certifications */}
        {cooperative.certifications && cooperative.certifications.length > 0 && (
          <div className="absolute top-3 start-3 flex gap-1.5">
            {cooperative.certifications.map((cert) => (
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

        {/* name overlay */}
        <h3 className="absolute bottom-3 start-3 end-3 text-white font-serif text-lg font-bold leading-tight truncate">
          {name}
        </h3>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-grow">

        {/* location */}
        <div className="flex items-center gap-1.5 text-sm font-medium mb-2"
          style={{ color: '#CC8F57' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{city}</span>
          <span style={{ color: '#F8D197' }}>·</span>
          <span className="text-xs truncate" style={{ color: '#BA8944' }}>{province}</span>
        </div>

        {/* meta row */}
        {(cooperative.memberCount || cooperative.foundedYear) && (
          <div className="flex items-center gap-3 mb-3">
            {cooperative.memberCount && (
              <div className="flex items-center gap-1 text-xs" style={{ color: '#9FA93D' }}>
                <Users className="w-3 h-3" />
                <span>{cooperative.memberCount} {t('عضو', 'members')}</span>
              </div>
            )}
            {cooperative.foundedYear && (
              <div className="flex items-center gap-1 text-xs" style={{ color: '#9FA93D' }}>
                <Award className="w-3 h-3" />
                <span>{t('منذ', 'est.')} {cooperative.foundedYear}</span>
              </div>
            )}
          </div>
        )}

        {/* description */}
        <p className="text-sm leading-relaxed line-clamp-2 flex-grow mb-4"
          style={{ color: '#763C19' }}>
          {description}
        </p>

        {/* divider */}
        <div className="border-t mb-4" style={{ borderColor: '#F8D197' }} />

        {/* CTA */}
        <Link
          to={`/cooperatives/${cooperative.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors mt-auto"
          style={{ color: '#455324' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#CC8F57')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#455324')}
        >
          {t('اكتشف التعاونية', 'Explore Cooperative')}
          {isRtl
            ? <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
        </Link>
      </div>
    </div>
  );
};

export default CooperativeCard;