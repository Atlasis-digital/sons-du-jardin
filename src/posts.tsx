import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from './i18n/I18nProvider';
import { useSeo } from './seo';
import { getEvents, getEvent, renderMd } from './lib/md';
import { contact, i18n } from './data';

const CLAY = 'linear-gradient(135deg, #dCE8D5, #e9dfce)';

function Events() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  useSeo({ title: `${contact.name} — Événements`, description: 'Concerts, salons littéraires et rencontres culturelles aux Sons du jardin.', url: 'https://atlasis-digital.github.io/sons-du-jardin/evenements' });
  const events = getEvents();
  return (
    <section style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h1 className="title display" style={{ textAlign: 'center', marginBottom: '1rem' }}>{lang === 'ar' ? 'فعاليات' : lang === 'en' ? 'Events' : 'Événements'}</h1>
        <div className="rule" style={{ margin: '0 auto 2.5rem' }} />
        {events.length === 0 && <p className="muted" style={{ textAlign: 'center' }}>Bientôt des événements…</p>}
        <div className="events-grid">
          {events.map((e) => (
            <Link key={e.slug} to={`/evenements/${e.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: 14 }}>
              <div className="box">
                {e.cover && <img src={e.cover} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} loading="lazy" />}
                <div style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>{e.dateDisplay}</div>
                <h3 style={{ margin: '.4rem 0', fontSize: '1.25rem' }}>{e.title}</h3>
                <p className="muted" style={{ fontSize: '.95rem' }}>{e.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventDetail() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const data = slug ? getEvent(slug) : null;
  if (!data) return <section style={{ paddingTop: '8rem' }}><div className="container"><h1 className="title">Introuvable</h1><Link to="/evenements" className="btn btn-ghost">← Événements</Link></div></section>;
  useSeo({ title: `${data.meta.title} — ${contact.name}`, description: data.meta.excerpt, url: `https://atlasis-digital.github.io/sons-du-jardin/evenements/${data.meta.slug}` });
  return (
    <section style={{ paddingTop: '8rem' }}>
      <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
        <Link to="/evenements" className="btn btn-ghost" style={{ marginBottom: '1.5rem' }}>← {lang === 'ar' ? 'الفعاليات' : lang === 'en' ? 'Events' : 'Événements'}</Link>
        <div style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>{data.meta.dateDisplay}</div>
        <h1 className="title display" style={{ margin: '.4rem 0 1.5rem' }}>{data.meta.title}</h1>
        {data.meta.cover && <img src={data.meta.cover} alt="" style={{ width: '100%', borderRadius: 16, marginBottom: '2rem' }} loading="lazy" />}
        <div className="prose" dangerouslySetInnerHTML={{ __html: data.html }} />
        <div style={{ marginTop: '2.5rem' }}>
          <a href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Bonjour, je veux réserver pour : ' + data.meta.title)}`} target="_blank" rel="noopener noreferrer" className="btn">🟢 {lang === 'ar' ? 'واتساب' : 'WhatsApp'}</a>
        </div>
      </div>
    </section>
  );
}

function Admin() {
  const [pw, setPw] = useState('');
  const [ok, setOk] = useState(false);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [dateDisplay, setDateDisplay] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const events = getEvents();
  const submit = () => {
    const fm = `---\ntitle: ${title}\ndate: ${date}\ndateDisplay: "${dateDisplay}"\nexcerpt: ${excerpt}\n---\n\n${body}`;
    const name = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    // NOTE: l'écriture de fichier nécessite un backend. Ici on génère le contenu à copier dans content/events/{name}.md
    const blob = new Blob([fm], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.md`;
    a.click();
    alert('Fichier ' + name + '.md généré. Dépose-le dans content/events/ puis relance le build (GitHub Action le publie).');
  };
  if (!ok) return (
    <section style={{ paddingTop: '8rem' }}><div className="container" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1 className="title display">Admin</h1>
      <input className="field" type="password" placeholder="Mot de passe" value={pw} onChange={(e) => setPw(e.target.value)} />
      <button className="btn" onClick={() => setOk(pw === 'atlasisdigital')}>Entrer</button>
    </div></section>
  );
  return (
    <section style={{ paddingTop: '8rem' }}><div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 className="title display">Nouvel événement</h1>
      <input className="field" placeholder="slug (ex: concert-ete)" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <input className="field" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="field" placeholder="date ISO (2026-07-01)" value={date} onChange={(e) => setDate(e.target.value)} />
      <input className="field" placeholder="date affichée (1 juil. 2026 · 20h)" value={dateDisplay} onChange={(e) => setDateDisplay(e.target.value)} />
      <input className="field" placeholder="extrait (résumé)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      <textarea className="field" placeholder="Contenu Markdown…" rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
      <button className="btn" onClick={submit}>⬇ Générer le fichier .md</button>
      <h3 style={{ marginTop: '2rem' }}>Événements existants</h3>
      <ul>{events.map((e) => <li key={e.slug}>{e.title} — <code>{e.slug}.md</code></li>)}</ul>
    </div></section>
  );
}

export { Events, EventDetail, Admin };
