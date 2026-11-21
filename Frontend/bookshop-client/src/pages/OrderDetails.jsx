import { usePageTitle } from '../hooks/usePageTitle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { errorMessage, formatDateTime, redirectToPayHere } from '../constants/orders';
import {
    DeliveryAndPayment, ItemsList, Panel, PaymentBadge, ProgressTracker, StatusBadge, Timeline, Totals, TrackingInfo
} from '../components/orders/OrderParts';

const Banner = ({ tone = 'info', title, children }) => {
    const tones = {
        success: 'border-accent-olive bg-[#eef2e6]',
        info: 'border-ink bg-paper-dark',
        warning: 'border-orange-600 bg-orange-50',
        error: 'border-red-700 bg-red-50',
    };
    return (
        <div className={`border-l-4 p-4 font-serif ${tones[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
            {title && <p className="font-bold text-ink">{title}</p>}
            {children && <div className="text-sm text-ink-light mt-1">{children}</div>}
        </div>
    );
};

const OrderDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [busy, setBusy] = useState(false);
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const pollRef = useRef(null);
    usePageTitle(`Order #${id}`);

    const justPlaced = searchParams.get('placed') === '1';
    const paymentReturn = searchParams.get('payment');

    const load = useCallback(async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
            return res.data;
        } catch (err) {
            if (err.response?.status === 404) setNotFound(true);
            else showToast(errorMessage(err, 'Could not load this order.'), 'error');
            return null;
        } finally {
            setLoading(false);
        }
    }, [id, showToast]);

    useEffect(() => {
        load();
    }, [load]);

    // Back from PayHere: the payment is confirmed server-to-server, which can take a few seconds. Poll briefly.
    useEffect(() => {
        if (paymentReturn !== 'return') return;
        let attempts = 0;
        setConfirmingPayment(true);
        pollRef.current = setInterval(async () => {
            attempts += 1;
            const latest = await load();
            if (!latest || latest.orderStatus !== 'AwaitingPayment' || attempts >= 10) {
                clearInterval(pollRef.current);
                setConfirmingPayment(false);
            }
        }, 3000);
        return () => clearInterval(pollRef.current);
    }, [paymentReturn, load]);

    const payNow = async () => {
        setBusy(true);
        try {
            const res = await api.post(`/orders/${id}/pay`);
            redirectToPayHere(res.data);
        } catch (err) {
            showToast(errorMessage(err), 'error');
            setBusy(false);
        }
    };

    const cancelOrder = async () => {
        const paid = order.paymentStatus === 'Paid';
        const message = paid
            ? 'Cancel this order? You have already paid, so we will refund you.'
            : 'Cancel this order?';
        if (!window.confirm(message)) return;
        setBusy(true);
        try {
            await api.post(`/orders/${id}/cancel`);
            showToast('Your order has been cancelled.', 'success');
            await load();
        } catch (err) {
            showToast(errorMessage(err), 'error');
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center bg-paper font-serif italic text-ink animate-pulse">Loading your order…</div>;
    }

    if (notFound || !order) {
        return (
            <div className="min-h-[60vh] bg-paper flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-serif font-bold text-ink mb-2">Order not found</h1>
                <p className="font-serif italic text-ink-light mb-6">We couldn't find this order on your account.</p>
                <Link to="/orders" className="px-6 py-3 bg-ink text-paper font-serif uppercase tracking-widest text-xs font-bold">My orders</Link>
            </div>
        );
    }

    const method = order.deliveryDetails?.paymentMethod;
    const awaitingPayment = order.orderStatus === 'AwaitingPayment';
    const canCancel = ['AwaitingPayment', 'PendingApproval'].includes(order.orderStatus);
    const canPay = awaitingPayment && method === 'PayHere' && order.paymentStatus !== 'Paid';

    return (
        <div className="bg-paper-dark min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-5xl space-y-6">
                <Link to="/orders" className="inline-block font-serif text-sm text-ink-light hover:text-accent-olive">← All my orders</Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-4 border-double border-ink pb-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">Order #{order.id}</h1>
                        <p className="font-serif text-sm text-ink-light mt-1">Placed {formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <StatusBadge status={order.orderStatus} />
                        <PaymentBadge status={order.paymentStatus} />
                    </div>
                </div>

                {/* Situation banners */}
                {justPlaced && !awaitingPayment && order.orderStatus === 'PendingApproval' && (
                    <Banner tone="success" title="Thank you! Your order has been placed.">
                        We'll review it shortly and update this page at every step.
                        {method === 'Bank' && ' We will check your bank slip before approving the order.'}
                        {method === 'COD' && ' Please have the cash ready when your books arrive.'}
                    </Banner>
                )}
                {confirmingPayment && awaitingPayment && (
                    <Banner tone="info" title="Confirming your payment with PayHere…">
                        This usually takes a few seconds. You can stay on this page.
                    </Banner>
                )}
                {paymentReturn === 'return' && !awaitingPayment && order.paymentStatus === 'Paid' && order.orderStatus === 'PendingApproval' && (
                    <Banner tone="success" title="Payment received. Thank you!">
                        Your order is now waiting for our review.
                    </Banner>
                )}
                {awaitingPayment && !confirmingPayment && (
                    <Banner tone="warning" title={paymentReturn === 'cancelled' ? 'Payment was cancelled' : order.paymentStatus === 'Failed' ? 'Payment failed' : 'Waiting for payment'}>
                        Your books are reserved. Complete the payment to send the order for review, or cancel it.
                        {paymentReturn === 'return' && ' If you already paid, the confirmation may still be on its way. Refresh in a minute.'}
                    </Banner>
                )}
                {order.orderStatus === 'Rejected' && (
                    <Banner tone="error" title="This order was not accepted">
                        {order.rejectionReason && <>Reason: “{order.rejectionReason}”. </>}
                        {['RefundDue', 'Refunded'].includes(order.paymentStatus) && 'Your payment will be refunded.'}
                    </Banner>
                )}
                {order.orderStatus === 'Cancelled' && (
                    <Banner tone="info" title="This order was cancelled">
                        {order.paymentStatus === 'RefundDue' && 'Your refund is being processed.'}
                        {order.paymentStatus === 'Refunded' && 'Your payment has been refunded.'}
                    </Banner>
                )}

                {/* Actions */}
                {(canPay || canCancel) && (
                    <div className="flex flex-wrap gap-3">
                        {canPay && (
                            <button onClick={payNow} disabled={busy}
                                className="px-6 py-3 bg-ink text-paper font-serif font-bold uppercase tracking-widest text-xs hover:bg-accent-olive disabled:opacity-50">
                                Pay now with PayHere
                            </button>
                        )}
                        {canCancel && (
                            <button onClick={cancelOrder} disabled={busy}
                                className="px-6 py-3 border border-red-800 text-red-800 font-serif font-bold uppercase tracking-widest text-xs hover:bg-red-50 disabled:opacity-50">
                                Cancel order
                            </button>
                        )}
                    </div>
                )}

                {/* Progress */}
                <Panel title="Progress">
                    <div className="space-y-4">
                        <ProgressTracker order={order} />
                        <TrackingInfo order={order} />
                        {!['PendingApproval', 'Approved', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered'].includes(order.orderStatus) && (
                            <p className="font-serif text-sm text-ink-light">See the history below for details.</p>
                        )}
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
                            <Timeline history={order.statusHistory} />
                        </Panel>
                    </div>
                </div>

                <p className="font-serif text-sm text-ink-light text-center">
                    Questions about this order? <Link to="/contact" className="underline hover:text-accent-olive">Contact us</Link> and mention order #{order.id}.
                </p>
            </div>
        </div>
    );
};

export default OrderDetails;
