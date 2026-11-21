import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import { motion } from 'framer-motion';
import { errorMessage, formatMoney, redirectToPayHere } from '../constants/orders';

const inputClass = 'w-full bg-stone-50 border border-border-linen p-3 text-ink font-serif focus:outline-none focus:border-accent-olive transition-colors';
const labelClass = 'block text-xs font-bold uppercase tracking-widest text-ink-light mb-2';

const PAYMENT_HELP = {
    COD: 'Pay in cash when your books arrive.',
    PayHere: 'You will be taken to PayHere to pay securely by Visa, Mastercard, Amex, or mobile wallets. Your card details never reach our servers.',
    Bank: 'Transfer the total to our account, then upload a photo or scan of the slip. We confirm the order after checking the slip.',
};

const Checkout = () => {
    const { cartItems, fetchCart, loading: cartLoading } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [bankSlip, setBankSlip] = useState(null);
    const [options, setOptions] = useState(null);
    const [quote, setQuote] = useState(null);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponMessage, setCouponMessage] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        city: '',
        postalCode: '',
        paymentMethod: 'COD'
    });

    // Payment methods, shipping rules, and the last address used (to save retyping)
    useEffect(() => {
        api.get('/orders/checkout-options')
            .then(res => {
                setOptions(res.data);
                if (res.data.lastDelivery) {
                    setFormData(prev => ({ ...prev, ...res.data.lastDelivery }));
                }
            })
            .catch(err => console.error('Error loading checkout options', err));
    }, []);

    // Re-price whenever the cart or applied coupon changes
    useEffect(() => {
        if (cartItems.length === 0) return;
        api.post('/orders/quote', { couponCode: appliedCoupon || null })
            .then(res => setQuote(res.data))
            .catch(err => console.error('Error loading quote', err));
    }, [cartItems, appliedCoupon]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const applyCoupon = async (e) => {
        e.preventDefault();
        const code = couponInput.trim();
        if (!code) return;
        try {
            const res = await api.post('/orders/quote', { couponCode: code });
            if (res.data.couponError) {
                setCouponMessage({ type: 'error', text: res.data.couponError });
            } else {
                setAppliedCoupon(res.data.couponCode);
                setQuote(res.data);
                setCouponMessage({ type: 'success', text: `${res.data.couponCode} applied: you save ${formatMoney(res.data.discountAmount)}.` });
            }
        } catch (err) {
            setCouponMessage({ type: 'error', text: errorMessage(err) });
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon('');
        setCouponInput('');
        setCouponMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const payload = { ...formData, couponCode: appliedCoupon || null };

            if (formData.paymentMethod === 'Bank') {
                if (!bankSlip) throw new Error('Please upload the payment slip.');
                const uploadData = new FormData();
                uploadData.append('file', bankSlip);
                const uploadRes = await api.post('/orders/upload-slip', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                payload.paymentSlipPath = uploadRes.data.path;
            }

            const res = await api.post('/orders/checkout', payload);
            await fetchCart();

            if (res.data.payHere) {
                // Hand over to PayHere; it sends the customer back to the order page afterwards
                showToast('Order created. Taking you to PayHere to pay…', 'info');
                redirectToPayHere(res.data.payHere);
                return;
            }

            navigate(`/orders/${res.data.orderId}?placed=1`, { replace: true });
        } catch (err) {
            console.error(err);
            setError(errorMessage(err, 'Failed to place order. Please check your details.'));
            setSubmitting(false);
        }
    };

    if (!cartLoading && cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] bg-paper flex flex-col items-center justify-center px-4 text-center">
                <p className="text-xl font-serif text-ink italic mb-6">Your cart is empty, so there's nothing to check out yet.</p>
                <Link to="/shop" className="px-8 py-3 bg-ink text-paper font-serif font-bold uppercase tracking-widest text-xs">
                    Browse the collection
                </Link>
            </div>
        );
    }

    const methods = options?.paymentMethods || [
        { id: 'COD', label: 'Cash on Delivery', enabled: true },
        { id: 'Bank', label: 'Bank Transfer', enabled: true },
    ];
    const submitLabel = formData.paymentMethod === 'PayHere'
        ? `Continue to Payment${quote ? ` · ${formatMoney(quote.total)}` : ''}`
        : `Place Order${quote ? ` · ${formatMoney(quote.total)}` : ''}`;

    return (
        <div className="min-h-screen bg-paper py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-baseline justify-between mb-10 border-b border-ink pb-4 gap-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">Checkout</h1>
                    <Link to="/cart" className="font-serif italic text-sm text-ink-light hover:text-accent-olive">← Back to cart</Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-10" noValidate={false}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-sm font-serif" role="alert">
                                {error}
                            </div>
                        )}

                        <section className="space-y-5">
                            <h2 className="font-serif font-bold text-xl text-ink uppercase tracking-widest">1. Delivery details</h2>
                            {options?.lastDelivery && (
                                <p className="text-xs font-serif italic text-ink-light">Filled in from your last order. Change anything that's different.</p>
                            )}
                            <div>
                                <label htmlFor="fullName" className={labelClass}>Full name</label>
                                <input id="fullName" type="text" name="fullName" required maxLength={100} autoComplete="name"
                                    value={formData.fullName} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className={labelClass}>Phone number</label>
                                <input id="phoneNumber" type="tel" name="phoneNumber" required autoComplete="tel"
                                    pattern="^\+?[0-9 ()\-]{7,20}$" title="Digits, spaces, + ( ) and - only, 7 to 20 characters"
                                    placeholder="07X XXX XXXX"
                                    value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="addressLine" className={labelClass}>Address</label>
                                <input id="addressLine" type="text" name="addressLine" required maxLength={200} autoComplete="street-address"
                                    value={formData.addressLine} onChange={handleChange} className={inputClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className={labelClass}>City</label>
                                    <input id="city" type="text" name="city" required maxLength={100} autoComplete="address-level2"
                                        value={formData.city} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="postalCode" className={labelClass}>Postal code</label>
                                    <input id="postalCode" type="text" name="postalCode" required autoComplete="postal-code"
                                        pattern="^[A-Za-z0-9 \-]{3,10}$" title="3 to 10 letters or digits"
                                        value={formData.postalCode} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif font-bold text-xl text-ink uppercase tracking-widest">2. Payment</h2>
                            <div className="space-y-3" role="radiogroup" aria-label="Payment method">
                                {methods.map(method => (
                                    <label
                                        key={method.id}
                                        className={`flex items-start gap-3 border p-4 transition-colors ${!method.enabled
                                            ? 'opacity-50 cursor-not-allowed border-border-linen'
                                            : formData.paymentMethod === method.id
                                                ? 'border-ink bg-paper-dark cursor-pointer'
                                                : 'border-border-linen hover:border-ink/40 cursor-pointer'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={formData.paymentMethod === method.id}
                                            onChange={handleChange}
                                            disabled={!method.enabled}
                                            className="mt-1 accent-[#556b2f]"
                                        />
                                        <span>
                                            <span className="block font-serif font-bold text-ink">{method.label}</span>
                                            <span className="block text-sm font-serif text-ink-light mt-1">
                                                {method.enabled ? PAYMENT_HELP[method.id] : 'Not available right now.'}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {formData.paymentMethod === 'Bank' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-stone-100 p-4 border border-border-linen space-y-4"
                                >
                                    <div className="text-sm font-serif text-ink space-y-1">
                                        <p className="font-bold">Bank details</p>
                                        <p>Bank: City Bank</p>
                                        <p>Account name: Ink & Pen Bookstore</p>
                                        <p>Account number: 1234-5678-9012</p>
                                        <p>Branch: Main Street</p>
                                        <p className="pt-2">Reference: your name and phone number</p>
                                    </div>
                                    <div>
                                        <label htmlFor="slip" className={labelClass}>Upload payment slip</label>
                                        <input
                                            id="slip"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setBankSlip(e.target.files[0] || null)}
                                            required
                                            className="w-full bg-white border border-border-linen p-2 text-sm font-serif text-ink"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </section>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={submitting || !quote}
                            className="w-full bg-ink text-paper font-serif font-bold uppercase tracking-widest py-4 hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(44,44,44,0.2)] disabled:opacity-50"
                        >
                            {submitting ? 'Placing your order…' : submitLabel}
                        </motion.button>
                        <p className="text-center text-xs font-serif text-ink-light -mt-6">
                            You can cancel online until we've reviewed your order.
                        </p>
                    </form>

                    {/* Summary */}
                    <aside className="lg:col-span-2 order-first lg:order-none">
                        <div className="bg-[#e3ddd3] p-6 md:p-8 border border-border-linen shadow-md lg:sticky lg:top-28">
                            <h2 className="font-serif font-bold text-xl text-ink mb-6 uppercase tracking-widest border-b border-ink/20 pb-4">Order summary</h2>
                            <ul className="space-y-3 mb-6 text-sm font-serif text-ink/80">
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex justify-between gap-4">
                                        <span>{item.book.title} × {item.quantity}</span>
                                        <span className="whitespace-nowrap">{formatMoney(item.unitPrice * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Coupon */}
                            <div className="mb-6">
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-paper/60 border border-accent-olive/40 px-3 py-2 text-sm font-serif">
                                        <span className="text-accent-olive font-bold">{appliedCoupon}</span>
                                        <button type="button" onClick={removeCoupon} className="text-ink-light underline text-xs">Remove</button>
                                    </div>
                                ) : (
                                    <form onSubmit={applyCoupon} className="flex">
                                        <label htmlFor="coupon" className="sr-only">Discount code</label>
                                        <input
                                            id="coupon"
                                            value={couponInput}
                                            onChange={(e) => { setCouponInput(e.target.value); setCouponMessage(null); }}
                                            placeholder="Discount code"
                                            className="flex-1 min-w-0 bg-paper border border-border-linen px-3 py-2 text-sm font-serif uppercase focus:outline-none focus:border-accent-olive"
                                        />
                                        <button type="submit" className="px-4 bg-ink text-paper text-xs font-bold uppercase tracking-widest">Apply</button>
                                    </form>
                                )}
                                {couponMessage && (
                                    <p className={`mt-2 text-xs font-serif ${couponMessage.type === 'error' ? 'text-red-700' : 'text-accent-olive'}`}>
                                        {couponMessage.text}
                                    </p>
                                )}
                            </div>

                            {quote ? (
                                <dl className="space-y-2 text-sm font-serif text-ink">
                                    <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(quote.subtotal)}</dd></div>
                                    {quote.discountAmount > 0 && (
                                        <div className="flex justify-between text-accent-olive"><dt>Discount ({quote.couponCode})</dt><dd>−{formatMoney(quote.discountAmount)}</dd></div>
                                    )}
                                    <div className="flex justify-between"><dt>Shipping</dt><dd>{quote.shippingFee > 0 ? formatMoney(quote.shippingFee) : 'Free'}</dd></div>
                                    <div className="pt-3 mt-2 border-t border-ink/20 flex justify-between font-bold text-lg"><dt>Total</dt><dd>{formatMoney(quote.total)}</dd></div>
                                </dl>
                            ) : (
                                <p className="text-sm font-serif italic text-ink-light">Calculating total…</p>
                            )}
                            {quote?.amountToFreeShipping > 0 && (
                                <p className="mt-4 text-xs font-serif text-ink-light">
                                    Add {formatMoney(quote.amountToFreeShipping)} more for free shipping.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
