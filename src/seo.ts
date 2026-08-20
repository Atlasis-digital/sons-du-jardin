import { useEffect } from 'react';

// Helper SEO réutilisable (pack Atlasis Digital)
// Met à jour <title>, <meta description> et Open Graph / Twitter par page.
export function useSeo(opts: { title: string; description: string; url?: string; image?: string; locale?: string }) {
  useEffect(() => {
    document.title = opts.title;
    const set = (sel: string, attr: 'name' | 'property', key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };
    const img = opts.image || 'https://sons-du-jardin.vercel.app/cover.jpg';
    const loc = opts.locale || 'fr_FR';
    set('desc', 'name', 'description', opts.description);
    // Open Graph
    set('ogt', 'property', 'og:title', opts.title);
    set('ogd', 'property', 'og:description', opts.description);
    set('ogimg', 'property', 'og:image', img);
    set('ogtype', 'property', 'og:type', 'website');
    set('ogloc', 'property', 'og:locale', loc);
    set('ogloc_en', 'property', 'og:locale:alternate', 'en_US');
    set('ogloc_ar', 'property', 'og:locale:alternate', 'ar_TN');
    set('ogsite', 'property', 'og:site_name', 'Les sons du jardin');
    if (opts.url) set('ogu', 'property', 'og:url', opts.url);
    // Twitter
    set('twc', 'name', 'twitter:card', 'summary_large_image');
    set('twt', 'name', 'twitter:title', opts.title);
    set('twd', 'name', 'twitter:description', opts.description);
    set('twimg', 'name', 'twitter:image', img);
  }, [opts.title, opts.description, opts.url, opts.image, opts.locale]);
}

// Mappe la langue de l'app vers un code OG/BCP47
export function ogLocale(lang: string): string {
  if (lang === 'en') return 'en_US';
  if (lang === 'ar') return 'ar_TN';
  return 'fr_FR';
}

// Injecte un bloc JSON-LD (données structurées schema.org)
export function JsonLd({ data }: { data: object }) {
  useEffect(() => {
    const type = (data as any)['@type'] || 'LocalBusiness';
    const id = 'jsonld-' + String(type).toLowerCase();
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }, []);
  return null;
}
