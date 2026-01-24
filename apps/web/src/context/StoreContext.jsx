import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const products = [
    // Meat
    { id: 1, name: 'Fresh Beef Steak', category: 'meat', price: 25.99, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80', popularity: 92, is_discounted: true },
    { id: 2, name: 'Organic Chicken Breast', category: 'meat', price: 15.50, image: 'https://images.unsplash.com/photo-1604908176997-125f15ca1748?auto=format&fit=crop&w=800&q=80', popularity: 85, is_discounted: false },
    { id: 3, name: 'Fresh Salmon Fillet', category: 'meat', price: 22.00, image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80', popularity: 88, is_discounted: true },

    // Dairy
    { id: 4, name: 'Premium Whole Milk', category: 'dairy', price: 4.50, image: 'https://images.unsplash.com/photo-1563636619-e910ef2a844b?auto=format&fit=crop&w=800&q=80', popularity: 95, is_discounted: false },
    { id: 5, name: 'Artisan Aged Cheese', category: 'dairy', price: 12.00, image: 'https://images.unsplash.com/photo-1486297678162-ad2a19b058fb?auto=format&fit=crop&w=800&q=80', popularity: 88, is_discounted: true },

    // Produce
    { id: 6, name: 'Organic Red Apples', category: 'produce', price: 3.20, image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=800&q=80', popularity: 98, is_discounted: false },
    { id: 7, name: 'Fresh Broccoli Crown', category: 'produce', price: 2.80, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=800&q=80', popularity: 82, is_discounted: true },

    // Bakery
    { id: 8, name: 'Sourdough Bread', category: 'bakery', price: 6.50, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80', popularity: 90, is_discounted: false },
    { id: 9, name: 'Butter Croissants (4pk)', category: 'bakery', price: 8.00, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', popularity: 94, is_discounted: true },

    // Beverages
    { id: 10, name: 'Cold Brew Coffee', category: 'beverages', price: 5.50, image: 'https://images.unsplash.com/photo-1517701604599-bb2eb76f50b0?auto=format&fit=crop&w=800&q=80', popularity: 87, is_discounted: false },
    { id: 11, name: 'Sparkling Mineral Water', category: 'beverages', price: 2.50, image: 'https://images.unsplash.com/photo-1559839914-17aae19cea9e?auto=format&fit=crop&w=800&q=80', popularity: 80, is_discounted: true },

    // Frozen
    { id: 12, name: 'Margherita Pizza', category: 'frozen', price: 10.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', popularity: 85, is_discounted: false },

    // Pantry
    { id: 13, name: 'Extra Virgin Olive Oil', category: 'pantry', price: 18.00, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80', popularity: 91, is_discounted: false },
    { id: 14, name: 'Organic Honey', category: 'pantry', price: 14.50, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', popularity: 89, is_discounted: true },

    // Household
    { id: 15, name: 'Eco-Friendly Detergent', category: 'household', price: 12.99, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', popularity: 78, is_discounted: false },
  ];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const checkout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const order = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };
    setHistory(prev => [order, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    alert('Purchase successful!');
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    cart,
    products,
    user,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    login,
    logout,
    history
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
