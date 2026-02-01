"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, CheckCircle, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
    id: number;
    name: string;
    price: number;
    image_url: string;
    category_name?: string;
    category_image?: string;
    is_discounted?: boolean;
    discount_percent?: number;
    unit?: string;
    badge?: string;
}

export const ProductCard = ({ product, onQuickView }: { product: Product, onQuickView?: (product: Product) => void }) => {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const originalPrice = product.is_discounted
        ? product.price / (1 - (product.discount_percent || 0) / 100)
        : product.price;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        if (onQuickView) {
            e.preventDefault();
            onQuickView(product);
        }
    };

    const displayImage = product.image_url || product.category_image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-surface border border-border/50 rounded-[28px] p-4 flex flex-col gap-5 relative transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-primary/20 bg-gradient-to-b from-surface to-bg/30"
        >
            {/* Image Container - Enhanced with better radius and hover */}
            <Link
                href={`/products/${product.id}`}
                onClick={handleQuickView}
                className="relative aspect-[1/1] rounded-[22px] overflow-hidden bg-bg block border border-border/40 cursor-pointer shadow-inner group-hover:shadow-md transition-all duration-300"
            >
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 via-primary/10 to-transparent flex items-center justify-center p-6 text-center">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary opacity-30">{product.name}</span>
                    </div>
                )}

                {/* Floating Elements */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    {product.badge && (
                        <div className="bg-accent text-text text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-widest backdrop-blur-md border border-white/20">
                            {product.badge}
                        </div>
                    )}
                </div>

                {product.is_discounted && (
                    <div className="absolute top-3 left-3 bg-danger text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 tracking-wider">
                        SAVE {product.discount_percent}%
                    </div>
                )}

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md text-primary p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Search size={22} strokeWidth={2.5} />
                    </div>
                </div>
            </Link>

            {/* Content Section */}
            <div className="flex flex-col gap-3 px-1 flex-grow">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-accent">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} className={s <= 4 ? "fill-current" : "text-text-muted/30"} />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest">Premium</span>
                </div>

                <Link href={`/products/${product.id}`} onClick={handleQuickView} className="group/title">
                    <h4 className="text-base font-heading font-black text-text line-clamp-2 min-h-[44px] leading-tight group-hover/title:text-primary transition-colors">
                        {product.name}
                    </h4>
                </Link>

                {/* Price & Unit Section */}
                <div className="flex items-end justify-between mt-auto pt-2 border-t border-border/30">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-text tracking-tighter">₪{product.price.toFixed(2)}</span>
                            {product.is_discounted && (
                                <span className="text-xs text-text-muted/60 line-through font-bold">₪{originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                        {product.unit && (
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mt-0.5">
                                per {product.unit}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Dynamic Add Button */}
            <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className={`relative w-full h-[52px] rounded-2xl overflow-hidden font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-sm ${isAdded
                    ? 'bg-success text-white shadow-success/20'
                    : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20 hover:shadow-xl'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {isAdded ? (
                        <motion.div
                            key="added"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <CheckCircle size={18} strokeWidth={3} />
                            <span>In Cart</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="add"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <ShoppingCart size={18} strokeWidth={2.5} />
                            <span>Add to Bag</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.div>
    );
};
