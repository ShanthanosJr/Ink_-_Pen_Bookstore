import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api';
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, errorMessage, formatDateTime, formatMoney } from '../../constants/orders';
import { PaymentBadge, StatusBadge } from '../orders/OrderParts';

const PAGE_SIZE = 15;

// Download the currently filtered orders as a spreadsheet-friendly CSV file
const exportCsv = (orders) => {
    const header = ['Order', 'Placed', 'Status', 'Payment status', 'Payment method', 'Customer', 'Email', 'Phone',
        'City', 'Items', 'Subtotal', 'Discount', 'Coupon', 'Shipping', 'Total', 'Courier', 'Tracking'];
    const cell = (v) => {
        const s = v === null || v === undefined ? '' : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = orders.map(o => [
        o.id, new Date(o.createdAt).toISOString(), o.orderStatus, o.paymentStatus, o.deliveryDetails?.paymentMethod,
        o.deliveryDetails?.fullName || o.customer?.fullName, o.customer?.email, o.deliveryDetails?.phoneNumber,
        o.deliveryDetails?.city, o.items.map(i => `${i.book?.title || i.bookId} x${i.quantity}`).join('; '),
        o.subtotal, o.discountAmount, o.couponCode, o.shippingFee, o.totalAmount, o.courier, o.trackingNumber
    ]);
    const csv = [header, ...rows].map(r => r.map(cell).join(',')).join('\r\n');
    // BOM so Excel opens UTF-8 names correctly
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

// Status filter options; "ToShip" groups the two states that still need shipping
const STATUS_FILTERS = [
    { value: '', label: 'All statuses' },
    { value: 'ToShip', label: 'Ready to ship (Approved + Processing)' },
    ...Object.entries(ORDER_STATUS).map(([value, { label }]) => ({ value, label })),
];

const selectClass = 'bg-paper border border-border-linen px-3 py-2 font-serif text-sm text-ink focus:outline-none focus:border-accent-olive';

const OrdersTable = () => {
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState('');
    const [params, setParams] = useSearchParams();

    // Filters live in the URL so dashboard cards can link here and the back button works
    const q = params.get('q') || '';
    const status = params.get('status') || '';
    const payment = params.get('payment') || '';
    const method = params.get('method') || '';
    const page = Math.max(1, Number(params.get('page')) || 1);

    const setFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value); else next.delete(key);
        if (key !== 'page') next.delete('page');
        setParams(next, { replace: true });
    };

    useEffect(() => {
        api.get('/admin/orders')
            .then(res => setOrders(res.data))
            .catch(err => setError(errorMessage(err, 'Could not load orders.')));
    }, []);

    const filtered = useMemo(() => {
        if (!orders) return [];
        const term = q.trim().toLowerCase();
        return orders.filter(o => {
            if (status === 'ToShip' ? !['Approved', 'Processing'].includes(o.orderStatus) : status && o.orderStatus !== status) return false;
            if (payment && o.paymentStatus !== payment) return false;
            if (method && o.deliveryDetails?.paymentMethod !== method) return false;
            if (!term) return true;
            return [
                `#${o.id}`, String(o.id), o.customer?.fullName, o.customer?.email,
                o.deliveryDetails?.fullName, o.deliveryDetails?.phoneNumber, o.trackingNumber
            ].some(v => v && v.toLowerCase().includes(term));
        });
    }, [orders, q, status, payment, method]);

    if (error) return <p className="font-serif text-red-800">{error}</p>;
    if (!orders) return <p className="font-serif italic text-ink-light animate-pulse">Opening the order book…</p>;

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const hasFilters = q || status || payment || method;

    return (
        <div className="space-y-4">
            {/* Filters, one row */}
            <div className="flex flex-wrap gap-3 items-center">
                <label className="sr-only" htmlFor="order-search">Search orders</label>
                <input
                    id="order-search"
                    type="search"
                    value={q}
                    onChange={(e) => setFilter('q', e.target.value)}
                    placeholder="Search # , name, email, phone, tracking"
                    className={`${selectClass} flex-1 min-w-56`}
                />
                <select aria-label="Order status" value={status} onChange={(e) => setFilter('status', e.target.value)} className={selectClass}>
                    {STATUS_FILTERS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select aria-label="Payment status" value={payment} onChange={(e) => setFilter('payment', e.target.value)} className={selectClass}>
                    <option value="">Any payment status</option>
                    {Object.entries(PAYMENT_STATUS).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select aria-label="Payment method" value={method} onChange={(e) => setFilter('method', e.target.value)} className={selectClass}>
                    <option value="">Any method</option>
                    {Object.entries(PAYMENT_METHOD).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                {hasFilters && (
                    <button onClick={() => setParams({ tab: 'orders' }, { replace: true })} className="text-sm font-serif underline text-ink-light hover:text-ink">
                        Clear filters
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between gap-3">
                <p className="font-serif text-sm text-ink-light">{filtered.length} {filtered.length === 1 ? 'order' : 'orders'}</p>
                <button
                    onClick={() => exportCsv(filtered)}
                    disabled={filtered.length === 0}
                    className="px-4 py-2 border border-ink font-serif text-xs uppercase tracking-widest font-bold hover:bg-ink hover:text-paper disabled:opacity-40"
                >
                    Export CSV
                </button>
            </div>

            <div className="bg-paper border border-ink overflow-x-auto shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <table className="min-w-full divide-y divide-ink/20">
                    <thead className="bg-paper-dark">
                        <tr className="text-left text-xs font-serif font-bold text-ink uppercase tracking-widest">
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Placed</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3"><span className="sr-only">Open</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {visible.length === 0 && (
                            <tr><td colSpan={7} className="px-4 py-10 text-center font-serif italic text-ink-light">No orders match these filters.</td></tr>
                        )}
                        {visible.map(o => (
                            <tr key={o.id} className="hover:bg-paper-dark transition-colors">
                                <td className="px-4 py-3 font-serif font-bold text-ink whitespace-nowrap">#{o.id}</td>
                                <td className="px-4 py-3 font-serif text-sm">
                                    <div className="text-ink">{o.deliveryDetails?.fullName || o.customer?.fullName}</div>
                                    <div className="text-xs text-ink-light">{o.customer?.email}</div>
                                </td>
                                <td className="px-4 py-3 text-xs font-serif text-ink-light whitespace-nowrap">{formatDateTime(o.createdAt)}</td>
                                <td className="px-4 py-3"><StatusBadge status={o.orderStatus} /></td>
                                <td className="px-4 py-3">
                                    <PaymentBadge status={o.paymentStatus} />
                                    <div className="text-[11px] text-ink-light mt-1">{PAYMENT_METHOD[o.deliveryDetails?.paymentMethod] || o.deliveryDetails?.paymentMethod}</div>
                                </td>
                                <td className="px-4 py-3 font-serif font-bold text-ink text-right whitespace-nowrap">{formatMoney(o.totalAmount)}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link to={`/admin/orders/${o.id}`} className="text-sm font-serif font-bold text-accent-olive hover:text-ink whitespace-nowrap">
                                        {o.orderStatus === 'PendingApproval' ? 'Review →' : 'Open →'}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pageCount > 1 && (
                <nav className="flex items-center justify-center gap-4 font-serif text-sm" aria-label="Pagination">
                    <button disabled={currentPage <= 1} onClick={() => setFilter('page', String(currentPage - 1))} className="px-3 py-1 border border-border-linen disabled:opacity-40">← Previous</button>
                    <span className="text-ink-light">Page {currentPage} of {pageCount}</span>
                    <button disabled={currentPage >= pageCount} onClick={() => setFilter('page', String(currentPage + 1))} className="px-3 py-1 border border-border-linen disabled:opacity-40">Next →</button>
                </nav>
            )}
        </div>
    );
};

export default OrdersTable;
