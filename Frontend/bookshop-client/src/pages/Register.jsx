import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContextValue';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Return to where the visitor was (e.g. the book they tried to add) after signing up
    const from = location.state?.from ? `${location.state.from.pathname}${location.state.from.search || ''}` : '/';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        setLoading(true);

        try {
            await register(formData.fullName, formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Please try again.');
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
                        Join our Bookstore
                    </h2>
                    <p className="mt-2 text-center text-sm text-ink-light">
                        Create an account to start your collection
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="register-fullName" className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                Full Name
                            </label>
                            <input
                                id="register-fullName"
                                name="fullName"
                                type="text"
                                required
                                className="w-full px-3 py-3 bg-paper border border-border-linen font-serif text-ink placeholder-ink-light/50 focus:outline-none focus:border-accent-olive"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="register-email" className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                Email Address
                            </label>
                            <input
                                id="register-email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-3 bg-paper border border-border-linen font-serif text-ink placeholder-ink-light/50 focus:outline-none focus:border-accent-olive"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="register-password" className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                    Password
                                </label>
                                <input
                                    id="register-password"
                                name="password"
                                    type="password"
                                    required
                                    className="w-full px-3 py-3 bg-paper border border-border-linen font-serif text-ink placeholder-ink-light/50 focus:outline-none focus:border-accent-olive"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="register-confirmPassword" className="block text-xs font-bold uppercase tracking-widest text-ink-light mb-2">
                                    Confirm
                                </label>
                                <input
                                    id="register-confirmPassword"
                                name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full px-3 py-3 bg-paper border border-border-linen font-serif text-ink placeholder-ink-light/50 focus:outline-none focus:border-accent-olive"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold text-paper bg-ink hover:bg-accent-olive uppercase tracking-widest font-serif focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-ink-light">
                            Already have an account?{' '}
                            <Link to="/login" state={location.state} className="font-medium text-primary-700 hover:text-primary-800 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
