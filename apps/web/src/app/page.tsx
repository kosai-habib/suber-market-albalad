"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiClient';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { motion } from 'framer-motion';
import { SlidersHorizontal, PackageSearch, Sparkles, ChevronDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const catParam = searchParams.get('category');
  const minPriceParam = searchParams.get('min_price');
  const maxPriceParam = searchParams.get('max_price');

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState(minPriceParam || '');
  const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const buildQuery = (params: any) => {
          const s = new URLSearchParams();
          Object.entries(params).forEach(([k, v]) => {
            if (v) s.append(k, v.toString());
          });
          return s.toString() ? `?${s.toString()}` : '';
        };

        const [prodRes, catRes] = await Promise.all([
          apiFetch(`/api/products${buildQuery({
            q: query,
            category: catParam,
            min_price: minPriceParam,
            max_price: maxPriceParam
          })}`),
          apiFetch('/api/categories')
        ]);

        if (!prodRes.ok || !catRes.ok) throw new Error('Failed to fetch data');

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProducts(Array.isArray(prodData) ? prodData : (prodData.items || []));
        setCategories(Array.isArray(catData) ? catData : (catData.items || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, catParam, minPriceParam, maxPriceParam]);

  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('min_price', minPrice); else params.delete('min_price');
    if (maxPrice) params.set('max_price', maxPrice); else params.delete('max_price');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-12 pb-20 bg-bg text-text">
      {/* Hero Banner - Fresh Design */}
      {/* Hero Banner - Mobile First, Clean, Subtle Motion */}
      <section className="bg-[#1B4D3E] dark:bg-[#0c1f1a] pt-12 pb-16 md:py-24 overflow-hidden relative transition-colors duration-500">
        {/* Abstract Background Element (Subtle) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="container-custom flex flex-col md:flex-row items-center gap-10 md:gap-20 relative z-10">
          {/* Text Content */}
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] text-white tracking-tight">
              Quality Fresh Food <br className="hidden md:block" />
              <span className="text-accent">Delivered</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
              Curated local and imported groceries, delivered fresh.
            </p>
          </div>

          {/* Image Content - Subtle Motion */}
          <div className="flex-1 w-full max-w-[500px] md:max-w-none">
            <div className="aspect-[4/3] md:aspect-square lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm relative">
              <motion.img
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover"
                alt="Premium fresh groceries"
              />
              {/* Subtle Overlay for better blend if needed, kept minimal */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom">
        <div className="flex flex-col gap-10">

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-heading font-black text-text">Fresh Arrivals</h2>
              <CategoryFilter
                categories={categories}
                activeCategory={catParam}
                onSelect={(slug) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (slug) params.set('category', slug); else params.delete('category');
                  router.push(`/?${params.toString()}`);
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-md text-sm font-bold text-text-muted">
                <SlidersHorizontal size={16} />
                Price Range
              </div>
              <form onSubmit={handlePriceFilter} className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-24 h-11 text-sm text-center bg-surface border border-border rounded-md focus:ring-2 focus:ring-accent outline-none"
                />
                <span className="text-text-muted">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-24 h-11 text-sm text-center bg-surface border border-border rounded-md focus:ring-2 focus:ring-accent outline-none"
                />
                <button type="submit" className="w-11 h-11 bg-primary text-white flex items-center justify-center rounded-md shadow-soft hover:bg-primary-hover active:scale-95 transition-premium">
                  <ChevronDown size={20} className="-rotate-90" />
                </button>
              </form>
            </div>
          </div>

          {/* Product Grid */}
          <div className="min-h-[400px]">
            {loading ? (
              <GridSkeleton count={8} />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center flex flex-col items-center gap-6 bg-surface border border-dashed border-border rounded-xl shadow-soft">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <PackageSearch size={40} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold font-heading text-text">Nothing Found</h3>
                  <p className="text-text-muted max-w-sm mx-auto font-medium">We couldn't find any products matching your current filters. Try refining your selection.</p>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-md transition-premium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<GridSkeleton count={8} />}>
      <HomeContent />
    </Suspense>
  );
}
