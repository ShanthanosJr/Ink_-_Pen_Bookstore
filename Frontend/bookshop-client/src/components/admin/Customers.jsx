import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { errorMessage, formatDate, formatMoney } from '../../constants/orders';

const Customers = () => {
    const { showToast } = useToast();
    const [params, setParams] = useSearchParams();
    const [users, setUsers] = useState(null);
    const q = params.get('q') || '';
    const roleFilter = params.get('role') || '';

    const load = useCallback(() => {
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(err => showToast(errorMessage(err, 'Could not load customers.'), 'error'));
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const setFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value); else next.delete(key);
        setParams(next, { replace: true });
    };

    const visible = useMemo(() => {
        const term = q.trim().toLowerCase();
        return (users || []).filter(u =>
            (!roleFilter || (roleFilter === 'Blocked' ? !u.isActive : u.role === roleFilter)) &&
            (!term || u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)));
    }, [users, q, roleFilter]);

    const act = async (request, message) => {
        try {
            await request();
            showToast(message, 'success');
            load();
        } catch (err) {
            showToast(errorMessage(err), 'error');
        }
    };

    const toggleRole = (u) => {
        const role = u.role === 'Admin' ? 'User' : 'Admin';
        const question = role === 'Admin'
            ? `Make ${u.fullName} an admin? They will be able to manage orders, books and customers.`
            : `Remove admin rights from ${u.fullName}?`;
        if (!window.confirm(question)) return;
        act(() => api.put(`/admin/users/${u.id}/role`, { role }), `${u.fullName} is now ${role === 'Admin' ? 'an admin' : 'a customer'}.`);
    };

    const toggleActive = (u) => {
        if (u.isActive && !window.confirm(`Block ${u.fullName}? They will be signed out and can't log in until unblocked.`)) return;
        act(() => api.put(`/admin/users/${u.id}/active`, { isActive: !u.isActive }), u.isActive ? `${u.fullName} has been blocked.` : `${u.fullName} has been unblocked.`);
    };

    if (!users) return <p className="font-serif italic text-ink-light animate-pulse">Loading customers…</p>;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
                <label htmlFor="customer-search" className="sr-only">Search customers</label>
                <input id="customer-search" type="search" value={q} onChange={(e) => setFilter('q', e.target.value)}
                    placeholder="Search name or email"
                    className="flex-1 min-w-56 bg-paper border border-border-linen px-3 py-2 font-serif text-sm focus:outline-none focus:border-accent-olive" />
                <select aria-label="Filter by role" value={roleFilter} onChange={(e) => setFilter('role', e.target.value)}
                    className="bg-paper border border-border-linen px-3 py-2 font-serif text-sm">
                    <option value="">Everyone</option>
                    <option value="User">Customers</option>
                    <option value="Admin">Admins</option>
                    <option value="Blocked">Blocked</option>
                </select>
            </div>
            <p className="font-serif text-sm text-ink-light">{visible.length} {visible.length === 1 ? 'person' : 'people'}</p>

            <div className="bg-paper border border-ink overflow-x-auto shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <table className="min-w-full divide-y divide-ink/20">
                    <thead className="bg-paper-dark">
                        <tr className="text-left text-xs font-serif font-bold text-ink uppercase tracking-widest">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3 text-right">Orders</th>
                            <th className="px-4 py-3 text-right">Spent</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {visible.map(u => (
                            <tr key={u.id} className={u.isActive ? 'hover:bg-paper-dark' : 'bg-red-50/50'}>
                                <td className="px-4 py-3 font-serif text-sm">
                                    <div className="text-ink font-bold">{u.fullName}{u.isCurrentUser && <span className="font-normal text-ink-light"> (you)</span>}</div>
                                    <a href={`mailto:${u.email}`} className="text-xs text-ink-light underline">{u.email}</a>
                                </td>
                                <td className="px-4 py-3 text-xs font-serif text-ink-light whitespace-nowrap">{formatDate(u.createdAt)}</td>
                                <td className="px-4 py-3 text-sm font-serif text-right">
                                    {u.orderCount > 0
                                        ? <Link to={`/admin?tab=orders&q=${encodeURIComponent(u.email)}`} className="underline">{u.orderCount}</Link>
                                        : 0}
                                </td>
                                <td className="px-4 py-3 text-sm font-serif text-right">{formatMoney(u.totalSpent)}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[11px] uppercase tracking-widest font-bold ${u.role === 'Admin' ? 'text-accent-olive' : 'text-ink-light'}`}>{u.role === 'Admin' ? 'Admin' : 'Customer'}</span>
                                    {!u.isActive && <span className="block text-[11px] uppercase tracking-widest font-bold text-red-800">Blocked</span>}
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap text-sm font-serif">
                                    {!u.isCurrentUser && (
                                        <>
                                            <button onClick={() => toggleRole(u)} className="underline text-ink hover:text-accent-olive mr-4">
                                                {u.role === 'Admin' ? 'Remove admin' : 'Make admin'}
                                            </button>
                                            <button onClick={() => toggleActive(u)} className={`underline ${u.isActive ? 'text-red-800' : 'text-accent-olive'}`}>
                                                {u.isActive ? 'Block' : 'Unblock'}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
