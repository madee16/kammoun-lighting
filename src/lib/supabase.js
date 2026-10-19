import { createClient } from '@supabase/supabase-js';
import { STORE_INFO } from '../data/siteContent.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const rawWhatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
const fallbackWhatsappNumber = STORE_INFO.telHref.replace(/^tel:/, '').replace(/\D/g, '');

export const hasWhatsappConfig = Boolean(rawWhatsappNumber);
export const whatsappNumber = rawWhatsappNumber || fallbackWhatsappNumber;

if (!hasWhatsappConfig && import.meta.env.DEV) {
  console.warn(
    '[Kammoun Lighting] VITE_WHATSAPP_NUMBER non défini dans l\'environnement. Numéro par défaut utilisé pour le développement.',
  );
}

export const getWhatsappUrl = (text = '') => {
  if (!whatsappNumber) return '#';
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${whatsappNumber}${query}`;
};
