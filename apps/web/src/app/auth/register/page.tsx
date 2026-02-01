"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authApi.register({ email, password, phone });
            const loginRes = await authApi.login({ email, password });
            const data = loginRes.data;
            login(data.access_token, data.refresh_token || '', data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-6 bg-transparent overflow-hidden">
            {/* Background Decor - Adjusted for mobile */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-primary/10 blur-[80px] md:blur-[120px] rounded-full z-0 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[480px] bg-white/[0.06] backdrop-blur-[40px] p-6 sm:p-10 md:p-14 rounded-[32px] md:rounded-[48px] border border-white/[0.12] shadow-[0_16px_64px_-8px_rgba(0,0,0,0.5)] flex flex-col items-center"
            >
                <div className="flex flex-col gap-3 mb-8 md:mb-12 text-center w-full">
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight">Join</h1>
                    <p className="text-white/40 font-medium text-sm md:text-base">Start your journey with Albalad Market</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 md:mb-8 p-4 bg-error/10 border border-error/20 text-error text-sm font-bold rounded-2xl flex items-center gap-3 w-full"
                    >
                        <div className="w-1.5 h-1.5 bg-error rounded-full shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6 w-full">
                    <div className="flex flex-col gap-2 md:gap-3">
                        <label className="text-[10px] md:text-xs font-black text-white/50 ml-1 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 md:h-16 pl-14 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20 font-medium text-sm md:text-base outline-none focus:ring-1 focus:ring-primary/30"
                                placeholder="name@albalad.com"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <label className="text-[10px] md:text-xs font-black text-white/50 ml-1 uppercase tracking-widest">Phone Number (Israel)</label>
                        <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[0-9+\-\s]*$/.test(val)) {
                                        setPhone(val);
                                    }
                                }}
                                className="w-full h-14 md:h-16 pl-14 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20 font-medium text-sm md:text-base outline-none focus:ring-1 focus:ring-primary/30"
                                placeholder="+972 5X XXX XXXX"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <label className="text-[10px] md:text-xs font-black text-white/50 ml-1 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 md:h-16 pl-14 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20 font-medium text-sm md:text-base outline-none focus:ring-1 focus:ring-primary/30"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-glass-primary mt-2 md:mt-4 h-14 md:h-16 flex items-center justify-center gap-3 text-base md:text-lg w-full rounded-2xl active:scale-[0.98] transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        {!loading && <ArrowRight size={20} className="md:w-[22px]" />}
                    </button>
                </form>

                <div className="mt-8 md:mt-12 flex flex-col gap-4 md:gap-6 text-center w-full">
                    <p className="text-sm text-white/40 font-medium tracking-tight">
                        Already a member? {' '}
                        <Link href="/auth/login" className="text-primary font-black hover:text-white transition-colors">
                            Sign In
                        </Link>
                    </p>
                    <div className="h-[1px] bg-white/[0.05] w-full" />
                    <Link href="/" className="text-[10px] md:text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em] py-2">
                        Exit to Store
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
