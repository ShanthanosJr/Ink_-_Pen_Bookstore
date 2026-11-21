import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../constants/orders';

const Card = ({ title, subtitle, children }) => (
    <div className="min-h-[70vh] flex items-center justify-center bg-paper py-12 px-4">
        <div className="max-w-md w-full bg-paper-dark border border-border-linen p-8 md:p-10 shadow-[8px_8px_0_0_#e5e0d8]">
            <h1 className="text-3xl font-serif font-bold text-ink text-center">{title}</h1>
            {subtitle && <p className="mt-2 text-center text-sm font-serif text-ink-light">{subtitle}</p>}
            <div className="mt-8">{children}</div>
        </div>
    </div>
);

const inputClass = 'w-full bg-paper border border-border-linen px-3 py-3 font-serif text-ink focus:outline-none focus:border-accent-olive';
const labelClass = 'block text-xs font-bold uppercase tracking-widest text-ink-light mb-2';
const buttonClass = 'w-full bg-ink text-paper font-serif font-bold uppercase tracking-widest py-3 hover:bg-accent-olive disabled:opacity-50';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Card title="Forgot your password?" subtitle="Enter your email and we'll send you a link to choose a new one.">
            {sent ? (
                <div className="space-y-6 text-center">
                    <p className="font-serif text-ink">If an account exists for <strong>{email}</strong>, a reset link is on its way. It works for one hour.</p>
                    <Link to="/login" className="inline-block underline font-serif text-ink-light hover:text-ink">Back to login</Link>
                </div>
            ) : (
                <form onSubmit={submit} className="space-y-5">
                    {error && <p className="text-sm font-serif text-red-800" role="alert">{error}</p>}
                    <div>
                        <label htmlFor="forgot-email" className={labelClass}>Email address</label>
                        <input id="forgot-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                    </div>
                    <button type="submit" disabled={busy} className={buttonClass}>{busy ? 'Sending…' : 'Send reset link'}</button>
                    <p className="text-center text-sm font-serif"><Link to="/login" className="underline text-ink-light hover:text-ink">Back to login</Link></p>
                </form>
            )}
        </Card>
    );
};

export const ResetPassword = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const email = params.get('email') || '';
    const token = params.get('token') || '';

    const submit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('The passwords don\'t match.'); return; }
        setBusy(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { email, token, newPassword: password });
            showToast('Password updated. Please log in.', 'success');
            navigate('/login', { replace: true });
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setBusy(false);
        }
    };

    if (!email || !token) {
        return (
            <Card title="Reset link incomplete" subtitle="Please open the link from your email again, or request a new one.">
                <Link to="/forgot-password" className={`${buttonClass} block text-center`}>Request a new link</Link>
            </Card>
        );
    }

    return (
        <Card title="Choose a new password" subtitle={`For ${email}`}>
            <form onSubmit={submit} className="space-y-5">
                {error && (
                    <p className="text-sm font-serif text-red-800" role="alert">
                        {error} {error.includes('expired') && <Link to="/forgot-password" className="underline">Request a new link</Link>}
                    </p>
                )}
                <div>
                    <label htmlFor="new-password" className={labelClass}>New password</label>
                    <input id="new-password" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="confirm-password" className={labelClass}>Confirm new password</label>
                    <input id="confirm-password" type="password" required minLength={6} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
                </div>
                <button type="submit" disabled={busy} className={buttonClass}>{busy ? 'Saving…' : 'Set new password'}</button>
            </form>
        </Card>
    );
};
