import React from 'react';
import { Filter, SortAsc, Tag } from 'lucide-react';

const Sidebar = ({ className, activeCategory, setCategory, activeSort, setSort, showDeals, setShowDeals }) => {
    const categories = [
        { label: 'All Products', slug: 'All' },
        { label: 'Meat & Fish', slug: 'meat' },
        { label: 'Dairy', slug: 'dairy' },
        { label: 'Produce', slug: 'produce' },
        { label: 'Bakery', slug: 'bakery' },
        { label: 'Beverages', slug: 'beverages' },
        { label: 'Frozen', slug: 'frozen' },
        { label: 'Pantry', slug: 'pantry' },
        { label: 'Household', slug: 'household' }
    ];

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
                    className={`flex items-center justify-between px-md py-sm rounded-md text-sm transition-all border ${showDeals
                            ? 'bg-accent/10 border-accent text-accent font-bold'
                            : 'border-gray-100 text-text-muted hover:text-text-dark hover:bg-gray-50'
                        }`}
                >
                    <span>Flash Deals</span>
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
                    {categories.map(cat => (
                        <button
                            key={cat.slug}
                            onClick={() => setCategory(cat.slug)}
                            className={`text-left px-md py-sm rounded-md text-sm transition-all ${activeCategory === cat.slug && !showDeals
                                    ? 'bg-primary/5 text-primary font-bold border-l-2 border-primary'
                                    : 'text-text-muted hover:text-text-dark hover:bg-gray-50'
                                }`}
                        >
                            {cat.label}
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
