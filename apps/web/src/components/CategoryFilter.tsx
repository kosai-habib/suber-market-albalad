"use client";

import React from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    categories: Category[];
    activeCategory: string | null;
    onSelect: (slug: string | null) => void;
}

export const CategoryFilter = ({ categories, activeCategory, onSelect }: Props) => {
    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide pt-2">
            <button
                onClick={() => onSelect(null)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-premium border ${activeCategory === null
                        ? 'bg-primary text-white border-primary shadow-soft'
                        : 'bg-surface text-text-muted border-border hover:border-primary hover:text-primary'
                    }`}
            >
                All Products
            </button>
            {Array.isArray(categories) && categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.slug)}
                    className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-premium border ${activeCategory === cat.slug
                            ? 'bg-primary text-white border-primary shadow-soft'
                            : 'bg-surface text-text-muted border-border hover:border-primary hover:text-primary'
                        }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
};
