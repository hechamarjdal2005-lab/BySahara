import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-sahara-blue text-sahara-sand py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-serif text-2xl font-bold text-sahara-gold mb-4">BySahara</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-sahara-gold">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/" className="hover:text-sahara-terracotta transition-colors">{t('nav.home')}</a></li>
              <li><a href="/shop" className="hover:text-sahara-terracotta transition-colors">{t('nav.shop')}</a></li>
              <li><a href="/cooperatives" className="hover:text-sahara-terracotta transition-colors">{t('nav.cooperatives')}</a></li>
              <li><a href="/about" className="hover:text-sahara-terracotta transition-colors">{t('nav.about')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-sahara-gold">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-sahara-terracotta transition-colors">{t('footer.delivery')}</a></li>
              <li><a href="#" className="hover:text-sahara-terracotta transition-colors">{t('footer.returns')}</a></li>
              <li><a href="#" className="hover:text-sahara-terracotta transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-sahara-gold">Follow Us</h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="hover:text-sahara-terracotta transition-colors"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-sahara-terracotta transition-colors"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="hover:text-sahara-terracotta transition-colors"><Twitter className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-sahara-sand/20 mt-8 pt-8 text-center text-sm opacity-60">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
