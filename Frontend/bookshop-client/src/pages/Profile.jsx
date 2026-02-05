import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../api';

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
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order History</h2>

                    {loadingOrders ? (
                        <p className="text-center italic text-gray-500 font-serif animate-pulse">Retrieving archives...</p>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="text-4xl opacity-20 block mb-2">📭</span>
                            <p className="text-gray-500 font-serif italic">No past orders found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-gray-100 rounded-sm p-4 hover:border-[#723a13]/30 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-[#723a13] block">Order #{order.id}</span>
                                            <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-sm ${order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4 border-t border-dashed border-gray-200 pt-3">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm font-serif">
                                                <span className="text-gray-800">{item.book ? item.book.title : 'Unknown Volume'} (x{item.quantity})</span>
                                                <span className="text-gray-600">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total</span>
                                        <span className="font-serif font-bold text-lg text-[#723a13]">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
