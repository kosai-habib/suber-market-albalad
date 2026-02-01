import apiClient from './apiClient';

/**
 * Endpoints are now centralized in this file.
 * UI components should use these helper functions instead of calling axios directly.
 */

// Auth Endpoints
export const authApi = {
    login: (credentials: any) => apiClient.post('/api/auth/login', credentials),
    register: (userData: any) => apiClient.post('/api/auth/register', userData),
    getProfile: () => apiClient.get('/api/auth/me'),
    refresh: (refreshToken: string) => apiClient.post('/api/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
    })
};

// Product & Category Endpoints
export const productsApi = {
    getAll: (queryString: string = '') => apiClient.get(`/api/products${queryString}`),
    getById: (id: number) => apiClient.get(`/api/products/${id}`),
    getCategories: () => apiClient.get('/api/categories'),
};

// Cart Endpoints
export const cartApi = {
    get: () => apiClient.get('/api/cart'),
    add: (product_id: number, quantity: number = 1) =>
        apiClient.post('/api/cart', { product_id, quantity }),
    update: (item_id: number, quantity: number) =>
        apiClient.patch(`/api/cart/${item_id}`, { quantity }),
    remove: (item_id: number) => apiClient.delete(`/api/cart/${item_id}`),
};

// Order Endpoints
export const ordersApi = {
    checkout: (paymentMethod: string) =>
        apiClient.post('/api/orders/checkout', { payment_method: paymentMethod }),
    list: (page = 1, limit = 10) =>
        apiClient.get(`/api/orders?page=${page}&limit=${limit}`),
    getDetails: (id: number) => apiClient.get(`/api/orders/${id}`),
};
