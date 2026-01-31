"use client";
export const dynamic = 'force-dynamic';


import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCcw, Loader2, CheckCircle } from 'lucide-react';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="container-custom py-32 flex justify-center">
                <Loader2 className="animate-spin text-[var(--primary)] w-12 h-12" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container-custom py-32 text-center flex flex-col items-center gap-6">
                <h1 className="text-3xl font-heading font-bold text-[var(--text-main)]">Product not found</h1>
                <button onClick={() => router.push('/')} className="btn-primary">Return to Store</button>
            </div>
        );
    }

    const discountAmount = product.is_discounted
        ? (product.price * (product.discount_percent / 100))
        : 0;
    const originalPrice = product.price + discountAmount;

    return (
        <div className="container-custom py-12">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all mb-10 font-bold text-sm uppercase tracking-widest group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Shopping
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Gallery */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative aspect-square rounded-[var(--radius-xl)] overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-soft"
                >
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    {product.is_discounted && (
                        <div className="absolute top-6 left-6 bg-red-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg text-sm">
                            SAVE {product.discount_percent}%
                        </div>
                    )}
                </motion.div>

                {/* Info */}
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-6">
                        <div className="bg-[var(--primary-soft)] text-[var(--primary)] text-[11px] font-black px-4 py-2 rounded-full w-fit tracking-widest uppercase">
                            {product.category_name}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-[var(--text-main)] leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={18} className="fill-[var(--accent)] text-[var(--accent)]" />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-[var(--text-muted)]">(128 Customer Reviews)</span>
                        </div>
                    </div>

                    <div className="flex items-end gap-4 pb-8 border-b border-[var(--border-soft)]">
                        <span className="text-5xl font-heading font-bold text-[var(--text-main)]">₪{product.price.toFixed(2)}</span>
                        {product.is_discounted && (
                            <span className="text-2xl text-[var(--text-muted)] line-through mb-1 font-medium">₪{originalPrice.toFixed(2)}</span>
                        )}
                        <span className="text-sm font-bold text-[var(--text-muted)] mb-1.5 ml-2 uppercase tracking-widest">/ Per unit</span>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-4 bg-[var(--bg-surface)] rounded-[var(--radius-md)] p-1 border border-[var(--border-soft)] shadow-soft">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-[var(--bg-main)] rounded-[var(--radius-sm)] transition-all font-bold text-xl"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center font-bold text-xl">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-[var(--bg-main)] rounded-[var(--radius-sm)] transition-all font-bold text-xl"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`flex-grow h-14 flex items-center justify-center gap-3 text-lg font-bold rounded-[var(--radius-md)] transition-all shadow-soft ${isAdded ? 'bg-green-500 text-white' : 'bg-[var(--primary)] text-white hover:brightness-110'
                                    }`}
                            >
                                {isAdded ? (
                                    <>
                                        <CheckCircle size={22} />
                                        Item Added Correcty
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={22} />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-[var(--text-muted)] leading-relaxed text-lg">
                            Our {product.name} is selected for its superior quality and freshness.
                            Whether for cooking or fresh consumption, albalad market guarantees the best source.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[var(--border-soft)]">
                        {[
                            { icon: ShieldCheck, label: '100% Quality', color: 'text-green-600' },
                            { icon: Truck, label: 'Fast Delivery', color: 'text-blue-600' },
                            { icon: RefreshCcw, label: 'Easy Returns', color: 'text-orange-600' }
                        ].map((benef, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-[var(--bg-main)] flex items-center justify-center ${benef.color}`}>
                                    <benef.icon size={20} />
                                </div>
                                <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">{benef.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="mt-24 flex flex-col gap-12">
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-6">
                    <h2 className="text-3xl font-heading font-black text-[var(--text-main)]">Customer Feedback</h2>
                    <button className="text-[var(--primary)] font-bold hover:underline">Write Review</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { name: "Sami Ahmed", date: "2 days ago", rating: 5, comment: "Exceptional quality. The delivery was fast and the product was very fresh." },
                        { name: "Lina Khalid", date: "1 week ago", rating: 4, comment: "I really liked it. The taste is great and the packaging is perfect." }
                    ].map((rev, i) => (
                        <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-soft)] p-8 rounded-[var(--radius-lg)] shadow-soft flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="font-bold text-[var(--text-main)] text-lg">{rev.name}</span>
                                    <span className="text-xs text-[var(--text-muted)] font-medium mt-1">{rev.date}</span>
                                </div>
                                <div className="flex gap-1">
                                    {Array.from({ length: rev.rating }).map((_, j) => (
                                        <Star key={j} size={14} className="fill-[var(--accent)] text-[var(--accent)]" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-[var(--text-muted)] leading-relaxed italic">"{rev.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
