"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';


export const CategoryGrid = ({ activeCategory, setCategory }) => {
    const { categories } = useStore();

    const iconMap = {
        'meat': '🥩',
        'dairy': '🥛',
        'produce': '🥦',
        'bakery': '🥐',
        'beverages': '🥤',
        'frozen': '❄️',
        'pantry': '🧂',
        'household': '🧹',
        'All': <ShoppingBag size={20} />
    };

    const displayCategories = categories && categories.length > 0
        ? [{ name: 'All Products', slug: 'All' }, ...categories]
        : [{ name: 'All Products', slug: 'All' }];

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-h2">Shop by Category</h2>
                    <p className="text-text-muted mt-1">Explore our wide range of premium fresh goods</p>
                </div>
                <button className="text-primary font-semibold flex items-center gap-1 hover:underline">
                    View All Categories <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {displayCategories.map((cat) => (
                    <motion.button
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        key={cat.slug}
                        onClick={() => setCategory(cat.slug)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${activeCategory === cat.slug
                            ? 'bg-primary border-primary text-white shadow-lg'
                            : 'bg-surface border-border text-text hover:border-primary/50'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${activeCategory === cat.slug ? 'bg-white/20' : 'bg-bg text-text'
                            }`}>
                            {iconMap[cat.slug] || '📦'}
                        </div>
                        <span className="text-xs font-bold text-center uppercase tracking-tight">{cat.name}</span>
                    </motion.button>
                ))}
            </div>
        </section>
    );
};
