"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, CheckCircle } from 'lucide-react';
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
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-card border border-border shadow-soft rounded-lg p-4 flex flex-col gap-4 relative transition-premium hover:shadow-card hover:-translate-y-1"
        >
            {/* 1:1 Image Container */}
            <Link
                href={`/products/${product.id}`}
                onClick={handleQuickView}
                className="relative aspect-square rounded-md overflow-hidden bg-bg block border border-border cursor-pointer"
            >
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-bg flex items-center justify-center p-6 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-40">{product.name}</span>
                    </div>
                )}

                {/* Secondary Informational Badge (e.g. 12 pcs) */}
                {product.badge && (
                    <div className="absolute top-2 right-2 bg-accent text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10 uppercase tracking-tighter">
                        {product.badge}
                    </div>
                )}

                {product.is_discounted && (
                    <div className="absolute top-2 left-2 bg-danger text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg z-10">
                        -{product.discount_percent}%
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex flex-col gap-2 flex-grow">
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-accent">
                        <Star key="s1" size={12} className="fill-current" />
                        <Star key="s2" size={12} className="fill-current" />
                        <Star key="s3" size={12} className="fill-current" />
                        <Star key="s4" size={12} className="fill-current" />
                        <Star key="s5" size={12} className="text-text-muted" />
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">4.0 / 5</span>
                </div>

                <Link href={`/products/${product.id}`} onClick={handleQuickView}>
                    <h4 className="text-sm font-heading font-bold text-text line-clamp-2 min-h-[40px] leading-snug hover:text-primary transition-colors">
                        {product.name}
                    </h4>
                </Link>

                {/* Price Section */}
                <div className="flex flex-col gap-0.5 mt-1">
                    <div className="flex items-end gap-3">
                        <span className="text-[20px] font-black text-text leading-none">₪{product.price.toFixed(2)}</span>
                        {product.is_discounted && (
                            <span className="text-xs text-text-muted line-through font-medium mb-0.5">₪{originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    {product.unit && (
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
                            / {product.unit}
                        </span>
                    )}
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                className={`w-full h-11 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-premium ${isAdded
                    ? 'bg-success text-white'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
            >
                {isAdded ? (
                    <>
                        <CheckCircle size={18} />
                        Added ✔
                    </>
                ) : (
                    <>
                        <ShoppingCart size={18} />
                        Add to Cart
                    </>
                )}
            </button>
        </motion.div>
    );
};
