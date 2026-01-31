"use client";
export const dynamic = 'force-dynamic';


import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Package, Heart, Settings, Shield, Sparkles } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="container-custom py-32 text-center">
                <h1 className="text-2xl font-heading font-black text-[var(--text-main)]">Identification Required</h1>
                <p className="text-[var(--text-muted)] mt-2 font-medium">Please sign in to access your profile data.</p>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar */}
                <aside className="lg:col-span-4 flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[var(--radius-xl)] p-10 flex flex-col items-center text-center gap-6 shadow-soft"
                    >
                        <div className="relative group">
                            <div className="w-24 h-24 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-card ring-4 ring-[var(--primary-soft)]">
                                {user.email[0].toUpperCase()}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-heading font-black text-[var(--text-main)]">{user.email.split('@')[0]}</h2>
                            <p className="text-sm text-[var(--text-muted)] font-medium">{user.email}</p>
                        </div>
                        <div className="bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[var(--primary)]/10">
                            TRUSTED MEMBER
                        </div>
                    </motion.div>

                    <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] p-3 rounded-[var(--radius-xl)] flex flex-col gap-1 shadow-soft">
                        {[
                            { icon: User, label: 'Personal Identity', active: true },
                            { icon: Package, label: 'Selection History', active: false },
                            { icon: Heart, label: 'Preferences', active: false },
                            { icon: MapPin, label: 'Saved Addresses', active: false },
                            { icon: Settings, label: 'Account Controls', active: false }
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`flex items-center gap-3 px-6 py-3.5 rounded-[var(--radius-lg)] font-bold text-sm transition-all ${item.active
                                        ? 'bg-[var(--primary)] text-white shadow-soft'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Content */}
                <main className="lg:col-span-8 flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[var(--radius-xl)] p-10 md:p-14 flex flex-col gap-12 shadow-soft"
                    >
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-heading font-black text-[var(--text-main)] tracking-tight">Access Protocol</h1>
                            <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-green-200">VERIFIED</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Alias Name</span>
                                <div className="flex items-center gap-3 h-14 px-5 bg-[var(--bg-main)] border border-[var(--border-soft)] rounded-[var(--radius-md)] text-[var(--text-main)] font-bold shadow-inner">
                                    <User size={18} className="text-[var(--text-muted)]" />
                                    {user.email.split('@')[0]}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Secure Email</span>
                                <div className="flex items-center gap-3 h-14 px-5 bg-[var(--bg-main)] border border-[var(--border-soft)] rounded-[var(--radius-md)] text-[var(--text-main)] font-bold shadow-inner">
                                    <Mail size={18} className="text-[var(--text-muted)]" />
                                    {user.email}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Initialization</span>
                                <div className="flex items-center gap-3 h-14 px-5 bg-[var(--bg-main)] border border-[var(--border-soft)] rounded-[var(--radius-md)] text-[var(--text-main)] font-bold shadow-inner">
                                    <Calendar size={18} className="text-[var(--text-muted)]" />
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Phase 1'}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Safety Status</span>
                                <div className="flex items-center gap-3 h-14 px-5 bg-[var(--bg-main)] border border-[var(--border-soft)] rounded-[var(--radius-md)] text-green-600 font-bold shadow-inner">
                                    <Shield size={18} className="opacity-60" />
                                    Active Shielding
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--primary-soft)] border border-[var(--primary)]/10 p-8 rounded-[var(--radius-xl)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-10 text-[var(--primary)]">
                                <Sparkles size={160} />
                            </div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <h3 className="text-xl font-heading font-black text-[var(--primary)] flex items-center gap-2">
                                    <Sparkles size={24} className="text-[var(--accent)]" />
                                    Loyalty Rewards
                                </h3>
                                <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed max-w-sm">
                                    You have accumulated <strong>450 Fresh Points</strong>. You are only 50 points away from a reward!
                                </p>
                            </div>
                            <div className="relative z-10 bg-white px-8 py-3 rounded-[var(--radius-lg)] text-[var(--primary)] font-black text-4xl tracking-tighter shadow-soft">
                                450
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
