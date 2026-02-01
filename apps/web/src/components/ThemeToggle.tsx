"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
    theme: string;
    toggleTheme: () => void;
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 🔒 هذا السطر هو الحل
    if (!mounted) {
        return (
            <button
                aria-label="Toggle theme"
                className="p-3 opacity-0 pointer-events-none"
            />
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-3 bg-bg hover:bg-primary-soft rounded-2xl text-text-muted hover:text-primary transition-all duration-200 border border-transparent hover:border-primary/10"
        >
            {theme === "dark" ? (
                <Sun size={20} strokeWidth={2.2} />
            ) : (
                <Moon size={20} strokeWidth={2.2} />
            )}
        </motion.button>
    );
}
