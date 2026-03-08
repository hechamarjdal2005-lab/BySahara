import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { fetchFooterContact, fetchFooterLinks, fetchFooterSocial, fetchFooterNewsletter } from '../data';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, Loader2 } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { logo, tagline } = useSiteConfig();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [contact, setContact] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [social, setSocial] = useState<any[]>([]);
  const [newsletter, setNewsletter] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [contactData, linksData, socialData, newsletterData] = await Promise.all([
          fetchFooterContact(),
          fetchFooterLinks(),
          fetchFooterSocial(),
          fetchFooterNewsletter(),
        ]);
        setContact(contactData);
        setLinks(linksData);
        setSocial(socialData);
        setNewsletter(newsletterData);
      } catch (err) {
        console.error('Error loading footer:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getNewsletterSection = (key: string) => newsletter.find(n => n.section_key === key);

  const getIcon = (key: string | null) => {
    switch (key) {
      case 'map-pin': return <MapPin className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'phone': return <Phone className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'mail': return <Mail className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'facebook': return <Facebook className="w-3.5 h-3.5" />;
      case 'instagram': return <Instagram className="w-3.5 h-3.5" />;
      case 'twitter': return <Twitter className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5 flex-shrink-0" />;
    }
  };

  if (loading) {
    return (
      <footer dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#442413', padding: '20px' }}>
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: '#F8D197' }} />
        </div>
      </footer>
    );
  }

  const newsletterText = getNewsletterSection('newsletter_text');
  const newsletterPlaceholder = getNewsletterSection('newsletter_placeholder');
  const newsletterButton = getNewsletterSection('newsletter_button');

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#442413' }}>

      {/* Top band — newsletter */}
      <div style={{ background: '#455324' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logo || 'https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png'} 
              alt="By Sahara" 
              className="h-9 object-contain" 
              style={{ filter: 'brightness(0) invert(1)' }} 
            />
            {newsletterText && (
              <p className="text-xs hidden sm:block" style={{ color: '#F7E5CD' }}>
                {isRtl ? newsletterText.text_ar : newsletterText.text_en}
              </p>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder={newsletterPlaceholder ? (isRtl ? newsletterPlaceholder.placeholder_ar : newsletterPlaceholder.placeholder_en) : tr('بريدك الإلكتروني...', 'Your email...')}
              className="flex-1 sm:w-48 px-3 py-2 rounded-xl text-xs outline-none"
              style={{ background: '#617131', color: '#F7E5CD', border: '1px solid #9FA93D40' }}
            />
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
              style={{ background: '#F8D197', color: '#442413' }}
            >
              {newsletterButton ? (isRtl ? newsletterButton.button_text_ar : newsletterButton.button_text_en) : tr('اشترك', 'Subscribe')}
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

          {/* Col 1 — Contact */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#F8D197' }}>
              {tr('تواصل معنا', 'Contact Us')}
            </h4>
            <ul className="space-y-2">
              {contact.map((item) => (
                <li key={item.id} className="flex items-center gap-1.5 text-xs" style={{ color: '#F7E5CD99' }}>
                  <span style={{ color: '#CC8F57' }}>{getIcon(item.icon_key)}</span>
                  {isRtl ? item.value_ar : item.value_en}
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
              {links.map((link) => (
                <li key={link.id}>
                  <Link to={link.url} className="text-xs transition-colors"
                    style={{ color: '#F7E5CDaa' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F8D197')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#F7E5CDaa')}>
                    {isRtl ? link.title_ar : link.title_en}
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
                tr('سياسة الإرجاع', 'Returns'),
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
              {social.map((item) => (
                <a key={item.id} href={item.url}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: '#617131', color: '#F8D197' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#CC8F57'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#617131'; (e.currentTarget as HTMLElement).style.color = '#F8D197'; }}>
                  {getIcon(item.icon_key)}
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

      {/* Bottom bar */}
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