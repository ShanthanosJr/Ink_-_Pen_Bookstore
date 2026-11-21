import axios from 'axios';

// Override with VITE_API_ORIGIN in a .env file (e.g. VITE_API_ORIGIN=http://localhost:5050)
export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || 'http://localhost:5000').replace(/\/$/, '');

// Files uploaded to the API (book covers, slips) are stored as /uploads/...; external images are full URLs
export const assetUrl = (url) => (url && url.startsWith('/uploads/') ? `${API_ORIGIN}${url}` : url);

const api = axios.create({
    baseURL: `${API_ORIGIN}/api`
});

// Interceptor to add JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// When the API rejects a token we sent (expired, blocked account, changed role), drop it and tell the app.
export const AUTH_EXPIRED_EVENT = 'auth:expired';
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const sentToken = !!error.config?.headers?.Authorization;
        if (error.response?.status === 401 && sentToken) {
            localStorage.removeItem('token');
            window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
        }
        return Promise.reject(error);
    }
);

export default api;
