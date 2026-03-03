import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#442413' }}>

      {/* ── Top band ────────────────────────────────────────── */}
      <div style={{ background: '#455324' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
          {/* left: logo + tagline */}
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
            <img
              src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png"
              alt="By Sahara"
              className="h-9 sm:h-11 md:h-14 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: '#9FA93D' }}>
                {tr('منطقة كلميم-واد نون', 'Guelmim-Oued Noun')}
              </p>
              <p className="text-xs sm:text-sm" style={{ color: '#F7E5CD' }}>
                {t('hero.subtitle', tr(
                  'منتجات أصيلة من تعاونيات الجنوب المغربي',
                  'Authentic products from southern Moroccan cooperatives'
                ))}
              </p>
            </div>
          </div>

          {/* right: newsletter hint */}
          <div className={`flex flex-col sm:flex-row gap-1.5 sm:gap-2 ${isRtl ? 'md:justify-start' : 'md:justify-end'}`}>
            <input
              type="email"
              placeholder={tr('بريدك الإلكتروني...', 'Your email...')}
              className="flex-1 max-w-xs px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none"
              style={{ background: '#617131', color: '#F7E5CD', border: '1px solid #9FA93D40' }}
            />
            <button
              className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ background: '#F8D197', color: '#442413' }}
            >
              {tr('اشترك', 'Subscribe')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-10">

          {/* Col 1 — Contact ──────────────────────────────── */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 md:mb-5"
              style={{ color: '#F8D197' }}>
              {tr('تواصل معنا', 'Contact Us')}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              {[
                { icon: <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />, text: tr('كلميم، المغرب', 'Guelmim, Morocco') },
                { icon: <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />,  text: '+212 528 870 000' },
                { icon: <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />,   text: 'hello@bysahara.ma' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm"
                  style={{ color: '#F7E5CD99' }}>
                  <span style={{ color: '#CC8F57' }}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Navigation ───────────────────────────── */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 md:mb-5"
              style={{ color: '#F8D197' }}>
              {t('footer.links', tr('روابط سريعة', 'Quick Links'))}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
              {[
                { to: '/',             label: t('nav.home',         tr('الرئيسية',  'Home'))         },
                { to: '/shop',         label: t('nav.shop',         tr('المتجر',    'Shop'))         },
                { to: '/cooperatives', label: t('nav.cooperatives', tr('التعاونيات','Cooperatives')) },
                { to: '/about',        label: t('nav.about',        tr('من نحن',   'About'))        },
                { to: '/contact',      label: t('nav.contact',      tr('اتصل بنا', 'Contact'))      },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm transition-colors"
                    style={{ color: '#F7E5CDaa' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F8D197')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#F7E5CDaa')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Legal ────────────────────────────────── */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 md:mb-5"
              style={{ color: '#F8D197' }}>
              {t('footer.legal', tr('قانوني', 'Legal'))}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
              {[
                t('footer.delivery', tr('الشحن والتوصيل', 'Delivery')),
                t('footer.returns',  tr('سياسة الإرجاع',  'Returns')),
                t('footer.terms',    tr('الشروط والأحكام', 'Terms & Conditions')),
                tr('سياسة الخصوصية', 'Privacy Policy'),
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xs sm:text-sm transition-colors"
                    style={{ color: '#F7E5CDaa' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F8D197')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#F7E5CDaa')}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Social ────────────────────────────────── */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 md:mb-5"
              style={{ color: '#F8D197' }}>
              {tr('تابعنا', 'Follow Us')}
            </h4>
            <div className="flex gap-2 sm:gap-2.5 md:gap-3 mb-4 md:mb-6">
              {[
                { icon: <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,  href: '#' },
                { icon: <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, href: '#' },
                { icon: <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,   href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: '#617131', color: '#F8D197' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#CC8F57';
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#617131';
                    (e.currentTarget as HTMLElement).style.color = '#F8D197';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* certifications */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {['Bio', 'Fair Trade'].map((cert) => (
                <span key={cert}
                  className="text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                  style={{ background: '#9FA93D20', color: '#9FA93D', border: '1px solid #9FA93D40' }}>
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #ffffff15' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-xs" style={{ color: '#F7E5CD60' }}>
            {t('footer.copyright', `© ${new Date().getFullYear()} By Sahara. ${tr('جميع الحقوق محفوظة', 'All rights reserved.')}`)}
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs" style={{ color: '#F7E5CD40' }}>
              {tr('صُنع بـ', 'Made with')}
            </span>
            <span style={{ color: '#CC8F57' }}>♥</span>
            <span className="text-xs" style={{ color: '#F7E5CD40' }}>
              {tr('في المغرب', 'in Morocco')}
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;