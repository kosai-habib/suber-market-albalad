"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import { requireAuth } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    ArrowLeft,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    Truck
} from 'lucide-react';
import Link from 'next/link';

interface Order {
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
}

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!requireAuth(router.push)) return;
        }
    }, [authLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return;
            try {
                setLoading(true);
                const res = await ordersApi.list();
                setOrders(res.data.items || []);
            } catch (err) {
                console.error('Order fetch error:', err);
                setError('Order retrieval failed.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [isAuthenticated]);

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

    return (
        <div className="container-custom py-12 text-text">
            <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-all mb-10 font-black text-xs uppercase tracking-widest group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
            </Link>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-heading font-black text-text tracking-tight">Order History</h1>
                    <p className="text-text-muted font-medium">Tracking and managing your fresh selections @ Albalad Market.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Case-insensitive search..."
                            className="pl-12 pr-6 py-3 bg-card border border-border rounded-xl text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary transition-all w-64 shadow-sm outline-none"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl text-sm font-bold text-text hover:bg-surface transition-all shadow-sm active:scale-95">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </header>

            {error ? (
                <div className="py-20 text-center flex flex-col items-center gap-6 bg-card border border-dashed border-danger/30 rounded-[32px]">
                    <AlertCircle className="text-danger" size={56} />
                    <h2 className="text-2xl font-bold text-text">{error}</h2>
                    <button onClick={() => window.location.reload()} className="btn-primary px-8 h-12 rounded-xl">Try Again</button>
                </div>
            ) : orders.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center gap-8 bg-card border border-dashed border-border rounded-[32px] shadow-soft">
                    <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-text-muted opacity-30">
                        <Package size={48} strokeWidth={1} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-heading font-black text-text">No orders yet</h2>
                        <p className="text-text-muted max-w-sm mx-auto font-medium">Your basket history is clear. Start exploring our fresh products!</p>
                    </div>
                    <Link href="/" className="btn-primary h-12 px-8 rounded-xl flex items-center gap-2">Started Shopping <ArrowLeft size={18} className="rotate-180" /></Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.order_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-card border border-border rounded-[24px] p-6 md:p-8 hover:shadow-card hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden shadow-soft"
                            >
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-text-muted group-hover:text-primary transition-all duration-300 border border-border">
                                        <Package size={28} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xl font-heading font-black text-text">
                                            {order.order_number || `Order #${order.order_id}`}
                                        </h3>
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold uppercase tracking-widest text-text-muted">
                                            <span className="flex items-center gap-2" title="Created Date">
                                                <Calendar size={14} />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                            {order.paid_at ? (
                                                <>
                                                    <span className="hidden md:inline w-1.5 h-1.5 bg-border rounded-full" />
                                                    <span className="flex items-center gap-2 text-success/80" title="Payment Time">
                                                        <Clock size={14} />
                                                        {new Date(order.paid_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="hidden md:inline w-1.5 h-1.5 bg-border rounded-full" />
                                                    <span>Verified Transaction</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8 md:gap-12 relative z-10">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest">Total Value</span>
                                        <span className="text-2xl font-heading font-black text-text tracking-tight">₪{order.total?.toFixed(2) || order.total_price.toFixed(2)}</span>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest">Process State</span>
                                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${getStatusStyles(order.order_status || order.status)}`}>
                                            {order.order_status || order.status}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest">Payment</span>
                                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${getStatusStyles(order.payment_status)}`}>
                                            {order.payment_status || 'Unknown'}
                                        </div>
                                    </div>

                                    <Link
                                        href={`/orders/${order.order_id}`}
                                        className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                                    >
                                        <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
