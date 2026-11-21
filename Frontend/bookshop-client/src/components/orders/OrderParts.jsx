// Building blocks shared by the customer and admin order pages
import { Link } from 'react-router-dom';
import { API_ORIGIN, assetUrl } from '../../api';
import {
    FULFILMENT_STEPS, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS,
    formatDateTime, formatMoney, paymentLabel, statusLabel
} from '../../constants/orders';

export const StatusBadge = ({ status }) => (
    <span className={`inline-block px-3 py-1 text-[11px] uppercase font-bold tracking-widest rounded-full border ${ORDER_STATUS[status]?.badge || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
        {statusLabel(status)}
    </span>
);

export const PaymentBadge = ({ status }) => (
    <span className={`inline-block px-3 py-1 text-[11px] uppercase font-bold tracking-widest rounded-full border ${PAYMENT_STATUS[status]?.badge || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
        {paymentLabel(status)}
    </span>
);

export const Panel = ({ title, children, className = '' }) => (
    <section className={`bg-paper border border-border-linen p-6 ${className}`}>
        {title && <h2 className="font-serif font-bold text-sm uppercase tracking-widest text-ink mb-4 pb-3 border-b border-border-linen">{title}</h2>}
        {children}
    </section>
);

// Step tracker: Pending review -> ... -> Delivered, with the time each step was reached
export const ProgressTracker = ({ order }) => {
    const history = order.statusHistory || [];
    const reachedAt = (status) => history.find(h => h.status === status)?.createdAt;
    const currentIndex = FULFILMENT_STEPS.indexOf(order.orderStatus);

    if (currentIndex === -1) return null; // AwaitingPayment / Cancelled / Rejected are shown as banners instead

    return (
        <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3" aria-label="Order progress">
            {FULFILMENT_STEPS.map((step, index) => {
                const done = index <= currentIndex;
                const current = index === currentIndex;
                return (
                    <li key={step} className={`border-t-4 pt-2 ${done ? 'border-accent-olive' : 'border-border-linen'}`} aria-current={current ? 'step' : undefined}>
                        <p className={`text-[11px] uppercase tracking-widest font-bold ${done ? 'text-ink' : 'text-ink-light'}`}>
                            {statusLabel(step)}
                        </p>
                        <p className="text-[11px] font-serif text-ink-light mt-1">
                            {done && reachedAt(step) ? formatDateTime(reachedAt(step)) : current ? 'Now' : ''}
                        </p>
                    </li>
                );
            })}
        </ol>
    );
};

export const Timeline = ({ history = [], showActor = false }) => {
    const entries = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (entries.length === 0) return <p className="font-serif italic text-ink-light text-sm">No updates yet.</p>;

    return (
        <ol className="relative border-l border-border-linen ml-2 space-y-5">
            {entries.map((entry, i) => (
                <li key={entry.id ?? i} className="ml-5">
                    <span className={`absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-accent-olive' : 'bg-border-linen'}`} aria-hidden="true" />
                    <p className="font-serif text-sm text-ink">
                        <span className="font-bold">{statusLabel(entry.status)}</span>
                        {showActor && <span className="text-ink-light"> · {entry.changedBy}</span>}
                    </p>
                    {entry.note && <p className="font-serif text-sm text-ink-light mt-0.5">{entry.note}</p>}
                    <time className="block text-xs text-ink-light/80 mt-0.5" dateTime={entry.createdAt}>{formatDateTime(entry.createdAt)}</time>
                </li>
            ))}
        </ol>
    );
};

export const ItemsList = ({ items = [] }) => (
    <ul className="divide-y divide-border-linen">
        {items.map(item => (
            <li key={item.id} className="flex gap-4 py-3">
                <div className="w-12 h-16 bg-[#e3ddd3] border border-border-linen flex-shrink-0 overflow-hidden">
                    {item.book?.imageUrl && <img src={assetUrl(item.book.imageUrl)} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                    {item.book
                        ? <Link to={`/product/${item.bookId}`} className="font-serif font-bold text-ink hover:text-accent-olive">{item.book.title}</Link>
                        : <span className="font-serif font-bold text-ink">Unknown book</span>}
                    <p className="text-xs font-serif text-ink-light">{item.quantity} × {formatMoney(item.unitPrice)}</p>
                </div>
                <span className="font-serif text-ink whitespace-nowrap">{formatMoney(item.quantity * item.unitPrice)}</span>
            </li>
        ))}
    </ul>
);

export const Totals = ({ order }) => (
    <dl className="space-y-2 text-sm font-serif text-ink">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(order.subtotal || order.totalAmount)}</dd></div>
        {order.discountAmount > 0 && (
            <div className="flex justify-between text-accent-olive">
                <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>−{formatMoney(order.discountAmount)}</dd>
            </div>
        )}
        <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shippingFee > 0 ? formatMoney(order.shippingFee) : 'Free'}</dd></div>
        <div className="flex justify-between pt-2 border-t border-border-linen font-bold text-base"><dt>Total</dt><dd>{formatMoney(order.totalAmount)}</dd></div>
    </dl>
);

export const DeliveryAndPayment = ({ order }) => {
    const d = order.deliveryDetails || {};
    return (
        <div className="grid sm:grid-cols-2 gap-6 text-sm font-serif text-ink">
            <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-ink-light mb-2">Deliver to</p>
                <p className="font-bold">{d.fullName}</p>
                <p>{d.addressLine}</p>
                <p>{d.city} {d.postalCode}</p>
                <p className="mt-1">{d.phoneNumber}</p>
            </div>
            <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-ink-light mb-2">Payment</p>
                <p className="font-bold">{PAYMENT_METHOD[d.paymentMethod] || d.paymentMethod}</p>
                <div className="mt-1"><PaymentBadge status={order.paymentStatus} /></div>
                {order.paymentReference && <p className="mt-2 text-xs text-ink-light">Reference: {order.paymentReference}</p>}
                {d.cardLast4Digits && <p className="mt-2 text-xs text-ink-light">Card ending {d.cardLast4Digits}</p>}
                {d.paymentSlipPath && (
                    <a href={`${API_ORIGIN}${d.paymentSlipPath}`} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs underline text-accent-olive">
                        View uploaded slip
                    </a>
                )}
            </div>
        </div>
    );
};

export const TrackingInfo = ({ order }) => {
    if (!order.trackingNumber && !order.courier) return null;
    return (
        <div className="bg-paper-dark border border-border-linen px-4 py-3 font-serif text-sm text-ink">
            <span className="text-[11px] uppercase tracking-widest font-bold text-ink-light mr-2">Tracking</span>
            {order.courier && <span>{order.courier}</span>}
            {order.courier && order.trackingNumber && <span> · </span>}
            {order.trackingNumber && <span className="font-mono font-bold">{order.trackingNumber}</span>}
        </div>
    );
};
