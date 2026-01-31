"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, User, Search, Store, LogOut, Package, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/?q=${encodeURIComponent(searchTerm)}`);
        } else {
            router.push('/');
        }
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
                <form onSubmit={handleSearch} className="flex-grow max-w-xl flex items-center bg-bg border border-border rounded-lg px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <Search size={18} className="text-text-muted" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search fresh products..."
                        className="bg-transparent border-none focus:ring-0 ml-3 w-full text-sm font-medium text-text placeholder:text-text-muted"
                    />
                </form>

                {/* Actions */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/profile" className="flex items-center gap-3 p-1.5 hover:bg-primary/5 rounded-md transition-all group">
                                <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-soft">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-text hidden xl:block">{user.email.split('@')[0]}</span>
                            </Link>
                            <Link href="/orders" title="My Orders" className="p-2.5 hover:bg-bg rounded-md text-text-muted hover:text-primary transition-all relative">
                                <Package size={22} />
                            </Link>
                            <button
                                onClick={logout}
                                title="Logout"
                                className="p-2.5 hover:bg-danger/10 rounded-md text-text-muted hover:text-danger transition-all"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary rounded-md text-sm font-bold hover:bg-primary/20 transition-all"
                        >
                            <User size={18} />
                            <span className="hidden sm:inline">Sign In</span>
                        </button>
                    )}

                    <div className="w-[1px] h-8 bg-border hidden sm:block" />

                    <Link href="/cart" className="relative p-2.5 bg-accent text-text rounded-md hover:bg-accent-hover transition-all shadow-soft flex items-center justify-center">
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
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
