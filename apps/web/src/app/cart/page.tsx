"use client";
export const dynamic = 'force-dynamic';


import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, total, isLoading } = useCart();
    const { isAuthenticated } = useAuth();

    if (cart.length === 0) {
        return (
            <div className="container-custom py-32 flex flex-col items-center gap-8 text-center">
                <div className="w-24 h-24 bg-[var(--bg-main)] rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--text-muted)] opacity-40">
                    <ShoppingBag size={48} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-heading font-black text-[var(--text-main)]">Your cart is empty</h1>
                    <p className="text-[var(--text-muted)] max-w-sm font-medium">
                        Looks like you haven't added anything to your cart yet. Explore our fresh products and start shopping!
                    </p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="btn-primary mt-4"
                >
                    Browse Products
                    <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <h1 className="text-4xl font-heading font-black text-[var(--text-main)] mb-10">Shopping Bag</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cart Items */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[var(--radius-lg)] p-5 flex items-center gap-6 group hover:shadow-soft transition-all"
                            >
                                <div className="w-24 h-24 rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-main)] flex-shrink-0">
                                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow flex flex-col gap-1">
                                    <h3 className="font-heading font-bold text-[var(--text-main)] text-lg leading-tight">{item.product.name}</h3>
                                    <span className="text-[var(--primary)] font-black text-sm">₪{item.product.price.toFixed(2)} / unit</span>
                                </div>

                                <div className="flex items-center gap-3 bg-[var(--bg-main)] rounded-[var(--radius-md)] p-1 border border-[var(--border-soft)]">
                                    <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-[var(--radius-sm)] transition-colors text-[var(--text-main)]"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-[var(--text-main)]">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-[var(--radius-sm)] transition-colors text-[var(--text-main)]"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="text-right flex flex-col items-end gap-3 min-w-[100px]">
                                    <span className="font-heading font-black text-[var(--text-main)] text-lg">
                                        ₪{(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-[var(--text-muted)] hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[var(--radius-xl)] p-8 sticky top-28 shadow-soft flex flex-col gap-8">
                        <h2 className="text-2xl font-heading font-black text-[var(--text-main)]">Summary</h2>

                        <div className="flex flex-col gap-4 py-6 border-y border-[var(--border-soft)]">
                            <div className="flex justify-between text-[var(--text-muted)] font-medium">
                                <span>Subtotal</span>
                                <span className="text-[var(--text-main)] font-bold">₪{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-muted)] font-medium">
                                <span>Delivery</span>
                                <span className="text-green-600 font-black text-xs uppercase tracking-widest">Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-3xl font-heading font-black text-[var(--text-main)]">
                            <span>Total</span>
                            <span className="text-[var(--primary)]">₪{total.toFixed(2)}</span>
                        </div>

                        {!isAuthenticated && (
                            <div className="p-4 bg-[var(--accent-soft)] border border-[var(--accent)]/10 rounded-[var(--radius-md)] flex gap-4">
                                <Wallet className="text-[var(--accent)] flex-shrink-0" size={24} />
                                <p className="text-xs text-[var(--text-main)] font-bold leading-relaxed">
                                    Join us to secure your order and earn loyalty points on every purchase.
                                </p>
                            </div>
                        )}

                        <button
                            disabled={!isAuthenticated || cart.length === 0}
                            onClick={() => router.push('/checkout')}
                            className="btn-primary w-full h-14"
                        >
                            Secure Checkout
                            <ArrowRight size={20} />
                        </button>
                        <p className="text-[10px] text-center text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">
                            Encrypted Checkout Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
