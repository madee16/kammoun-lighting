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
  facebookPageUrl: 'https://www.facebook.com/profile.php?id=100054271100283',
  facebookOwnerUrl: 'https://www.facebook.com/mhamedali.kammoun',
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

export const ADMIN_DEVICE_ACCESS_KEY = 'kl_admin_device_unlocked';
export const ADMIN_DEVICE_PASSPHRASE_HASH =
  'f6b9a9851afe1c4fccc08bb2062807f8a329164a8e84cd713a199a271f0baba3';

export const ADMIN_COPY = {
  privateEyebrow: 'Espace prive',
  deviceTitle: 'Acces restreint',
  deviceText: 'Saisis le code d’acces pour ouvrir la gestion.',
  devicePlaceholder: 'Code d’acces',
  deviceCta: 'Ouvrir',
  deviceDenied: 'Code incorrect.',
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
    logoUrl: 'https://www.somef.tn/img/logo.png',
    website: 'https://www.somef.tn/',
  },
  {
    name: 'Platinum',
    logoUrl: 'https://dummyimage.com/220x90/0d47a1/ffffff&text=PLATINUM',
    website: '',
  },
  {
    name: 'Schneider Electric',
    logoUrl:
      "data:image/svg+xml,%3c!--%20SPDX-FileCopyrightText:%20%C2%A9%202024%20Schneider%20Electric%20SPDX-License-Identifier:%20LicenseRef-Proprietary%20--%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20218%2064'%3e%3cpath%20fill='%23009530'%20d='M24.7%209.47c-4.95-2.18-7.87-3.1-10.8-3.1-3.1%200-5.12%201.1-5.12%202.74%200%205.1%2017.56%203.64%2017.56%2015.48%200%206.56-5.49%2010.38-13.17%2010.38-6.04%200-8.96-1.64-12.44-3.28v-7.28c4.94%203.28%207.87%204.37%2011.7%204.37%203.3%200%205.13-1.1%205.13-3.1C17.56%2020.04%200%2022.22%200%209.84%200%204%205.12%200%2012.99%200c3.84%200%207.31.73%2011.7%202.73v6.74Zm24.5%2024.04a21.55%2021.55%200%200%201-7.86%201.64c-8.23%200-13.36-4.73-13.36-11.84%200-7.1%205.5-12.02%2013.17-12.02%202.38%200%205.3.55%207.87%201.46v5.46a12.43%2012.43%200%200%200-5.85-1.64c-4.4%200-7.14%202.55-7.14%206.56%200%204%202.75%206.74%206.95%206.74%201.83%200%203.3-.36%206.59-1.64v5.28m67.49-22.4c-7.13%200-12.25%205.1-12.25%2012.02%200%207.1%205.3%2011.84%2013.35%2011.84%201.83%200%206.22%200%2010.24-3.1v-4.36c-3.47%202.36-5.67%203.27-8.6%203.27-4.56%200-7.3-2.36-7.67-6.37h16.64c.55-8.56-4.94-13.3-11.7-13.3Zm-4.39%209.47c.37-3.28%202.2-5.1%204.94-5.1%202.75%200%204.76%201.82%204.94%205.1h-9.88Zm26.52-9.1h-7.32V34.6h7.32V11.48ZM159.3.55v12.02a14.02%2014.02%200%200%200-6.04-1.46c-6.59%200-11.16%204.92-11.16%2012.02%200%206.92%204.57%2012.02%2010.8%2012.02%202.37%200%204.38-.72%206.4-2.36v1.82h7.31V.55h-7.32Zm0%2027.87c-1.47%201.27-2.75%201.82-4.4%201.82-3.47%200-5.66-2.74-5.66-6.92%200-4.56%202.19-7.3%205.85-7.3%201.28%200%203.1.56%204.02%201.28v11.12h.18Zm22.69-17.31c-7.13%200-12.25%205.1-12.25%2012.02%200%207.1%205.3%2011.84%2013.35%2011.84%201.83%200%206.22%200%2010.42-3.1v-4.36c-3.47%202.36-5.67%203.27-8.6%203.27-4.57%200-7.31-2.36-7.68-6.37h16.65c.37-8.56-5.12-13.3-11.89-13.3Zm-4.57%209.47c.36-3.28%202.2-5.1%204.94-5.1s4.75%201.82%205.12%205.1h-10.06Zm27.42-2.36c2.2-4.74%204.76-7.1%207.5-7.1%201.47%200%202.75.54%204.76%202.18l-2.01%206.37c-1.83-1.27-3.11-1.64-4.4-1.64-2.74%200-4.38%202.55-6.03%206.74V34.8h-7.31V11.48h7.31v6.74m-65.11-16.4c.73%201.82-.55%204.37-2.75%205.65-2.2%201.27-4.57.9-5.12-.92-.73-1.82.55-4.37%202.75-5.64%202-1.28%204.38-.91%205.12.9Zm-64.2%2018.22c0-6.2-4.2-8.74-8.41-8.74-2.93%200-5.3%201.27-7.32%203.82h-.18V.73h-7.32V34.8h7.32V20.22c1.64-2.37%203.1-3.46%204.93-3.46%202.2%200%203.85%201.64%203.85%205.1v8.2a22.9%2022.9%200%200%201%207.31-2.37v-7.65m18.12-8.93c-2.93%200-5.3%201.1-7.5%203.83v-3.28h-7.32v15.66c2.56.19%205.67%201.46%207.32%203.28V19.85c1.83-2.91%203.3-3.82%205.12-3.82%202.01%200%203.66%201.27%203.66%204.55v14.03h7.32V20.04c-.19-6.92-5.13-8.93-8.6-8.93Zm12.45%2030.06h-8.6v6h8.24v2.56H97.5v6.19h8.78v2.55H94.76V38.62h11.34v2.55Zm9.3-2.55h-2.55v19.85h2.56V38.62Zm9.33%2013.66h9.14c0-4.92-2.2-7.1-5.67-7.1-3.66%200-6.03%202.72-6.03%206.55%200%203.64%202.2%206.92%206.4%206.92a9.9%209.9%200%200%200%205.3-1.46v-2.55a7.81%207.81%200%200%201-4.57%201.64c-2.74%200-4.2-1.27-4.57-4Zm3.65-4.92c1.83%200%202.93%201.27%203.11%203.28h-6.58c.18-2%201.46-3.28%203.47-3.28Zm22.52%201.46a5.56%205.56%200%200%200-3.67-1.28c-2.37%200-4.02%201.82-4.02%204.55%200%202.74%201.83%204.38%204.39%204.38a9%209%200%200%200%203.47-.91v2.55a12%2012%200%200%201-3.84.72%206.33%206.33%200%200%201-6.58-6.55c0-4.38%202.56-7.1%206.4-7.1%201.46%200%202.56.36%203.84.9v2.74Zm11.87-3.47h4.21v2.37h-4.2v6.74c0%201.46%201.1%202%201.82%202a6.8%206.8%200%200%200%202.93-.9v2.36c-.91.55-2.38.91-3.11.91-2.74%200-4.2-1.82-4.2-4.19v-6.92h-2.2v-.18l4.94-4.74v2.55m13.73%200v3.1c1.28-2.37%202.56-3.28%203.84-3.28%201.1%200%202.01.55%203.11%201.46l-1.46%202.19c-.74-.73-1.83-1.28-2.38-1.28-1.83%200-3.11%201.82-3.11%204v6.93h-2.56V45.35h2.56Zm33.65%203.47a5.56%205.56%200%200%200-3.66-1.28c-2.38%200-4.03%201.82-4.03%204.55%200%202.74%201.83%204.38%204.4%204.38a9.1%209.1%200%200%200%203.47-.91v2.55a12%2012%200%200%201-3.84.72%206.33%206.33%200%200%201-6.59-6.55c0-4.38%202.56-7.1%206.4-7.1%201.47%200%202.56.36%203.84.9v2.74Zm-17.2-3.46h-2.56v13.11h2.56V45.36Zm.18-4.74c.18.54-.18%201.46-.91%202-.74.55-1.65.37-1.83-.36-.19-.73.18-1.46.91-2%20.73-.37%201.46-.19%201.83.36ZM79%2047.18l.74-2.92h7.13c.91-4.19.18-8.01-2.38-10.38-5.12-5.1-15.73-3.28-23.6%204.2-1.27%201.08-2.19%202.36-3.29%203.63H62l-.92%202.92h-5.12c-.55.9-.92%201.82-1.28%202.73h6.03l-.91%202.91h-6.04c-1.1%204.38-.36%208.38%202.2%2010.93%204.94%204.92%2015.55%203.28%2023.6-4.37a18.42%2018.42%200%200%200%203.47-4.19h-5.49l.92-2.91h6.4c.55-.91.91-1.82%201.28-2.73H79v.18Zm-1.64-5.47c-.37%200-.73%200-.92.37%200%200-.18.18-.18.36l-2.2%208.75c-.54%203.1-4.38%206.19-9.32%206.19h-6.95l1.28-4.55h4.39c.36%200%20.73-.19%201.1-.55.18-.18.18-.37.18-.55l1.83-7.65c.55-3.1%203.84-6.56%208.78-6.56h6.95l-.92%204.2h-4.02Z'%20/%3e%3c/svg%3e",
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
  {
    name: 'Afro Light',
    logoUrl:
      'https://scontent.fnbe1-2.fna.fbcdn.net/v/t39.30808-6/291669361_416670163811342_879877328057886905_n.jpg?stp=dst-jpg_tt6&cstp=mx360x360&ctp=s360x360&_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=susOk91ax00Q7kNvwEv2pz_&_nc_oc=AdqL3xn1PJ2w0dmTP0lItm7EhosjFVuMJE1HvNbuVrm8Z_ba9kSjs1Zn-3g3u4wDRoc&_nc_zt=23&_nc_ht=scontent.fnbe1-2.fna&_nc_gid=i7HUSr841-ATvM4gSftU_A&_nc_ss=7b2a8&oh=00_AQJpST8F9eRN8mrihrBJsWVMCz080BO1wMErPdQLn_TK7g&oe=6AAE2729',
    website: '',
  },
  {
    name: 'CHNT',
    logoUrl: 'https://www.google.com/s2/favicons?domain=chintglobal.com&sz=128',
    website: 'https://www.chintglobal.com/',
  },
  {
    name: 'Hager',
    logoUrl:
      'https://assets.sc.hager.com/-/media/project/hagerdeep/shared/images/white-logo-hager.png?h=64&la=en&w=192&hash=2BA5F29EDAF71044456529C64B33E2D7',
    website: 'https://hager.com/',
  },
  {
    name: 'Marlanvil',
    logoUrl:
      'https://www.marlanvil.it/imgs/157/logo_new.jpeg?t=hub&t=hub?s=large&f=webp&t=hub',
    website: 'https://www.marlanvil.it/',
  },
  {
    name: 'Mirsa Eliktrik',
    logoUrl: 'https://www.mirsaelektrik.com/resimler/logo.png',
    website: 'https://www.mirsaelektrik.com/',
  },
  {
    name: 'Alpha by Stiel',
    logoUrl: 'https://www.alphabystiel.tn/wp-content/uploads/2017/06/logo-footer.png',
    website: 'https://www.alphabystiel.tn/',
  },
  {
    name: 'TTI Elecsa TN',
    logoUrl: 'https://www.google.com/s2/favicons?domain=elecsa-tn.com&sz=128',
    website: 'https://www.elecsa-tn.com/',
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

