"use client";
import React from 'react';
import { ShoppingCart, Star, Plus } from 'lucide-react';
// Legacy component - imports removed
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { apiFetch } from '../lib/apiClient';

/**
 * ProductCard Contract:
 * - Image: 1:1 ratio
 * - Title: Poppins, max 2 lines
 * - Price: Poppins, always visible
 * - CTA: Anchored bottom
 */
export const ProductCard = ({ product }) => {
    const { addToCart, categories } = useStore();

    // Get category name from category_id
    const category = categories.find(cat => cat.id === product.category_id);
    const categoryName = category ? category.name : 'Product';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-surface border border-border p-4 flex flex-col gap-4 rounded-2xl hover:shadow-md transition-all duration-300"
        >
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-bg relative">
                <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.is_discounted && (
                    <div className="absolute top-3 right-3 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-soft">
                        SALE
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{categoryName}</span>
                <h4 className="text-body font-heading font-semibold text-text line-clamp-2 min-h-[3rem]">
                    {product.name}
                </h4>
                <p className="text-xs text-text-muted">Price per kg</p>
                <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-accent text-accent" />
                    <span className="text-xs text-text-muted font-medium">4.5 (128 reviews)</span>
                </div>
            </div>

            <div className="mt-auto pt-2 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xl font-heading font-bold text-text">₪{product.price.toFixed(2)}</span>
                    {product.is_discounted && (
                        <span className="text-xs text-text-muted line-through">₪{(product.price * 1.2).toFixed(2)}</span>
                    )}
                </div>
                <button
                    className="bg-primary text-white p-4 rounded-xl hover:bg-primary-hover shadow-soft active:scale-95 transition-all"
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                >
                    <Plus size={20} strokeWidth={3} />
                </button>
            </div>
        </motion.div>
    );
};

export const ProductGrid = ({ products }) => {
    const { setLoading, setProducts, setCategories, loading } = useStore();

    useEffect(() => {
        setLoading(true);
        // Fetch products and categories in parallel
        Promise.all([
            apiFetch("/api/products"),
            apiFetch("/api/categories")
        ]).then(async ([prodRes, catRes]) => {
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            setProducts(prodData.items || prodData);
            setCategories(catData.items || catData);
        }).finally(() => setLoading(false));
    }, [setLoading, setProducts, setCategories]);

    if (loading) {
        return (
            <section className="py-8">
                <div className="system-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square w-full rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-8">
            <p className="text-sm text-text-muted mb-4 font-medium">
                {products.length} products found
            </p>
            <div className="system-grid">
                {products.map((product, idx) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {products.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-6 max-w-sm mx-auto">
                    <div className="w-24 h-24 bg-bg rounded-3xl flex items-center justify-center text-text-muted/40 shadow-inner">
                        <ShoppingCart size={48} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold text-text">No items found</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We couldn't find any products matching your current filters. Try adjusting your selection.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};
