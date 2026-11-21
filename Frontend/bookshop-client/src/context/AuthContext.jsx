import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { AUTH_EXPIRED_EVENT } from '../api';
import { AuthContext } from './authContextValue';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                } catch (error) {
                    console.error("Session expired or invalid token", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    // The API rejected our token mid-session (expired, account blocked, or role changed):
    // sign out cleanly and send the person to login, then back to where they were.
    // Several requests can fail at once; only react to the first one
    const handlingExpiry = useRef(false);
    const handleExpired = useCallback(() => {
        if (!user || handlingExpiry.current) return;
        handlingExpiry.current = true;
        // The login page shows this even if a protected page redirects there first
        try { sessionStorage.setItem('authNotice', 'Your session has ended. Please log in again.'); } catch { /* ignore */ }
        setUser(null);
        navigate('/login', { replace: true, state: { from: location, message: 'Your session has ended. Please log in again.' } });
    }, [user, navigate, location]);

    useEffect(() => {
        window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    }, [handleExpired]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        handlingExpiry.current = false;
        setUser(userData);
        return userData;
    };

    const register = async (fullName, email, password) => {
        await api.post('/auth/register', { fullName, email, password });
        return login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (userData) => {
        const response = await api.put('/auth/profile', userData);
        setUser(response.data);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

