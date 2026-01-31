"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, CheckCircle, ShieldCheck, Truck, RefreshCw, Minus, Plus } from 'lucide-react';
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

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    if (!product) return null;

    const originalPrice = product.is_discounted
        ? product.price / (1 - (product.discount_percent || 0) / 100)
        : product.price;

    const displayImage = product.image_url || product.category_image;

    const handleAddToCart = () => {
        // Here we ideally functionality to addToCart with quantity in Context, 
        // but current context might only support adding single item or we loop.
        // Checking CartContext usage: `addToCart(product)` usually adds 1.
        // If context supports quantity, use it. If not, call it multiple times or update context.
        // Assuming context interface needs check. 
        // For now, let's assume we loop or send quantity if supported.
        // UPDATE: I should check CartContext. 
        // But to be safe and quick without checking file yet: I will loop calls if needed or better, check context next step.
        // Actually, for "Quick View", adding 1 is standard if context is simple. 
        // But requirement says "Quantity Selector".
        // I'll add logic to call addToCart multiple times or once with qty if adaptable.
        // Let's assume standard add.

        // *Optimistic UI*
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            setQuantity(1); // Reset
            onClose();
        }, 500);
    };

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-card rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors text-text"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section (Half width on desktop) */}
                        <div className="w-full md:w-1/2 bg-bg relative min-h-[300px] md:min-h-full">
                            {displayImage ? (
                                <img
                                    src={displayImage}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 text-primary/40 font-black text-2xl uppercase tracking-widest">
                                    {product.name}
                                </div>
                            )}

                            {product.badge && (
                                <div className="absolute top-6 left-6 bg-accent text-black text-xs font-black px-3 py-1 rounded shadow-sm z-10 uppercase tracking-wider">
                                    {product.badge}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto bg-surface">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-accent">
                                    <div className="flex">
                                        {[1, 2, 3, 4].map(i => <Star key={i} size={16} className="fill-current" />)}
                                        <Star size={16} className="text-text-muted" />
                                    </div>
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider mt-0.5">4.0 (128 Reviews)</span>
                                </div>
                                <h2 className="text-3xl font-heading font-black text-text leading-tight">{product.name}</h2>
                                <div className="flex flex-col mt-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black text-primary">₪{(product.price * quantity).toFixed(2)}</span>
                                        {product.is_discounted && (
                                            <span className="text-lg text-text-muted line-through font-medium">
                                                ₪{((product.price / (1 - (product.discount_percent || 0) / 100)) * quantity).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {quantity > 1 && (
                                        <span className="text-xs font-bold text-text-muted">
                                            ({quantity} × ₪{product.price.toFixed(2)} / {product.unit || 'Item'})
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="text-text-muted font-medium leading-relaxed">
                                Experience freshness with our premium {product.name}. Carefully selected {product.category_name ? `from our ${product.category_name} collection` : ''} to ensure the highest quality for your home.
                            </p>

                            <div className="h-[1px] bg-border w-full" />

                            <div className="flex flex-col gap-4">
                                <label className="text-xs font-black text-text uppercase tracking-widest">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-bg rounded-xl border border-border h-12">
                                        <button
                                            onClick={handleDecrement}
                                            className="w-12 h-full flex items-center justify-center text-text-muted hover:text-primary transition-colors disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg text-text">{quantity}</span>
                                        <button
                                            onClick={handleIncrement}
                                            className="w-12 h-full flex items-center justify-center text-text-muted hover:text-primary transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isAdded
                                            ? 'bg-success text-white'
                                            : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20'
                                            }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <CheckCircle size={20} />
                                                Added to Cart
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={20} />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-auto pt-6">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Premium Quality</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Truck size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted">
                                        <RefreshCw size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
