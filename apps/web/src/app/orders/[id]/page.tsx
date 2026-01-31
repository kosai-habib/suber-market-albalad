"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, requireAuth } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    Calendar,
    CreditCard,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    ShieldCheck,
    Receipt
} from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
    product_id: number;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
    line_total: number;
}

interface OrderDetails {
    order_id: number;
    order_number?: string;
    paid_at?: string;
    total_price: number;
    status: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    subtotal: number;
    logistics_fee: number;
    total: number;
    created_at: string;
    items: OrderItem[];
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            try {
                requireAuth(router.push);
            } catch (e) {
                // Handled
            }
        }
    }, [authLoading, router]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!isAuthenticated || !id) return;
            try {
                setLoading(true);
                const res = await apiFetch(`/api/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    setError('Failed to load order details.');
                }
            } catch (err) {
                setError('Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [isAuthenticated, id]);

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'succeeded':
            case 'processing':
                return <CheckCircle2 className="text-success" size={20} />;
            case 'pending':
                return <Clock className="text-accent" size={20} />;
            case 'failed':
            case 'cancelled':
                return <XCircle className="text-danger" size={20} />;
            default:
                return <Package className="text-text-muted" size={20} />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'succeeded':
            case 'processing': return 'bg-success/10 text-success border-success/20';
            case 'pending': return 'bg-accent/10 text-accent border-accent/20';
            case 'failed':
            case 'cancelled': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-surface text-text-muted border-border';
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary w-12 h-12" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container-custom py-24 text-center">
                <h1 className="text-2xl font-black text-text mb-6">{error || 'Order not found'}</h1>
                <Link href="/orders" className="btn-primary">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="container-custom py-16">
            <Link href="/orders" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-all mb-10 font-black text-xs uppercase tracking-[0.2em] group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to History
            </Link>

            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Manifest #{order.order_number || order.order_id}</span>
                    </div>
                    <h1 className="text-5xl font-heading font-black text-text tracking-tight">Order <span className="text-primary italic">Status</span></h1>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                        <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-primary" />
                            {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="w-1.5 h-1.5 bg-border rounded-full" />
                        <span className="flex items-center gap-2">
                            <Clock size={14} className="text-primary" />
                            {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-xl font-black text-xs uppercase tracking-widest ${getStatusStyles(order.order_status || order.status)}`}>
                        {getStatusIcon(order.order_status || order.status)}
                        {order.order_status || order.status}
                    </div>
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-xl font-black text-xs uppercase tracking-widest ${getStatusStyles(order.payment_status)}`}>
                        <CreditCard size={18} />
                        Payment: {order.payment_status}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <section className="bg-card border border-border rounded-[48px] p-10 md:p-14 shadow-card">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                <Package size={24} />
                            </div>
                            <h2 className="text-2xl font-heading font-black text-text tracking-tight">Order Items</h2>
                        </div>

                        <div className="flex flex-col divide-y divide-border">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between group">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-lg text-text group-hover:text-primary transition-colors">{item.product_name}</span>
                                        <div className="flex items-center gap-3 text-xs font-black text-text-muted/60 uppercase tracking-widest">
                                            <span>{item.quantity} Unit(s)</span>
                                            <span className="w-1 h-1 bg-border rounded-full" />
                                            <span>₪{item.price_at_purchase.toFixed(2)} each</span>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-text">₪{item.line_total.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-32">
                    <section className="bg-card border border-border rounded-[48px] p-10 shadow-card flex flex-col gap-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                <Receipt size={20} />
                            </div>
                            <h2 className="text-2xl font-heading font-black text-text tracking-tight">Financials</h2>
                        </div>

                        <div className="flex flex-col gap-5 py-8 border-y border-border">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Subtotal</span>
                                <span className="font-bold text-text">₪{(order.subtotal || order.total_price).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Logistics Fee</span>
                                <span className="font-bold text-primary">₪{(order.logistics_fee || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Payment via</span>
                                <span className="font-bold text-text uppercase">{order.payment_method.replace('_', ' ')}</span>
                            </div>
                            {order.paid_at && (
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Paid on</span>
                                    <span className="font-bold text-text-muted text-[10px]">
                                        {new Date(order.paid_at).toLocaleString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-8">
                            <div>
                                <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.3em] block mb-1">Final Total</span>
                                <span className="text-5xl font-heading font-black text-text tracking-tight">₪{(order.total || order.total_price).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center gap-4 p-5 bg-surface rounded-3xl border border-border">
                                <ShieldCheck size={20} className="text-success" />
                                <p className="text-[10px] text-text-muted font-bold leading-relaxed uppercase tracking-widest">
                                    Verified & <span className="text-text-muted/80">Secured Transaction</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
