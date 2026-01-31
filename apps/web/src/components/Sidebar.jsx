"use client";
import React from 'react';
import { Filter, SortAsc, Tag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const Sidebar = ({ className, products = [], activeCategory, setCategory, activeSort, setSort, showDeals, setShowDeals }) => {
    const { categories } = useStore();

    // Ensure "All Products" is always at the top if we have other categories
    const displayCategories = categories.length > 0
        ? [{ name: 'All Products', slug: 'All' }, ...categories]
        : [{ name: 'All Products', slug: 'All' }];

    const getCount = (slug) => {
        if (slug === 'All') return products.length;
        // Match with category_id from products
        const category = categories.find(c => c.slug === slug);
        if (!category) return 0;
        return products.filter(p => p.category_id === category.id).length;
    };

    const dealsCount = products.filter(p => p.is_discounted).length;

    return (
        <aside className={`${className} flex-col p-lg gap-xl`}>
            {/* Featured Filter section */}
            <div className="flex flex-col gap-md">
                <div className="flex items-center gap-xs text-text-muted">
                    <Tag size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Offers</span>
                </div>
                <button
                    onClick={() => setShowDeals(!showDeals)}
                    aria-label={`Show ${dealsCount} flash deals`}
                    className={`flex items-center justify-between px-md py-sm rounded-md text-sm transition-all border ${showDeals
                        ? 'bg-accent/10 border-accent text-accent font-bold'
                        : 'border-gray-100 text-text-muted hover:text-text-dark hover:bg-gray-50'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span>Flash Deals</span>
                        <span className="text-[10px] bg-accent/10 px-1.5 py-0.5 rounded-full font-bold">{dealsCount}</span>
                    </div>
                    {showDeals && <div className="w-2 h-2 rounded-full bg-accent" />}
                </button>
            </div>

            {/* Category section */}
            <div className="flex flex-col gap-md">
                <div className="flex items-center gap-xs text-text-muted">
                    <Filter size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Categories</span>
                </div>
                <div className="flex flex-col gap-xs">
                    {displayCategories.map(cat => (
                        <button
                            key={cat.slug}
                            onClick={() => setCategory(cat.slug)}
                            aria-label={`Filter by ${cat.name} (${getCount(cat.slug)} items)`}
                            className={`flex items-center justify-between px-md py-sm rounded-md text-sm transition-all ${activeCategory === cat.slug && !showDeals
                                ? 'bg-primary/5 text-primary font-bold border-l-2 border-primary'
                                : 'text-text-muted hover:text-text-dark hover:bg-gray-50'
                                }`}
                        >
                            <span>{cat.name}</span>
                            <span className="text-[10px] opacity-60 font-medium">{getCount(cat.slug)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort Section */}
            <div className="flex flex-col gap-md pt-md border-t border-gray-100">
                <div className="flex items-center gap-xs text-text-muted">
                    <SortAsc size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Sort By</span>
                </div>
                <select
                    value={activeSort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-transparent border border-gray-200 rounded-md p-sm text-sm text-text-dark focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="pop">Popularity</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>
        </aside>
    );
};

export default Sidebar;
