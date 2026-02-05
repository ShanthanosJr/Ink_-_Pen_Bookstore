import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import { motion } from 'framer-motion';

const Checkout = () => {
    const { cartItems, cartTotal, fetchCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        city: '',
        postalCode: '',
        paymentMethod: 'COD'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/orders/checkout', formData);
            // Refresh cart (should be empty now)
            await fetchCart();
            // Redirect to profile or success page
            alert("Order placed successfully!");
            navigate('/profile');
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Failed to place order. Please check stock levels.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-paper flex items-center justify-center">
                <p className="text-xl font-serif text-ink italic">Your satchel is empty. Cannot proceed.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold text-ink mb-12 border-b border-ink pb-4">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div>
                        <h3 className="font-serif font-bold text-xl text-ink mb-6 uppercase tracking-widest">Delivery Details</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-sm font-serif">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50 border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50 border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Address</label>
                                <input
                                    type="text"
                                    name="addressLine"
                                    required
                                    value={formData.addressLine}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50 border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full bg-stone-50 border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        required
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full bg-stone-50 border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50 border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                >
                                    <option value="COD">Cash on Delivery</option>
                                    <option value="Card">Credit Card</option>
                                    <option value="Bank">Bank Transfer</option>
                                </select>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-ink text-paper font-serif font-bold uppercase tracking-widest py-4 hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(44,44,44,0.2)] disabled:opacity-50"
                            >
                                {loading ? 'Processing Order...' : 'Place Order'}
                            </motion.button>
                        </form>
                    </div>

                    {/* Order Summary Stub */}
                    <div className="bg-[#e3ddd3] p-8 border border-border-linen h-fit shadow-md">
                        <h3 className="font-serif font-bold text-xl text-ink mb-6 uppercase tracking-widest border-b border-ink/20 pb-4">Order Summary</h3>
                        <ul className="space-y-4 mb-6 text-sm font-serif text-ink/80">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex justify-between">
                                    <span>{item.book.title} x {item.quantity}</span>
                                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 border-t border-ink/20 flex justify-between font-serif font-bold text-xl text-ink">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
