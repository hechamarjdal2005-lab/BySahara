import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { cart } = useCart();
  const { logo, siteName } = useSiteConfig();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRtl = language === 'ar';
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');

  const navItems = [
    { path: '/', label: { en: 'Home', ar: 'الرئيسية' } },
    { path: '/shop', label: { en: 'Shop', ar: 'المتجر' } },
    { path: '/cooperatives', label: { en: 'Our Cooperatives', ar: 'تعاونياتنا' } },
    { path: '/about', label: { en: 'About Us', ar: 'من نحن' } },
    { path: '/contact', label: { en: 'Contact', ar: 'اتصل بنا' } },
    { path: '/admin/login', label: { en: 'Login', ar: 'تسجيل الدخول' } },
  ];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  

  return (
    <header style={{ background: '#fff', borderBottom: '1.5px solid #F8D197' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo || 'https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png'}
              alt={siteName || 'By Sahara'}
              className="h-8 sm:h-10 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  color: item.path === '/admin/login' ? '#F8D197' : '#455324',
                  background: item.path === '/admin/login' ? '#455324' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (item.path === '/admin/login') {
                    (e.currentTarget as HTMLElement).style.background = '#2d3816';
                  } else {
                    (e.currentTarget as HTMLElement).style.background = '#F8D197';
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.path === '/admin/login') {
                    (e.currentTarget as HTMLElement).style.background = '#455324';
                  } else {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {isRtl ? item.label.ar : item.label.en}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ background: '#F7F1E8', color: '#455324', border: '1px solid #EDD9AA' }}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'English' : 'عربي'}</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-full transition-colors"
              style={{ background: '#F8D19740', color: '#455324' }}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -end-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: '#455324', color: '#fff' }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full"
              style={{ background: '#F8D19740', color: '#455324' }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: '#F8D197' }}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: item.path === '/admin/login' ? '#455324' : '#F7F1E8',
                    color: item.path === '/admin/login' ? '#F8D197' : '#455324',
                  }}
                >
                  {isRtl ? item.label.ar : item.label.en}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;