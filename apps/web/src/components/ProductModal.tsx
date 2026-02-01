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

    const displayImage = product.image_url || product.category_image;

    const handleAddToCart = () => {
        addToCart(product, quantity);
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
                        className="relative w-full max-w-4xl bg-card rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] mx-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-[30] p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors text-text"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 bg-bg relative min-h-[240px] h-[35vh] md:h-auto shrink-0 md:shrink">
                            {displayImage ? (
                                <img
                                    src={displayImage}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 text-primary/40 font-black text-2xl uppercase tracking-widest text-center px-4">
                                    {product.name}
                                </div>
                            )}

                            {product.badge && (
                                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-accent text-black text-[10px] md:text-xs font-black px-2 md:px-3 py-1 rounded shadow-sm z-10 uppercase tracking-wider">
                                    {product.badge}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-5 md:p-10 flex flex-col gap-5 md:gap-6 overflow-y-auto bg-surface">
                            <div className="flex flex-col gap-1.5 md:gap-2">
                                <div className="flex items-center gap-2 text-accent">
                                    <div className="flex">
                                        {[1, 2, 3, 4].map(i => < Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />)}
                                        <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-muted" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider mt-0.5">4.0 (128 Reviews)</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-heading font-black text-text leading-tight">{product.name}</h2>
                                <div className="flex flex-col mt-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl md:text-3xl font-black text-primary">₪{(product.price * quantity).toFixed(2)}</span>
                                        {product.is_discounted && (
                                            <span className="text-base md:text-lg text-text-muted line-through font-medium">
                                                ₪{((product.price / (1 - (product.discount_percent || 0) / 100)) * quantity).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {quantity > 1 && (
                                        <span className="text-[10px] md:text-xs font-bold text-text-muted mt-0.5">
                                            ({quantity} × ₪{product.price.toFixed(2)} / {product.unit || 'Item'})
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-text-muted font-medium leading-relaxed">
                                Experience freshness with our premium {product.name}. Carefully selected {product.category_name ? `from our ${product.category_name} collection` : ''} to ensure the highest quality for your home.
                            </p>

                            <div className="h-[1px] bg-border w-full shrink-0" />

                            <div className="flex flex-col gap-3 md:gap-4 shrink-0">
                                <label className="text-[10px] md:text-xs font-black text-text uppercase tracking-widest">Quantity</label>
                                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 md:gap-4">
                                    <div className="flex items-center bg-bg rounded-xl border border-border h-12 self-start xs:self-auto">
                                        <button
                                            onClick={handleDecrement}
                                            className="w-10 md:w-12 h-full flex items-center justify-center text-text-muted hover:text-primary transition-colors disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4 md:w-4.5 md:h-4.5" />
                                        </button>
                                        <span className="w-10 md:w-12 text-center font-bold text-base md:text-lg text-text">{quantity}</span>
                                        <button
                                            onClick={handleIncrement}
                                            className="w-10 md:w-12 h-full flex items-center justify-center text-text-muted hover:text-primary transition-colors"
                                        >
                                            <Plus className="w-4 h-4 md:w-4.5 md:h-4.5" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-sm ${isAdded
                                            ? 'bg-success text-white'
                                            : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20'
                                            }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <CheckCircle className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                                Added to Cart
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-auto pt-4 md:pt-6 shrink-0">
                                <div className="flex flex-col items-center gap-1.5 md:gap-2 text-center flex-1">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <ShieldCheck className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-tight">Premium Quality</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 md:gap-2 text-center flex-1">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Truck className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-tight">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 md:gap-2 text-center flex-1">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted">
                                        <RefreshCw className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-tight">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
