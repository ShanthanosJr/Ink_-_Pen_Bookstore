import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Cart = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart, loading } = useCart();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-paper">
            <div className="font-serif italic text-ink text-xl animate-pulse">Consulting the ledger...</div>
        </div>
    );

    if (cartItems.length === 0) return (
        <div className="min-h-screen bg-paper py-20 px-4 flex flex-col items-center justify-center">
            <div className="text-6xl mb-6 opacity-20">🕮</div>
            <h2 className="text-2xl font-serif font-bold text-ink mb-2">Your Satchel is Empty</h2>
            <p className="text-ink-light font-serif italic mb-8">Perhaps a visit to the shelves is in order?</p>
            <Link to="/shop" className="px-8 py-3 bg-ink text-paper font-serif font-bold uppercase tracking-widest hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(44,44,44,0.2)]">
                Browse Collection
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-paper py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-4xl font-serif font-bold text-ink mb-12 border-b border-ink pb-4 flex items-baseline justify-between">
                    <span>Your Selection</span>
                    <span className="text-lg font-normal italic text-ink-light">{cartItems.length} Volumes</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-8">
                        {cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-6 border-b border-border-linen pb-8 last:border-0"
                            >
                                <div className="w-24 h-32 bg-[#e3ddd3] flex-shrink-0 border border-border-linen shadow-sm relative overflow-hidden">
                                    {item.book.imageUrl ? (
                                        <img src={item.book.imageUrl} alt={item.book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="flex items-center justify-center h-full text-2xl text-ink/20">❦</span>
                                    )}
                                </div>

                                <div className="flex-grow flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-serif font-bold text-xl text-ink">{item.book.title}</h3>
                                            <span className="font-serif font-bold text-ink">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <p className="text-ink-light font-serif italic text-sm mb-4">by {item.book.author}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-border-linen bg-white">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 text-ink hover:bg-gray-100 transition disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 font-mono text-sm border-x border-border-linen w-10 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 text-ink hover:bg-gray-100 transition disabled:opacity-50"
                                                disabled={item.quantity >= item.book.stockQuantity}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-red-800 hover:text-red-900 font-bold uppercase tracking-widest border-b border-red-800/20 hover:border-red-800 transition-colors pb-0.5"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    {item.quantity >= item.book.stockQuantity && (
                                        <span className="text-[10px] text-red-600 mt-2 font-bold uppercase tracking-widest">Max Stock Reached</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-paper-dark p-8 border border-border-linen sticky top-24 shadow-[8px_8px_0_0_#e5e0d8]">
                            <h3 className="font-serif font-bold text-xl text-ink mb-6 uppercase tracking-widest border-b border-border-linen pb-4">Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-ink-light font-serif text-sm">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-ink-light font-serif text-sm">
                                    <span>Shipping</span>
                                    <span>calculated next step</span>
                                </div>
                                <div className="pt-4 border-t border-border-linen flex justify-between font-serif font-bold text-xl text-ink">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full text-center bg-ink text-white font-serif font-bold uppercase tracking-widest py-4 hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(85,107,47,0.2)]"
                            >
                                Proceed to Checkout
                            </Link>

                            <div className="mt-6 flex items-center gap-3 text-ink-light/70 text-[10px] uppercase tracking-widest justify-center">
                                <span>Secure Checkout</span>
                                <span>•</span>
                                <span>Fast Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
