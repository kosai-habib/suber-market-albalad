"use client";
import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
// Legacy component - imports removed
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, checkout } = useStore();
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
                    >
                        <div className="p-lg flex items-center justify-between border-b border-gray-100">
                            <h2 className="text-xl font-bold text-text-dark flex items-center gap-sm">
                                <ShoppingBag size={20} className="text-primary" />
                                Shopping Cart
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="text-text-muted hover:text-text-dark p-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-text-muted gap-sm">
                                    <ShoppingBag size={48} className="opacity-10" />
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {cart.map(item => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex gap-md p-md bg-gray-50 rounded-lg"
                                        >
                                            <img src={item.image_url || item.image || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded object-cover" />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <h4 className="text-sm font-medium text-text-dark">{item.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-primary">₪{(item.price * item.quantity).toFixed(2)}</p>
                                                    {item.quantity > 1 && (
                                                        <span className="text-[10px] text-text-muted">(₪{item.price.toFixed(2)} each)</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-md">
                                                <div className="flex items-center gap-sm bg-white border border-gray-200 rounded px-sm py-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-text-muted"><Minus size={14} /></button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-text-muted"><Plus size={14} /></button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        <div className="p-lg bg-gray-50 border-t border-gray-100 flex flex-col gap-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-text-muted font-medium">Subtotal</span>
                                <span className="text-2xl font-bold text-text-dark">₪{total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={checkout}
                                disabled={cart.length === 0}
                                className="w-full bg-primary text-white py-lg rounded-lg font-bold hover:bg-opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Complete Purchase
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
