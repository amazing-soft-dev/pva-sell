import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  schema
}) => {
  const siteName = 'Credexus Market';
  const domain = 'https://credexus.com'; // Replace with actual domain in production
  const fullUrl = canonicalUrl ? `${domain}${canonicalUrl}` : window.location.href;

  useEffect(() => {
    // Update Title
    document.title = title;
    
    // Update Meta Tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords || 'PVA accounts, verified accounts, buy linkedin, buy upwork, buy payment accounts, digital marketplace');
    updateMeta('robots', 'index, follow');

    // Open Graph
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:type', ogType, 'property');
    updateMeta('og:url', fullUrl, 'property');
    updateMeta('og:site_name', siteName, 'property');

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', description, 'name');

    // Canonical Link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullUrl);

    // JSON-LD Structured Data
    if (schema) {
      let script = document.querySelector('#structured-data');
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    // Cleanup function not strictly necessary for single page apps navigating forward, 
    // but good practice if unmounting completely.
  }, [title, description, keywords, fullUrl, ogType, schema]);

  return null;
};