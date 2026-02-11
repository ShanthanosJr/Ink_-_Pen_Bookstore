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
                                <motion.div
                                    key={order.id}
                                    whileHover={{ scale: 1.01 }}
                                    className={`relative border rounded-sm p-6 transition-all shadow-sm ${order.orderStatus === 'Rejected' ? 'border-red-200 bg-red-50/30' :
                                        order.orderStatus === 'Approved' ? 'border-green-200 bg-green-50/30' :
                                            'border-gray-100 bg-white'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-sm font-bold uppercase tracking-widest text-ink block mb-1">Order #{order.id}</span>
                                            <span className="text-xs text-ink-light font-serif">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                                            {order.lastUpdated && order.orderStatus !== 'PendingApproval' && (
                                                <span className="text-xs text-ink-light font-serif block mt-1">Updated {new Date(order.lastUpdated).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-3 py-1 text-[11px] uppercase font-bold tracking-widest rounded-full border ${order.orderStatus === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                order.orderStatus === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                    order.orderStatus === 'PendingApproval' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                        order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                            order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                                order.orderStatus === 'OutForDelivery' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                                                                    'bg-gray-100 text-gray-800 border-gray-200'
                                                }`}>
                                                {order.orderStatus === 'PendingApproval' ? 'Pending Review' :
                                                    order.orderStatus === 'OutForDelivery' ? 'Out For Delivery' :
                                                        order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rejection Reason */}
                                    {order.orderStatus === 'Rejected' && order.rejectionReason && (
                                        <div className="mb-4 bg-red-100 border-l-4 border-red-500 p-3">
                                            <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Reason for Rejection</p>
                                            <p className="text-sm font-serif text-red-900 italic">"{order.rejectionReason}"</p>
                                        </div>
                                    )}

                                    {/* Timeline Visualization (Simple) */}
                                    {!['Rejected', 'Cancelled', 'PendingApproval'].includes(order.orderStatus) && (
                                        <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                            <span className={['Approved', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered'].includes(order.orderStatus) ? 'text-green-600' : ''}>Approved</span>
                                            <span>&rarr;</span>
                                            <span className={['Processing', 'Shipped', 'OutForDelivery', 'Delivered'].includes(order.orderStatus) ? 'text-green-600' : ''}>Processing</span>
                                            <span>&rarr;</span>
                                            <span className={['Shipped', 'OutForDelivery', 'Delivered'].includes(order.orderStatus) ? 'text-green-600' : ''}>Shipped</span>
                                            <span>&rarr;</span>
                                            <span className={order.orderStatus === 'Delivered' ? 'text-green-600' : ''}>Delivered</span>
                                        </div>
                                    )}

                                    <div className="space-y-2 mb-4 border-t border-dashed border-gray-200 pt-3">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm font-serif">
                                                <span className="text-ink">{item.book ? item.book.title : 'Unknown Volume'} (x{item.quantity})</span>
                                                <span className="text-ink-light">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className="text-xs text-ink-light font-bold uppercase tracking-widest">Total</span>
                                        <span className="font-serif font-bold text-lg text-accent-olive">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
