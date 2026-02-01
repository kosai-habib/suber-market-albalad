"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '@/lib/api';
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
    addToCart: (product: Product, quantity?: number) => Promise<void>;
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
            const res = await cartApi.get();
            setCart(res.data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [isAuthenticated]);

    const addToCart = async (product: Product, quantity: number = 1) => {
        if (!isAuthenticated) {
            const existing = cart.find(item => item.product.id === product.id);
            if (existing) {
                setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
            } else {
                setCart([...cart, { id: Math.random(), product, quantity }]);
            }
            return;
        }

        try {
            await cartApi.add(product.id, quantity);
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
            await cartApi.update(id, quantity);
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
            await cartApi.remove(id);
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
