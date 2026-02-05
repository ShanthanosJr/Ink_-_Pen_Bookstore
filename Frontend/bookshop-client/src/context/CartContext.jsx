import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
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
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (bookId, quantity = 1) => {
        if (!user) {
            // TODO: Handle guest cart later if needed, for now alert or redirect
            alert("Please login to add items to cart.");
            return;
        }
        try {
            const response = await api.post('/cart/add', { bookId, quantity });
            setCart(response.data);
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await api.put(`/cart/update/${itemId}`, { quantity });
            setCart(response.data);
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await api.delete(`/cart/remove/${itemId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Error removing from cart:", error);
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

export const useCart = () => useContext(CartContext);
