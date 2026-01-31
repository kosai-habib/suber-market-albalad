"use client";

import React from 'react';

export const ProductSkeleton = () => {
    return (
        <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-4 animate-pulse shadow-soft">
            <div className="aspect-square rounded-md bg-bg" />
            <div className="flex flex-col gap-2">
                <div className="h-4 w-1/3 bg-bg rounded" />
                <div className="h-6 w-full bg-bg rounded" />
                <div className="flex items-center justify-between mt-4">
                    <div className="h-8 w-1/3 bg-bg rounded" />
                    <div className="h-10 w-full bg-bg rounded-md" />
                </div>
            </div>
        </div>
    );
};

export const GridSkeleton = ({ count = 8 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
};
