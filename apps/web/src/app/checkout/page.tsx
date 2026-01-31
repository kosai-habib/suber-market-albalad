"use client";
export const dynamic = 'force-dynamic';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    ShieldCheck,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Banknote,
    FileText,
    AlertCircle,
    Truck
} from 'lucide-react';

type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay' | 'cash_on_delivery';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, total, clearCart } = useCart();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<any>(null);

    const logisticsFee = 10;
    const finalTotal = total + logisticsFee;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/'); // Instead of separate login page, we should triggered the modal ideally but for now redirect
        }
    }, [isAuthenticated, authLoading, router]);

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:5001/api/orders/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    payment_method: selectedMethod,
                }),
            });

            if (!res.ok) {
                throw new Error("Checkout failed");
            }

            const data = await res.json();

            if (data.status === 'success') {
                setOrderData(data);
                setSuccess(true);
                clearCart();
                setTimeout(() => router.push('/orders'), 5000);
            } else {
                throw new Error('Checkout failed');
            }
        } catch (err: any) {
            setError(err.message || 'Transaction could not be completed at this time.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--primary)] w-12 h-12" />
        </div>
    );

    if (success && orderData) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-transparent overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-primary/10 blur-[120px] rounded-full z-0 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-2xl bg-white/[0.06] backdrop-blur-[40px] p-10 md:p-14 rounded-[48px] border border-white/[0.12] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] text-center flex flex-col items-center gap-8"
                >
                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-[32px] flex items-center justify-center border border-green-500/30">
                        <CheckCircle2 size={56} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl font-heading font-black text-white tracking-tight">Order Placed!</h1>
                        <p className="text-white/40 font-medium">Your order <span className="text-white font-bold">#{orderData.order_id}</span> is confirmed.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full bg-white/[0.03] p-6 rounded-3xl border border-white/[0.08]">
                        <div className="flex flex-col gap-1 text-left">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</span>
                            <span className="text-sm font-bold text-white uppercase">PROCESSING</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Total</span>
                            <span className="text-xl font-black text-primary">₪{orderData.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4 mt-4">
                        <p className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">Redirecting to your orders...</p>
                        <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden border border-white/[0.08]">
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
                    <div className="h-px flex-1 bg-white/[0.08]" />
                    <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Checkout</span>
                    <div className="h-px flex-1 bg-white/[0.08]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-heading font-black text-center text-white tracking-tight mb-4">
                    Secure <span className="text-primary italic">Checkout</span>
                </h1>
                <p className="text-white/30 text-center font-medium max-w-xl mx-auto">Complete your premium grocery journey with our encrypted payment processing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-10">

                    <section className="flex flex-col gap-10 bg-white/[0.03] border border-white/[0.08] p-10 md:p-14 rounded-[48px] backdrop-blur-3xl shadow-2xl">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                                <CreditCard size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-heading font-black text-white tracking-tight">Payment Method</h2>
                                <p className="text-sm font-bold text-white/30 uppercase tracking-widest mt-1">Select your preferred way to pay</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'credit_card', icon: CreditCard, label: 'Credit Card', desc: 'Secure Online' },
                                { id: 'apple_pay', icon: CreditCard, label: 'Apple Pay', desc: 'Fast \u0026 Secure' },
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
                                            group flex items-center gap-6 p-6 rounded-3xl text-left transition-all duration-500
                                            border ${isActive
                                                ? 'bg-primary/10 border-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]'
                                                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04]'}
                                        `}
                                    >
                                        <div className={`
                                            w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                            ${isActive ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-white/20 group-hover:text-white/40'}
                                        `}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-base font-black tracking-tight ${isActive ? 'text-white' : 'text-white/60'}`}>
                                                {method.label}
                                            </h3>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                                                {method.desc}
                                            </p>
                                        </div>
                                        {isActive && (
                                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white/10">
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
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 p-6 rounded-[var(--radius-lg)] flex items-center gap-4 text-red-600 font-bold">
                                <AlertCircle size={24} />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting || cart.length === 0}
                        className="btn-glass-primary h-20 text-2xl group w-full rounded-[32px] flex items-center justify-center gap-4"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span>Confirm & Pay ₪{finalTotal.toFixed(2)}</span>
                                <ArrowRight size={28} className="group-hover:translate-x-1.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                <aside className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-28">
                    <div className="bg-white/[0.03] border border-white/[0.08] p-10 md:p-14 flex flex-col gap-10 rounded-[48px] backdrop-blur-3xl shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-2xl font-heading font-black text-white tracking-tight">Summary</h2>
                        </div>

                        <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center group">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-sm text-white/80 group-hover:text-primary transition-colors">{item.product.name}</span>
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.quantity} × ₪{item.product.price.toFixed(2)}</span>
                                    </div>
                                    <span className="font-black text-white">₪{(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-5 py-8 border-y border-white/[0.08]">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Subtotal</span>
                                <span className="font-bold text-white">₪{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Logistics Fee</span>
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-primary">₪{logisticsFee.toFixed(2)}</span>
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5 italic">Standard Delivery</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] block mb-1">Final Result</span>
                                    <span className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">₪{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-3xl border border-white/[0.05]">
                                <ShieldCheck size={20} className="text-green-500" />
                                <p className="text-[10px] text-white/20 font-bold leading-relaxed uppercase tracking-widest">
                                    Protected by <span className="text-white/40">Albalad Encrypted Tunnel</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
