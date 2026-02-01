import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'Albalad Market | Fresh Groceries Delivered',
    description: 'Your premium supermarket for fresh fruits, vegetables, and household essentials.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <AuthProvider>
                    <ThemeProvider>
                        <CartProvider>
                            <Suspense fallback={<div className="h-[90px] bg-surface border-b border-border" />}>
                                <Navbar />
                            </Suspense>
                            <main className="min-h-[calc(100vh-80px)]">
                                {children}
                            </main>
                        </CartProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
