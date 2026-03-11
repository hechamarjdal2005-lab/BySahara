import React, { useEffect } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

const DocumentTitle: React.FC = () => {
  const { siteName, siteTitle, logo } = useSiteConfig();

  useEffect(() => {
    // Update document title
    if (siteTitle) {
      document.title = siteTitle;
    } else if (siteName) {
      document.title = siteName;
    }

    // Update favicon
    if (logo) {
      const favicon = document.getElementById('dynamic-favicon') as HTMLLinkElement;
      if (favicon) {
        favicon.href = logo;
      }
    }

    // Update meta title
    const metaTitle = document.getElementById('dynamic-title');
    if (metaTitle) {
      metaTitle.textContent = siteTitle || siteName || 'By Sahara';
    }
  }, [siteName, siteTitle, logo]);

  return null;
};

export default DocumentTitle;