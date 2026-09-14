import { useEffect, useState } from 'react';
import { sampleProducts } from '../data/sampleProducts.js';
import { sortProducts } from '../lib/productUtils.js';
import { supabase } from '../lib/supabase.js';

export function useProducts() {
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('name');

      if (!error && data && data.length >= sampleProducts.length) {
        setProducts(sortProducts(data));
      }
    };

    loadProducts();
  }, []);

  return { products, loading };
}