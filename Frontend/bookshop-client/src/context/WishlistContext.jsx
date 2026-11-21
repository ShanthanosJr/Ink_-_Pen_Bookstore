import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from './authContextValue';
import { useToast } from './ToastContext';
import { errorMessage } from '../constants/orders';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [loadedItems, setItems] = useState([]);
    // Logged-out visitors have no wishlist (no need to clear state in an effect)
    const items = user ? loadedItems : [];

    const refresh = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get('/wishlist');
            setItems(res.data);
        } catch (err) {
            console.error('Error loading wishlist', err);
        }
    }, [user]);

    // Load the wishlist when someone logs in (ignore the answer if they log out meanwhile)
    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        api.get('/wishlist')
            .then(res => { if (!cancelled) setItems(res.data); })
            .catch(err => console.error('Error loading wishlist', err));
        return () => { cancelled = true; };
    }, [user]);

    const isSaved = (bookId) => items.some(i => i.bookId === bookId);

    const toggle = async (book) => {
        if (!user) {
            navigate('/login', { state: { from: location, message: 'Log in to save books to your wishlist.' } });
            return;
        }
        const saved = isSaved(book.id);
        try {
            if (saved) {
                await api.delete(`/wishlist/${book.id}`);
                showToast(`Removed "${book.title}" from your wishlist.`, 'info');
            } else {
                await api.put(`/wishlist/${book.id}`);
                showToast(`Saved "${book.title}" to your wishlist.`, 'success', {
                    action: { label: 'View', onClick: () => navigate('/wishlist') }
                });
            }
            await refresh();
        } catch (err) {
            showToast(errorMessage(err), 'error');
        }
    };

    return (
        <WishlistContext.Provider value={{ items, count: items.length, isSaved, toggle, refresh }}>
            {children}
        </WishlistContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);
