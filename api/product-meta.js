const BOT_USER_AGENT =
  /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest/i;

export const config = {
  runtime: 'edge',
};

const DEFAULT_DESCRIPTION =
  "Catalogue de produits d'eclairage Kammoun Lighting, Societe MEM d'Electricite.";
const SITE_NAME = 'Kammoun Lighting';
const LEGAL_NAME = "Societe MEM d'Electricite";
const DEFAULT_IMAGE_PATH = '/assets/kammoun-logo.png';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getSiteOrigin(request) {
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  return host ? `${protocol}://${host}` : '';
}

function absoluteUrl(origin, path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return origin ? `${origin}${normalizedPath}` : normalizedPath;
}

function absoluteImageUrl(origin, image) {
  if (!image) return absoluteUrl(origin, DEFAULT_IMAGE_PATH);
  if (/^https?:\/\//i.test(image)) return image;
  return absoluteUrl(origin, image.startsWith('/') ? image : `/${image}`);
}

function productImages(product) {
  const gallery = Array.isArray(product.image_urls)
    ? product.image_urls
    : String(product.image_urls || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

  return [product.image_url, ...gallery].filter(Boolean);
}

function productMatchesPath(product, value) {
  const decoded = decodeURIComponent(value || '').toLowerCase();
  return [product.slug, product.reference, product.id, product.name]
    .filter(Boolean)
    .some((candidate) => String(candidate).toLowerCase() === decoded);
}

async function fetchActiveProducts() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/products?active=eq.true&select=*`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

function buildPreviewHtml({ origin, path, title, description, image, type = 'website' }) {
  const pageUrl = absoluteUrl(origin, path);
  const pageImage = absoluteImageUrl(origin, image);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${escapeHtml(pageImage)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${escapeHtml(pageImage)}" />
    <link rel="canonical" href="${escapeHtml(pageUrl)}" />
    <meta http-equiv="refresh" content="0;url=${escapeHtml(pageUrl)}" />
  </head>
  <body>
    <p><a href="${escapeHtml(pageUrl)}">${safeTitle}</a></p>
  </body>
</html>`;
}

export default async function handler(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const rawPath = url.searchParams.get('path') || '';
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const origin = getSiteOrigin(request);

  if (!path.startsWith('/produit/')) {
    return new Response('Not found', { status: 404 });
  }

  if (!BOT_USER_AGENT.test(userAgent)) {
    const redirectTarget = absoluteUrl(origin, path);
    return Response.redirect(redirectTarget, 307);
  }

  const productKey = path.replace('/produit/', '');
  const products = await fetchActiveProducts();
  const product = products.find((item) => productMatchesPath(item, productKey));

  if (!product) {
    const html = buildPreviewHtml({
      origin,
      path,
      title: `Produit introuvable | ${SITE_NAME}`,
      description: "Ce produit n'est plus disponible dans le catalogue public.",
      type: 'website',
    });

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const description =
    product.description ||
    [product.brand, product.category, product.wattage].filter(Boolean).join(' | ') ||
    DEFAULT_DESCRIPTION;

  const html = buildPreviewHtml({
    origin,
    path,
    title: `${product.name} | ${SITE_NAME}`,
    description,
    image: productImages(product)[0],
    type: 'product',
  });

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
