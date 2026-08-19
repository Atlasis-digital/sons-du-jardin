import { useEffect } from 'react';

// Helper SEO réutilisable (pack Atlasis Digital)
// Met à jour <title>, <meta description> et Open Graph par page.
export function useSeo(opts: { title: string; description: string; url?: string }) {
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
    set('desc', 'name', 'description', opts.description);
    set('ogt', 'property', 'og:title', opts.title);
    set('ogd', 'property', 'og:description', opts.description);
    if (opts.url) set('ogu', 'property', 'og:url', opts.url);
  }, [opts.title, opts.description, opts.url]);
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
