export const tokens = {
    colors: {
        primary: {
            DEFAULT: 'var(--primary)',
            hover: 'var(--primary-hover)',
            soft: 'rgba(27, 77, 62, 0.1)', // Derived from primary
        },
        accent: {
            DEFAULT: 'var(--accent)',
            hover: 'var(--accent-hover)',
        },
        bg: {
            DEFAULT: 'var(--bg)',
            surface: 'var(--surface)',
            card: 'var(--card)',
        },
        text: {
            DEFAULT: 'var(--text)',
            muted: 'var(--text-muted)',
            inverse: '#FFFFFF',
        },
        border: 'var(--border)',
        status: {
            success: 'var(--success)',
            danger: 'var(--danger)',
            warning: '#F59E0B',
            info: '#3B82F6',
        }
    },
    typography: {
        fontFamily: {
            sans: 'var(--font-sans)',
            heading: 'var(--font-heading)',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            bold: '700',
            black: '900',
        }
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
    },
    borderRadius: {
        sm: 'var(--radius-sm)', // 8px
        md: 'var(--radius-md)', // 12px
        lg: 'var(--radius-lg)', // 16px
        xl: 'var(--radius-xl)', // 20px
        full: '9999px',
    },
    shadows: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
        glass: 'var(--shadow-glass)',
    },
    animation: {
        DEFAULT: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
};
