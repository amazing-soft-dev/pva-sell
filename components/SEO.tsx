import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.png',
  schema
}) => {
  const siteName = 'Credexus Market';
  const domain = 'https://amazing-soft-dev.github.io/pva-sell';
  const fullUrl = canonicalUrl ? `${domain}${canonicalUrl}` : window.location.href;

  useEffect(() => {
    document.title = `${title} | ${siteName}`;

    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Basic Meta
    updateMeta('description', description);
    updateMeta('keywords', keywords || 'buy pva accounts, verified linkedin, aged upwork, paypal verified, buy verified accounts, credexus');
    updateMeta('author', 'Credexus Market');
    updateMeta('robots', 'index, follow, max-image-preview:large');

    // 3. Open Graph
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:type', ogType, 'property');
    updateMeta('og:url', fullUrl, 'property');
    updateMeta('og:site_name', siteName, 'property');
    updateMeta('og:image', `${domain}${ogImage}`, 'property');

    // 4. Twitter
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', `${domain}${ogImage}`, 'name');

    // 5. Canonical Link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullUrl);


    // 6. JSON-LD Structured Data
    const scriptId = 'structured-data-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    // Default Organization Schema
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": domain,
      "logo": `${domain}/favicon.ico`,
      "sameAs": [
        "https://t.me/credexusmarket",
        "https://x.com/credexus"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "url": `${domain}/whyus`
      }
    };

    // Breadcrumbs
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": domain
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": title,
          "item": fullUrl
        }
      ]
    };

    // Merge provided schema with defaults
    const jsonLdData = [baseSchema, breadcrumbSchema];
    if (schema) {
      jsonLdData.push(schema as any);
    }

    script.textContent = JSON.stringify(jsonLdData);

  }, [title, description, keywords, fullUrl, ogType, ogImage, schema]);

  return null;
};