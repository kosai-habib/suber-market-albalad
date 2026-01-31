"use client";
import React from 'react';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
// Legacy component - imports removed

const Header = ({ className }) => {
    const { cart, setIsCartOpen, user, logout, setIsAuthModalOpen, searchQuery, setSearchQuery } = useStore();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className={`${className} sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border`}>
            <div className="container-custom h-20 flex items-center justify-between gap-xl">
                {/* Logo */}
                <div
                    className="flex items-center gap-sm shrink-0 cursor-pointer"
                    onClick={() => window.location.href = '/'}
                    aria-label="Go to home page"
                >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center">
                        <img src="/logo.png" alt="Albalad Market Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xl font-heading font-bold text-text shrink-0 hidden sm:block">Albalad <span className="text-primary italic">Market</span></span>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl hidden md:flex relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search for premium products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg border-none py-3 pl-12 pr-4 rounded-2xl text-sm placeholder:text-text-muted transition-all focus:bg-white focus:shadow-soft"
                        aria-label="Search products"
                    />
                </div>

                {/* Nav & Actions */}
                <div className="flex items-center gap-lg">
                    <nav className="hidden lg:flex items-center gap-xl mr-4">
                        <a href="#" className="text-sm font-semibold text-primary">Shop</a>
                        <a href="#" className="text-sm font-semibold text-text-muted hover:text-text transition-colors">Deals</a>
                        <a href="#" className="text-sm font-semibold text-text-muted hover:text-text transition-colors">Premium</a>
                    </nav>

                    <div className="flex items-center gap-md">
                        {user ? (
                            <button
                                onClick={logout}
                                className="flex items-center gap-xs text-sm font-semibold text-text-muted hover:text-text transition-colors p-2"
                                aria-label="Logout"
                            >
                                <span className="flex items-center gap-1 sm:hidden">
                                    <User size={18} />
                                    <span>Account</span>
                                </span>
                                <span className="hidden sm:inline">Hello, {user.name.split(' ')[0]}</span>
                                <LogOut size={18} className="hidden sm:block" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="p-3 text-text-muted hover:text-primary transition-colors flex items-center gap-1"
                                aria-label="Sign In"
                            >
                                <User size={22} />
                                <span className="text-xs font-bold sm:hidden">Sign In</span>
                            </button>
                        )}

                        <button
                            className="relative text-text p-3 hover:bg-bg rounded-xl transition-colors flex items-center gap-1"
                            onClick={() => setIsCartOpen(true)}
                            aria-label={`Open cart, ${itemCount} items`}
                        >
                            <ShoppingCart size={22} />
                            <span className="text-xs font-bold sm:hidden whitespace-nowrap">My Cart</span>
                            {itemCount > 0 && (
                                <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-soft">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
