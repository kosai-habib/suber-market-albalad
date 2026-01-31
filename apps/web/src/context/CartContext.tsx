"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { useAuth } from './AuthContext';

interface Product {
    id: number;
    name: string;
    price: number;
    image_url: string;
    is_discounted?: boolean;
    discount_percent?: number;
}

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    removeFromCart: (id: number) => Promise<void>;
    clearCart: () => void;
    total: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = async () => {
        if (!isAuthenticated) return;
        try {
            setIsLoading(true);
            const res = await apiFetch('/api/cart'); // Updated to apiFetch and /api prefix
            if (res.ok) {
                const data = await res.json(); // JSON parsing
                setCart(data);
            } else {
                console.error('Failed to fetch cart:', res.status, res.statusText);
            }
        } catch (err) {
            console.error('Failed to fetch cart', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (product: Product) => {
        if (!isAuthenticated) {
            // Local cart logic if not logged in
            const existing = cart.find(item => item.product.id === product.id);
            if (existing) {
                setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                setCart([...cart, { id: Math.random(), product, quantity: 1 }]);
            }
            return;
        }

        try {
            await apiFetch('/api/cart', { // Updated to apiFetch and /api prefix
                method: 'POST',
                body: JSON.stringify({ product_id: product.id, quantity: 1 })
            });
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const updateQuantity = async (id: number, quantity: number) => {
        if (!isAuthenticated) {
            setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
            return;
        }
        try {
            await apiFetch(`/api/cart/${id}`, { // Updated to apiFetch and /api prefix
                method: 'PATCH',
                body: JSON.stringify({ quantity })
            });
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromCart = async (id: number) => {
        if (!isAuthenticated) {
            setCart(cart.filter(item => item.id !== id));
            return;
        }
        try {
            await apiFetch(`/api/cart/${id}`, { // Updated to apiFetch and /api prefix
                method: 'DELETE'
            });
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, total, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
