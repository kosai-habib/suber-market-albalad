"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';

interface User {
    id: number;
    email: string;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (accessToken: string, refreshToken: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await apiFetch('/api/auth/me');
            if (!res.ok) throw new Error('Failed to fetch profile');
            const data = await res.json();
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
        } catch (err: any) {
            // Silently handle auth failures (expected when not logged in)
            if (err.name === 'TypeError' || err.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                localStorage.removeItem('user_id');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            refreshProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const login = (accessToken: string, refreshToken: string, userData: User) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_id', userData.id.toString());
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        window.dispatchEvent(new Event('auth-changed'));
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
