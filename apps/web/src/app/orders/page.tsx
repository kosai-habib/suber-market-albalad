"use client";
export const dynamic = 'force-dynamic';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
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
        if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return;
            try {
                setLoading(true);
                const res = await api.get('/orders');
                setOrders(res.data.items || []);
            } catch (err) {
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
            case 'processing': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'failed':
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--primary)] w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all mb-10 font-black text-xs uppercase tracking-widest group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
            </Link>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-heading font-black text-[var(--text-main)] tracking-tight">Order History</h1>
                    <p className="text-[var(--text-muted)] font-medium">Tracking and managing your fresh selections @ Albalad Market.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Case-insensitive search..."
                            className="pl-12 pr-6 py-3 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[var(--radius-md)] text-sm text-[var(--text-main)] focus:border-[var(--primary)] transition-all w-64 shadow-soft"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-all shadow-soft">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </header>

            {error ? (
                <div className="py-20 text-center flex flex-col items-center gap-6 bg-[var(--bg-surface)] border border-dashed border-red-200 rounded-[var(--radius-xl)]">
                    <AlertCircle className="text-red-500" size={56} />
                    <h2 className="text-2xl font-bold text-[var(--text-main)]">{error}</h2>
                    <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
                </div>
            ) : orders.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center gap-8 bg-[var(--bg-surface)] border border-dashed border-[var(--border-soft)] rounded-[var(--radius-xl)] shadow-soft">
                    <div className="w-24 h-24 bg-[var(--bg-main)] rounded-full flex items-center justify-center text-[var(--text-muted)] opacity-30">
                        <Package size={48} strokeWidth={1} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-heading font-black text-[var(--text-main)]">No orders yet</h2>
                        <p className="text-[var(--text-muted)] max-w-sm mx-auto font-medium">Your basket history is clear. Start exploring our fresh products!</p>
                    </div>
                    <Link href="/" className="btn-primary">Start Shopping</Link>
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
                                className="group bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[var(--radius-lg)] p-6 md:p-8 hover:shadow-card hover:border-[var(--primary)]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden shadow-soft"
                            >
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-[var(--bg-main)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-all duration-300 border border-[var(--border-soft)]">
                                        <Package size={28} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xl font-heading font-black text-[var(--text-main)]">Order #{order.order_id}</h3>
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                            <span className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="w-1.5 h-1.5 bg-[var(--border-soft)] rounded-full" />
                                            <span>Verified Transaction</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8 md:gap-12 relative z-10">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Value</span>
                                        <span className="text-2xl font-heading font-black text-white tracking-tight">₪{order.total?.toFixed(2) || order.total_price.toFixed(2)}</span>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Process State</span>
                                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${getStatusStyles(order.order_status || order.status)}`}>
                                            {order.order_status || order.status}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Payment</span>
                                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${getStatusStyles(order.payment_status)}`}>
                                            {order.payment_status || 'Unknown'}
                                        </div>
                                    </div>

                                    <Link
                                        href={`/orders/${order.order_id}`}
                                        className="w-12 h-12 rounded-[var(--radius-md)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300 shadow-soft"
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
