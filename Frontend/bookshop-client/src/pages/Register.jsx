import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContextValue';
import { errorMessage } from '../constants/orders';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthField, Banner, PasswordStrength, SubmitButton } from '../components/auth/AuthFields';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [touched, setTouched] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Return to where the visitor was (e.g. the book they tried to add) after signing up
    const from = location.state?.from ? `${location.state.from.pathname}${location.state.from.search || ''}` : '/';

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const touch = (e) => setTouched(t => ({ ...t, [e.target.name]: true }));

    const emailInvalid = touched.email && formData.email && !/^\S+@\S+\.\S+$/.test(formData.email);
    const mismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;
    const confirmMatches = formData.confirmPassword && !mismatch;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password.length < 6) return setError('Your password needs at least 6 characters.');
        if (mismatch) return setError("The two passwords don't match.");

        setLoading(true);
        try {
            await register(formData.fullName.trim(), formData.email.trim(), formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(errorMessage(err, 'We couldn\'t create your account. Please try again.'));
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            mode="register"
            eyebrow="Join the reading room"
            title="Create account"
            subtitle="It takes a minute. Then enjoy 50% off your first order."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {location.state?.message && !error && <Banner>{location.state.message}</Banner>}
                {error && <Banner tone="error">{error}</Banner>}

                <AuthField
                    id="register-fullName"
                    label="Full name"
                    icon="user"
                    name="fullName"
                    autoComplete="name"
                    required
                    maxLength={100}
                    autoFocus
                    placeholder="e.g. Amaya Fernando"
                    value={formData.fullName}
                    onChange={handleChange}
                />

                <AuthField
                    id="register-email"
                    label="Email address"
                    icon="mail"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    maxLength={100}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={touch}
                    invalid={emailInvalid}
                    hint={emailInvalid ? <p className="text-xs font-body text-red-700">That doesn't look like an email address.</p> : null}
                />

                <AuthField
                    id="register-password"
                    label="Password"
                    icon="lock"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Choose a password"
                    value={formData.password}
                    onChange={handleChange}
                    hint={<PasswordStrength password={formData.password} />}
                />

                <AuthField
                    id="register-confirmPassword"
                    label="Confirm password"
                    icon="lock"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    placeholder="Type it again"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    invalid={!!mismatch}
                    hint={mismatch
                        ? <p className="text-xs font-body text-red-700">The passwords don't match yet.</p>
                        : confirmMatches ? <p className="text-xs font-body text-accent-olive">✓ Passwords match</p> : null}
                />

                <div className="pt-2">
                    <SubmitButton loading={loading} loadingText="Creating your account…">Create account</SubmitButton>
                </div>
                <p className="text-xs font-body text-ink-light text-center">
                    We only use your email for your orders and account. No spam.
                </p>
            </form>

            <p className="mt-8 pt-8 border-t border-border-linen text-center font-body text-ink-light">
                Already a member?{' '}
                <Link to="/login" state={location.state} replace className="font-serif font-bold text-ink underline decoration-accent-olive decoration-2 underline-offset-4 hover:text-accent-olive">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Register;
