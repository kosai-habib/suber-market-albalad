"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { X, Mail, Lock, ArrowRight, Loader2, Sparkles, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin
                ? { email, password }
                : { email, password, phone };

            const res = await api.post(endpoint, payload);

            if (isLogin) {
                login(res.data.access_token, res.data.refresh_token, res.data.user);
                onClose();
            } else {
                const loginRes = await api.post('/auth/login', { email, password });
                login(loginRes.data.access_token, loginRes.data.refresh_token, loginRes.data.user);
                onClose();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden border border-white/20 dark:border-white/5 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Ambient Backgrounds */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* Header */}
                    <div className="p-8 border-b border-border/10 flex justify-between items-center relative z-10">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-md">
                                    <Sparkles size={16} className="text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Secure Sign In</span>
                            </div>
                            <h2 className="text-2xl font-heading font-black text-text tracking-tight leading-tight">
                                {isLogin ? (
                                    <>Welcome back to <br />Albalad Market</>
                                ) : (
                                    <>Create your <br />Albalad account</>
                                )}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 text-text-muted hover:text-text rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar relative z-10">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger text-xs font-bold rounded-xl flex items-center gap-3"
                            >
                                <X size={14} className="flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text ml-1">Email address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-white/40 dark:bg-black/20 border border-border/50 rounded-xl focus:border-primary focus:bg-white/60 dark:focus:bg-black/40 transition-all outline-none text-sm font-medium shadow-inner"
                                        placeholder="yours@example.com"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex flex-col gap-2 overflow-hidden"
                                >
                                    <label className="text-xs font-bold text-text ml-1">Phone number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full h-14 pl-12 pr-4 bg-white/40 dark:bg-black/20 border border-border/50 rounded-xl focus:border-primary focus:bg-white/60 dark:focus:bg-black/40 transition-all outline-none text-sm font-medium shadow-inner"
                                            placeholder="+970 5xx xxx xxx"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-bold text-text">Password</label>
                                    {isLogin && (
                                        <button type="button" className="text-[10px] font-bold text-primary hover:underline underline-offset-4">
                                            Forgot your password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-white/40 dark:bg-black/20 border border-border/50 rounded-xl focus:border-primary focus:bg-white/60 dark:focus:bg-black/40 transition-all outline-none text-sm font-medium shadow-inner"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {isLogin && (
                                <div className="flex items-center gap-2 ml-1">
                                    <input
                                        type="checkbox"
                                        id="keep-signed-in"
                                        checked={keepSignedIn}
                                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                                    />
                                    <label htmlFor="keep-signed-in" className="text-xs font-medium text-text-muted cursor-pointer select-none">
                                        Keep me signed in
                                    </label>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign in' : 'Create account')}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div className="mt-10 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/20"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black">
                                <span className="bg-transparent backdrop-blur-2xl px-4 text-text-muted/60 tracking-widest">Quick sign-in options</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="mt-6 w-full h-14 bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl flex items-center justify-center gap-3 hover:bg-white/50 dark:hover:bg-white/10 transition-all shadow-sm text-text font-bold group"
                        >
                            <div className="bg-white p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <span className="flex-grow text-center pr-8 font-bold">Continue with Google</span>
                        </button>

                        <div className="mt-10 text-center">
                            {isLogin ? (
                                <p className="text-sm font-medium text-text-muted">
                                    New to Albalad Market? {' '}
                                    <button onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                                        Create an account
                                    </button>
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-text-muted">
                                    Already have an account? {' '}
                                    <button onClick={() => setIsLogin(true)} className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                                        Sign in
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
