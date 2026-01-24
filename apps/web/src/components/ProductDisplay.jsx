import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';

/**
 * ProductCard Contract:
 * - Parent: Grid item only
 * - Internal: Flex column
 * - Image: aspect-square
 * - No margins, gap-based spacing
 */
export const ProductCard = ({ product }) => {
    const { addToCart } = useStore();

    return (
        <div className="bg-bg-card border border-gray-100 p-md flex flex-col gap-sm rounded-lg hover:shadow-sm transition-shadow">
            <div className="aspect-square w-full rounded-md overflow-hidden bg-gray-50 relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {product.is_discounted && (
                    <div className="absolute top-sm right-sm bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        SALE
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-xs">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{product.category}</span>
                <h4 className="text-sm font-medium text-text-dark line-clamp-1">{product.name}</h4>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-text-dark">${product.price.toFixed(2)}</span>
                    <div className="flex items-center gap-[0.125rem]">
                        <Star size={10} className="fill-accent text-accent" />
                        <span className="text-[10px] text-text-muted">{product.popularity / 20}</span>
                    </div>
                </div>
                <button
                    className="bg-primary text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                    onClick={() => addToCart(product)}
                >
                    <ShoppingCart size={16} />
                </button>
            </div>
        </div>
    );
};

export const ProductGrid = ({ products }) => {
    return (
        <div className="system-grid">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
