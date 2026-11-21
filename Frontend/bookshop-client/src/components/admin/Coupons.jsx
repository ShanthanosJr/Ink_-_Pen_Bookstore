import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { errorMessage, formatDate, formatMoney } from '../../constants/orders';

const EMPTY = { code: '', percentOff: '', firstOrderOnly: false, minSubtotal: '', isActive: true, expiresAt: '' };
const inputClass = 'w-full bg-paper border border-border-linen px-3 py-2 font-serif text-sm text-ink focus:outline-none focus:border-accent-olive';
const labelClass = 'block text-[11px] font-bold uppercase tracking-widest text-ink-light mb-1';

const Coupons = () => {
    const { showToast } = useToast();
    const [coupons, setCoupons] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        api.get('/admin/coupons')
            .then(res => setCoupons(res.data))
            .catch(err => showToast(errorMessage(err, 'Could not load coupons.'), 'error'));
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const edit = (c) => {
        setEditingId(c.id);
        setForm({
            code: c.code, percentOff: String(c.percentOff), firstOrderOnly: c.firstOrderOnly,
            minSubtotal: c.minSubtotal ? String(c.minSubtotal) : '', isActive: c.isActive,
            expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : ''
        });
        setError('');
    };

    const reset = () => { setEditingId(null); setForm(EMPTY); setError(''); };

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const payload = {
            ...form,
            percentOff: Number(form.percentOff),
            minSubtotal: form.minSubtotal === '' ? 0 : Number(form.minSubtotal),
            // End of the chosen day
            expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : null,
        };
        try {
            if (editingId) await api.put(`/admin/coupons/${editingId}`, payload);
            else await api.post('/admin/coupons', payload);
            showToast(editingId ? `${form.code.toUpperCase()} updated.` : `${form.code.toUpperCase()} created.`, 'success');
            reset();
            load();
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const remove = async (c) => {
        if (!window.confirm(`Delete ${c.code}?`)) return;
        try {
            const res = await api.delete(`/admin/coupons/${c.id}`);
            showToast(res.data.message, res.data.deactivated ? 'info' : 'success');
            if (editingId === c.id) reset();
            load();
        } catch (err) {
            showToast(errorMessage(err), 'error');
        }
    };

    const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date();

    return (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
            <form onSubmit={save} className="bg-paper border border-border-linen p-6 space-y-4 lg:sticky lg:top-28">
                <h2 className="font-serif font-bold text-lg text-ink">{editingId ? `Edit ${form.code}` : 'New coupon'}</h2>
                {error && <p className="text-sm font-serif text-red-800" role="alert">{error}</p>}
                <div>
                    <label htmlFor="coupon-code" className={labelClass}>Code</label>
                    <input id="coupon-code" required pattern="[A-Za-z0-9]{3,20}" title="3 to 20 letters or digits" disabled={!!editingId}
                        value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                        className={`${inputClass} uppercase disabled:opacity-60`} placeholder="e.g. SPRING20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="coupon-percent" className={labelClass}>Discount %</label>
                        <input id="coupon-percent" type="number" required min="1" max="100" step="1" value={form.percentOff}
                            onChange={(e) => setForm(f => ({ ...f, percentOff: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="coupon-min" className={labelClass}>Min. subtotal $</label>
                        <input id="coupon-min" type="number" min="0" step="0.01" value={form.minSubtotal}
                            onChange={(e) => setForm(f => ({ ...f, minSubtotal: e.target.value }))} className={inputClass} placeholder="0" />
                    </div>
                </div>
                <div>
                    <label htmlFor="coupon-expiry" className={labelClass}>Expires (optional)</label>
                    <input id="coupon-expiry" type="date" value={form.expiresAt}
                        onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))} className={inputClass} />
                </div>
                <label className="flex items-center gap-2 font-serif text-sm text-ink">
                    <input type="checkbox" checked={form.firstOrderOnly} onChange={(e) => setForm(f => ({ ...f, firstOrderOnly: e.target.checked }))} className="accent-[#556b2f]" />
                    First order only
                </label>
                <label className="flex items-center gap-2 font-serif text-sm text-ink">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-[#556b2f]" />
                    Active
                </label>
                <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="px-5 py-2 bg-ink text-paper font-serif font-bold uppercase tracking-widest text-xs disabled:opacity-50">
                        {saving ? 'Saving…' : editingId ? 'Save' : 'Create'}
                    </button>
                    {editingId && <button type="button" onClick={reset} className="px-5 py-2 border border-border-linen font-serif text-sm">Cancel</button>}
                </div>
            </form>

            <div className="lg:col-span-2 bg-paper border border-ink overflow-x-auto shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <table className="min-w-full divide-y divide-ink/20">
                    <thead className="bg-paper-dark">
                        <tr className="text-left text-xs font-serif font-bold text-ink uppercase tracking-widest">
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">Rules</th>
                            <th className="px-4 py-3 text-right">Used</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {coupons === null && <tr><td colSpan={6} className="px-4 py-8 text-center font-serif italic text-ink-light">Loading…</td></tr>}
                        {coupons?.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center font-serif italic text-ink-light">No coupons yet.</td></tr>}
                        {coupons?.map(c => (
                            <tr key={c.id} className="hover:bg-paper-dark">
                                <td className="px-4 py-3 font-mono font-bold text-ink">{c.code}</td>
                                <td className="px-4 py-3 font-serif text-sm">{c.percentOff}% off</td>
                                <td className="px-4 py-3 font-serif text-xs text-ink-light">
                                    {[c.firstOrderOnly && 'First order only', c.minSubtotal > 0 && `Min. ${formatMoney(c.minSubtotal)}`, c.expiresAt && `Until ${formatDate(c.expiresAt)}`].filter(Boolean).join(' · ') || 'Any order'}
                                </td>
                                <td className="px-4 py-3 font-serif text-sm text-right">{c.timesUsed}</td>
                                <td className="px-4 py-3 text-[11px] uppercase tracking-widest font-bold">
                                    {!c.isActive ? <span className="text-ink-light">Off</span> : isExpired(c) ? <span className="text-accent-leather">Expired</span> : <span className="text-accent-olive">Active</span>}
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap text-sm font-serif">
                                    <button onClick={() => edit(c)} className="underline mr-4">Edit</button>
                                    <button onClick={() => remove(c)} className="underline text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Coupons;
