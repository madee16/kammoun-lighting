import { useEffect, useState } from 'react';
import { sampleProducts } from '../data/sampleProducts.js';
import { sortProducts } from '../lib/productUtils.js';
import { hasSupabaseConfig, supabase } from '../lib/supabase.js';

export function useProducts() {
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(hasSupabaseConfig);

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('name');

      if (!error && data && data.length > 0) {
        const dbRefs = new Set(
          data.map((p) => String(p.reference || '').trim().toLowerCase())
        );
        const merged = sortProducts([
          ...data,
          ...sampleProducts.filter(
            (d) => !dbRefs.has(String(d.reference || '').trim().toLowerCase())
          ),
        ]);
        setProducts(merged);
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  return { products, loading };
}