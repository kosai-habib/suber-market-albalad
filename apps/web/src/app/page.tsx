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
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-slate-950">
        {/* Dynamic Background Elements */}
        {/* ... (Existing background motion div contents) ... */}

        <div className="container-custom relative z-10 w-full pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16 lg:gap-24">
            {/* Left Column: Text Content */}
            <div className="flex-1 flex flex-col gap-6 md:gap-8 text-center lg:text-left items-center lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary-soft text-center">Premium Freshness Delivered</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-black leading-[1] md:leading-[0.95] text-white tracking-tighter"
              >
                Fresh Food <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Redefined.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-xl text-slate-400 max-w-xl font-medium leading-relaxed text-balance"
              >
                Experience the finest local produce and global delicacies,
                hand-picked and delivered to your doorstep.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6"
              >
                <button
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  className="px-8 py-4 md:px-10 md:py-5 bg-primary text-white font-black rounded-xl md:rounded-2xl shadow-soft transition-all duration-300 uppercase tracking-widest text-[10px] md:text-xs min-h-[44px]"
                >
                  Shop Now
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 md:-space-x-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-slate-900 bg-primary flex items-center justify-center text-[8px] md:text-[10px] font-black text-white">
                      +2k
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-black text-white">Trusted by 2,000+</span>
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Healthy Customers</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Image - Responsive Aspect Ratio */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex-1 w-full max-w-[500px] lg:max-w-[600px] relative mt-8 lg:mt-0"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[80px] md:blur-[100px] rounded-full scale-75" />
              <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-glass border border-white/10">
                <motion.img
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
                  className="w-full h-full object-cover"
                  alt="Premium fresh groceries"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating Card - Mobile Friendly */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl md:rounded-2xl flex items-center justify-center text-slate-900 shadow-lg flex-shrink-0">
                      <PackageSearch className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] font-black text-accent uppercase tracking-widest">Flash Deal</span>
                      <span className="text-base md:text-lg font-black text-white">Fresh Organic Basket</span>
                      <span className="text-[10px] md:text-xs font-bold text-white/60 mt-0.5">Starting from ₪49.99</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-col gap-8 md:gap-10">

          {/* Controls Bar - Responsive Alignment */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 pb-6 md:pb-8 border-b border-border">
            <div className="flex flex-col gap-3 md:gap-4">
              <h2 className="text-2xl md:text-3xl font-heading font-black text-text">Fresh Arrivals</h2>
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

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-xl text-xs md:text-sm font-bold text-text-muted">
                <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Price Range
              </div>
              <form onSubmit={handlePriceFilter} className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 md:w-24 h-10 md:h-11 text-xs md:text-sm text-center bg-surface border border-border rounded-xl outline-none min-h-[44px]"
                />
                <span className="text-text-muted">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 md:w-24 h-10 md:h-11 text-xs md:text-sm text-center bg-surface border border-border rounded-xl outline-none min-h-[44px]"
                />
                <button type="submit" className="min-w-[44px] min-h-[44px] bg-primary text-white flex items-center justify-center rounded-xl shadow-soft hover:bg-primary-hover active:scale-95 transition-premium">
                  <ChevronDown size={20} className="-rotate-90" />
                </button>
              </form>
            </div>
          </div>

          {/* Product Grid - Verified Grid Values */}
          <div className="min-h-[400px]">
            {loading ? (
              <GridSkeleton count={8} />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
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
