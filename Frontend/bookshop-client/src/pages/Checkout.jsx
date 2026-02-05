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

    const [bankSlip, setBankSlip] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

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

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setBankSlip(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let finalFormData = { ...formData };

            // Handle Bank Transfer Upload
            if (formData.paymentMethod === 'Bank') {
                if (!bankSlip) {
                    throw new Error("Please upload the payment slip.");
                }
                const uploadData = new FormData();
                uploadData.append('file', bankSlip);

                const uploadRes = await api.post('/orders/upload-slip', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                finalFormData.paymentSlipPath = uploadRes.data.path;
            }

            // Handle Card Logic (Mock)
            if (formData.paymentMethod === 'Card') {
                if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc) {
                    throw new Error("Please complete card details.");
                }
                // In a real app, you'd tokenize here. We just save last 4 digits.
                finalFormData.cardLast4Digits = cardDetails.cardNumber.slice(-4);
            }

            await api.post('/orders/checkout', finalFormData);

            // Refresh cart (should be empty now)
            await fetchCart();
            // Redirect to profile or success page
            alert("Order placed successfully!");
            navigate('/profile');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data || err.message || "Failed to place order. Please check details.";
            setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
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

                            {/* Bank Transfer Details */}
                            {formData.paymentMethod === 'Bank' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-stone-100 p-4 border border-border-linen space-y-4"
                                >
                                    <div className="text-sm font-serif text-ink space-y-1">
                                        <p className="font-bold">Bank Details:</p>
                                        <p>Bank: City Bank</p>
                                        <p>Account Name: Ink & Pen Bookstore</p>
                                        <p>Account Number: 1234-5678-9012</p>
                                        <p>Branch: Main Street</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Upload Payment Slip</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            required
                                            className="w-full bg-white border border-border-linen p-2 text-sm font-serif text-ink file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-ink file:text-white hover:file:bg-accent-olive transition-colors"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Credit Card Details */}
                            {formData.paymentMethod === 'Card' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-stone-100 p-4 border border-border-linen space-y-4"
                                >
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            maxLength="19"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            value={cardDetails.cardNumber}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                            required
                                            className="w-full bg-white border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                required
                                                className="w-full bg-white border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">CVC</label>
                                            <input
                                                type="text"
                                                maxLength="3"
                                                placeholder="123"
                                                value={cardDetails.cvc}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                                required
                                                className="w-full bg-white border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

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
