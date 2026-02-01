"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, User, Search, Store, LogOut, Package, Menu, Moon, Sun, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

export const Navbar = () => {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Debounce Search Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            // Only update URL if searchTerm differs from current query
            // and we are ready to search (e.g., at least 1 char or empty to clear)
            const currentQ = searchParams.get('q') || '';
            if (searchTerm !== currentQ) {
                const params = new URLSearchParams(searchParams.toString());
                if (searchTerm) {
                    params.set('q', searchTerm);
                } else {
                    params.delete('q');
                }
                router.replace(`/?${params.toString()}`, { scroll: false });
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [searchTerm, router, searchParams]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Immediate trigger on enter
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('q', searchTerm);
        } else {
            params.delete('q');
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <nav className={`sticky top-0 z-[150] transition-all duration-500 h-[90px] flex items-center ${scrolled
            ? 'backdrop-blur-xl bg-surface/85 border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
            : 'bg-surface border-b border-border'
            }`}>
            <div className="container-custom w-full flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary p-2.5 rounded-2xl text-white shadow-[0_8px_16px_rgba(27,77,62,0.2)] group-hover:shadow-[0_12px_24px_rgba(27,77,62,0.3)] transition-all duration-300"
                    >
                        <Store size={24} strokeWidth={2.5} />
                    </motion.div>
                    <div className="flex flex-col -gap-1 hidden lg:flex">
                        <span className="text-2xl font-black text-text tracking-tighter leading-none">
                            Albalad<span className="text-primary font-black uppercase tracking-widest text-[10px] ml-1 opacity-80">Market</span>
                        </span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">Fresh & Fast</span>
                    </div>
                </Link>

                {/* Search - Enhanced with glassmorphism and focus effects */}
                <div className="flex-grow max-w-2xl relative group hidden md:block">
                    <form onSubmit={handleSearch} className="relative z-10 flex items-center bg-bg border-2 border-transparent group-focus-within:border-primary/20 group-focus-within:bg-surface rounded-2xl px-5 py-3 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        <Search size={18} className="text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Discover fresh essentials..."
                            className="bg-transparent border-none focus:ring-0 ml-4 w-full text-sm font-semibold text-text placeholder:text-text-muted/50"
                            aria-label="Search items"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="p-1 hover:bg-primary-soft rounded-full text-text-muted hover:text-primary transition-all"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </form>
                    <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Actions - Grouped and balanced */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>

                    <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />

                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link href="/profile" className="flex items-center gap-3 p-1 rounded-2xl bg-bg border border-transparent hover:border-border hover:bg-surface transition-all group overflow-hidden">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md group-hover:shadow-lg transition-all duration-300">
                                        {user.email[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col pr-4 hidden xl:flex">
                                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest leading-none">Account</span>
                                        <span className="text-sm font-black text-text mt-0.5">{user.email.split('@')[0]}</span>
                                    </div>
                                </Link>

                                <div className="flex items-center bg-bg rounded-2xl border border-transparent p-1">
                                    <Link href="/orders" title="Review Orders" className="p-2.5 hover:bg-surface rounded-xl text-text-muted hover:text-primary transition-all relative group">
                                        <Package size={22} strokeWidth={2} />
                                        <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 rounded-xl transition-transform" />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        title="Sign Out"
                                        className="p-2.5 hover:bg-danger/10 rounded-xl text-text-muted hover:text-danger transition-all"
                                    >
                                        <LogOut size={22} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsAuthModalOpen(true)}
                                className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-[0_8px_20px_rgba(27,77,62,0.2)] hover:shadow-[0_12px_28px_rgba(27,77,62,0.3)] transition-all duration-300"
                            >
                                <User size={18} strokeWidth={2.5} />
                                <span className="hidden sm:inline">Sign In</span>
                            </motion.button>
                        )}

                        <Link href="/cart" className="relative p-3 bg-accent text-text rounded-2xl hover:bg-accent-hover transition-all shadow-[0_8px_20px_rgba(255,193,7,0.2)] flex items-center justify-center hover:scale-110 active:scale-95 duration-300 group">
                            <ShoppingCart size={22} strokeWidth={2.5} />
                            <AnimatePresence>
                                {cart.length > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-[3px] border-surface shadow-md"
                                    >
                                        {cart.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </nav>
    );
};

export default Navbar;
