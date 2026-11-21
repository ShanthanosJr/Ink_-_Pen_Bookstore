import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContextValue';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
    const from = location.state?.from ? `${location.state.from.pathname}${location.state.from.search || ""}` : "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-paper py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-paper-dark p-8 md:p-10 border border-border-linen shadow-[8px_8px_0_0_#e5e0d8]"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif font-bold text-ink">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-ink-light">
                        Please enter your details to sign in
                    </p>
                </div>

                {message && !error && (
                    <div className="bg-paper-dark border-l-4 border-accent-olive p-4 text-ink text-sm font-serif">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                Email Address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-3 py-3 bg-paper border border-border-linen font-serif text-ink placeholder-ink-light/50 focus:outline-none focus:border-accent-olive"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" name="password" className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-3 py-3 bg-paper border border-border-linen font-serif text-ink placeholder-ink-light/50 focus:outline-none focus:border-accent-olive"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm font-serif text-primary-700 hover:text-primary-800 underline">Forgot password?</Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold text-paper bg-ink hover:bg-accent-olive uppercase tracking-widest font-serif focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-ink-light">
                            Don't have an account?{' '}
                            <Link to="/register" state={location.state} className="font-medium text-primary-700 hover:text-primary-800 transition-colors">
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
