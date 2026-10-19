const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const TONES = {
  warm: { core: '#ffd9a8', beam: '#ffb35c', halo: '#ff9f45' },
  neutral: { core: '#fff6e2', beam: '#ffeec4', halo: '#ffe3a6' },
  cool: { core: '#e6f1ff', beam: '#c6ddff', halo: '#9ec8ff' },
};

function kelvinTone(label) {
  if (/chaud|2700|3000|warm/i.test(label || '')) return 'warm';
  if (/froid|5000|6000|6500|cool|blanc pur/i.test(label || '')) return 'cool';
  return 'neutral';
}

function fixtureShape(category, tone, variant) {
  const { core, beam } = tone;
  const tilt = variant ? 26 : 0;

  if (category === 'Panneaux LED') {
    const dots = [];
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        dots.push(
          `<circle cx="${228 + col * 36}" cy="${146 + row * 34}" r="6" fill="${core}" opacity="${
            variant ? 0.5 : 0.8
          }"/>`,
        );
      }
    }
    return `
      <rect x="206" y="118" width="188" height="126" rx="12" fill="#1c2a3d" stroke="#35506e"/>
      ${dots.join('')}
      <rect x="206" y="118" width="188" height="126" rx="12" fill="none" stroke="${beam}" stroke-opacity="0.35" stroke-width="2"/>
      <path d="M206 256 h188 l60 128 H146 Z" fill="url(#beam)"/>`;
  }

  if (category === 'Rubans LED') {
    const wave = (offset, width, color, opacity) =>
      `<path d="M118 ${258 + offset} q62 -42 124 0 t124 0 t124 0" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${width}" stroke-linecap="round"/>`;
    return `
      ${wave(0, variant ? 8 : 10, core, 0.9)}
      ${wave(0, variant ? 22 : 28, beam, 0.28)}
      ${wave(46, 6, core, 0.4)}
      ${wave(46, 18, beam, 0.14)}`;
  }

  if (category === 'Accessoires') {
    return `
      <rect x="238" y="122" width="124" height="182" rx="16" fill="#1c2a3d" stroke="#35506e"/>
      <rect x="266" y="166" width="68" height="24" rx="7" fill="#0d1a29" stroke="${beam}" stroke-opacity="0.5"/>
      <circle cx="300" cy="242" r="15" fill="#0d1a29" stroke="${beam}" stroke-opacity="0.5"/>
      <path d="M270 300 h60 v34 h-60 Z" fill="url(#beam)"/>`;
  }

  return `
    <g transform="rotate(${tilt / 2} 300 200)">
      <path d="M224 118 h152 l-20 62 h-112 Z" fill="#1c2a3d" stroke="#35506e"/>
      <ellipse cx="300" cy="182" rx="58" ry="13" fill="${core}" opacity="0.9"/>
      <path d="M242 184 h116 l112 214 H130 Z" fill="url(#beam)"/>
    </g>`;
}

function demoImage(category, colorTemperature, variant = 0) {
  const tone = TONES[kelvinTone(colorTemperature)];
  const glowOffset = variant ? 34 : 0;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <defs>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tone.beam}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${tone.beam}" stop-opacity="0.05"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="${tone.halo}" stop-opacity="0.38"/>
      <stop offset="1" stop-color="${tone.halo}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c4d8e7"/>
      <stop offset="1" stop-color="#b2cbdc"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bg)"/>
  <ellipse cx="${300 + glowOffset / 2}" cy="196" rx="230" ry="170" fill="url(#halo)"/>
  ${fixtureShape(category, tone, variant)}
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n\s*/g, ' '))}`;
}

let counter = 0;
const p = (brand, category, name, opts = {}) => {
  counter += 1;
  const colorTemperature = opts.color_temperature || 'Blanc neutre';
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
    color_temperature: colorTemperature,
    stock_quantity: opts.stock_quantity ?? 3,
    price: opts.price ?? null,
    show_price: Boolean(opts.show_price),
    image_url: opts.image_url || demoImage(category, colorTemperature, 0),
    image_urls: opts.image_urls ? [demoImage(category, colorTemperature, 1)] : [],
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
    color_temperature: 'Blanc chaud',
    featured: true,
    sort_order: 1,
  }),
  p('Platinum', 'Projecteurs', 'Projecteur LED 50W IP65', {
    wattage: '50W',
    description: 'Projecteur etanche pour facade, depot et espaces exterieurs.',
    stock_quantity: 12,
    color_temperature: 'Blanc froid',
    image_urls: true,
  }),
  p('Platinum', 'Projecteurs', 'Projecteur LED 100W', {
    wattage: '100W',
    description: 'Fort flux lumineux pour grands espaces et chantiers.',
    price: 145,
    show_price: true,
    color_temperature: 'Blanc froid',
  }),
  p('Philips', 'Projecteurs', 'Projecteur LED 30W Philips', {
    wattage: '30W',
    color_temperature: 'Blanc chaud',
    stock_quantity: 20,
  }),
  p('LEDVANCE', 'Projecteurs', 'Projecteur LED 50W Floodlight', {
    wattage: '50W',
    is_new: true,
    color_temperature: 'Blanc neutre',
  }),
  p('Somef', 'Projecteurs', 'Projecteur LED 200W', {
    wattage: '200W',
    description: 'Projecteur industriel pour chantiers et parkings.',
    price: 260,
    show_price: true,
    color_temperature: 'Blanc froid',
  }),
  p('Mirsa Eliktrik', 'Projecteurs', 'Projecteur LED eau de pluie 150W', {
    wattage: '150W',
    description: 'Projecteur etanche de marque Mirsa pour exterieur.',
    stock_quantity: 1,
    color_temperature: 'Blanc chaud',
  }),
  p('Afro Light', 'Projecteurs', 'Projecteur LED 10W Afro Light', {
    wattage: '10W',
    description: 'Petit projecteur compact pour accents.',
    is_new: true,
    color_temperature: 'Blanc chaud',
  }),
  p('Hager', 'Projecteurs', 'Projecteur LED 30W Hager', {
    wattage: '30W',
    stock_quantity: 0,
    color_temperature: 'Blanc neutre',
  }),

  // Panneaux LED
  p('Philips', 'Panneaux LED', 'Panneau LED encastrable 18W', {
    wattage: '18W',
    color_temperature: 'Blanc neutre',
    featured: true,
    sort_order: 2,
  }),
  p('Philips', 'Panneaux LED', 'Panneau LED 36W', {
    wattage: '36W',
    description: 'Panneau lumineux pour bureaux, salles de classe et couloirs.',
    price: 49,
    show_price: true,
    color_temperature: 'Blanc froid',
  }),
  p('LEDVANCE', 'Panneaux LED', 'Panneau LED carre 24W', {
    wattage: '24W',
    color_temperature: 'Blanc chaud',
  }),
  p('Sylvania', 'Panneaux LED', 'Panneau LED Sylvania 18W', {
    wattage: '18W',
    color_temperature: 'Blanc neutre',
  }),
  p('Osram', 'Panneaux LED', 'Panneau LED Osram 32W', {
    wattage: '32W',
    is_new: true,
    color_temperature: 'Blanc froid',
  }),
  p('Somef', 'Panneaux LED', 'Panneau LED 12W Somef', {
    wattage: '12W',
    stock_quantity: 8,
    color_temperature: 'Blanc chaud',
  }),
  p('Schneider Electric', 'Panneaux LED', 'Panneau LED 24W', {
    wattage: '24W',
    color_temperature: 'Blanc neutre',
  }),
  p('TTI Elecsa TN', 'Panneaux LED', 'Panneau LED 18W industriel', {
    wattage: '18W',
    description: 'Panneau industriel pour ateliers et entrepots.',
    color_temperature: 'Blanc froid',
  }),
  p('ABB', 'Panneaux LED', 'Panneau LED 36W ABB', {
    wattage: '36W',
    stock_quantity: 0,
    color_temperature: 'Blanc neutre',
  }),

  // Rubans LED
  p('Philips', 'Rubans LED', 'Ruban LED 5m 12V', {
    wattage: '24W',
    color_temperature: 'Blanc chaud',
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
    color_temperature: 'Blanc chaud',
  }),
  p('LEDVANCE', 'Rubans LED', 'Ruban LED 2m doux', {
    wattage: '10W',
    color_temperature: 'Blanc chaud',
  }),
  p('Osram', 'Rubans LED', 'Ruban LED 10m', {
    wattage: '48W',
    is_new: true,
    color_temperature: 'Blanc froid',
  }),
  p('Sylvania', 'Rubans LED', 'Ruban LED etanche 5m', {
    wattage: '24W',
    description: 'Ruban etanche pour cuisines et terrasses.',
    color_temperature: 'Blanc neutre',
  }),
  p('Mirsa Eliktrik', 'Rubans LED', 'Ruban LED Mirsa 5m', {
    wattage: '20W',
    color_temperature: 'Blanc chaud',
  }),
  p('Afro Light', 'Rubans LED', 'Ruban LED Afro Light 1m', {
    wattage: '5W',
    description: 'Segment court pour petits projets.',
    color_temperature: 'Blanc chaud',
  }),
  p('TTI Elecsa TN', 'Rubans LED', 'Ruban LED pro 5m', {
    wattage: '24W',
    is_new: true,
    color_temperature: 'Blanc neutre',
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