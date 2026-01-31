"use client";
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../lib/apiClient';

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
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                const res = await apiFetch('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'An error occurred');
                }

                const data = await res.json();
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user_id', data.user.id);
                window.dispatchEvent(new Event('auth-changed'));

                login(data.access_token, data.refresh_token || '', data.user);
                onClose();
            } else {
                // Register
                const regRes = await apiFetch('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (!regRes.ok) {
                    const errorData = await regRes.json();
                    throw new Error(errorData.message || 'Registration failed');
                }

                // Auto login after registration
                const loginRes = await apiFetch('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (!loginRes.ok) throw new Error('Auto-login failed');

                const data = await loginRes.json();
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user_id', data.user.id);
                window.dispatchEvent(new Event('auth-changed'));

                login(data.access_token, data.refresh_token || '', data.user);
                onClose();
            }
        } catch (err: any) {
            setError(err?.message || 'Network error');
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-2xl rounded-xl shadow-2xl z-[201] flex flex-col gap-xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-md right-md text-text-muted p-sm hover:text-text-dark"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col gap-xs text-center">
                            <h2 className="text-2xl font-bold text-text-dark">{isLogin ? 'Welcome Back' : 'Join Albald Market'}</h2>
                            <p className="text-sm text-text-muted">{isLogin ? 'Enter your credentials to access your account' : 'Start your premium fresh grocery journey'}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                            {!isLogin && (
                                <div className="flex flex-col gap-xs">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Full Name</label>
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-md py-md bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-xs">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-md py-md bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-xs">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="password"
                                        required
                                        className={`w-full pl-12 pr-md py-md bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-1 ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-100 focus:ring-primary'}`}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                {error && <p className="text-[10px] text-red-500 font-bold mt-1 italic">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-lg rounded-lg font-bold text-sm tracking-wide hover:bg-opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </form>

                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs font-medium text-text-muted hover:text-primary transition-colors text-center"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
