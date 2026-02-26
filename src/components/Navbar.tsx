import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount } = useCart();
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isRtl = language === 'ar';

  const navLinks = [
    { name: t('nav.home'),         path: '/'              },
    { name: t('nav.shop'),         path: '/shop'          },
    { name: t('nav.cooperatives'), path: '/cooperatives'  },
    { name: t('nav.about'),        path: '/about'         },
    { name: t('nav.contact'),      path: '/contact'       },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: '#fff',
        borderBottom: '1.5px solid #F8D197',
        boxShadow: '0 2px 16px #F8D19730',
      }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between h-16 items-center gap-6">

          {/* ── Logo ──────────────────────────────────────── */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png"
              alt="By Sahara"
              className="h-10 object-contain"
            />
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                style={{
                  color: isActive(link.path) ? '#455324' : '#763C19',
                  background: isActive(link.path) ? '#F8D197' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    (e.currentTarget as HTMLElement).style.color = '#455324';
                    (e.currentTarget as HTMLElement).style.background = '#F7E5CD';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    (e.currentTarget as HTMLElement).style.color = '#763C19';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {link.name}
                {/* active underline dot */}
                {isActive(link.path) && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#CC8F57' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">

            {/* Language toggle */}
            <button
              onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors"
              style={{ color: '#617131', border: '1.5px solid #9FA93D40', background: 'transparent' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#9FA93D15';
                (e.currentTarget as HTMLElement).style.borderColor = '#9FA93D';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = '#9FA93D40';
              }}
            >
              <Globe className="h-3.5 w-3.5" />
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
              style={{ color: '#455324', background: '#F7E5CD' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8D197')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F7E5CD')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -end-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full"
                  style={{ background: '#455324' }}
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* ── Mobile: cart + hamburger ──────────────────── */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ color: '#455324', background: '#F7E5CD' }}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -end-1 w-4 h-4 flex items-center justify-center text-xs font-bold text-white rounded-full"
                  style={{ background: '#455324' }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
              style={{ color: '#455324', background: isOpen ? '#F8D197' : '#F7E5CD' }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────── */}
      {isOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2"
          style={{ borderTop: '1px solid #F8D197', background: '#fff' }}
        >
          {/* nav links */}
          <div className="space-y-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  color: isActive(link.path) ? '#455324' : '#763C19',
                  background: isActive(link.path) ? '#F8D197' : 'transparent',
                }}
              >
                {isActive(link.path) && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#CC8F57' }} />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* language toggle */}
          <div className="pt-3" style={{ borderTop: '1px solid #F8D197' }}>
            <button
              onClick={() => {
                changeLanguage(language === 'en' ? 'ar' : 'en');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors"
              style={{ color: '#617131', border: '1.5px solid #9FA93D40', background: '#9FA93D08' }}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;