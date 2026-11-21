import { Link } from 'react-router-dom';
import { assetUrl } from '../../api';
import { formatDate, formatMoney } from '../../constants/orders';
import { PaymentBadge, StatusBadge } from './OrderParts';

// Summary card linking to an order's tracking page
const OrderCard = ({ order }) => {
    const itemCount = order.items.reduce((n, item) => n + item.quantity, 0);
    const needsPayment = order.orderStatus === 'AwaitingPayment';
    return (
        <Link
            to={`/orders/${order.id}`}
            className={`block border p-5 transition-all hover:shadow-md hover:border-accent-olive/50 ${needsPayment ? 'border-orange-300 bg-orange-50/40' : 'border-border-linen bg-paper'}`}
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
            <div className="flex gap-2 mb-3" aria-hidden="true">
                {order.items.slice(0, 4).map(item => (
                    <div key={item.id} className="w-9 h-12 bg-[#e3ddd3] border border-border-linen overflow-hidden">
                        {item.book?.imageUrl && <img src={assetUrl(item.book.imageUrl)} alt="" className="w-full h-full object-cover" />}
                    </div>
                ))}
            </div>
            <p className="text-sm font-serif text-ink truncate">
                {order.items.map(item => item.book?.title || 'Unknown book').join(', ')}
            </p>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-border-linen">
                <span className="text-xs text-ink-light font-serif">{itemCount} {itemCount === 1 ? 'book' : 'books'} · {formatMoney(order.totalAmount)}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-olive">
                    {needsPayment ? 'Complete payment →' : 'Track order →'}
                </span>
            </div>
        </Link>
    );
};

export default OrderCard;
