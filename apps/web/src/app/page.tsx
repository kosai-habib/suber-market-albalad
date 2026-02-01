"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api';
import { buildQueryString } from '@/lib/utils/query';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { motion } from 'framer-motion';
import { SlidersHorizontal, PackageSearch, Sparkles, ChevronDown } from 'lucide-react';
import { ProductModal } from '@/components/ProductModal';

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

  // Quick View State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const qs = buildQueryString({
          q: query,
          category: catParam,
          min_price: minPriceParam,
          max_price: maxPriceParam
        });

        const [prodRes, catRes] = await Promise.all([
          productsApi.getAll(qs),
          productsApi.getCategories()
        ]);

        setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.items || []));
        setCategories(Array.isArray(catRes.data) ? catRes.data : (catRes.data.items || []));
      } catch (err) {
        console.error('Home fetchData error:', err);
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

      {/* ... Hero Banner ... */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-slate-950">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/10 blur-[100px] rounded-full"
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="container-custom relative z-10 w-full pt-20 pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left Column: Text Content */}
            <div className="flex-1 flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
              >
                <Sparkles size={16} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-soft">Premium Freshness Delivered</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-heading font-black leading-[0.95] text-white tracking-tighter"
              >
                Fresh Food <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Redefined.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 max-w-xl font-medium leading-relaxed text-balance"
              >
                Experience the finest local produce and global delicacies,
                hand-picked and delivered to your doorstep with uncompromising quality.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-6"
              >
                <button
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(27,77,62,0.3)] hover:shadow-[0_25px_50px_rgba(27,77,62,0.4)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-xs"
                >
                  Shop Now
                </button>
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-primary flex items-center justify-center text-[10px] font-black text-white">
                    +2k
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white">Trusted by 2,000+</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Happy Customers</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex-1 w-full max-w-[600px] relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75" />
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10">
                <motion.img
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
                  className="w-full h-full object-cover"
                  alt="Premium fresh groceries"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-slate-900 shadow-lg">
                      <PackageSearch size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-accent uppercase tracking-widest">Flash Deal</span>
                      <span className="text-lg font-black text-white">Fresh Organic Basket</span>
                      <span className="text-xs font-bold text-white/60 mt-1">Starting from ₪49.99</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom">
        <div className="flex flex-col gap-10">

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
            {/* ... same controls ... */}
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
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={(prod) => setSelectedProduct(prod)}
                  />
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

      {/* Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
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
