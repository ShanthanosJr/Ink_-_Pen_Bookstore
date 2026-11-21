import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';
import { formatDate, formatMoney } from '../constants/orders';
import { PaymentBadge, StatusBadge } from '../components/orders/OrderParts';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
            setEmail(user.email);
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            await updateProfile({ fullName, email });
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Failed to update profile.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 h-fit"
                >
                    <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
                        <div className="h-20 w-20 rounded-full bg-[#e3ddd3] flex items-center justify-center text-[#723a13] text-3xl font-serif">
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-gray-900">{user?.fullName}</h1>
                            <p className="text-gray-500 text-xs uppercase tracking-widest">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-[#723a13] focus:border-[#723a13] block w-full p-3 transition-colors font-serif"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                disabled
                                className="bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-sm block w-full p-3 cursor-not-allowed font-serif"
                                value={email}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`block w-full text-center bg-ink text-white font-serif font-bold uppercase tracking-widest py-4 hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(85,107,47,0.2)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Order History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
                >
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">My Orders</h2>

                    {loadingOrders ? (
                        <p className="text-center italic text-gray-500 font-serif animate-pulse">Retrieving archives...</p>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="text-4xl opacity-20 block mb-2">📭</span>
                            <p className="text-gray-500 font-serif italic">No past orders found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const itemCount = order.items.reduce((n, item) => n + item.quantity, 0);
                                const needsPayment = order.orderStatus === 'AwaitingPayment';
                                return (
                                    <Link
                                        key={order.id}
                                        to={`/orders/${order.id}`}
                                        className={`block border rounded-sm p-5 transition-all shadow-sm hover:shadow-md hover:border-accent-olive/50 ${needsPayment ? 'border-orange-300 bg-orange-50/40' : 'border-gray-100 bg-white'}`}
                                    >
                                        <div className="flex justify-between items-start gap-3 mb-3">
                                            <div>
                                                <span className="text-sm font-bold uppercase tracking-widest text-ink block">Order #{order.id}</span>
                                                <span className="text-xs text-ink-light font-serif">Placed {formatDate(order.createdAt)}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <StatusBadge status={order.orderStatus} />
                                                {order.paymentStatus !== 'Unpaid' && <PaymentBadge status={order.paymentStatus} />}
                                            </div>
                                        </div>
                                        <p className="text-sm font-serif text-ink truncate">
                                            {order.items.map(item => item.book?.title || 'Unknown book').join(', ')}
                                        </p>
                                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                                            <span className="text-xs text-ink-light font-serif">{itemCount} {itemCount === 1 ? 'book' : 'books'} · {formatMoney(order.totalAmount)}</span>
                                            <span className="text-xs font-bold uppercase tracking-widest text-accent-olive">
                                                {needsPayment ? 'Complete payment →' : 'Track order →'}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
