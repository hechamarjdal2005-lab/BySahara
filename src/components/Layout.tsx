import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col min-h-screen font-sans transition-colors duration-300"
      style={{ background: '#F7E5CD20', color: '#442413' }}
    >
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;