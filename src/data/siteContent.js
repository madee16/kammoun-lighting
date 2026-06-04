export const ROUTES = {
  home: '/',
  admin: '/gestion',
  catalog: '/catalogue',
  categories: '/categories',
  categoryPrefix: '/categorie/',
  brands: '/marques',
  brandPrefix: '/marque/',
  productPrefix: '/produit/',
  contact: '/contact',
  about: '/a-propos',
};

export const EMPTY_PRODUCT = {
  name: '',
  reference: '',
  brand: '',
  category: '',
  description: '',
  wattage: '',
  color_temperature: '',
  stock_quantity: 0,
  price: '',
  show_price: false,
  image_url: '',
  image_urls: '',
  availability_status: 'auto',
  is_new: false,
  sort_order: 0,
  active: true,
  featured: false,
};

export const STORE_INFO = {
  legalName: "Societe MEM d'Electricite",
  brandName: 'Kammoun Lighting',
  brandInitials: 'KL',
  logoPath: '/assets/kammoun-logo.png',
  phone: '+216 22 400 000',
  telHref: 'tel:+21622400000',
  address: 'Tunisie',
  mapUrl: 'https://maps.app.goo.gl/6Sqn7qhkrnVcyZRU6',
  facebookUrl: 'https://www.facebook.com/p/Sté-MEM-délectricité-100054271100283/',
  openingHours: [
    'Lundi - Vendredi: 8h - 12h30, 14h - 17h',
    'Samedi: 8h - 12h30',
    'Dimanche: Fermé',
  ],
};

export const DEFAULT_CATEGORIES = [
  { name: 'Projecteurs', text: 'Facades, depots et espaces exterieurs.' },
  { name: 'Panneaux LED', text: 'Bureaux, magasins et plafonds modernes.' },
  { name: 'Rubans LED', text: 'Vitrines, decoration et eclairage indirect.' },
  { name: 'Accessoires', text: 'Alimentations, supports et pieces utiles.' },
];

export const NAV_ITEMS = [
  { label: 'Accueil', path: ROUTES.home },
  { label: 'Catalogue', path: ROUTES.catalog },
  { label: 'Categories', path: ROUTES.categories },
  { label: 'Marques', path: ROUTES.brands },
  { label: 'A propos', path: ROUTES.about },
  { label: 'Contact', path: ROUTES.contact },
];

export const PAGE_COPY = {
  homeIntro: {
    eyebrow: "Magasin d'eclairage",
    title: 'Des produits clairs, un contact direct.',
    text:
      'Le site sert de catalogue simple pour consulter les arrivages, verifier les gammes disponibles et demander les details directement par WhatsApp.',
  },
  hero: {
    eyebrow: STORE_INFO.legalName,
    title: STORE_INFO.brandName,
    text:
      "Solutions d'eclairage pour maisons, commerces et chantiers: projecteurs, panneaux LED, rubans, accessoires et arrivages selon le stock du magasin.",
    catalogCta: 'Voir le catalogue',
    contactCta: 'Nous contacter',
  },
  featured: {
    eyebrow: 'Selection',
    title: 'Produits a consulter',
    cta: 'Tout le catalogue',
    loading: 'Chargement du catalogue...',
    empty: 'Les produits seront ajoutes bientot.',
  },
  trust: {
    eyebrow: 'Confiance',
    title: STORE_INFO.legalName,
    text:
      'Kammoun Lighting presente les produits disponibles au magasin et garde le contact direct avec les clients pour confirmer les prix, les quantites et les disponibilites.',
    aboutCta: 'En savoir plus',
    contactCta: 'Contact',
  },
  brandLogos: {
    eyebrow: 'Nos marques',
    title: 'Marques disponibles au magasin',
    text: 'Les marques peuvent changer selon les arrivages et le stock.',
  },
  testimonials: {
    eyebrow: 'Avis clients',
    title: 'Ce que disent les clients',
    text: 'Avis temporaires pour montrer la section. Ils pourront etre remplaces par de vrais avis.',
    formTitle: 'Ajouter un commentaire',
    namePlaceholder: 'Votre nom',
    locationPlaceholder: 'Votre ville (optionnel)',
    commentPlaceholder: 'Votre commentaire',
    submitLabel: 'Envoyer',
    helperText: 'Votre commentaire sera visible apres validation par un administrateur.',
    successMessage: 'Merci, votre commentaire a ete envoye pour validation.',
    missingFieldsMessage: 'Ajoutez votre nom et votre commentaire.',
    errorMessage: 'Impossible d’envoyer le commentaire pour le moment.',
  },
  catalog: {
    eyebrow: 'Catalogue',
    title: 'Produits disponibles',
    text:
      'Parcourez les gammes, filtrez par marque ou categorie, puis demandez les details du produit sur WhatsApp.',
    searchPlaceholder: 'Rechercher un produit, une marque, une reference...',
    stockOnly: 'En stock',
    loading: 'Chargement du catalogue...',
    empty: 'Aucun produit ne correspond a cette recherche.',
  },
  categories: {
    eyebrow: 'Categories',
    title: 'Gammes de produits',
    text: 'Choisissez une famille de produits pour ouvrir un catalogue filtre.',
    emptyCount: 'A completer',
  },
  brands: {
    eyebrow: 'Marques',
    title: 'Marques disponibles',
    text: 'Les marques dependent du stock et des arrivages du magasin.',
    fallback: ['Platinum', 'Somef'],
    tileText: 'Voir les produits disponibles de cette marque.',
    allCta: 'Voir tout',
  },
  product: {
    loadingTitle: 'Chargement...',
    loadingText: 'Recherche du produit.',
    missingTitle: 'Produit introuvable',
    missingText: "Ce produit n'est plus disponible dans le catalogue public.",
    backToCatalog: 'Retour au catalogue',
    fallbackEyebrow: 'Produit',
    fallbackMeta: 'Eclairage',
    fallbackDetails: 'Details disponibles sur WhatsApp.',
    quantityLabel: 'Quantite souhaitee',
    quantityPlaceholder: 'Ex: 2',
    priceOnRequest: 'Prix sur demande',
    askWhatsapp: 'Demander sur WhatsApp',
    askPrice: 'Demander le prix',
    checkAvailability: 'Verifier disponibilite',
    newBadge: 'Nouveaute',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Parlez directement avec le magasin',
    text:
      'Pour confirmer le stock, demander un prix ou envoyer une photo du besoin, WhatsApp reste le chemin le plus rapide.',
    photoTitle: 'Photo du besoin',
    photoText: 'Le client peut envoyer une photo de la lampe, piece ou espace.',
    photoCta: 'Envoyer une photo',
    photoMessage: 'Bonjour, je veux envoyer une photo de mon besoin en eclairage.',
    missingAddress: 'Adresse exacte a ajouter.',
    mapsCta: 'Ouvrir Google Maps',
  },
  about: {
    eyebrow: 'A propos',
    title: STORE_INFO.legalName,
    text:
      "Kammoun Lighting presente les produits d'eclairage disponibles et facilite le contact direct avec les clients.",
    sectionEyebrow: STORE_INFO.brandName,
    sectionTitle: 'Un catalogue simple pour un magasin reel.',
    sectionText:
      'Le site aide les clients a voir les gammes, choisir un produit et demander rapidement le prix ou la disponibilite. Les commandes et confirmations restent sur WhatsApp, comme le magasin travaille deja avec ses clients.',
    cta: 'Voir les produits',
  },
};

export const CONTACT_CARDS = [
  { icon: 'whatsapp', label: 'WhatsApp', value: STORE_INFO.phone, hrefType: 'whatsapp' },
  { icon: 'phone', label: 'Telephone', value: STORE_INFO.phone, href: STORE_INFO.telHref },
  { icon: 'map', label: 'Magasin', value: STORE_INFO.address },
];

export const CONTACT_INFO_PANELS = [
  { icon: 'clock', title: 'Horaires', type: 'openingHours' },
  { icon: 'map', title: 'Adresse', type: 'address' },
  { icon: 'whatsapp', title: PAGE_COPY.contact.photoTitle, type: 'photo' },
];

export const ABOUT_FACTS = [
  { icon: 'building', label: 'Societe', value: STORE_INFO.legalName },
  { icon: 'whatsapp', label: 'Contact', value: STORE_INFO.phone },
  { icon: 'tags', label: 'Produits', value: 'LED, projecteurs, panneaux et accessoires' },
];

export const PRODUCT_DETAIL_FIELDS = [
  { label: 'Reference', key: 'reference' },
  { label: 'Marque', key: 'brand' },
  { label: 'Puissance', key: 'wattage' },
  { label: 'Couleur', key: 'color_temperature' },
];

export const AVAILABILITY_OPTIONS = [
  { value: 'auto', label: 'Auto selon le stock' },
  { value: 'available', label: 'Disponible' },
  { value: 'request', label: 'Sur demande' },
  { value: 'order', label: 'Sur commande' },
];

export const AVAILABILITY_LABELS = {
  autoInStock: 'Disponible',
  autoOutOfStock: 'Sur demande',
  available: 'Disponible',
  request: 'Sur demande',
  order: 'Sur commande',
};

export const WHATSAPP_ACTION_LABELS = {
  details: "plus d'informations",
  price: 'le prix',
  availability: 'la disponibilite',
};

export const ADMIN_COPY = {
  privateEyebrow: 'Espace prive',
  loginTitle: 'Gestion Kammoun Lighting',
  loginText: 'Connecte-toi pour gerer les produits, le stock et les photos.',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'Mot de passe',
  loginCta: 'Se connecter',
  adminEyebrow: 'Administration',
  adminTitle: 'Gestion des produits',
  adminSubtitle: 'Catalogue, stock, images et import Excel.',
  formTitleAdd: 'Ajouter un produit',
  formTitleEdit: 'Modifier un produit',
  formHint: 'Les champs peuvent etre completes plus tard.',
  inventoryTitle: 'Inventaire',
  inventoryHint: 'Produits enregistres dans Supabase.',
  inventorySearchPlaceholder: 'Rechercher dans l’inventaire...',
  emptyInventory: 'Aucun produit pour le moment.',
  testimonialsTitle: 'Avis clients',
  testimonialsHint: 'Commentaires envoyes par les visiteurs.',
  emptyTestimonials: 'Aucun avis en attente.',
  approveLabel: 'Approuver',
  approvedLabel: 'Approuve',
  deleteLabel: 'Supprimer',
  testimonialsTableMissing:
    'La table testimonials n’existe pas encore. Execute le SQL dans Supabase.',
  setupTitle: 'Supabase pas encore connecte',
  setupText: 'Ajoute les variables de .env.example dans un fichier .env.local, puis relance le site.',
};

export const BRAND_LOGOS = [
  {
    name: 'Somef',
    logoUrl: 'https://www.google.com/s2/favicons?domain=somef.tn&sz=128',
    website: 'https://www.somef.tn/',
  },
  {
    name: 'Platinum',
    logoUrl: 'https://dummyimage.com/220x90/0d47a1/ffffff&text=PLATINUM',
    website: '',
  },
  {
    name: 'Schneider Electric',
    logoUrl: 'https://www.google.com/s2/favicons?domain=se.com&sz=128',
    website: 'https://www.se.com/',
  },
  {
    name: 'Legrand',
    logoUrl: 'https://www.google.com/s2/favicons?domain=legrandgroup.com&sz=128',
    website: 'https://www.legrandgroup.com/',
  },
  {
    name: 'Philips',
    logoUrl: 'https://www.google.com/s2/favicons?domain=philips.com&sz=128',
    website: 'https://www.philips.com/',
  },
  {
    name: 'LEDVANCE',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ledvance.com&sz=128',
    website: 'https://www.ledvance.com/',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Mohamed Ben Salem',
    location: 'Sfax',
    text: 'Service rapide sur WhatsApp, j’ai trouve les projecteurs LED qu’il me fallait.',
  },
  {
    name: 'Amel Trabelsi',
    location: 'Tunis',
    text: 'Catalogue clair, pratique pour verifier les modeles avant de se deplacer.',
  },
  {
    name: 'Youssef Kammoun',
    location: 'Sousse',
    text: 'Bon conseil pour choisir l’eclairage d’un petit local commercial.',
  },
];

export const ADMIN_STATS = [
  { label: 'Visibles', compute: (products) => products.filter((product) => product.active).length },
  {
    label: 'Stock faible',
    compute: (products) =>
      products.filter(
        (product) => product.active && product.stock_quantity > 0 && product.stock_quantity <= 3,
      ).length,
  },
  {
    label: 'Sur demande',
    compute: (products) =>
      products.filter((product) => product.active && product.stock_quantity === 0).length,
  },
];

export const ADMIN_TEXT_FIELDS = [
  { label: 'Nom du produit', key: 'name', required: true },
  { label: 'Reference', key: 'reference' },
  { label: 'Marque', key: 'brand', list: 'brand-options' },
  { label: 'Categorie', key: 'category', list: 'category-options' },
  { label: 'Puissance', key: 'wattage' },
  { label: 'Couleur', key: 'color_temperature' },
  { label: 'Stock', key: 'stock_quantity', type: 'number', min: '0' },
  { label: 'Prix', key: 'price', placeholder: 'Optionnel' },
  { label: 'Ordre accueil', key: 'sort_order', type: 'number' },
];

export const ADMIN_CHECKBOX_FIELDS = [
  { label: 'Afficher le prix', key: 'show_price' },
  { label: 'Produit en avant', key: 'featured' },
  { label: 'Nouveaute', key: 'is_new' },
  { label: 'Produit visible', key: 'active' },
];

export const ADMIN_FILE_ACTIONS = [
  { label: 'Ajouter images', accept: 'image/*', multiple: true, action: 'images' },
  { label: 'Import Excel/CSV', accept: '.csv,text/csv,.xlsx,.xls', action: 'import' },
];

