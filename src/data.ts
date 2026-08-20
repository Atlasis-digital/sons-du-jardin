// Les sons du jardin — Maison de charme, Skanes (Monastir)
// Infos scrapées Google Maps : note 4.6 / 5 avis, Avenue Hedi Khfecha, Skanes 5000
// Photos du lieu — import dynamique de tout le dossier (vraies photos Airbnb)
const photoModules = import.meta.glob('./assets/photos/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
// ordre curé : les meilleures vues en tete (hero, sections), le reste ensuite
const priority = [15,77,28,1,4,9,10,3,5,26,27,30,43,63,64,69,70,74,76,79,12,16,18,21,22,33,34,35,36,38,40,45,48,52,55,58,60,62,66,68,71,73,75,78,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,2,6,7,8,11,13,14,17,19,20,23,24,25,29,31,32,37,39,41,42,44,46,47,49,50,51,53,54,56,57,59,61,65,67,72];
const allPaths = Object.keys(photoModules);
const numOf = (p: string) => { const m = p.match(/airbnb_(\d+)\.jpg/); return m ? parseInt(m[1],10) : 999; };
const inPriority = (n: number) => priority.indexOf(n);
export const photos: string[] = allPaths
  .map(p => ({ p, n: numOf(p) }))
  .sort((a, b) => {
    const ia = inPriority(a.n), ib = inPriority(b.n);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.n - b.n;
  })
  .map(x => photoModules[x.p]);

// Galerie curée (bento/tetris) : ~36 meilleures vues, formes melangées
type GalleryShape = 'big' | 'h' | 'sq';
// chaque bloc de 4 = [big, h, sq, sq] -> remplit parfaitement une grille 4 colonnes x 2 lignes
const GALLERY_LAYOUT: [number, GalleryShape][] = [
  [1, 'big'], [2, 'h'], [4, 'sq'], [5, 'sq'],
  [3, 'big'], [6, 'h'], [8, 'sq'], [9, 'sq'],
  [7, 'big'], [12, 'h'], [10, 'sq'], [11, 'sq'],
  [13, 'big'], [15, 'h'], [14, 'sq'], [16, 'sq'],
  [17, 'big'], [18, 'h'], [21, 'sq'], [22, 'sq'],
  [23, 'big'], [25, 'h'], [24, 'sq'], [26, 'sq'],
  [27, 'big'], [29, 'h'], [28, 'sq'], [30, 'sq'],
  [31, 'big'], [33, 'h'], [32, 'sq'], [34, 'sq'],
  [35, 'big'], [37, 'h'], [36, 'sq'], [38, 'sq'],
];
export const gallery: { src: string; shape: GalleryShape }[] = GALLERY_LAYOUT.map(([i, s]) => ({ src: photos[i] ?? photos[0], shape: s }));

export const contact = {
  name: 'Les sons du jardin',
  nameAr: 'أصوات الحديقة',
  phone: '+216 98 277 380',
  phoneDisplay: '+216 98 277 380',
  whatsapp: '21698277380',
  address: 'Avenue Hedi Khfecha, Skanes 5000, Monastir, Tunisie',
  city: 'Skanes, Monastir',
  rating: '4.81',
  reviews: '60',
  // Note : note principale = Airbnb (plus représentatif). La note Google (4.6/5) reste dispo via le lien.
  googleRating: '4.6',
  googleReviews: '5',
  mapsEmbed: 'https://www.google.com/maps?q=Les+sons+du+jardin+Skanes+Monastir&output=embed',
  mapsDir: 'https://www.google.com/maps/dir/?api=1&destination=Les+sons+du+jardin+Skanes+Monastir',
  socials: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    // Ajoute ici les vrais liens quand tu les as
  },
};

// JSON-LD pour le référencement local
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: contact.name,
  address: { '@type': 'PostalAddress', streetAddress: 'Avenue Hedi Khfecha, Skanes 5000', addressLocality: 'Monastir', addressCountry: 'TN' },
  telephone: contact.phone,
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.81', reviewCount: '60' },
  url: 'https://atlasis-digital.github.io/sons-du-jardin/',
};

export const hoursDetail = { fr: 'Check-in 14h00 · Check-out 12h00', en: 'Check-in 2pm · Check-out 12pm', ar: 'تسجيل الدخول 14:00 · المغادرة 12:00' };

export const promo = { fr: 'Petit-déjeuner maison offert · Réservation directe = meilleur prix', en: 'Homemade breakfast included · Direct booking = best price', ar: 'فطور محلي مجاني · الحجز المباشر = أحسن سعر' };

export const scrapedReviews = [
  { rating: 5, date: 'il y a 5 mois' },
  { rating: 5, date: 'il y a 1 mois' },
  { rating: 4, date: 'il y a 3 ans' },
  { rating: 5, date: 'il y a 4 ans' },
  { rating: 5, date: 'il y a 4 ans' },
];

// Avis Airbnb (vrais clients, source : annonce Airbnb Les Sons du Jardin)
export const airbnbRating = '4.81';
export const airbnbCount = '60';
export const airbnbReviews = [
  { name: 'Belgacem', rating: 5, text: "Un excellent séjour en famille chez une hôte remarquable. Dès notre arrivée, elle a été extrêmement accueillante, souriante et disponible. Le logement correspondait parfaitement à nos attentes : propre, fonctionnel et bien situé." },
  { name: 'Jelle', rating: 5, text: "Séjour merveilleux : jardin paradisiaque, logement impeccablement propre, spacieux et cosy. Emplacement idéal dans un quartier calme, à distance de marche de la plage. Hôte incroyablement sympathique." },
  { name: 'Barbara', rating: 5, text: "Lorsque vous réservez en Tunisie, ne choisissez pas un hôtel, mais choisissez cette belle maison. Une maison de caractère, située dans une oasis de paix. L'hôtesse était parfaite et le repas tunisien absolument délicieux." },
  { name: 'Evan & Yasmin', rating: 5, text: "Nous avons beaucoup apprécié notre séjour aux Sons du Jardin à Monastir ! Cette ancienne demeure familiale est meublée avec goût, a toutes les commodités modernes tout en gardant son charme ancien. Le jardin est un joli havre de paix." },
  { name: 'Kaireddin', rating: 5, text: "Ce voyage a été l'une des meilleures expériences vécues. Le lieu est paradisiaque avec un luxe incroyable. La villa est un bijou et le jardin un véritable conte de fée grâce à son calme et sa beauté." },
  { name: 'Sabrine', rating: 5, text: "Une maison avec une histoire et une architecture fantastique. L'intérieur et les chambres sont beaucoup plus beaux que ce que vous pouvez voir sur les photos. La propriétaire a toujours été très gentille, disponible et professionnelle." },
  { name: 'Valérie', rating: 5, text: "Une parenthèse enchantée... difficile de trouver les mots face à ce jardin incroyable, cette belle maison très bien entretenue et la gentillesse de nos hôtes. Nous garderons le meilleur souvenir de Tunisie grâce à ce lieu d'exception." },
  { name: 'Mathilde', rating: 5, text: "Je recommande à 100% le logement Les Sons du Jardin, c'est une belle surprise, une villa dans un quartier paisible, avec un beau jardin et une piscine. Les chambres sont propres et bien entretenues, les hôtes très accueillants." },
  { name: 'Frédéric', rating: 5, text: "En plus de 8 ans d'Airbnb je n'ai jamais eu un accueil aussi chaleureux chez un hôte. Sa maison totalement rénovée est extrêmement confortable. Le grand jardin très calme, la piscine, le chef à domicile sont des vrais plus." },
  { name: 'Thouraya', rating: 5, text: "Un vrai havre de paix ! Coin extrêmement tranquille, parfait pour une famille. Une belle piscine dans un jardin intime, relaxation garantie. La propriétaire est très accueillante et donne de bonnes recommandations." },
];

export const i18n = {
  nav_home: { fr: 'ACCUEIL', en: 'HOME', ar: 'الرئيسية' },
  nav_rooms: { fr: 'CHAMBRES', en: 'ROOMS', ar: 'الغرف' },
  nav_gallery: { fr: 'GALERIE', en: 'GALLERY', ar: 'معرض' },
  nav_contact: { fr: 'RÉSERVATION', en: 'BOOKING', ar: 'احجز' },
  nav_history: { fr: 'NOTRE HISTOIRE', en: 'OUR STORY', ar: 'قصتنا' },
  nav_events: { fr: 'ÉVÉNEMENTS', en: 'EVENTS', ar: 'فعاليات' },
  hero_title: { fr: 'Les sons du jardin', en: 'Les sons du jardin', ar: 'أصوات الحديقة' },
  hero_lead: { fr: 'Maison de charme à Skanes, en face de la mer, dans un cadre paradisiaque. Repas extraordinaires, jardin méditerranéen, et le chant des oiseaux au réveil.', en: 'A charming home in Skanes, facing the sea, in a paradisiacal setting. Extraordinary meals, Mediterranean garden, and birdsong at dawn.', ar: 'بيت ساحر في سقانس، أمام البحر، في إطار فردوسي. وجبات استثنائية، حديقة متوسطية، وغناء العصافير عند الاستيقاظ.' },
  about_title: { fr: 'Un refuge au bord du jardin', en: 'A retreat by the garden', ar: 'ملاذ عند الحديقة' },
  about: { fr: 'À deux pas des plages de Monastir et de Skanes, notre maison de charme vous accueille comme à la maison. En face de la mer, elle vous offre des repas extraordinaires dans un cadre paradisiaque : terrasse ombragée, salon de jardin, et chambres pensées pour le repos.', en: 'Steps from the Monastir and Skanes beaches, our charming home welcomes you like family. Facing the sea, it offers extraordinary meals in a paradisiacal setting: shaded terrace, garden lounge, and rooms made for rest.', ar: 'على مقربة من شواطئ المنستير وسقانس، بيتنا الساحر يرحب بك كأنك في بيتك. أمام البحر، يقدم وجبات استثنائية في إطار فردوسي: تراس ظليل، صالة حديقة، وغرف مصممة للراحة.' },
  history_title: { fr: 'L\'âme des lieux', en: 'The soul of the place', ar: 'روح المكان' },
  history: {
    fr: [
      'Les Sons du jardin est une demeure artistique et interculturelle, nichée au bord de la falaise de Skanes à Monastir. Elle porte un héritage familial datant du milieu du XXᵉ siècle : le domaine appartient aux El Jemmali, un nom si étendu qu\'il fut prêté à tout le quartier.',
      'Son architecture conjugue le cubisme et des structures en arcs, avec des espaces majestueusement suspendus en symbiose avec la nature. L\'extérieur, magnifiquement ombragé, compte des oliviers centenaires et une piscine aux lumières variables.',
      'À l\'entrée, sous un arbre centenaire, veille une reproduction en fer forgé de l\'œuvre du grand peintre tunisien Zoubeir Turki. Faïence d\'artisans, illustrations signées, salons littéraires : ici, l\'hospitalité est un véritable art.',
      'La maison accueille penseurs, écrivains et figures de la culture tunisienne, dans la perspective de valoriser le tourisme culturel et écologique du Sahel. Le bonheur n\'a de sens que s\'il est partagé.',
    ],
    en: [
      'Les Sons du jardin is an artistic and intercultural home, nestled on the Skanes cliff in Monastir. It carries a family heritage from the mid-20th century: the estate belongs to the El Jemmali family, a name so vast it was given to the whole neighbourhood.',
      'Its architecture blends cubism and arched structures, with majestically suspended spaces in symbiosis with nature. The shaded exterior holds century-old olive trees and a pool with shifting lights.',
      'At the entrance, beneath a centenary tree, stands a wrought-iron reproduction of a work by the great Tunisian painter Zoubeir Turki. Artisan tiles, signed illustrations, literary salons: here, hospitality is a true art.',
      'The house welcomes thinkers, writers and figures of Tunisian culture, to value the cultural and ecological tourism of the Sahel. Happiness only makes sense when shared.',
    ],
    ar: [
      'Les Sons du jardin دار فنية وثقافية، متربعة على صخرة سقانس في المنستير. تحمل إرثاً عائلياً يعود لمنتصف القرن العشرين: العقار يخص عائلة الجملالي، اسم اتسع حتى أُطلق على الحي بأكمله.',
      'يجمع بناؤها بين التكعيبية والأقواس، بمساحات معلقة ببهاء في تآلف مع الطبيعة. الخارج الظليل يضم أشجار زيتون مئوية وحوض سباحة بأضواء متغيرة.',
      'عند المدخل، تحت شجرة مئوية، تقف إعادة صنع بالحديد المطاوع لعمل الرسام التونسي الكبير زبير التركي. قرميد حرفي، لوحات موقعة، صالونات أدبية: هنا الضيافة فن حقيقي.',
      'يستقبل البيت المفكرين والكتاب ورموز الثقافة التونسية، لتعزيز السياحة الثقافية والبيئية في الساحل. السعادة لا معنى لها إلا إذا شاركها غيرك.',
    ],
  },
  hours: { fr: 'Check-in 14h00 · Check-out 12h00', en: 'Check-in 2pm · Check-out 12pm', ar: 'تسجيل الدخول 14:00 · المغادرة 12:00' },
  rooms_title: { fr: 'Nos chambres', en: 'Our rooms', ar: 'غرفنا' },
  rooms: {
    fr: [
      { n: 'Chambre Jasmin', d: 'Lit double, vue jardin, salle d\'eau privée.', p: '120 TND / nuit' },
      { n: 'Chambre Olivier', d: 'Deux lits, terrasse ombragée.', p: '140 TND / nuit' },
      { n: 'Suite Cèdre', d: 'Grand espace, salon, accès jardin direct.', p: '180 TND / nuit' },
    ],
    en: [
      { n: 'Jasmine Room', d: 'Double bed, garden view, private shower.', p: '120 TND / night' },
      { n: 'Olive Room', d: 'Twin beds, shaded terrace.', p: '140 TND / night' },
      { n: 'Cedar Suite', d: 'Large space, lounge, direct garden access.', p: '180 TND / night' },
    ],
    ar: [
      { n: 'غرفة ياسمين', d: 'سرير مزدوج، إطلالة على الحديقة، حمام خاص.', p: '120 دينار / ليلة' },
      { n: 'غرفة زيتون', d: 'سريران، تراس ظليل.', p: '140 دينار / ليلة' },
      { n: 'جناح أرز', d: 'مساحة كبيرة، صالة، وصول مباشر للحديقة.', p: '180 دينار / ليلة' },
    ],
  },
  gallery_title: { fr: 'Galerie', en: 'Gallery', ar: 'معرض' },
  reviews_title: { fr: 'Ils ont séjourné', en: 'Our guests', ar: 'نزلاؤنا' },
  reserve: { fr: 'Réserver', en: 'Book', ar: 'احجز' },
  reservation: { fr: 'Réservation', en: 'Booking', ar: 'الحجز' },
  arrival_time: { fr: 'Heure arrivée', en: 'Arrival time', ar: 'وقت الوصول' },
  departure_time: { fr: 'Heure départ', en: 'Departure time', ar: 'وقت المغادرة' },
  contact_title: { fr: 'Contact & accès', en: 'Contact & directions', ar: 'اتصل ووصول' },
  contact_text: { fr: 'Écrivez-nous sur WhatsApp pour disponibilité et tarifs, ou appelez directement.', en: 'Message us on WhatsApp for availability and rates, or call directly.', ar: 'راسلنا على واتساب للتوفر والأسعار، أو اتصل مباشرة.' },
  whatsapp: { fr: 'WhatsApp', en: 'WhatsApp', ar: 'واتساب' },
  call: { fr: 'Appeler', en: 'Call', ar: 'اتصل' },
  features_title: { fr: 'Pourquoi chez nous', en: 'Why stay with us', ar: 'لماذا تقيم معنا' },
  features: {
    fr: [
      { ic: '🌿', h: 'Jardin méditerranéen', p: 'Terrasse ombragée et verdure pour le repos.' },
      { ic: '🥐', h: 'Petit-déjeuner maison', p: 'Produits frais, faits chaque matin.' },
      { ic: '🏖️', h: 'Près des plages', p: 'Monastir et Skanes à quelques minutes.' },
      { ic: '🤫', h: 'Calme absolu', p: 'Loin du bruit, pour de vraies vacances.' },
    ],
    en: [
      { ic: '🌿', h: 'Mediterranean garden', p: 'Shaded terrace and greenery for rest.' },
      { ic: '🥐', h: 'Homemade breakfast', p: 'Fresh produce, made each morning.' },
      { ic: '🏖️', h: 'Near the beaches', p: 'Monastir and Skanes minutes away.' },
      { ic: '🤫', h: 'Absolute calm', p: 'Away from noise, for real holidays.' },
    ],
    ar: [
      { ic: '🌿', h: 'حديقة متوسطية', p: 'تراس ظليل وخضرة للراحة.' },
      { ic: '🥐', h: 'فطور محلي', p: 'منتجات طازجة، محضرة كل صباح.' },
      { ic: '🏖️', h: 'قرب الشواطئ', p: 'المنستير وسقانس على بعد دقائق.' },
      { ic: '🤫', h: 'هدوء تام', p: 'بعيد عن الضجيج، لعطلة حقيقية.' },
    ],
  },
  faq_title: { fr: 'Questions fréquentes', en: 'FAQ', ar: 'أسئلة شائعة' },
  footer_title: { fr: 'Les sons du jardin', en: 'Les sons du jardin', ar: 'أصوات الحديقة' },
  footer_tagline: { fr: 'Maison d\'hôtes · Skanes, Monastir', en: 'Guesthouse · Skanes, Monastir', ar: 'نزل · سقانس، المنستير' },
  footer_contact: { fr: 'Contact', en: 'Contact', ar: 'اتصل' },
  footer_follow: { fr: 'Suivez-nous', en: 'Follow us', ar: 'تابعنا' },
  arrival: { fr: 'Date d\'arrivée', en: 'Arrival Date', ar: 'تاريخ الوصول' },
  departure: { fr: 'Date de départ', en: 'Departure Date', ar: 'تاريخ المغادرة' },
  time: { fr: 'Heure', en: 'Time', ar: 'الوقت' },
  send: { fr: 'Envoyer', en: 'Send', ar: 'إرسال' },
  optional_message: { fr: 'Facultatif', en: 'Optional', ar: 'اختياري' },
  message_title: { fr: 'Votre message', en: 'Your message', ar: 'رسالتك' },
  message_placeholder: { fr: 'Écrivez votre message...', en: 'Write your message...', ar: 'اكتب رسالتك...' },
  faq: {
    fr: [
      { q: 'Petit-déjeuner inclus ?', a: 'Oui, le petit-déjeuner maison est inclus dans tous les séjours.' },
      { q: 'Parking disponible ?', a: 'Oui, parking gratuit sur place.' },
      { q: 'Animaux acceptés ?', a: 'Sur demande, nous acceptons les petits animaux.' },
      { q: 'Transfert aéroport ?', a: 'Oui, transfert depuis l\'aéroport de Monastir sur réservation.' },
    ],
    en: [
      { q: 'Breakfast included?', a: 'Yes, homemade breakfast is included in every stay.' },
      { q: 'Parking available?', a: 'Yes, free on-site parking.' },
      { q: 'Pets allowed?', a: 'On request, we accept small pets.' },
      { q: 'Airport transfer?', a: 'Yes, transfer from Monastir airport on request.' },
    ],
    ar: [
      { q: 'الفطور مشمول؟', a: 'نعم، الفطور المحلي مشمول في كل إقامة.' },
      { q: 'موقف سيارات متاح؟', a: 'نعم، موقف مجاني في الموقع.' },
      { q: 'الحيوانات مسموحة؟', a: 'عند الطلب، نقبل الحيوانات الصغيرة.' },
      { q: 'نقل من المطار؟', a: 'نعم، نقل من مطار المنستير عند الطلب.' },
    ],
  },
};
