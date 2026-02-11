import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [booksRes, ordersRes] = await Promise.all([
                api.get('/books'),
                api.get('/admin/orders').catch(() => ({ data: [] })) // Fail gracefully if not admin or error
            ]);
            setBooks(booksRes.data);
            setOrders(ordersRes.data || []);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteBook = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await api.delete(`/books/${id}`);
                setBooks(books.filter(book => book.id !== id));
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Failed to delete book");
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/orders/${id}/approve`);
            fetchData();
        } catch (error) {
            alert("Failed to approve order: " + (error.response?.data || error.message));
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await api.put(`/admin/orders/${id}/reject`, { reason });
            fetchData();
        } catch (error) {
            alert("Failed to reject order: " + (error.response?.data || error.message));
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/admin/orders/${id}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            alert("Failed to update status: " + (error.response?.data || error.message));
        }
    };

    if (loading) return <div className="p-12 font-serif text-center text-ink italic">Opening Ledger...</div>;

    return (
        <div className="container mx-auto px-4 py-12 bg-paper min-h-screen">
            <div className="flex justify-between items-center mb-10 border-b-4 border-double border-ink pb-4">
                <h1 className="text-4xl font-serif font-bold text-ink">Admin Dashboard</h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-ink/20">
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-6 py-3 font-serif font-bold uppercase tracking-widest text-sm transition-colors ${activeTab === 'inventory'
                        ? 'bg-ink text-paper'
                        : 'text-ink hover:bg-ink/5'
                        }`}
                >
                    Inventory Ledger
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-3 font-serif font-bold uppercase tracking-widest text-sm transition-colors ${activeTab === 'orders'
                        ? 'bg-ink text-paper'
                        : 'text-ink hover:bg-ink/5'
                        }`}
                >
                    Order Manifest
                </button>
            </div>

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <Link to="/add" className="bg-ink text-paper px-6 py-3 font-serif uppercase tracking-widest text-xs font-bold hover:bg-accent-olive transition-colors border border-ink">
                            + New Entry
                        </Link>
                    </div>
                    <div className="bg-paper border border-ink rounded-sm overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                        <table className="min-w-full divide-y divide-ink/20">
                            <thead className="bg-paper-dark">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Author</th>
                                    <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Stock</th>
                                    <th className="px-6 py-4 text-right text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-paper divide-y divide-ink/10">
                                {books.map(book => (
                                    <tr key={book.id} className="hover:bg-paper-dark transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink-light">{book.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-serif font-bold text-ink">{book.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink italic">{book.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink">${book.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink-light">{book.stockQuantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/edit/${book.id}`} className="text-accent-olive hover:text-ink mr-4 font-serif italic border-b border-transparent hover:border-ink transition-all">Edit</Link>
                                            <button onClick={() => handleDeleteBook(book.id)} className="text-accent-leather hover:text-red-800 font-serif italic border-b border-transparent hover:border-red-800 transition-all">Strike</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="bg-paper border border-ink rounded-sm overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                    <table className="min-w-full divide-y divide-ink/20">
                        <thead className="bg-paper-dark">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Order #</th>
                                <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">User</th>
                                <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Items</th>
                                <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Controls</th>
                            </tr>
                        </thead>
                        <tbody className="bg-paper divide-y divide-ink/10">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-paper-dark transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink-light">#{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink">
                                        <div className="font-bold">{order.deliveryDetails.fullName}</div>
                                        <div className="text-xs text-ink-light">{order.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-serif text-ink">
                                        <ul className="list-disc list-inside">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="truncate max-w-[200px]">{item.book?.title} (x{item.quantity})</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-serif font-bold text-ink">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-serif font-bold uppercase tracking-widest rounded-full border ${order.orderStatus === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                            order.orderStatus === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                order.orderStatus === 'PendingApproval' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                    'bg-blue-100 text-blue-800 border-blue-200'
                                            }`}>
                                            {order.orderStatus}
                                        </span>
                                        {order.rejectionReason && (
                                            <div className="text-xs text-red-600 mt-1 italic max-w-[150px] truncate" title={order.rejectionReason}>
                                                "{order.rejectionReason}"
                                            </div>
                                        )}
                                        {order.deliveryDetails?.paymentSlipPath && (
                                            <a href={`http://localhost:5000${order.deliveryDetails.paymentSlipPath}`} target="_blank" rel="noopener noreferrer" className="inline-block text-center ml-2 mt-2 px-3 py-1 bg-ink text-paper text-xs font-serif font-bold uppercase tracking-widest hover:bg-accent-olive transition-colors no-underline border border-transparent hover:border-ink rounded-full">
                                                View Slip
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {order.orderStatus === 'PendingApproval' && (
                                            <>
                                                <button onClick={() => handleApprove(order.id)} className="text-green-700 hover:text-green-900 font-serif font-bold border-b border-transparent hover:border-green-900 transition-all">Approve</button>
                                                <button onClick={() => handleReject(order.id)} className="text-red-700 hover:text-red-900 font-serif font-bold border-b border-transparent hover:border-red-900 transition-all">Reject</button>
                                            </>
                                        )}
                                        {['Approved', 'Processing', 'Shipped', 'OutForDelivery'].includes(order.orderStatus) && (
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className="text-xs font-serif p-1 border border-ink/20 bg-paper focus:outline-none focus:border-accent-olive"
                                            >
                                                <option disabled>Current: {order.orderStatus}</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="OutForDelivery">Out For Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;
