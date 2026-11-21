import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { formatDate, formatMoney, errorMessage } from '../../constants/orders';
import { PaymentBadge, StatusBadge } from '../orders/OrderParts';

const Tile = ({ label, value, sub }) => (
    <div className="bg-paper border border-border-linen p-5">
        <p className="text-[11px] uppercase tracking-widest font-bold text-ink-light">{label}</p>
        <p className="text-3xl font-serif font-bold text-ink mt-2">{value}</p>
        {sub && <p className="text-xs font-serif text-ink-light mt-1">{sub}</p>}
    </div>
);

// Something the admin has to do; links to the filtered order list
const ActionCard = ({ count, label, to, urgent }) => (
    <Link
        to={to}
        className={`flex items-center justify-between gap-3 border p-4 transition-colors ${count > 0 && urgent
            ? 'border-accent-leather bg-[#f8eee6] hover:bg-[#f3e2d4]'
            : 'border-border-linen bg-paper hover:bg-paper-dark'
            }`}
    >
        <span className="font-serif text-sm text-ink">{label}</span>
        <span className={`text-2xl font-serif font-bold ${count > 0 && urgent ? 'text-accent-leather' : 'text-ink'}`}>{count}</span>
    </Link>
);

// Single-series daily revenue bars. Hover/focus a bar for its values; a table view is available for screen readers and exact numbers.
const RevenueChart = ({ data }) => {
    const [active, setActive] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const max = Math.max(...data.map(d => d.revenue), 1);
    const total = data.reduce((sum, d) => sum + d.revenue, 0);
    const shortDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    const activePoint = active != null ? data[active] : null;

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4 mb-4">
                <p className="font-serif text-sm text-ink-light">
                    {activePoint
                        ? <><span className="font-bold text-ink">{shortDate(activePoint.date)}</span>: {formatMoney(activePoint.revenue)} from {activePoint.orders} {activePoint.orders === 1 ? 'order' : 'orders'}</>
                        : <>Total {formatMoney(total)}. Hover a bar for the day.</>}
                </p>
                <button onClick={() => setShowTable(s => !s)} className="text-xs font-serif underline text-ink-light hover:text-ink whitespace-nowrap">
                    {showTable ? 'Show chart' : 'Show table'}
                </button>
            </div>

            {showTable ? (
                <table className="w-full text-sm font-serif">
                    <thead><tr className="text-left text-[11px] uppercase tracking-widest text-ink-light"><th className="py-1">Day</th><th className="py-1 text-right">Orders</th><th className="py-1 text-right">Revenue</th></tr></thead>
                    <tbody>
                        {data.map(d => (
                            <tr key={d.date} className="border-t border-border-linen">
                                <td className="py-1">{shortDate(d.date)}</td>
                                <td className="py-1 text-right">{d.orders}</td>
                                <td className="py-1 text-right">{formatMoney(d.revenue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <>
                    <div className="relative h-44 border-b border-ink/30" onMouseLeave={() => setActive(null)}>
                        {/* Recessive gridline at the max value */}
                        <div className="absolute inset-x-0 top-0 border-t border-dashed border-border-linen" aria-hidden="true" />
                        <span className="absolute -top-2 left-0 bg-paper pr-1 text-[10px] text-ink-light" aria-hidden="true">{formatMoney(max)}</span>
                        <div className="absolute inset-0 flex items-end gap-[2px]" role="list" aria-label="Revenue per day">
                            {data.map((d, i) => (
                                <button
                                    key={d.date}
                                    role="listitem"
                                    aria-label={`${shortDate(d.date)}: ${formatMoney(d.revenue)}, ${d.orders} orders`}
                                    onMouseEnter={() => setActive(i)}
                                    onFocus={() => setActive(i)}
                                    onBlur={() => setActive(null)}
                                    className="flex-1 h-full flex items-end focus:outline-none group"
                                >
                                    {/* Hit target is the full column; the visible bar is inside it */}
                                    <span
                                        className={`w-full max-w-6 mx-auto rounded-t-[4px] transition-colors ${active === i ? 'bg-ink' : 'bg-accent-olive'} group-focus-visible:ring-2 group-focus-visible:ring-ink`}
                                        style={{ height: d.revenue > 0 ? `${Math.max(2, (d.revenue / max) * 100)}%` : '2px', opacity: d.revenue > 0 ? 1 : 0.25 }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-ink-light mt-1" aria-hidden="true">
                        <span>{shortDate(data[0].date)}</span>
                        <span>{shortDate(data[data.length - 1].date)}</span>
                    </div>
                </>
            )}
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/admin/dashboard', { params: { days: 14 } })
            .then(res => setData(res.data))
            .catch(err => setError(errorMessage(err, 'Could not load the dashboard.')));
    }, []);

    if (error) return <p className="font-serif text-red-800">{error}</p>;
    if (!data) return <p className="font-serif italic text-ink-light animate-pulse">Tallying the ledger…</p>;

    const { totals, actionNeeded } = data;

    return (
        <div className="space-y-8">
            {/* Needs attention */}
            <section>
                <h2 className="font-serif font-bold text-sm uppercase tracking-widest text-ink mb-3">Needs your attention</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <ActionCard count={actionNeeded.pendingApproval} label="Orders to review" to="/admin?tab=orders&status=PendingApproval" urgent />
                    <ActionCard count={actionNeeded.readyToShip} label="Ready to ship" to="/admin?tab=orders&status=ToShip" urgent />
                    <ActionCard count={actionNeeded.refundDue} label="Refunds due" to="/admin?tab=orders&payment=RefundDue" urgent />
                    <ActionCard count={actionNeeded.awaitingPayment} label="Awaiting payment" to="/admin?tab=orders&status=AwaitingPayment" />
                    <ActionCard count={actionNeeded.lowStock} label={`Low stock (≤${data.lowStockThreshold})`} to="/admin?tab=inventory&lowStock=1" urgent />
                </div>
            </section>

            {/* Headline numbers */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Tile label="Revenue" value={formatMoney(totals.revenue)} sub={`${formatMoney(totals.paidRevenue)} received`} />
                <Tile label="Orders" value={totals.orders} sub={`${totals.periodOrders} in the last ${data.days} days`} />
                <Tile label="Average order" value={formatMoney(totals.averageOrderValue)} />
                <Tile label="Customers" value={totals.customers} />
            </section>

            <div className="grid lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 bg-paper border border-border-linen p-6">
                    <h2 className="font-serif font-bold text-sm uppercase tracking-widest text-ink mb-4">Revenue, last {data.days} days</h2>
                    <RevenueChart data={data.revenueByDay} />
                </section>

                <section className="bg-paper border border-border-linen p-6">
                    <h2 className="font-serif font-bold text-sm uppercase tracking-widest text-ink mb-4">Best sellers</h2>
                    {data.topBooks.length === 0 ? (
                        <p className="font-serif italic text-sm text-ink-light">No sales yet.</p>
                    ) : (
                        <ol className="space-y-3">
                            {data.topBooks.map((b, i) => (
                                <li key={b.bookId} className="flex items-baseline gap-3 font-serif text-sm">
                                    <span className="text-ink-light w-4">{i + 1}.</span>
                                    <span className="flex-1 text-ink truncate">{b.title}</span>
                                    <span className="text-ink-light whitespace-nowrap">{b.quantity} sold</span>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 bg-paper border border-border-linen p-6">
                    <div className="flex justify-between items-baseline mb-4">
                        <h2 className="font-serif font-bold text-sm uppercase tracking-widest text-ink">Latest orders</h2>
                        <Link to="/admin?tab=orders" className="text-xs font-serif underline text-ink-light hover:text-ink">All orders</Link>
                    </div>
                    <ul className="divide-y divide-border-linen">
                        {data.recentOrders.map(o => (
                            <li key={o.id}>
                                <Link to={`/admin/orders/${o.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 hover:bg-paper-dark px-2 -mx-2">
                                    <span className="font-serif font-bold text-ink w-14">#{o.id}</span>
                                    <span className="font-serif text-sm text-ink flex-1 min-w-32 truncate">{o.customer}</span>
                                    <span className="text-xs text-ink-light">{formatDate(o.createdAt)}</span>
                                    <StatusBadge status={o.orderStatus} />
                                    <PaymentBadge status={o.paymentStatus} />
                                    <span className="font-serif text-sm text-ink w-20 text-right">{formatMoney(o.totalAmount)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="bg-paper border border-border-linen p-6">
                    <h2 className="font-serif font-bold text-sm uppercase tracking-widest text-ink mb-4">Low stock</h2>
                    {data.lowStock.length === 0 ? (
                        <p className="font-serif italic text-sm text-ink-light">Everything is well stocked.</p>
                    ) : (
                        <ul className="space-y-2">
                            {data.lowStock.map(b => (
                                <li key={b.id} className="flex items-center gap-3 font-serif text-sm">
                                    <span className="flex-1 truncate text-ink">{b.title}</span>
                                    <span className={`font-bold ${b.stockQuantity === 0 ? 'text-red-800' : 'text-accent-leather'}`}>
                                        {b.stockQuantity === 0 ? 'Sold out' : `${b.stockQuantity} left`}
                                    </span>
                                    <Link to={`/edit/${b.id}`} className="text-xs underline text-ink-light hover:text-ink">Restock</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
