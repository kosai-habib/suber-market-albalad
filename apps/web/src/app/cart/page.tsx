"use client";
export const dynamic = 'force-dynamic';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Wallet, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, total, isLoading } = useCart();
    const { isAuthenticated } = useAuth();

    if (cart.length === 0) {
        return (
            <div className="container-custom py-32 flex flex-col items-center gap-8 text-center min-h-[60vh] justify-center">
                <div className="w-24 h-24 bg-card border border-border rounded-[32px] flex items-center justify-center text-text-muted opacity-50 shadow-soft">
                    <ShoppingBag size={48} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-heading font-black text-text">Your cart is empty</h1>
                    <p className="text-text-muted max-w-sm font-medium mx-auto">
                        Looks like you haven't added anything to your cart yet. Explore our fresh products and start shopping!
                    </p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="btn-primary mt-4 h-12 px-8 rounded-xl gap-2"
                >
                    Browse Products
                    <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-text tracking-tight">Shopping Bag</h1>
                    <p className="text-sm md:text-base text-text-muted font-medium mt-1">{cart.length} items to checkout</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors self-start sm:self-auto"
                >
                    <Store size={18} />
                    Continue Shopping
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                {/* Cart Items */}
                <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-card border border-border rounded-[20px] md:rounded-[24px] p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 group hover:shadow-card hover:border-primary/20 transition-all relative"
                            >
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden bg-bg flex-shrink-0 border border-border">
                                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                <div className="flex-grow flex flex-col gap-1 min-w-0 pr-10 sm:pr-0">
                                    <h3 className="font-heading font-bold text-text text-base md:text-lg leading-tight truncate">{item.product.name}</h3>
                                    <span className="text-primary font-black text-xs md:text-sm">₪{item.product.price.toFixed(2)} <span className="text-text-muted font-medium ml-1 text-[10px] md:text-xs uppercase tracking-wider">/ unit</span></span>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
                                    <div className="flex items-center gap-2 md:gap-3 bg-bg rounded-xl p-1 border border-border">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-card hover:shadow-sm rounded-lg transition-all text-text active:scale-95"
                                        >
                                            <Minus className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />
                                        </button>
                                        <span className="w-5 md:w-6 text-center font-bold text-text text-xs md:text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-card hover:shadow-sm rounded-lg transition-all text-text active:scale-95"
                                        >
                                            <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className="font-heading font-black text-text text-lg md:text-xl tracking-tight">
                                            ₪{(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-text-muted/50 hover:text-danger p-2 rounded-lg hover:bg-danger/10 transition-all"
                                    title="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 w-full mt-4 lg:mt-0">
                    <div className="bg-card border border-border rounded-[28px] md:rounded-[32px] p-6 md:p-8 shadow-card flex flex-col gap-6 md:gap-8 relative overflow-hidden">

                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ShoppingBag size={120} className="transform translate-x-8 -translate-y-8" />
                        </div>

                        <h2 className="text-xl md:text-2xl font-heading font-black text-text relative z-10">Summary</h2>

                        <div className="flex flex-col gap-4 py-6 border-y border-border relative z-10">
                            <div className="flex justify-between items-center text-text-muted font-medium text-sm md:text-base">
                                <span>Subtotal</span>
                                <span className="text-text font-bold">₪{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-text-muted font-medium text-sm md:text-base">
                                <span>Delivery</span>
                                <span className="bg-success/10 text-success px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <span className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">Total to Pay</span>
                                <span className="text-3xl md:text-4xl font-heading font-black text-text tracking-tight">₪{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {!isAuthenticated && (
                            <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl flex gap-4 relative z-10">
                                <div className="w-9 h-9 md:w-10 md:h-10 bg-accent text-bg rounded-full flex items-center justify-center shrink-0 shadow-sm font-bold">
                                    <Wallet className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="font-bold text-text text-sm">Earn Points</h4>
                                    <p className="text-[11px] md:text-xs text-text-muted leading-relaxed">
                                        Log in to earn loyalty points on every purchase.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            disabled={cart.length === 0}
                            onClick={() => router.push(isAuthenticated ? '/checkout' : '/auth/login')}
                            className="btn-primary w-full h-14 md:h-16 text-base md:text-lg rounded-xl md:rounded-2xl gap-3 relative z-10"
                        >
                            {isAuthenticated ? 'Secure Checkout' : 'Login to Checkout'}
                            <ArrowRight className="w-5 h-5 md:w-5.5 md:h-5.5" />
                        </button>

                        <p className="text-[9px] md:text-[10px] text-center text-text-muted/60 font-bold uppercase tracking-[0.2em] relative z-10 mb-[-10px] md:mb-0">
                            Encrypted Checkout Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
