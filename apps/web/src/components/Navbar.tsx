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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push('/');
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className={`sticky top-0 z-[150] transition-all duration-500 min-h-[80px] md:h-[90px] flex items-center py-2 md:py-0 ${scrolled
            ? 'backdrop-blur-xl bg-surface/85 border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
            : 'bg-surface border-b border-border'
            }`}>
            <div className="container-custom w-full flex flex-wrap items-center justify-between gap-4 md:gap-8">
                {/* Mobile Menu Button & Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 md:hidden text-text hover:bg-bg rounded-xl transition-all"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary p-2 md:p-2.5 rounded-xl md:rounded-2xl text-white shadow-[0_8px_16px_rgba(27,77,62,0.2)]"
                        >
                            <Store className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                        </motion.div>
                        <div className="flex flex-col -gap-1">
                            <span className="text-xl md:text-2xl font-black text-text tracking-tighter leading-none">
                                Albalad<span className="text-primary font-black uppercase tracking-widest text-[8px] md:text-[10px] ml-1 opacity-80">Market</span>
                            </span>
                            <span className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60 hidden xs:block">Fresh & Fast</span>
                        </div>
                    </Link>
                </div>

                {/* Search - Mobile Hidden behind toggle or full width on md+ */}
                <div className="order-3 md:order-2 w-full md:flex-grow md:max-w-2xl relative group block md:block">
                    <form onSubmit={handleSearch} className="relative z-10 flex items-center bg-bg border-2 border-transparent focus-within:border-primary/20 focus-within:bg-surface rounded-xl md:rounded-2xl px-4 md:px-5 py-2 md:py-3 transition-all duration-300">
                        <Search className="w-4 h-4 md:w-[18px] md:h-[18px] text-text-muted transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Discover fresh essentials..."
                            className="bg-transparent border-none focus:ring-0 ml-3 md:ml-4 w-full text-xs md:text-sm font-semibold text-text placeholder:text-text-muted/50 outline-none"
                            aria-label="Search items"
                        />
                    </form>
                </div>

                {/* Actions */}
                <div className="order-2 md:order-3 flex items-center gap-2 sm:gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>

                    <div className="h-6 md:h-8 w-[1px] bg-border mx-1 hidden md:block" />

                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link href="/profile" className="flex items-center gap-2 md:gap-3 p-1 rounded-xl md:rounded-2xl bg-bg border border-transparent hover:border-border transition-all group overflow-hidden">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary-hover text-white rounded-lg md:rounded-xl flex items-center justify-center font-black text-xs md:text-sm shadow-md">
                                        {user.email[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col pr-2 md:pr-4 hidden xl:flex">
                                        <span className="text-[9px] md:text-[11px] font-bold text-text-muted uppercase tracking-widest leading-none">Account</span>
                                        <span className="text-xs md:text-sm font-black text-text mt-0.5">{user.email.split('@')[0]}</span>
                                    </div>
                                </Link>

                                <div className="flex items-center bg-bg rounded-xl md:rounded-2xl border border-transparent p-1 hidden md:flex">
                                    <Link href="/orders" className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-primary transition-all">
                                        <Package size={20} strokeWidth={2} />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="p-2 hover:bg-danger/10 rounded-lg text-text-muted hover:text-danger transition-all"
                                    >
                                        <LogOut size={20} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="min-h-[44px] flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold shadow-soft"
                            >
                                <User className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2.5} />
                                <span className="hidden xs:inline">Sign In</span>
                            </button>
                        )}

                        <Link href="/cart" className="min-h-[44px] min-w-[44px] relative p-2.5 md:p-3 bg-accent text-text rounded-xl md:rounded-2xl hover:bg-accent-hover transition-all flex items-center justify-center group">
                            <ShoppingCart className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                            <AnimatePresence>
                                {cart.length > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] md:text-[10px] font-black w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-2 md:border-[3px] border-surface shadow-md"
                                    >
                                        {cart.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar/Menu overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[160] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-surface z-[170] md:hidden p-6 shadow-2xl flex flex-col gap-8"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-primary">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-text-muted hover:text-text"><X size={24} /></button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-bg font-bold text-text hover:bg-primary-soft transition-all">
                                    <Store size={20} className="text-primary" /> Home
                                </Link>
                                <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-bg font-bold text-text hover:bg-primary-soft transition-all">
                                    <ShoppingCart size={20} className="text-primary" /> My Cart
                                </Link>
                                {user && (
                                    <>
                                        <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-bg font-bold text-text hover:bg-primary-soft transition-all">
                                            <Package size={20} className="text-primary" /> My Orders
                                        </Link>
                                        <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-bg font-bold text-text hover:bg-primary-soft transition-all">
                                            <User size={20} className="text-primary" /> Profile
                                        </Link>
                                    </>
                                )}
                            </div>

                            <div className="mt-auto pt-6 border-t border-border flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-text-muted">Appearance</span>
                                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                                </div>
                                {user && (
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-danger/10 font-bold text-danger transition-all w-full text-left"
                                    >
                                        <LogOut size={20} /> Logout
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </nav>
    );
};

export default Navbar;
