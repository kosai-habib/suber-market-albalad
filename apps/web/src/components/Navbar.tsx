"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, User, Search, Store, LogOut, Package, Menu, Moon, Sun } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { AuthModal } from './AuthModal';

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
        <nav className={`sticky top-0 z-[90] transition-all duration-300 h-[80px] flex items-center ${scrolled ? 'backdrop-blur-md bg-surface/80 border-b border-border shadow-soft' : 'bg-surface border-b border-border'
            }`}>
            <div className="container-custom w-full flex items-center justify-between gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className="bg-primary p-2.5 rounded-md text-white shadow-soft group-hover:scale-110 transition-transform">
                        <Store size={22} />
                    </div>
                    <span className="text-xl font-heading font-black text-text tracking-tight hidden lg:block">
                        Albalad<span className="text-primary">Market</span>
                    </span>
                </Link>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex-grow max-w-xl flex items-center bg-bg border border-border rounded-xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <Search size={18} className="text-text-muted" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search fresh products..."
                        className="bg-transparent border-none focus:ring-0 ml-3 w-full text-sm font-medium text-text placeholder:text-text-muted/60"
                        aria-label="Search products"
                    />
                </form>

                {/* Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 hover:bg-bg rounded-xl text-text-muted hover:text-primary transition-all active:scale-95 border border-transparent hover:border-border"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link href="/profile" className="flex items-center gap-3 p-1.5 pr-3 hover:bg-primary/5 rounded-xl transition-all group border border-transparent hover:border-primary/10">
                                <div className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-soft group-hover:scale-105 transition-transform">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-text hidden xl:block">{user.email.split('@')[0]}</span>
                            </Link>
                            <Link href="/orders" title="My Orders" className="p-2.5 hover:bg-bg rounded-xl text-text-muted hover:text-primary transition-all relative border border-transparent hover:border-border">
                                <Package size={22} />
                            </Link>
                            <button
                                onClick={logout}
                                title="Logout"
                                className="p-2.5 hover:bg-danger/10 rounded-xl text-text-muted hover:text-danger transition-all border border-transparent hover:border-danger/20"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-all active:scale-95"
                        >
                            <User size={18} />
                            <span className="hidden sm:inline">Sign In</span>
                        </button>
                    )}

                    <div className="w-[1px] h-8 bg-border hidden sm:block" />

                    <Link href="/cart" className="relative p-2.5 bg-accent text-text rounded-xl hover:bg-accent-hover transition-all shadow-soft flex items-center justify-center hover:scale-105 active:scale-95 duration-200">
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-surface shadow-sm">
                                {cart.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </nav>
    );
};
