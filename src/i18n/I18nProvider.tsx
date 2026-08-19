// i18n provider — generic UI labels (fr/en/ar). Business-specific text comes from business.json.
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'fr' | 'en' | 'ar';
const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
];
const RTL: Lang[] = ['ar'];

const DICT: Record<Lang, Record<string, string>> = {
  fr: {
    'nav.home': 'Accueil', 'nav.about': 'À propos', 'nav.gallery': 'Galerie',
    'nav.contact': 'Contact', 'nav.book': 'Réserver', 'nav.menu': 'Carte', 'nav.rooms': 'Chambres',
    'hero.cta': 'Réserver', 'hero.cta2': 'Voir la galerie', 'hero.book': 'Réserver maintenant',
    'about.title': 'À propos', 'gallery.title': 'Galerie', 'contact.title': 'Contact',
    'amenities.title': 'Nos atouts', 'amenities.sub': 'Tout ce qui fait de votre séjour une expérience unique',
    'contact.phone': 'Téléphone', 'contact.email': 'Email',
    'contact.address': 'Adresse', 'contact.send': 'Envoyer', 'contact.sent': 'Merci !',
    'footer.rights': 'Tous droits réservés.', 'footer.tagline': 'Bienvenue chez nous.',
    'reviews.title': 'Ce que disent nos clients', 'reviews.see': 'Voir tous les avis sur Google',
    'reviews.onGoogle': 'sur Google',
    'lang.label': 'Langue',
    'whatsapp.label': 'WhatsApp',
    'rooms.title': 'Nos hébergements', 'rooms.sub': 'Confort et caractère pour chaque voyage',
    'menu.title': 'Notre carte', 'menu.sub': 'Des saveurs préparées avec soin',
    'hours.title': 'Horaires', 'hours.sub': 'Quand nous rendre visite',
    'book.title': 'Réservation', 'book.sub': 'Écrivez-nous sur WhatsApp pour confirmer votre séjour',
    'book.whatsapp': 'Réserver sur WhatsApp', 'book.call': 'Nous appeler',
    'book.form.name': 'Nom', 'book.form.email': 'Email', 'book.form.dates': 'Dates',
    'book.form.guests': 'Voyageurs', 'book.form.msg': 'Votre message',
    'type.hotel': 'Hôtel', 'type.restaurant': 'Restaurant', 'type.cafe': 'Café',
  },
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.gallery': 'Gallery',
    'nav.contact': 'Contact', 'nav.book': 'Book', 'nav.menu': 'Menu', 'nav.rooms': 'Rooms',
    'hero.cta': 'Book', 'hero.cta2': 'View gallery', 'hero.book': 'Book now',
    'about.title': 'About', 'gallery.title': 'Gallery', 'contact.title': 'Contact',
    'amenities.title': 'Highlights', 'amenities.sub': 'Everything that makes your stay unique',
    'contact.phone': 'Phone', 'contact.email': 'Email',
    'contact.address': 'Address', 'contact.send': 'Send', 'contact.sent': 'Thank you!',
    'footer.rights': 'All rights reserved.', 'footer.tagline': 'Welcome.',
    'reviews.title': 'What our guests say', 'reviews.see': 'See all reviews on Google',
    'reviews.onGoogle': 'on Google',
    'lang.label': 'Language',
    'whatsapp.label': 'WhatsApp',
    'rooms.title': 'Our rooms', 'rooms.sub': 'Comfort and character for every trip',
    'menu.title': 'Our menu', 'menu.sub': 'Flavours prepared with care',
    'hours.title': 'Opening hours', 'hours.sub': 'When to visit us',
    'book.title': 'Booking', 'book.sub': 'Message us on WhatsApp to confirm your stay',
    'book.whatsapp': 'Book on WhatsApp', 'book.call': 'Call us',
    'book.form.name': 'Name', 'book.form.email': 'Email', 'book.form.dates': 'Dates',
    'book.form.guests': 'Guests', 'book.form.msg': 'Your message',
    'type.hotel': 'Hotel', 'type.restaurant': 'Restaurant', 'type.cafe': 'Café',
  },
  ar: {
    'nav.home': 'الرئيسية', 'nav.about': 'حول', 'nav.gallery': 'معرض',
    'nav.contact': 'اتصل', 'nav.book': 'احجز', 'nav.menu': 'القائمة', 'nav.rooms': 'الغرف',
    'hero.cta': 'احجز', 'hero.cta2': 'شاهد المعرض', 'hero.book': 'احجز الآن',
    'about.title': 'حول', 'gallery.title': 'معرض الصور', 'contact.title': 'اتصل',
    'amenities.title': 'مميزاتنا', 'amenities.sub': 'كل ما يجعل إقامتك تجربة فريدة',
    'contact.phone': 'هاتف', 'contact.email': 'بريد',
    'contact.address': 'عنوان', 'contact.send': 'إرسال', 'contact.sent': 'شكراً!',
    'footer.rights': 'جميع الحقوق محفوظة.', 'footer.tagline': 'مرحباً بكم.',
    'reviews.title': 'ماذا يقول ضيوفنا', 'reviews.see': 'شاهد كل التقييمات على Google',
    'reviews.onGoogle': 'على Google',
    'lang.label': 'اللغة',
    'whatsapp.label': 'واتساب',
    'rooms.title': 'غرفنا', 'rooms.sub': 'راحة وطابع لكل رحلة',
    'menu.title': 'قائمتنا', 'menu.sub': 'نكهات محضّرة بعناية',
    'hours.title': 'ساعات العمل', 'hours.sub': 'متى تزورنا',
    'book.title': 'الحجز', 'book.sub': 'راسلنا على واتساب لتأكيد إقامتك',
    'book.whatsapp': 'احجز عبر واتساب', 'book.call': 'اتصل بنا',
    'book.form.name': 'الاسم', 'book.form.email': 'البريد', 'book.form.dates': 'التواريخ',
    'book.form.guests': 'الضيوف', 'book.form.msg': 'رسالتك',
    'type.hotel': 'فندق', 'type.restaurant': 'مطعم', 'type.cafe': 'مقهى',
  },
};

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; isRtl: boolean; }
const I18nCtx = createContext<Ctx | null>(null);
const STORE = 'wa-lang';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(
    (typeof localStorage !== 'undefined' && (localStorage.getItem(STORE) as Lang)) || 'fr'
  );
  const isRtl = RTL.includes(lang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORE, lang);
  }, [lang, isRtl]);
  const t = (k: string) => DICT[lang][k] ?? k;
  return <I18nCtx.Provider value={{ lang, setLang, t, isRtl }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error('useI18n must be used within I18nProvider');
  return c;
}
