import { marked } from 'marked';

export interface EventMeta {
  slug: string;
  title: string;
  date: string;     // ISO
  dateDisplay: string;
  excerpt: string;
  cover?: string;
  image?: string;  // alias
}

// Import direct des fichiers Markdown présents dans content/events
const mdModules = import.meta.glob('../../content/events/*.md', { as: 'raw', eager: true }) as Record<string, string>;

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) {
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      // Les URLs (http/https) contiennent ':' -> on reconstruit l'absolu si coupé
      if (val.startsWith('//')) val = 'https:' + val;
      data[key] = val;
    }
  });
  return { data, body: m[2] };
}

export function getEvents(): EventMeta[] {
  const out: EventMeta[] = [];
  for (const [path, raw] of Object.entries(mdModules)) {
    const { data } = parseFrontmatter(raw);
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    out.push({
      slug,
      title: data.title || slug,
      date: data.date || '',
      dateDisplay: data.dateDisplay || data.date || '',
      excerpt: data.excerpt || '',
      cover: data.cover || data.image || '',
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getEvent(slug: string): { meta: EventMeta; html: string } | null {
  const raw = mdModules[`../../content/events/${slug}.md`];
  if (!raw) return null;
  const { data, body } = parseFrontmatter(raw);
  return {
    meta: {
      slug,
      title: data.title || slug,
      date: data.date || '',
      dateDisplay: data.dateDisplay || data.date || '',
      excerpt: data.excerpt || '',
      cover: data.cover || data.image || '',
    },
    html: marked.parse(body) as string,
  };
}

export function renderMd(md: string): string {
  return marked.parse(md) as string;
}
