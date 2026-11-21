import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { errorMessage, formatDateTime } from '../../constants/orders';

// Contact-form inbox
const Messages = () => {
    const { showToast } = useToast();
    const [data, setData] = useState(null);
    const [showHandled, setShowHandled] = useState(false);

    const load = useCallback(() => {
        api.get('/admin/messages')
            .then(res => setData(res.data))
            .catch(err => showToast(errorMessage(err, 'Could not load messages.'), 'error'));
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const setHandled = async (message, isHandled) => {
        try {
            await api.put(`/admin/messages/${message.id}/handled`, { isHandled });
            load();
        } catch (err) {
            showToast(errorMessage(err), 'error');
        }
    };

    if (!data) return <p className="font-serif italic text-ink-light animate-pulse">Opening the post…</p>;

    const open = data.messages.filter(m => !m.isHandled);
    const visible = showHandled ? data.messages : open;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
                <p className="font-serif text-sm text-ink-light">
                    {open.length} open {open.length === 1 ? 'message' : 'messages'} · {data.newsletterSubscribers} newsletter {data.newsletterSubscribers === 1 ? 'subscriber' : 'subscribers'}
                </p>
                <label className="flex items-center gap-2 font-serif text-sm text-ink">
                    <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} className="accent-[#556b2f]" />
                    Show answered messages
                </label>
            </div>

            {visible.length === 0 ? (
                <p className="font-serif italic text-ink-light bg-paper border border-border-linen p-8 text-center">No messages waiting.</p>
            ) : (
                <ul className="space-y-3">
                    {visible.map(m => (
                        <li key={m.id} className={`bg-paper border p-5 ${m.isHandled ? 'border-border-linen opacity-70' : 'border-ink'}`}>
                            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                                <p className="font-serif font-bold text-ink">{m.subject}</p>
                                <time className="text-xs font-serif text-ink-light" dateTime={m.createdAt}>{formatDateTime(m.createdAt)}</time>
                            </div>
                            <p className="text-sm font-serif text-ink-light mb-3">
                                {m.name} · <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="underline">{m.email}</a>
                                {m.userId && <span className="ml-2 text-[11px] uppercase tracking-widest text-accent-olive font-bold">Customer</span>}
                            </p>
                            <p className="font-serif text-ink whitespace-pre-line">{m.message}</p>
                            <div className="mt-4 flex gap-4 text-sm font-serif">
                                <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="px-4 py-2 bg-ink text-paper text-xs uppercase tracking-widest font-bold">Reply by email</a>
                                <button onClick={() => setHandled(m, !m.isHandled)} className="underline text-ink-light hover:text-ink">
                                    {m.isHandled ? 'Mark as open' : 'Mark as answered'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Messages;
