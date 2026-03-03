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

      {/* ── Top band — newsletter ──────────────────────────── */}
      <div style={{ background: '#455324' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png"
              alt="By Sahara"
              className="h-9 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-xs hidden sm:block" style={{ color: '#F7E5CD' }}>
              {tr('منتجات أصيلة من تعاونيات الجنوب المغربي', 'Authentic products from southern Moroccan cooperatives')}
            </p>
          </div>

          {/* Newsletter */}
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder={tr('بريدك الإلكتروني...', 'Your email...')}
              className="flex-1 sm:w-48 px-3 py-2 rounded-xl text-xs outline-none"
              style={{ background: '#617131', color: '#F7E5CD', border: '1px solid #9FA93D40' }}
            />
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
              style={{ background: '#F8D197', color: '#442413' }}
            >
              {tr('اشترك', 'Subscribe')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
        {/* Mobile: 2×2 grid | Desktop: 4 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

          {/* Col 1 — Contact */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#F8D197' }}>
              {tr('تواصل معنا', 'Contact Us')}
            </h4>
            <ul className="space-y-2">
              {[
                { icon: <MapPin className="w-3.5 h-3.5 flex-shrink-0" />, text: tr('كلميم، المغرب', 'Guelmim, Morocco') },
                { icon: <Phone className="w-3.5 h-3.5 flex-shrink-0" />,  text: '+212 528 870 000' },
                { icon: <Mail className="w-3.5 h-3.5 flex-shrink-0" />,   text: 'hello@bysahara.ma' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#F7E5CD99' }}>
                  <span style={{ color: '#CC8F57' }}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#F8D197' }}>
              {tr('روابط سريعة', 'Quick Links')}
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/',             label: tr('الرئيسية',   'Home')         },
                { to: '/shop',         label: tr('المتجر',     'Shop')         },
                { to: '/cooperatives', label: tr('التعاونيات', 'Cooperatives') },
                { to: '/about',        label: tr('من نحن',    'About')        },
                { to: '/contact',      label: tr('اتصل بنا',  'Contact')      },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs transition-colors"
                    style={{ color: '#F7E5CDaa' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F8D197')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#F7E5CDaa')}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Legal */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#F8D197' }}>
              {tr('قانوني', 'Legal')}
            </h4>
            <ul className="space-y-2">
              {[
                tr('الشحن والتوصيل', 'Delivery'),
                tr('سياسة الإرجاع',  'Returns'),
                tr('الشروط والأحكام', 'Terms & Conditions'),
                tr('سياسة الخصوصية', 'Privacy Policy'),
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs transition-colors"
                    style={{ color: '#F7E5CDaa' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F8D197')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#F7E5CDaa')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Social */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#F8D197' }}>
              {tr('تابعنا', 'Follow Us')}
            </h4>
            <div className="flex gap-2 mb-4">
              {[
                { icon: <Facebook className="w-3.5 h-3.5" />,  href: '#' },
                { icon: <Instagram className="w-3.5 h-3.5" />, href: '#' },
                { icon: <Twitter className="w-3.5 h-3.5" />,   href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: '#617131', color: '#F8D197' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#CC8F57'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#617131'; (e.currentTarget as HTMLElement).style.color = '#F8D197'; }}>
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Bio', 'Fair Trade'].map((cert) => (
                <span key={cert} className="text-xs font-bold px-2.5 py-0.5 rounded-full"
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
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="text-xs" style={{ color: '#F7E5CD60' }}>
            © {new Date().getFullYear()} By Sahara. {tr('جميع الحقوق محفوظة', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: '#F7E5CD40' }}>{tr('صُنع بـ', 'Made with')}</span>
            <span style={{ color: '#CC8F57' }}>♥</span>
            <span className="text-xs" style={{ color: '#F7E5CD40' }}>{tr('في المغرب', 'in Morocco')}</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;