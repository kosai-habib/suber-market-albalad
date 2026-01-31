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
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-heading font-black text-text tracking-tight">Shopping Bag</h1>
                    <p className="text-text-muted font-medium mt-1">{cart.length} items to checkout</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                >
                    <Store size={18} />
                    Continue Shopping
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Cart Items */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-card border border-border rounded-[24px] p-5 flex items-center gap-6 group hover:shadow-card hover:border-primary/20 transition-all"
                            >
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-bg flex-shrink-0 border border-border">
                                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                <div className="flex-grow flex flex-col gap-1 min-w-0">
                                    <h3 className="font-heading font-bold text-text text-lg leading-tight truncate">{item.product.name}</h3>
                                    <span className="text-primary font-black text-sm">₪{item.product.price.toFixed(2)} <span className="text-text-muted font-medium ml-1 text-xs uppercase tracking-wider">/ unit</span></span>
                                </div>

                                <div className="flex items-center gap-3 bg-bg rounded-xl p-1.5 border border-border">
                                    <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-card hover:shadow-sm rounded-lg transition-all text-text active:scale-95"
                                    >
                                        <Minus size={14} strokeWidth={2.5} />
                                    </button>
                                    <span className="w-6 text-center font-bold text-text text-sm">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-card hover:shadow-sm rounded-lg transition-all text-text active:scale-95"
                                    >
                                        <Plus size={14} strokeWidth={2.5} />
                                    </button>
                                </div>

                                <div className="text-right flex flex-col items-end gap-2 min-w-[100px]">
                                    <span className="font-heading font-black text-text text-xl tracking-tight">
                                        ₪{(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-text-muted/50 hover:text-danger p-2 rounded-lg hover:bg-danger/10 transition-all"
                                        title="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 lg:sticky lg:top-28">
                    <div className="bg-card border border-border rounded-[32px] p-8 shadow-card flex flex-col gap-8 relative overflow-hidden">

                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ShoppingBag size={120} className="transform translate-x-8 -translate-y-8" />
                        </div>

                        <h2 className="text-2xl font-heading font-black text-text relative z-10">Summary</h2>

                        <div className="flex flex-col gap-4 py-6 border-y border-border relative z-10">
                            <div className="flex justify-between items-center text-text-muted font-medium">
                                <span>Subtotal</span>
                                <span className="text-text font-bold">₪{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-text-muted font-medium">
                                <span>Delivery</span>
                                <span className="bg-success/10 text-success px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">Total to Pay</span>
                                <span className="text-4xl font-heading font-black text-text tracking-tight">₪{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {!isAuthenticated && (
                            <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl flex gap-4 relative z-10">
                                <div className="w-10 h-10 bg-accent text-bg rounded-full flex items-center justify-center shrink-0 shadow-sm font-bold">
                                    <Wallet size={20} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-text text-sm">Earn Points</h4>
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        Log in to earn loyalty points on every purchase.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            disabled={cart.length === 0}
                            onClick={() => router.push(isAuthenticated ? '/checkout' : '/auth/login')}
                            className="btn-primary w-full h-16 text-lg rounded-2xl gap-3 relative z-10"
                        >
                            {isAuthenticated ? 'Secure Checkout' : 'Login to Checkout'}
                            <ArrowRight size={22} />
                        </button>

                        <p className="text-[10px] text-center text-text-muted/60 font-bold uppercase tracking-[0.2em] relative z-10">
                            Encrypted Checkout Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
