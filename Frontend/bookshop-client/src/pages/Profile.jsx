import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContextValue';
import { useWishlist } from '../context/WishlistContext';
import api from '../api';
import { errorMessage, formatDate } from '../constants/orders';
import OrderCard from '../components/orders/OrderCard';

const panel = 'bg-paper border border-border-linen p-6 md:p-8 shadow-[6px_6px_0_0_#e5e0d8]';
const labelClass = 'block text-xs font-bold uppercase tracking-widest text-ink-light mb-2';
const inputClass = 'w-full bg-paper-dark border border-border-linen px-3 py-3 font-serif text-ink focus:outline-none focus:border-accent-olive';

const Notice = ({ message }) => message.text ? (
    <div role="status" className={`p-3 text-sm font-serif border-l-4 ${message.type === 'success' ? 'border-accent-olive bg-[#eef2e6] text-ink' : 'border-red-700 bg-red-50 text-red-800'}`}>
        {message.text}
    </div>
) : null;

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { count: wishlistCount } = useWishlist();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [orders, setOrders] = useState(null);

    const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
    const [pwMessage, setPwMessage] = useState({ text: '', type: '' });
    const [pwBusy, setPwBusy] = useState(false);

    useEffect(() => {
        api.get('/orders')
            .then(res => setOrders(res.data))
            .catch(() => setOrders([]));
    }, []);

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            await updateProfile({ fullName });
            setMessage({ text: 'Your details were saved.', type: 'success' });
        } catch (err) {
            setMessage({ text: errorMessage(err, 'Failed to update your details.'), type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (pw.next !== pw.confirm) {
            setPwMessage({ text: "The new passwords don't match.", type: 'error' });
            return;
        }
        setPwBusy(true);
        setPwMessage({ text: '', type: '' });
        try {
            await api.post('/auth/change-password', { currentPassword: pw.current, newPassword: pw.next });
            setPw({ current: '', next: '', confirm: '' });
            setPwMessage({ text: 'Password changed.', type: 'success' });
        } catch (err) {
            setPwMessage({ text: errorMessage(err), type: 'error' });
        } finally {
            setPwBusy(false);
        }
    };

    const recent = (orders || []).slice(0, 3);
    const needsPayment = (orders || []).filter(o => o.orderStatus === 'AwaitingPayment').length;

    return (
        <div className="bg-paper-dark min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-5xl space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-5 border-b-4 border-double border-ink pb-6">
                    <div className="h-16 w-16 rounded-full bg-[#e3ddd3] border border-border-linen flex items-center justify-center text-2xl font-serif text-ink" aria-hidden="true">
                        {user?.fullName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-serif font-bold text-ink">{user?.fullName}</h1>
                        <p className="text-sm font-serif text-ink-light">{user?.email} · member since {formatDate(user?.createdAt)}</p>
                    </div>
                    <nav className="flex flex-wrap gap-3 font-serif text-sm" aria-label="Account">
                        <Link to="/orders" className="px-4 py-2 border border-ink text-ink hover:bg-ink hover:text-paper">
                            My orders{orders ? ` (${orders.length})` : ''}
                        </Link>
                        <Link to="/wishlist" className="px-4 py-2 border border-ink text-ink hover:bg-ink hover:text-paper">
                            Wishlist ({wishlistCount})
                        </Link>
                    </nav>
                </div>

                {needsPayment > 0 && (
                    <div className="border-l-4 border-orange-600 bg-orange-50 p-4 font-serif text-sm text-ink" role="status">
                        {needsPayment === 1 ? 'One order is' : `${needsPayment} orders are`} waiting for payment.{' '}
                        <Link to="/orders?show=action" className="underline font-bold">Complete payment</Link>
                    </div>
                )}

                {/* Recent orders */}
                <section className={panel} aria-labelledby="recent-orders">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
                        <h2 id="recent-orders" className="font-serif font-bold text-xl text-ink">Recent orders</h2>
                        {orders?.length > 3 && <Link to="/orders" className="font-serif text-sm underline text-ink-light hover:text-ink">See all {orders.length} orders</Link>}
                    </div>
                    {orders === null ? (
                        <div className="h-24 bg-border-linen/40 animate-pulse" aria-busy="true" />
                    ) : recent.length === 0 ? (
                        <p className="font-serif italic text-ink-light">
                            No orders yet. <Link to="/shop" className="underline not-italic">Browse the collection</Link>
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                            {recent.map(order => <OrderCard key={order.id} order={order} />)}
                        </div>
                    )}
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Details */}
                    <section className={panel} aria-labelledby="details-heading">
                        <h2 id="details-heading" className="font-serif font-bold text-xl text-ink mb-5">Your details</h2>
                        <form onSubmit={saveProfile} className="space-y-5">
                            <Notice message={message} />
                            <div>
                                <label htmlFor="profile-name" className={labelClass}>Full name</label>
                                <input id="profile-name" type="text" required maxLength={100} autoComplete="name"
                                    value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="profile-email" className={labelClass}>Email address</label>
                                <input id="profile-email" type="email" disabled value={user?.email || ''} className={`${inputClass} opacity-60 cursor-not-allowed`} aria-describedby="email-help" />
                                <p id="email-help" className="text-xs font-serif text-ink-light mt-1">To change your email, please <Link to="/contact" className="underline">contact us</Link>.</p>
                            </div>
                            <button type="submit" disabled={saving}
                                className="w-full bg-ink text-paper font-serif font-bold uppercase tracking-widest py-3 hover:bg-accent-olive transition-colors disabled:opacity-50">
                                {saving ? 'Saving…' : 'Save details'}
                            </button>
                        </form>
                    </section>

                    {/* Password */}
                    <section className={panel} aria-labelledby="password-heading">
                        <h2 id="password-heading" className="font-serif font-bold text-xl text-ink mb-5">Change password</h2>
                        <form onSubmit={changePassword} className="space-y-5">
                            <Notice message={pwMessage} />
                            {[['current', 'Current password', 'current-password'], ['next', 'New password', 'new-password'], ['confirm', 'Confirm new password', 'new-password']].map(([key, label, auto]) => (
                                <div key={key}>
                                    <label htmlFor={`pw-${key}`} className={labelClass}>{label}</label>
                                    <input
                                        id={`pw-${key}`}
                                        type="password"
                                        required
                                        minLength={key === 'current' ? undefined : 6}
                                        autoComplete={auto}
                                        value={pw[key]}
                                        onChange={(e) => setPw(p => ({ ...p, [key]: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                            ))}
                            <button type="submit" disabled={pwBusy}
                                className="w-full border border-ink text-ink font-serif font-bold uppercase tracking-widest py-3 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50">
                                {pwBusy ? 'Saving…' : 'Change password'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
