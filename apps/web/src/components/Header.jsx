import React from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Header = ({ className }) => {
    const { cart, setIsCartOpen, user, logout, setIsAuthModalOpen } = useStore();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className={`${className} flex items-center justify-between`}>
            <div className="flex items-center gap-sm">
                <img src="/logo.png" alt="Albald Market" className="w-10 h-10 object-contain" />
                <h1 className="text-xl font-bold tracking-tight text-primary">Albald Market</h1>
            </div>

            <nav className="hidden md:flex items-center gap-xl">
                <a href="#" className="text-sm font-medium text-text-dark border-b-2 border-primary pb-1">Shop</a>
                <a href="#" className="text-sm font-medium text-text-muted hover:text-text-dark transition-colors">Deals</a>
                <a href="#" className="text-sm font-medium text-text-muted hover:text-text-dark transition-colors">Premium</a>
            </nav>

            <div className="flex items-center gap-lg">
                {user ? (
                    <button
                        onClick={logout}
                        className="flex items-center gap-xs text-sm text-text-muted hover:text-text-dark transition-colors"
                    >
                        <span className="hidden sm:inline">Hello, {user.name.split(' ')[0]}</span>
                        <LogOut size={18} />
                    </button>
                ) : (
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="text-sm font-semibold text-primary hover:text-opacity-80 transition-colors"
                    >
                        Sign In
                    </button>
                )}

                <button
                    className="relative text-text-dark p-2 hover:bg-gray-50 rounded-full transition-colors"
                    onClick={() => setIsCartOpen(true)}
                >
                    <ShoppingCart size={22} />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
