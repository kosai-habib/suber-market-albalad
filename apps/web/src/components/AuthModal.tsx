"use client";
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const res = await authApi.login({
                    email: formData.email,
                    password: formData.password
                });

                const data = res.data;
                login(data.access_token, data.refresh_token || '', data.user);
                onClose();
            } else {
                await authApi.register({
                    email: formData.email,
                    password: formData.password
                });

                // Auto login after registration
                const loginRes = await authApi.login({
                    email: formData.email,
                    password: formData.password
                });

                const data = loginRes.data;
                login(data.access_token, data.refresh_token || '', data.user);
                onClose();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'An account error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200]"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[440px] bg-surface rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden z-[201] flex flex-col"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

                        <div className="relative p-8 md:p-12 flex flex-col gap-8">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-text-muted p-2 hover:bg-primary-soft hover:text-primary rounded-full transition-all duration-200"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col gap-3 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto mb-2"
                                >
                                    <Lock className="text-primary" size={28} />
                                </motion.div>
                                <h2 className="text-3xl font-heading font-black tracking-tight text-text">
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-sm text-text-muted leading-relaxed max-w-[280px] mx-auto text-balance">
                                    {isLogin
                                        ? 'Enter your credentials to access your Albalad Market account'
                                        : 'Join our community for the freshest premium groceries delivered to your door'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <AnimatePresence mode="wait">
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="flex flex-col gap-2 overflow-hidden"
                                        >
                                            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted ml-1">Full Name</label>
                                            <div className="relative group">
                                                <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="John Doe"
                                                    className="w-full pl-12 pr-4 py-4 bg-bg border-2 border-transparent focus:border-primary/20 focus:bg-surface rounded-2xl text-sm transition-all shadow-sm group-hover:shadow-md"
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-4 bg-bg border-2 border-transparent focus:border-primary/20 focus:bg-surface rounded-2xl text-sm transition-all shadow-sm group-hover:shadow-md"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">Password</label>
                                        {isLogin && (
                                            <button type="button" className="text-[11px] font-bold text-primary hover:underline">Forgot?</button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className={`w-full pl-12 pr-4 py-4 bg-bg border-2 focus:bg-surface rounded-2xl text-sm transition-all shadow-sm group-hover:shadow-md ${error ? 'border-danger/30 focus:border-danger' : 'border-transparent focus:border-primary/20'}`}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-danger font-medium mt-1 ml-1"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover transition-all duration-300 group-hover:opacity-90" />
                                    <div className="relative flex items-center justify-center py-4 px-6 text-white font-bold text-sm tracking-wide">
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Authenticating...</span>
                                            </div>
                                        ) : (
                                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        )}
                                    </div>
                                </motion.button>
                            </form>

                            <div className="flex flex-col gap-6 text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                    <div className="relative flex justify-center text-xs"><span className="bg-surface px-4 text-text-muted uppercase tracking-widest font-medium">Or</span></div>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="text-sm font-semibold text-text hover:text-primary transition-all group flex items-center justify-center gap-2"
                                >
                                    <span className="text-text-muted font-medium">
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    </span>
                                    <span className="inline-block transition-transform group-hover:translate-x-1">
                                        {isLogin ? "Sign Up Free" : "Sign In Here"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
