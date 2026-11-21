import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContextValue';
import { errorMessage } from '../constants/orders';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthField, Banner, SubmitButton } from '../components/auth/AuthFields';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // A note left by the app when a session ended (shown once)
    const [notice] = useState(() => {
        try { return sessionStorage.getItem('authNotice'); } catch { return null; }
    });
    useEffect(() => {
        try { sessionStorage.removeItem('authNotice'); } catch { /* ignore */ }
    }, []);
    const message = location.state?.message || notice;
    const from = location.state?.from ? `${location.state.from.pathname}${location.state.from.search || ''}` : '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email.trim(), password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(errorMessage(err, 'We couldn\'t log you in. Please check your email and password.'));
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            mode="login"
            eyebrow="Welcome back, reader"
            title="Log in"
            subtitle="Pick up where you left off: your cart, wishlist and orders are waiting."
        >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
                {message && !error && <Banner>{message}</Banner>}
                {error && <Banner tone="error">{error}</Banner>}

                <AuthField
                    id="login-email"
                    label="Email address"
                    icon="mail"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <AuthField
                    id="login-password"
                    label="Password"
                    icon="lock"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsLock(e.getModifierState?.('CapsLock') || false)}
                    trailing={
                        <Link to="/forgot-password" className="font-body text-sm text-accent-olive hover:text-ink underline-offset-4 hover:underline">
                            Forgot password?
                        </Link>
                    }
                    hint={capsLock ? <p className="text-xs font-body text-amber-700">Caps Lock is on.</p> : null}
                />

                <SubmitButton loading={loading} loadingText="Logging in…">Log in</SubmitButton>
            </form>

            <p className="mt-10 pt-8 border-t border-border-linen text-center font-body text-ink-light">
                New to Ink &amp; Pens?{' '}
                <Link to="/register" state={location.state} replace className="font-serif font-bold text-ink underline decoration-accent-olive decoration-2 underline-offset-4 hover:text-accent-olive">
                    Create a free account
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
