"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { requireAuth } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    ShieldCheck,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Banknote,
    FileText,
    AlertCircle
} from 'lucide-react';

type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay' | 'cash_on_delivery';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, total, clearCart } = useCart();
    const { loading: authLoading } = useAuth();

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<any>(null);

    const logisticsFee = 10;
    const finalTotal = total + logisticsFee;

    useEffect(() => {
        if (!authLoading) {
            if (!requireAuth(router.push)) return;
        }
    }, [authLoading, router]);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setError('Your cart is empty. Please add items before checkout.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        console.log('🛒 Starting checkout with:', {
            cartItems: cart.length,
            paymentMethod: selectedMethod,
            total: finalTotal,
            token: localStorage.getItem('access_token') ? 'Present' : 'Missing'
        });

        try {
            const res = await ordersApi.checkout(selectedMethod);
            console.log('✅ Checkout successful:', res.data);

            // Backend success
            setOrderData(res.data);
            setSuccess(true);
            clearCart();

            // Redirect after showing success UI
            setTimeout(() => router.push(`/orders`), 5000);

        } catch (err: any) {
            console.error('❌ Checkout error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                isNetworkError: !err.response
            });

            if (err.message === 'Network Error') {
                setError('Unable to connect to the server. Please check if the backend is running on port 5001.');
            } else if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                setTimeout(() => router.push('/auth/login'), 2000);
            } else {
                setError(err.response?.data?.error || err.response?.data?.message || 'Transaction could not be completed at this time.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
        </div>
    );

    if (success && orderData) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-transparent overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-primary/10 blur-[120px] rounded-full z-0 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-2xl bg-surface/80 glass-card p-10 md:p-14 rounded-[48px] text-center flex flex-col items-center gap-8"
                >
                    <div className="w-24 h-24 bg-success/10 text-success rounded-[32px] flex items-center justify-center border border-success/20">
                        <CheckCircle2 size={56} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl font-heading font-black text-text tracking-tight">Order Placed!</h1>
                        <p className="text-text-muted font-medium">Your order has been successfully confirmed.</p>

                        {/* New Order details display */}
                        <div className="flex flex-col gap-1 mt-2">
                            <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
                                Order ID: <span className="text-text select-all">#{orderData.order_number || orderData.order_id}</span>
                            </span>
                            {orderData.paid_at && (
                                <span className="text-xs font-bold text-text-muted/60 uppercase tracking-widest">
                                    Paid on: {new Date(orderData.paid_at).toLocaleString('en-GB', {
                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full bg-card p-6 rounded-3xl border border-border">
                        <div className="flex flex-col gap-1 text-left">
                            <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Status</span>
                            <span className="text-sm font-bold text-text uppercase">PROCESSING</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Total</span>
                            <span className="text-xl font-black text-primary">₪{orderData.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4 mt-4">
                        <p className="text-xs font-bold text-text-muted/40 uppercase tracking-[0.2em]">Redirecting to your orders...</p>
                        <div className="w-full bg-border/20 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 5 }}
                                className="bg-primary h-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <header className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Checkout</span>
                    <div className="h-px flex-1 bg-border" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-center text-text tracking-tight mb-4 text-balance">
                    Secure <span className="text-primary italic">Checkout</span>
                </h1>
                <p className="text-text-muted text-center font-medium max-w-xl mx-auto">Complete your premium grocery journey with our encrypted payment processing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-10">

                    <section className="flex flex-col gap-10 bg-card border border-border p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-soft">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                <CreditCard size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-black text-text tracking-tight">Payment Method</h2>
                                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-1">Select your preferred way to pay</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'credit_card', icon: CreditCard, label: 'Credit Card', desc: 'Secure Online' },
                                { id: 'apple_pay', icon: CreditCard, label: 'Apple Pay', desc: 'Fast & Secure' },
                                { id: 'google_pay', icon: CreditCard, label: 'Google Pay', desc: 'Instant Checkout' },
                                { id: 'cash_on_delivery', icon: Banknote, label: 'Cash on Delivery', desc: 'Pay at Door' }
                            ].map((method) => {
                                const Icon = method.icon;
                                const isActive = selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                                        className={`
                                            group flex items-center gap-5 p-5 rounded-3xl text-left transition-all duration-300
                                            border cursor-pointer
                                            ${isActive
                                                ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5'
                                                : 'bg-bg border-border hover:border-primary/50 hover:bg-bg/80'}
                                        `}
                                    >
                                        <div className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0
                                            ${isActive ? 'bg-primary text-white shadow-md' : 'bg-surface border border-border text-text-muted group-hover:text-primary'}
                                        `}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-sm font-bold tracking-tight truncate ${isActive ? 'text-primary' : 'text-text'}`}>
                                                {method.label}
                                            </h3>
                                            <p className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest mt-0.5 truncate">
                                                {method.desc}
                                            </p>
                                        </div>
                                        {isActive && (
                                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white dark:border-card shadow-sm shrink-0">
                                                <CheckCircle2 size={12} strokeWidth={4} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-danger/10 border border-danger/20 p-6 rounded-[var(--radius-lg)] flex items-center gap-4 text-danger font-bold">
                                <AlertCircle size={24} />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting || cart.length === 0}
                        className="btn-primary h-20 text-xl font-heading font-black w-full rounded-[24px] md:rounded-[32px] flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span>Confirm & Pay ₪{finalTotal.toFixed(2)}</span>
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                <aside className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-28">
                    <div className="bg-card border border-border p-8 md:p-12 flex flex-col gap-10 rounded-[32px] md:rounded-[48px] shadow-card">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-2xl font-heading font-black text-text tracking-tight">Summary</h2>
                        </div>

                        <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center group">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-sm text-text group-hover:text-primary transition-colors">{item.product.name}</span>
                                        <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest">{item.quantity} × ₪{item.product.price.toFixed(2)}</span>
                                    </div>
                                    <span className="font-black text-text">₪{(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-5 py-8 border-y border-border">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Subtotal</span>
                                <span className="font-bold text-text">₪{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Logistics Fee</span>
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-primary">₪{logisticsFee.toFixed(2)}</span>
                                    <span className="text-[8px] font-black text-text-muted/60 uppercase tracking-widest mt-0.5 italic">Standard Delivery</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] block mb-1">Final Result</span>
                                    <span className="text-4xl md:text-5xl font-heading font-black text-text tracking-tight">₪{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-bg rounded-3xl border border-border">
                                <ShieldCheck size={20} className="text-success" />
                                <p className="text-[10px] text-text-muted font-bold leading-relaxed uppercase tracking-widest">
                                    Protected by <span className="text-text">Albalad Encrypted Tunnel</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
