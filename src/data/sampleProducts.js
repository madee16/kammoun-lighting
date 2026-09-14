const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const img = (label, color = '1f7a4d') =>
  `https://dummyimage.com/600x450/${color}/ffffff.png&text=${encodeURIComponent(label).replace(/%20/g, '+')}`;

let counter = 0;
const p = (brand, category, name, opts = {}) => {
  counter += 1;
  return {
    id: `demo-${counter}`,
    slug: opts.slug || slugify(name),
    reference: opts.reference || `KL-${String(counter).padStart(3, '0')}`,
    name,
    brand,
    category,
    description:
      opts.description ||
      `${name} disponible chez Kammoun Lighting. Demandez le prix et la disponibilite par WhatsApp.`,
    wattage: opts.wattage || null,
    color_temperature: opts.color_temperature || 'Blanc neutre',
    stock_quantity: opts.stock_quantity ?? 3,
    price: opts.price ?? null,
    show_price: Boolean(opts.show_price),
    image_url: opts.image_url || img(name),
    image_urls: opts.image_urls ? [img(`${name} 2`, '243b31')] : [],
    availability_status: opts.availability_status || 'auto',
    is_new: Boolean(opts.is_new),
    featured: Boolean(opts.featured),
    active: true,
    sort_order: opts.sort_order ?? 50,
  };
};

export const sampleProducts = [
  // Projecteurs
  p('Platinum', 'Projecteurs', 'Projecteur LED 20W', {
    wattage: '20W',
    featured: true,
    sort_order: 1,
  }),
  p('Platinum', 'Projecteurs', 'Projecteur LED 50W IP65', {
    wattage: '50W',
    description: 'Projecteur etanche pour facade, depot et espaces exterieurs.',
    stock_quantity: 12,
    image_urls: true,
  }),
  p('Platinum', 'Projecteurs', 'Projecteur LED 100W', {
    wattage: '100W',
    description: 'Fort flux lumineux pour grands espaces et chantiers.',
    price: 145,
    show_price: true,
  }),
  p('Philips', 'Projecteurs', 'Projecteur LED 30W Philips', {
    wattage: '30W',
    color_temperature: 'Blanc chaud',
    stock_quantity: 20,
  }),
  p('LEDVANCE', 'Projecteurs', 'Projecteur LED 50W Floodlight', {
    wattage: '50W',
    is_new: true,
  }),
  p('Somef', 'Projecteurs', 'Projecteur LED 200W', {
    wattage: '200W',
    description: 'Projecteur industriel pour chantiers et parkings.',
    price: 260,
    show_price: true,
  }),
  p('Mirsa Eliktrik', 'Projecteurs', 'Projecteur LED eau de pluie 150W', {
    wattage: '150W',
    description: 'Projecteur etanche de marque Mirsa pour exterieur.',
    stock_quantity: 1,
  }),
  p('Afro Light', 'Projecteurs', 'Projecteur LED 10W Afro Light', {
    wattage: '10W',
    description: 'Petit projecteur compact pour accents.',
    is_new: true,
  }),
  p('Hager', 'Projecteurs', 'Projecteur LED 30W Hager', {
    wattage: '30W',
    stock_quantity: 0,
  }),

  // Panneaux LED
  p('Philips', 'Panneaux LED', 'Panneau LED encastrable 18W', {
    wattage: '18W',
    featured: true,
    sort_order: 2,
  }),
  p('Philips', 'Panneaux LED', 'Panneau LED 36W', {
    wattage: '36W',
    description: 'Panneau lumineux pour bureaux, salles de classe et couloirs.',
    price: 49,
    show_price: true,
  }),
  p('LEDVANCE', 'Panneaux LED', 'Panneau LED carre 24W', { wattage: '24W' }),
  p('Sylvania', 'Panneaux LED', 'Panneau LED Sylvania 18W', { wattage: '18W' }),
  p('Osram', 'Panneaux LED', 'Panneau LED Osram 32W', {
    wattage: '32W',
    is_new: true,
  }),
  p('Somef', 'Panneaux LED', 'Panneau LED 12W Somef', {
    wattage: '12W',
    stock_quantity: 8,
  }),
  p('Schneider Electric', 'Panneaux LED', 'Panneau LED 24W', { wattage: '24W' }),
  p('TTI Elecsa TN', 'Panneaux LED', 'Panneau LED 18W industriel', {
    wattage: '18W',
    description: 'Panneau industriel pour ateliers et entrepots.',
  }),
  p('ABB', 'Panneaux LED', 'Panneau LED 36W ABB', {
    wattage: '36W',
    stock_quantity: 0,
  }),

  // Rubans LED
  p('Philips', 'Rubans LED', 'Ruban LED 5m 12V', {
    wattage: '24W',
    featured: true,
    sort_order: 3,
    price: 25,
    show_price: true,
  }),
  p('Philips', 'Rubans LED', 'Ruban LED RGB 5m', {
    wattage: '20W',
    description: 'Ruban LED RGB pour decoration et vitrines.',
    price: 32,
    show_price: true,
  }),
  p('LEDVANCE', 'Rubans LED', 'Ruban LED 2m doux', {
    wattage: '10W',
    color_temperature: 'Blanc chaud',
  }),
  p('Osram', 'Rubans LED', 'Ruban LED 10m', { wattage: '48W', is_new: true }),
  p('Sylvania', 'Rubans LED', 'Ruban LED etanche 5m', {
    wattage: '24W',
    description: 'Ruban etanche pour cuisines et terrasses.',
  }),
  p('Mirsa Eliktrik', 'Rubans LED', 'Ruban LED Mirsa 5m', { wattage: '20W' }),
  p('Afro Light', 'Rubans LED', 'Ruban LED Afro Light 1m', {
    wattage: '5W',
    description: 'Segment court pour petits projets.',
  }),
  p('TTI Elecsa TN', 'Rubans LED', 'Ruban LED pro 5m', {
    wattage: '24W',
    is_new: true,
  }),

  // Accessoires
  p('Schneider Electric', 'Accessoires', 'Interrupteur double', {
    description: 'Interrupteur double a encastrer, serie standard.',
  }),
  p('Schneider Electric', 'Accessoires', 'Prise de courant 2P+T', {
    price: 8,
    show_price: true,
    featured: true,
    sort_order: 4,
  }),
  p('Legrand', 'Accessoires', 'Prise USB Legrand', { is_new: true }),
  p('Hager', 'Accessoires', 'Tableau 4 modules'),
  p('Hager', 'Accessoires', 'Diffuseur 10A Hager', {
    price: 22,
    show_price: true,
  }),
  p('CHNT', 'Accessoires', 'Prise CHNT 16A', { stock_quantity: 30 }),
  p('CHNT', 'Accessoires', 'Interrupteur CHNT', { stock_quantity: 0 }),
  p('BTicino', 'Accessoires', 'Prise BTicino'),
  p('Platinum', 'Accessoires', 'Douille E27 Platinum'),
  p('Alpha by Stiel', 'Accessoires', 'Interrupteur serie Alpha', {
    is_new: true,
    description: 'Appareillage de la serie Alpha, design aluminium.',
  }),
  p('Marlanvil', 'Accessoires', 'Boite de derivation Marlanvil'),
  p('TTI Elecsa TN', 'Accessoires', 'Cable HO5V-K 2,5mm2', {
    price: 12,
    show_price: true,
  }),
];