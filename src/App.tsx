import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from './i18n/I18nProvider';
import { i18n, photos, contact, hoursDetail, promo, scrapedReviews, jsonLd } from './data';
import { useSeo, JsonLd } from './seo';
import { Events, EventDetail, Admin } from './posts';

const CLAY = 'linear-gradient(135deg, #dCE8D5, #e9dfce)';
const wa = (msg: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={'reveal' + (inView ? ' in' : '')} style={{ transitionDelay: delay + 's' }}>{children}</div>;
}

function StatusBadge() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const id = setInterval(() => { const d = new Date(); const day = d.getDay(); const h = d.getHours() + d.getMinutes() / 60; const o = (day >= 1 && day <= 7); setOpen(o && h >= 14 && h < 24); }, 60000); return () => clearInterval(id); }, []);
  return <span className={'status ' + (open ? 'open' : 'closed')}>{open ? '● Ouvert' : '● Fermé'}</span>;
}

function Gallery() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  const [zoom, setZoom] = useState<number | null>(null);
  return (
    <section style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="title display reveal" style={{ textAlign: 'center', marginBottom: '2rem' }}>{t('gallery_title')}</h2>
        <div className="masonry">
          {photos.map((src, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <img src={src} alt="" style={{ width: '100%', borderRadius: 14, cursor: 'zoom-in', marginBottom: 14, display: 'block' }} loading="lazy" onClick={() => setZoom(i)} />
            </Reveal>
          ))}
        </div>
      </div>
      {zoom !== null && <div className="lightbox" onClick={() => setZoom(null)}><img src={photos[zoom]} alt="" /></div>}
    </section>
  );
}

function Reviews() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);
  return (
    <section className="faq-section">
      <div className="container" style={{ paddingBlock: '4rem' }}>
        <h2 className="title display reveal" style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('reviews_title')}</h2>
        <div className="rule" style={{ margin: '0 auto 2rem' }} />
        <div className="feature">
          {scrapedReviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="chip" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', color: 'var(--gold)', letterSpacing: '2px' }}>{stars(r.rating)}</div>
                <p style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{r.date}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href={`https://search.google.com/local/reviews?placeid=&q=${encodeURIComponent(contact.name + ' ' + contact.city)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">★ {contact.rating} ({contact.reviews}) · Google</a>
        </p>
      </div>
    </section>
  );
}

function Faq() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq-section">
      <div className="container" style={{ paddingBlock: '4rem' }}>
        <h2 className="title display reveal" style={{ marginBottom: '1rem' }}>{t('faq_title')}</h2>
        <div className="rule" />
        <div className="faq-list">
          {(i18n.faq[lang] as any[]).map((f, i) => (
            <div key={i} className="faq-item">
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>{f.q} <span>{open === i ? '−' : '+'}</span></button>
              <AnimatePresence>{open === i && <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{f.a}</motion.div>}</AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reservation() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  useSeo({ title: `${contact.name} — Réservation`, description: 'Réservez votre séjour', url: 'https://wiliwow.github.io/sons-du-jardin/reservation' });
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [msg, setMsg] = useState('');
  const [pers, setPers] = useState('2');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [error, setError] = useState('');

  const sendResa = async () => {
    if (!name || !tel || !arrivalDate || !departureDate) {
      setError(lang === 'ar' ? 'فضلاً أدخل التاريخين' : lang === 'en' ? 'Please fill both dates' : 'Veuillez remplir les deux dates');
      return;
    }
    if (departureDate <= arrivalDate) {
      setError(lang === 'ar' ? 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول' : lang === 'en' ? 'Departure must be after arrival' : 'La date de départ doit être après l\'arrivée');
      return;
    }
    if (company && String(company).trim() !== '') return;
    setStatus('sending');
    setError('');
    try {
      const r = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: tel, guests: pers, arrivalDate, arrivalTime, departureDate, departureTime, message: msg, company }),
      });
      const data = await r.json();
      if (data.ok) { setStatus('ok'); setTimeout(() => setStatus('idle'), 3000); }
      else { throw new Error(data.error || 'err'); }
    } catch (e: any) { setError(e.message || 'Erreur'); setTimeout(() => setError(''), 3000); }
  };

  return (
    <section style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="title display reveal" style={{ marginBottom: '1.5rem' }}>{t('reservation')}</h2>
        <form onSubmit={(e) => { e.preventDefault(); sendResa(); }} className="reservation-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input className="field" placeholder={lang === 'ar' ? 'اسمك' : 'Nom'} value={name} onChange={e => setName(e.target.value)} />
            <input className="field" type="tel" placeholder={lang === 'ar' ? 'WhatsApp / هاتف' : 'WhatsApp / Tél'} value={tel} onChange={e => setTel(e.target.value)} />
            <input className="field" type="number" min="1" value={pers} onChange={e => setPers(e.target.value)} placeholder={lang === 'ar' ? 'عدد الضيوف' : 'Invités'} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <label style={{ flex: '1 1 160px' }}>{t('arrival')}<input type="date" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} /></label>
            <label style={{ flex: '1 1 160px' }}>{t('arrival_time') || 'Heure arriv.'}<input type="time" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} /></label>
            <label style={{ flex: '1 1 160px' }}>{t('departure')}<input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} /></label>
            <label style={{ flex: '1 1 160px' }}>{t('departure_time') || 'Heure départ'}<input type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} /></label>
          </div>
          <textarea className="field" placeholder={lang === 'ar' ? 'رسالتك' : lang === 'en' ? 'Your message' : 'Message optionnel'} value={msg} onChange={e => setMsg(e.target.value)} style={{ marginTop: '1rem' }} />
          <div className="hp-field" style={{ position: 'absolute', left: '-9999px' }}>
            <label>Ne remplissez pas ce champ<input tabIndex={-1} autoComplete="off" value={company} onChange={e => setCompany(e.target.value)} /></label>
          </div>
          <button type="submit" className="btn" disabled={status === 'sending'} style={{ marginTop: '1.5rem' }}>📩 {t('reserve')}</button>
          {status === 'ok' && <p style={{ color: 'var(--feuille)', textAlign: 'center', marginTop: '1rem' }}>✓ Réservation prise en compte !</p>}
          {error && <p style={{ color: 'var(--terracotta)', textAlign: 'center', marginTop: '1rem' }}>✗ {error}</p>}
        </form>
      </div>
    </section>
  );
}

function Contact() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  useSeo({ title: `${contact.name} — Contact`, description: t('contact_text'), url: 'https://wiliwow.github.io/sons-du-jardin/#/contact' });
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [msg, setMsg] = useState('');
  const [pers, setPers] = useState('2');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [heure, setHeure] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const sendResa = async () => {
    if (!name || !tel || !arrivalDate) { setCompany('bot'); return; }
    if (company && String(company).trim() !== '') return;
    setStatus('sending');
    try {
      const r = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: tel, guests: pers, arrivalDate, departureDate, heure, message: msg, company }),
      });
      const data = await r.json();
      if (data.ok) { setStatus('ok'); setTimeout(() => setStatus('idle'), 3000); }
      else { throw new Error(data.error || 'err'); }
    } catch (e: any) { setStatus('err'); setTimeout(() => setStatus('idle'), 3000); }
  };


  return (
    <section style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="title display reveal" style={{ marginBottom: '1.5rem' }}>{t('contact_title')}</h2>
        <p className="muted reveal" style={{ marginBottom: '2rem' }}>{t('contact_text')}</p>
        <div className="contact-grid">
          <Reveal><div className="box">
            <ul className="contact-list">
              <li>📍 {contact.address}</li>
              <li>📞 <a href={`tel:${contact.phone}`}>{contact.phoneDisplay}</a></li>
              <li>🕒 {t('hours')}</li>
              <li>★ {contact.rating} ({contact.reviews} avis)</li>
            </ul>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <a href={wa(`${t('reserve')} — ${contact.name}`)} target="_blank" rel="noopener noreferrer" className="btn">🟢 {t('whatsapp')}</a>
              <a href={`tel:${contact.phone}`} className="btn btn-ghost">📞 {t('call')}</a>
            </div>
            <div style={{ marginTop: '2rem' }} className="map-wrap">
              <iframe src={contact.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="carte" />
              <a href={contact.mapsDir} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">→ {lang === 'ar' ? 'اتجاهات' : lang === 'en' ? 'Directions' : 'Itinéraire'}</a>
            </div>
          </div></Reveal>
          <Reveal><div className="box-clay">
            <h4 style={{ marginTop: 0 }}>{t('reserve')}</h4>
            <form onSubmit={(e) => { e.preventDefault(); sendResa(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input className="field" placeholder={lang === 'ar' ? 'اسمك' : 'Nom'} value={name} onChange={e => setName(e.target.value)} />
                <input className="field" placeholder="WhatsApp / Tél" value={tel} onChange={e => setTel(e.target.value)} />
                <input className="field" type="number" min="1" value={pers} onChange={e => setPers(e.target.value)} placeholder={lang === 'ar' ? 'عدد الضيوف' : lang === 'en' ? 'Guests' : 'Invités'} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <label style={{ flex: '1 1 160px' }}>{t('arrival')}<input value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} type="date" /></label>
                <label style={{ flex: '1 1 160px' }}>{t('departure')}<input value={departureDate} onChange={e => setDepartureDate(e.target.value)} type="date" /></label>
                <label style={{ flex: '1 1 160px' }}>{t('time')}<input value={heure} onChange={e => setHeure(e.target.value)} type="time" /></label>
              </div>
              <textarea className="field" placeholder={lang === 'ar' ? 'رسالتك' : lang === 'en' ? 'Your message' : 'Votre message'} value={msg} onChange={e => setMsg(e.target.value)} style={{ marginTop: '1rem' }} />
              <div className="hp-field" style={{ position: 'absolute', left: '-9999px' }}>
                <label>Ne remplissez pas ce champ<input tabIndex={-1} autoComplete="off" value={company} onChange={e => setCompany(e.target.value)} /></label>
              </div>
              <button type="submit" className="btn" disabled={status === 'sending'} style={{ marginTop: '1.5rem' }}>📩 {t('reserve')}</button>
            </form>

          </div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Rooms() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  useSeo({ title: `${contact.name} — Chambres`, description: t('rooms_title'), url: 'https://wiliwow.github.io/sons-du-jardin/#/rooms' });
  const downloadRooms = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' }); const W = doc.internal.pageSize.getWidth(); let y = 56;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text(contact.name, W / 2, y, { align: 'center' }); y += 28;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(120); doc.text(t('rooms_title'), W / 2, y, { align: 'center' }); y += 30; doc.setTextColor(0);
    (i18n.rooms[lang] as any[]).forEach((m: any) => {
      if (y > 760) { doc.addPage(); y = 56; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(107, 122, 58); doc.text(m.n, 56, y); doc.setTextColor(0);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.text(m.p, W - 56, y, { align: 'right' }); y += 18;
      doc.setFontSize(9); doc.setTextColor(120); doc.text(m.d, 56, y); doc.setTextColor(0); y += 28;
    });
    doc.save(`${contact.name} - chambres.pdf`);
  };
  return (
    <section style={{ paddingTop: '8rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="title display" style={{ margin: 0 }}>{t('rooms_title')}</h2>
          <button className="btn btn-ghost" onClick={downloadRooms}>⬇ {lang === 'ar' ? 'تحميل' : 'PDF'}</button>
        </div>
        <div className="masonry" style={{ marginTop: '2rem' }}>
          {(i18n.rooms as any)[lang].map((m: any, i: number) => (
            <Reveal key={i}><div className="box">
              <div className="n" style={{ fontSize: '1.2rem', fontWeight: 600 }}>{m.n}</div>
              <div className="d" style={{ color: 'var(--muted)', margin: '.4rem 0 .8rem' }}>{m.d}</div>
              <div className="p" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>{m.p}</div>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  useSeo({ title: `${contact.name} — Maison d'hôtes, Skanes`, description: t('hero_lead'), url: 'https://wiliwow.github.io/sons-du-jardin/' });
  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">{lang === 'ar' ? 'نزل · سقانس' : lang === 'en' ? 'GUESTHOUSE · SKANES' : 'MAISON D\'HÔTES · SKANES'}</span>
            <h1 className="display">{t('hero_title')}</h1>
            <p className="lead">{t('hero_lead')}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/rooms" className="btn">{lang === 'ar' ? 'غرفنا' : 'Nos chambres'}</Link>
              <a href={wa(`${t('reserve')} — ${contact.name}`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">🟢 {t('whatsapp')}</a>
            </div>
            <div style={{ marginTop: '1.5rem' }}><StatusBadge /></div>
          </div>
          <div className="hero-photo" style={{ backgroundImage: photos[0] ? `url(${photos[0]})` : CLAY, aspectRatio: '4/5' }} />
        </div>
      </section>

      <div className="promo">{promo[lang]}</div>

      <section>
        <div className="container" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <h2 className="title display">{t('about_title')}</h2>
            <div className="rule" style={{ margin: '0 auto' }} />
            <p className="muted" style={{ fontSize: '1.05rem' }}>{t('about')}</p>
            <p className="muted" style={{ color: 'var(--terracotta)', fontWeight: 600, marginTop: '1rem' }}>🕒 {t('hours')}</p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/histoire" className="btn btn-ghost">{t('nav_history')} →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 className="title display reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>{t('features_title')}</h2>
          <div className="feature">
            {(i18n.features[lang] as any[]).map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div className="chip" whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                  <div className="ic">{f.ic}</div><h4>{f.h}</h4><p>{f.p}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}><Link to="/rooms" className="btn btn-ghost">{t('nav_rooms')}</Link></div>
        </div>
      </section>

      <Gallery />
      <Reviews />
      <Faq />
      <Reservation />
    </>
  );
}

function Story() {
  const { lang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  useSeo({ title: `${contact.name} — ${t('history_title')}`, description: (i18n.history[lang] as any[])[0], url: 'https://wiliwow.github.io/sons-du-jardin/histoire' });
  return (
    <>
      <JsonLd data={jsonLd} />
      <section style={{ paddingTop: '8rem' }}>
        <div className="container" style={{ maxWidth: 820, margin: '0 auto' }}>
          <Reveal>
            <span className="eyebrow" style={{ textAlign: 'center', display: 'block' }}>{lang === 'ar' ? 'إرث عائلي · منتصف القرن العشرين' : lang === 'en' ? 'FAMILY HERITAGE · MID-20TH C.' : 'HÉRITAGE FAMILIAL · MILIEU DU XXᵉ'}</span>
            <h1 className="title display reveal" style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('history_title')}</h1>
            <div className="rule" style={{ margin: '0 auto 2.5rem' }} />
          </Reveal>
          <Reveal>
            <div className="frame" style={{ backgroundImage: photos[2] ? `url(${photos[2]})` : CLAY, aspectRatio: '16/10', marginBottom: '2.5rem' }} />
          </Reveal>
          {(i18n.history[lang] as any[]).map((p: string, i: number) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="muted" style={{ fontSize: i === 0 ? '1.15rem' : '1.05rem', lineHeight: 1.8, marginBottom: '1.6rem' }}>{p}</p>
            </Reveal>
          ))}
          <Reveal>
            <div className="box-clay" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '1.2rem', margin: 0 }}>🎨 Zoubeir Turki &nbsp;·&nbsp; 🌳 Olivier centenaire &nbsp;·&nbsp; 🏛️ Architecture cubisme & arcs</p>
            </div>
          </Reveal>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/" className="btn btn-ghost">← {lang === 'ar' ? 'الرئيسية' : lang === 'en' ? 'Home' : 'Accueil'}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Shell() {
  const { lang, setLang } = useI18n();
  const t = (k: keyof typeof i18n): string => i18n[k][lang] as unknown as string;
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => { const onS = () => setScrolled(window.scrollY > 30); window.addEventListener('scroll', onS); return () => window.removeEventListener('scroll', onS); }, []);
  useEffect(() => { document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); }, [lang]);
  useEffect(() => { document.body.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { setMenuOpen(false); }, [loc.pathname]);
  const links = [['/', 'nav_home'], ['/rooms', 'nav_rooms'], ['/gallery', 'nav_gallery'], ['/histoire', 'nav_history'], ['/evenements', 'nav_events'], ['/reservation', 'nav_contact']] as const;
  const share = () => { const u = 'https://wiliwow.github.io/sons-du-jardin/'; const txt = encodeURIComponent(contact.name); if (navigator.share) navigator.share({ title: contact.name, url: u }); else window.open(`https://wa.me/?text=${txt}%20${u}`, '_blank'); };
  return (
    <div className="shell" style={{ background: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh' }}>
      <header className={scrolled ? 'solid' : ''}>
        <div className="container nav">
          <Link to="/" className="brand"><b>Les</b> sons du jardin</Link>
          <nav className="desktop-nav">
            <ul className="nav-links">
              {links.map(([to, key]) => <li key={to}><Link to={to} className={loc.pathname === to ? 'active' : ''}>{t(key)}</Link></li>)}
            </ul>
          </nav>
          <div className="header-right">
            <div className="langs">
              {(['fr', 'en', 'ar'] as const).map(l => <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
            </div>
            <button className="dark-toggle" onClick={() => setDark(!dark)} title="Mode sombre">◐</button>
            <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu"><span /><span /><span /></button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {links.map(([to, key]) => <Link key={to} to={to} className={loc.pathname === to ? 'active' : ''}>{t(key)}</Link>)}
            <button className="mobile-share" onClick={share}>↗ Partager</button>
          </motion.div>
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/histoire" element={<Story />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/evenements/:slug" element={<EventDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <button className="share-fab" onClick={share} title="Partager">↗</button>
      <a href={wa(`${t('reserve')} — ${contact.name}`)} target="_blank" rel="noopener noreferrer" className="sticky-cta">● {t('reserve')}</a>
    </div>
  );
}

export default function App() { return <Shell />; }
