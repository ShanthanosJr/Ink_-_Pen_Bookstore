import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from './authContextValue';
import { useToast } from './ToastContext';
import { errorMessage } from '../constants/orders';

const CartContext = createContext(null);

// A guest's "add to cart" is remembered here and completed after they log in
const PENDING_ADD_KEY = 'pendingCartAdd';

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCart(null);
            return;
        }
        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const postAdd = useCallback(async (bookId, quantity, title) => {
        try {
            const response = await api.post('/cart/add', { bookId, quantity });
            setCart(response.data);
            showToast(title ? `"${title}" added to your cart.` : 'Added to your cart.', 'success', {
                action: { label: 'View cart', onClick: () => navigate('/cart') }
            });
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            showToast(errorMessage(error, 'Could not add this book to your cart.'), 'error');
            return false;
        }
    }, [navigate, showToast]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // After logging in, finish the add-to-cart the guest started
    useEffect(() => {
        if (!user) return;
        let pending = null;
        try {
            pending = JSON.parse(sessionStorage.getItem(PENDING_ADD_KEY) || 'null');
            sessionStorage.removeItem(PENDING_ADD_KEY);
        } catch {
            pending = null;
        }
        if (pending?.bookId) {
            postAdd(pending.bookId, pending.quantity || 1, pending.title);
        }
    }, [user, postAdd]);

    // book can be an id or a book object (object gives nicer messages)
    const addToCart = async (book, quantity = 1) => {
        const bookId = typeof book === 'object' ? book.id : book;
        const title = typeof book === 'object' ? book.title : undefined;

        if (!user) {
            try {
                sessionStorage.setItem(PENDING_ADD_KEY, JSON.stringify({ bookId, quantity, title }));
            } catch { /* storage unavailable: user just adds it again after login */ }
            navigate('/login', {
                state: {
                    from: location,
                    message: title
                        ? `Log in or create an account to add "${title}" to your cart.`
                        : 'Log in or create an account to add books to your cart.'
                }
            });
            return false;
        }
        return postAdd(bookId, quantity, title);
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await api.put(`/cart/update/${itemId}`, { quantity });
            setCart(response.data);
        } catch (error) {
            console.error("Error updating cart:", error);
            showToast(errorMessage(error, 'Could not update the quantity.'), 'error');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await api.delete(`/cart/remove/${itemId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Error removing from cart:", error);
            showToast(errorMessage(error, 'Could not remove this item.'), 'error');
        }
    };

    const clearCartLocal = () => {
        setCart(null);
    };

    const cartItems = cart?.items || [];
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    return (
        <CartContext.Provider value={{
            cart,
            cartItems,
            cartCount,
            cartTotal,
            loading,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCartLocal
        }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
