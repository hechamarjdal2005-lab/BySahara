import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSiteSettings, getSiteSetting } from '../data';

interface SiteConfig {
  logo: string;
  logoDark: string;
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  currency: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

const SiteConfigContext = createContext<SiteConfig | null>(null);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get language from localStorage instead of context
  const getLanguage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('i18nextLng') || 'en';
    }
    return 'en';
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error loading site settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const language = getLanguage();

  const config: SiteConfig = {
    logo: getSiteSetting(settings, 'site_logo', language),
    logoDark: getSiteSetting(settings, 'site_logo_dark', language),
    siteName: getSiteSetting(settings, 'site_name', language),
    tagline: getSiteSetting(settings, 'site_tagline', language),
    email: getSiteSetting(settings, 'site_email', language),
    phone: getSiteSetting(settings, 'site_phone', language),
    location: getSiteSetting(settings, 'site_location', language),
    currency: getSiteSetting(settings, 'site_currency', language),
    facebook: getSiteSetting(settings, 'facebook_url', language),
    instagram: getSiteSetting(settings, 'instagram_url', language),
    twitter: getSiteSetting(settings, 'twitter_url', language),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: '#763C19' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within SiteConfigProvider');
  }
  return context;
};