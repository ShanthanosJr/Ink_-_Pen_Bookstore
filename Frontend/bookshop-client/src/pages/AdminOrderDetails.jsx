import { usePageTitle } from '../hooks/usePageTitle';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { errorMessage, formatDateTime, statusLabel } from '../constants/orders';
import {
    DeliveryAndPayment, ItemsList, Panel, PaymentBadge, ProgressTracker, StatusBadge, Timeline, Totals, TrackingInfo
} from '../components/orders/OrderParts';

// What an admin can move an order to from each state (mirrors the API rules)
const NEXT_STATUSES = {
    Approved: ['Processing', 'Shipped', 'Cancelled'],
    Processing: ['Shipped', 'Cancelled'],
    Shipped: ['OutForDelivery', 'Delivered', 'Cancelled'],
    OutForDelivery: ['Delivered', 'Cancelled'],
};

const inputClass = 'w-full bg-paper border border-border-linen px-3 py-2 font-serif text-sm text-ink focus:outline-none focus:border-accent-olive';
const labelClass = 'block text-[11px] font-bold uppercase tracking-widest text-ink-light mb-1';
const primaryBtn = 'px-5 py-2 bg-ink text-paper font-serif font-bold uppercase tracking-widest text-xs hover:bg-accent-olive disabled:opacity-50';
const secondaryBtn = 'px-5 py-2 border border-ink text-ink font-serif font-bold uppercase tracking-widest text-xs hover:bg-ink/5 disabled:opacity-50';
const dangerBtn = 'px-5 py-2 border border-red-800 text-red-800 font-serif font-bold uppercase tracking-widest text-xs hover:bg-red-50 disabled:opacity-50';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [statusForm, setStatusForm] = useState({ status: '', courier: '', trackingNumber: '', note: '' });
    usePageTitle(`Admin · Order #${id}`);

    const load = useCallback(async () => {
        try {
            const res = await api.get(`/admin/orders/${id}`);
            setOrder(res.data);
            setStatusForm(f => ({ ...f, status: '', note: '', courier: res.data.courier || '', trackingNumber: res.data.trackingNumber || '' }));
        } catch (err) {
            setError(errorMessage(err, 'Could not load this order.'));
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const run = async (request, successMessage) => {
        setBusy(true);
        try {
            await request();
            showToast(successMessage, 'success');
            setRejecting(false);
            setRejectReason('');
            await load();
        } catch (err) {
            showToast(errorMessage(err), 'error');
        } finally {
            setBusy(false);
        }
    };

    if (error) return <div className="container mx-auto px-4 py-12 font-serif text-red-800">{error}</div>;
    if (!order) return <div className="min-h-[60vh] flex items-center justify-center font-serif italic text-ink-light animate-pulse">Loading order…</div>;

    const method = order.deliveryDetails?.paymentMethod;
    const isPending = order.orderStatus === 'PendingApproval';
    const canReject = isPending || order.orderStatus === 'AwaitingPayment';
    const nextStatuses = NEXT_STATUSES[order.orderStatus] || [];
    const payHereUnpaid = method === 'PayHere' && order.paymentStatus !== 'Paid';

    const submitStatus = (e) => {
        e.preventDefault();
        if (!statusForm.status) return;
        if (statusForm.status === 'Cancelled' && !window.confirm(
            `Cancel order #${order.id}? Stock will be returned${order.paymentStatus === 'Paid' ? ' and the order will be marked for refund' : ''}.`)) return;
        run(() => api.put(`/admin/orders/${order.id}/status`, statusForm), `Order moved to ${statusLabel(statusForm.status)}.`);
    };

    return (
        <div className="bg-paper-dark min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-6xl space-y-6">
                <Link to="/admin?tab=orders" className="inline-block font-serif text-sm text-ink-light hover:text-accent-olive">← All orders</Link>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-4 border-double border-ink pb-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">Order #{order.id}</h1>
                        <p className="font-serif text-sm text-ink-light mt-1">
                            {order.customer?.fullName} · <a href={`mailto:${order.customer?.email}`} className="underline">{order.customer?.email}</a> · placed {formatDateTime(order.createdAt)}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <StatusBadge status={order.orderStatus} />
                        <PaymentBadge status={order.paymentStatus} />
                    </div>
                </div>

                {/* Actions for the current state */}
                <Panel title="Next step">
                    {isPending && (
                        <div className="space-y-4">
                            {method === 'Bank' && (
                                <p className="font-serif text-sm text-ink">
                                    Check the uploaded bank slip (under Delivery & payment) against your account before approving. Approving marks the order as paid.
                                </p>
                            )}
                            {method === 'COD' && <p className="font-serif text-sm text-ink">Cash on delivery: payment is collected when the order is delivered.</p>}
                            {method === 'PayHere' && order.paymentStatus === 'Paid' && <p className="font-serif text-sm text-ink">Paid online through PayHere (ref {order.paymentReference}).</p>}
                            <div className="flex flex-wrap gap-3">
                                <button className={primaryBtn} disabled={busy || payHereUnpaid}
                                    onClick={() => run(() => api.put(`/admin/orders/${order.id}/approve`), 'Order approved.')}>
                                    {method === 'Bank' ? 'Slip verified: approve' : 'Approve order'}
                                </button>
                                <button className={dangerBtn} disabled={busy} onClick={() => setRejecting(r => !r)}>Reject…</button>
                            </div>
                        </div>
                    )}

                    {order.orderStatus === 'AwaitingPayment' && (
                        <div className="space-y-3">
                            <p className="font-serif text-sm text-ink">The customer hasn't completed the PayHere payment yet. It will move to review automatically once PayHere confirms it.</p>
                            <button className={dangerBtn} disabled={busy} onClick={() => setRejecting(r => !r)}>Reject / release stock…</button>
                        </div>
                    )}

                    {canReject && rejecting && (
                        <form
                            className="mt-4 space-y-3 border-t border-border-linen pt-4"
                            onSubmit={(e) => { e.preventDefault(); run(() => api.put(`/admin/orders/${order.id}/reject`, { reason: rejectReason }), 'Order rejected. Stock returned.'); }}
                        >
                            <label htmlFor="reject-reason" className={labelClass}>Reason (shown to the customer)</label>
                            <textarea id="reject-reason" required rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                                className={inputClass} placeholder="e.g. The bank slip amount doesn't match the order total." />
                            <div className="flex gap-3">
                                <button type="submit" className={dangerBtn} disabled={busy || !rejectReason.trim()}>Reject order</button>
                                <button type="button" className={secondaryBtn} onClick={() => setRejecting(false)}>Keep order</button>
                            </div>
                        </form>
                    )}

                    {nextStatuses.length > 0 && (
                        <form onSubmit={submitStatus} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div>
                                <label htmlFor="next-status" className={labelClass}>Move to</label>
                                <select id="next-status" required value={statusForm.status}
                                    onChange={(e) => setStatusForm(f => ({ ...f, status: e.target.value }))} className={inputClass}>
                                    <option value="">Choose…</option>
                                    {nextStatuses.map(s => <option key={s} value={s}>{s === 'Cancelled' ? 'Cancel order' : statusLabel(s)}</option>)}
                                </select>
                            </div>
                            {['Shipped', 'OutForDelivery'].includes(statusForm.status) && (
                                <>
                                    <div>
                                        <label htmlFor="courier" className={labelClass}>Courier</label>
                                        <input id="courier" value={statusForm.courier} onChange={(e) => setStatusForm(f => ({ ...f, courier: e.target.value }))}
                                            className={inputClass} placeholder="e.g. Pronto, Domex" />
                                    </div>
                                    <div>
                                        <label htmlFor="tracking" className={labelClass}>Tracking number</label>
                                        <input id="tracking" value={statusForm.trackingNumber} onChange={(e) => setStatusForm(f => ({ ...f, trackingNumber: e.target.value }))}
                                            className={inputClass} />
                                    </div>
                                </>
                            )}
                            <div className={['Shipped', 'OutForDelivery'].includes(statusForm.status) ? '' : 'lg:col-span-2'}>
                                <label htmlFor="status-note" className={labelClass}>Note for the customer (optional)</label>
                                <input id="status-note" value={statusForm.note} onChange={(e) => setStatusForm(f => ({ ...f, note: e.target.value }))} className={inputClass} />
                            </div>
                            <button type="submit" className={`${statusForm.status === 'Cancelled' ? dangerBtn : primaryBtn} h-[38px]`} disabled={busy || !statusForm.status}>
                                Update
                            </button>
                        </form>
                    )}

                    {/* Payment bookkeeping */}
                    {(order.paymentStatus === 'RefundDue' || (method !== 'PayHere' && order.paymentStatus === 'Unpaid' && !['Cancelled', 'Rejected', 'PendingApproval'].includes(order.orderStatus))) && (
                        <div className="mt-4 pt-4 border-t border-border-linen flex flex-wrap items-center gap-3">
                            {order.paymentStatus === 'RefundDue' && (
                                <>
                                    <p className="font-serif text-sm text-red-800 flex-1">A refund is due for this order. Refund it{method === 'PayHere' ? ' in the PayHere merchant portal' : ''}, then record it here.</p>
                                    <button className={secondaryBtn} disabled={busy}
                                        onClick={() => run(() => api.put(`/admin/orders/${order.id}/payment`, { status: 'Refunded' }), 'Refund recorded.')}>
                                        Mark refunded
                                    </button>
                                </>
                            )}
                            {order.paymentStatus === 'Unpaid' && (
                                <>
                                    <p className="font-serif text-sm text-ink flex-1">Payment not recorded yet.</p>
                                    <button className={secondaryBtn} disabled={busy}
                                        onClick={() => run(() => api.put(`/admin/orders/${order.id}/payment`, { status: 'Paid' }), 'Payment recorded.')}>
                                        Mark paid
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {!isPending && order.orderStatus !== 'AwaitingPayment' && nextStatuses.length === 0 && order.paymentStatus !== 'RefundDue' && (
                        <p className="font-serif text-sm text-ink-light">This order is {statusLabel(order.orderStatus).toLowerCase()}. Nothing left to do.</p>
                    )}
                </Panel>

                <Panel title="Progress">
                    <div className="space-y-4">
                        <ProgressTracker order={order} />
                        <TrackingInfo order={order} />
                        {order.rejectionReason && <p className="font-serif text-sm text-red-800">Rejected: “{order.rejectionReason}”</p>}
                    </div>
                </Panel>

                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Panel title="Books">
                            <ItemsList items={order.items} />
                            <div className="mt-4 pt-4 border-t border-border-linen"><Totals order={order} /></div>
                        </Panel>
                        <Panel title="Delivery & payment">
                            <DeliveryAndPayment order={order} />
                        </Panel>
                    </div>
                    <div className="lg:col-span-2">
                        <Panel title="History">
                            <Timeline history={order.statusHistory} showActor />
                        </Panel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
