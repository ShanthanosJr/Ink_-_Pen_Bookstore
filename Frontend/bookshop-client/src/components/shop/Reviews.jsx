import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { errorMessage, formatDate } from '../../constants/orders';
import { Stars } from './BookBits';

const StarInput = ({ value, onChange }) => (
    <div role="radiogroup" aria-label="Your rating" className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
            <button
                key={n}
                type="button"
                role="radio"
                aria-checked={value === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onClick={() => onChange(n)}
                className={`text-3xl leading-none ${n <= value ? 'text-accent-leather' : 'text-border-linen hover:text-accent-leather/50'}`}
            >
                ★
            </button>
        ))}
    </div>
);

const Reviews = ({ bookId, onChanged }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const [reviews, setReviews] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ rating: 0, title: '', body: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const res = await api.get(`/books/${bookId}/reviews`);
            setReviews(res.data);
        } catch (err) {
            console.error('Error loading reviews', err);
            setReviews([]);
        }
    }, [bookId]);

    useEffect(() => { load(); }, [load, user]);

    const mine = reviews?.find(r => r.isMine);

    const startEditing = () => {
        setForm(mine ? { rating: mine.rating, title: mine.title || '', body: mine.body } : { rating: 0, title: '', body: '' });
        setError('');
        setEditing(true);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.rating) { setError('Please choose a star rating.'); return; }
        setSaving(true);
        setError('');
        try {
            await api.put(`/books/${bookId}/reviews`, form);
            showToast(mine ? 'Your review was updated.' : 'Thank you for your review!', 'success');
            setEditing(false);
            await load();
            onChanged?.();
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        if (!window.confirm('Delete your review?')) return;
        try {
            await api.delete(`/books/${bookId}/reviews/${mine.id}`);
            showToast('Your review was deleted.', 'info');
            await load();
            onChanged?.();
        } catch (err) {
            showToast(errorMessage(err), 'error');
        }
    };

    return (
        <section aria-labelledby="reviews-heading" className="bg-paper border border-border-linen p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6 border-b border-border-linen pb-4">
                <h2 id="reviews-heading" className="font-serif font-bold text-2xl text-ink">Reader reviews</h2>
                {user ? (
                    !editing && (
                        <button onClick={startEditing} className="px-5 py-2 border border-ink font-serif font-bold uppercase tracking-widest text-xs text-ink hover:bg-ink hover:text-paper transition-colors">
                            {mine ? 'Edit your review' : 'Write a review'}
                        </button>
                    )
                ) : (
                    <Link to="/login" state={{ from: location, message: 'Log in to write a review.' }} className="font-serif text-sm underline text-ink-light hover:text-ink">
                        Log in to write a review
                    </Link>
                )}
            </div>

            {editing && (
                <form onSubmit={submit} className="mb-8 space-y-4 bg-paper-dark border border-border-linen p-5">
                    {error && <p className="text-sm font-serif text-red-800" role="alert">{error}</p>}
                    <StarInput value={form.rating} onChange={(rating) => setForm(f => ({ ...f, rating }))} />
                    <div>
                        <label htmlFor="review-title" className="block text-[11px] font-bold uppercase tracking-widest text-ink-light mb-1">Headline (optional)</label>
                        <input id="review-title" maxLength={120} value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full bg-paper border border-border-linen px-3 py-2 font-serif text-ink focus:outline-none focus:border-accent-olive" />
                    </div>
                    <div>
                        <label htmlFor="review-body" className="block text-[11px] font-bold uppercase tracking-widest text-ink-light mb-1">Your review</label>
                        <textarea id="review-body" required minLength={10} maxLength={3000} rows={4} value={form.body}
                            onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
                            className="w-full bg-paper border border-border-linen px-3 py-2 font-serif text-ink focus:outline-none focus:border-accent-olive"
                            placeholder="What did you think? Would you recommend it?" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={saving} className="px-5 py-2 bg-ink text-paper font-serif font-bold uppercase tracking-widest text-xs disabled:opacity-50">
                            {saving ? 'Saving…' : mine ? 'Update review' : 'Post review'}
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className="px-5 py-2 border border-border-linen font-serif text-sm text-ink">Cancel</button>
                        {mine && <button type="button" onClick={remove} className="ml-auto text-sm font-serif text-red-800 underline">Delete my review</button>}
                    </div>
                </form>
            )}

            {reviews === null ? (
                <p className="font-serif italic text-ink-light animate-pulse">Loading reviews…</p>
            ) : reviews.length === 0 ? (
                <p className="font-serif italic text-ink-light">No reviews yet. Be the first to share what you thought.</p>
            ) : (
                <ul className="space-y-6">
                    {reviews.map(r => (
                        <li key={r.id} className="border-b border-dotted border-border-linen pb-6 last:border-0 last:pb-0">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                <Stars rating={r.rating} />
                                {r.title && <span className="font-serif font-bold text-ink">{r.title}</span>}
                            </div>
                            <p className="font-serif text-ink leading-relaxed whitespace-pre-line">{r.body}</p>
                            <p className="text-xs font-serif text-ink-light mt-2">
                                {r.author}{r.isMine && ' (you)'} · {formatDate(r.createdAt)}
                                {r.verifiedPurchase && <span className="ml-2 text-accent-olive font-bold uppercase tracking-widest text-[10px]">Verified purchase</span>}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Reviews;
