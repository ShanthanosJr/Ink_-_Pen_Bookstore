import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { errorMessage } from '../constants/orders';
import OrderCard from '../components/orders/OrderCard';

const PAGE_SIZE = 10;

const GROUPS = [
    { id: 'all', label: 'All', match: () => true },
    { id: 'action', label: 'Needs payment', match: (o) => o.orderStatus === 'AwaitingPayment' },
    { id: 'active', label: 'In progress', match: (o) => ['PendingApproval', 'Approved', 'Processing', 'Shipped', 'OutForDelivery'].includes(o.orderStatus) },
    { id: 'delivered', label: 'Delivered', match: (o) => o.orderStatus === 'Delivered' },
    { id: 'closed', label: 'Cancelled / rejected', match: (o) => ['Cancelled', 'Rejected'].includes(o.orderStatus) },
];

const MyOrders = () => {
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState('');
    const [params, setParams] = useSearchParams();
    const group = GROUPS.find(g => g.id === params.get('show')) || GROUPS[0];
    const page = Math.max(1, Number(params.get('page')) || 1);

    const fetchOrders = () => api.get('/orders')
        .then(res => setOrders(res.data))
        .catch(err => setError(errorMessage(err, 'Could not load your orders.')));

    useEffect(() => { fetchOrders(); }, []);

    const load = () => {
        setError('');
        setOrders(null);
        fetchOrders();
    };

    const filtered = useMemo(() => (orders || []).filter(group.match), [orders, group]);
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, pageCount);
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    const go = (changes) => {
        const next = new URLSearchParams(params);
        Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
        setParams(next, { replace: true });
    };

    return (
        <div className="bg-paper min-h-[70vh] py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6 border-b border-ink pb-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">My orders</h1>
                    <Link to="/profile" className="font-serif text-sm text-ink-light underline hover:text-ink">Account settings</Link>
                </div>

                {error ? (
                    <div className="text-center py-12">
                        <p className="font-serif text-ink mb-4">{error}</p>
                        <button onClick={load} className="px-6 py-3 bg-ink text-paper font-serif uppercase tracking-widest text-xs font-bold">Try again</button>
                    </div>
                ) : orders === null ? (
                    <div className="space-y-4" aria-busy="true">
                        {[0, 1, 2].map(i => <div key={i} className="h-36 bg-border-linen/40 animate-pulse" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="font-serif italic text-ink-light mb-6">You haven't placed any orders yet.</p>
                        <Link to="/shop" className="px-8 py-3 bg-ink text-paper font-serif font-bold uppercase tracking-widest text-xs">Browse the collection</Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter orders">
                            {GROUPS.map(g => {
                                const count = orders.filter(g.match).length;
                                if (g.id !== 'all' && count === 0) return null;
                                return (
                                    <button
                                        key={g.id}
                                        role="tab"
                                        aria-selected={group.id === g.id}
                                        onClick={() => go({ show: g.id === 'all' ? null : g.id, page: null })}
                                        className={`px-4 py-2 border font-serif text-sm ${group.id === g.id ? 'bg-ink text-paper border-ink' : 'border-border-linen text-ink hover:border-ink'}`}
                                    >
                                        {g.label} ({count})
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-4">
                            {visible.map(order => <OrderCard key={order.id} order={order} />)}
                        </div>

                        {pageCount > 1 && (
                            <nav className="flex items-center justify-center gap-4 font-serif text-sm mt-8" aria-label="Pagination">
                                <button disabled={current <= 1} onClick={() => go({ page: String(current - 1) })} className="px-3 py-1 border border-border-linen disabled:opacity-40">← Newer</button>
                                <span className="text-ink-light">Page {current} of {pageCount}</span>
                                <button disabled={current >= pageCount} onClick={() => go({ page: String(current + 1) })} className="px-3 py-1 border border-border-linen disabled:opacity-40">Older →</button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
