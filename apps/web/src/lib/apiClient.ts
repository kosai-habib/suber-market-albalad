const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';

export function getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
    const headers = {
        ...getAuthHeaders(),
        ...(options.headers as Record<string, string> || {})
    };

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers
    });

    return response;
}

export function requireAuth(navigate: (path: string) => void) {
    if (typeof window !== 'undefined' && !localStorage.getItem('access_token')) {
        navigate('/auth/login');
        throw new Error('Not authenticated');
    }
}
