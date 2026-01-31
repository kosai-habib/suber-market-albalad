"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
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
        const [prodRes, catRes] = await Promise.all([
          api.get('/products', {
            params: {
              q: query,
              category: catParam,
              min_price: minPriceParam,
              max_price: maxPriceParam
            }
          }),
          api.get('/categories')
        ]);

        // Handle both direct array or { items: [] } pattern
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.items || []));
        setCategories(Array.isArray(catRes.data) ? catRes.data : (catRes.data.items || []));
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
      <section className="bg-primary py-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="container-custom flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-grow flex flex-col gap-6">
            <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} className="text-accent" />
              Trusted Freshness Guaranteed
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-black leading-tight text-white">
              Quality Fresh Food <br />
              <span className="text-accent">Delivered to You</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl font-medium leading-relaxed">
              Order your daily groceries from Albalad Market and experience the ultimate freshness of local and imported products.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <button className="bg-accent hover:bg-accent-hover text-black font-bold py-3 px-10 rounded-md transition-premium shadow-soft">Get Started</button>
              <button className="px-8 py-3 rounded-md border border-white/20 font-bold hover:bg-white/5 transition-premium">Today's Deals</button>
            </div>
          </div>
          <div className="hidden lg:block w-96 h-96 bg-white/5 rounded-xl border border-white/10 p-6 backdrop-blur-3xl shadow-soft">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover"
                alt="Fresh groceries"
              />
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
