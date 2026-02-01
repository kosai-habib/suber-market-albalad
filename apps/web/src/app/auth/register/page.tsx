"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-primary/5 dark:bg-primary/10 blur-[80px] md:blur-[120px] rounded-full z-0 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[480px] bg-card/60 dark:bg-white/[0.06] backdrop-blur-[40px] px-6 py-10 sm:p-10 md:p-14 rounded-[32px] md:rounded-[48px] border border-border/50 dark:border-white/[0.12] shadow-card dark:shadow-[0_16px_64px_-8px_rgba(0,0,0,0.5)] flex flex-col items-center"
            >
                <div className="flex flex-col gap-3 mb-8 md:mb-12 text-center w-full">
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-text dark:text-white tracking-tight">Join</h1>
                    <p className="text-text-muted dark:text-white/40 font-medium text-sm md:text-base">Start your premium grocery journey</p>
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
                        <label className="text-[10px] md:text-xs font-black text-text-muted dark:text-white/50 ml-1 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 dark:text-white/30" size={20} />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-14 md:h-16 pl-14 pr-4 bg-bg dark:bg-white/[0.03] border border-border dark:border-white/[0.08] rounded-2xl focus:border-primary/50 focus:bg-surface dark:focus:bg-white/[0.05] transition-all text-text dark:text-white placeholder:text-text-muted/30 dark:placeholder:text-white/20 font-medium text-sm md:text-base outline-none focus:ring-1 focus:ring-primary/30"
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <label className="text-[10px] md:text-xs font-black text-text-muted dark:text-white/50 ml-1 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 dark:text-white/30" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 md:h-16 pl-14 pr-4 bg-bg dark:bg-white/[0.03] border border-border dark:border-white/[0.08] rounded-2xl focus:border-primary/50 focus:bg-surface dark:focus:bg-white/[0.05] transition-all text-text dark:text-white placeholder:text-text-muted/30 dark:placeholder:text-white/20 font-medium text-sm md:text-base outline-none focus:ring-1 focus:ring-primary/30"
                                placeholder="name@albalad.com"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <label className="text-[10px] md:text-xs font-black text-text-muted dark:text-white/50 ml-1 uppercase tracking-widest">Phone Number (Israel)</label>
                        <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 dark:text-white/30" size={20} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[0-9+\-\s]*$/.test(val)) {
                                        setPhone(val);
                                    }
                                }}
                                className="w-full h-14 md:h-16 pl-14 pr-4 bg-bg dark:bg-white/[0.03] border border-border dark:border-white/[0.08] rounded-2xl focus:border-primary/50 focus:bg-surface dark:focus:bg-white/[0.05] transition-all text-text dark:text-white placeholder:text-text-muted/30 dark:placeholder:text-white/20 font-medium text-sm md:text-base outline-none focus:ring-1 focus:ring-primary/30"
                                placeholder="+972 5X XXX XXXX"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <label className="text-[10px] md:text-xs font-black text-text-muted dark:text-white/50 ml-1 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 dark:text-white/30" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 md:h-16 pl-14 pr-4 bg-bg dark:bg-white/[0.03] border border-border dark:border-white/[0.08] rounded-2xl focus:border-primary/50 focus:bg-surface dark:focus:bg-white/[0.05] transition-all text-text dark:text-white placeholder:text-text-muted/30 dark:placeholder:text-white/20 font-medium text-sm md:text-base outline-none focus:ring-1 focus:ring-primary/30"
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

                    {/* Social Divider */}
                    <div className="flex items-center gap-4 my-2">
                        <div className="h-[1px] bg-border dark:bg-white/[0.08] flex-grow" />
                        <span className="text-[10px] font-black text-text-muted dark:text-white/30 uppercase tracking-[0.2em]">or</span>
                        <div className="h-[1px] bg-border dark:bg-white/[0.08] flex-grow" />
                    </div>

                    {/* Google Sign Up Button */}
                    <button
                        type="button"
                        className="w-full h-14 md:h-16 flex items-center justify-center gap-4 bg-white dark:bg-white/[0.05] border border-border dark:border-white/[0.1] rounded-2xl text-text dark:text-white font-bold text-sm md:text-base hover:bg-slate-50 dark:hover:bg-white/[0.08] active:scale-[0.98] transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Join with Google</span>
                    </button>
                </form>

                <div className="mt-8 md:mt-12 flex flex-col gap-4 md:gap-6 text-center w-full">
                    <p className="text-sm text-text-muted dark:text-white/40 font-medium tracking-tight">
                        Already have an account? {' '}
                        <Link href="/auth/login" className="text-primary font-black hover:text-text dark:hover:text-white transition-colors">
                            Sign in here
                        </Link>
                    </p>
                    <div className="h-[1px] bg-border dark:bg-white/[0.05] w-full" />
                    <Link href="/" className="text-[10px] md:text-xs font-bold text-text-muted/40 dark:text-white/20 hover:text-text dark:hover:text-white transition-colors uppercase tracking-[0.2em] py-4 md:py-2">
                        Exit to Store
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
