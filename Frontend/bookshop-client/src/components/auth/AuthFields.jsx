import { useState } from 'react';

const ICONS = {
    user: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0',
    mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
    lock: 'M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z',
};

const Icon = ({ name }) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ICONS[name]} />
    </svg>
);

/** Text input with a leading icon; password fields get a show/hide toggle. */
export const AuthField = ({ id, label, icon, type = 'text', hint, invalid, trailing, onKeyUp, ...inputProps }) => {
    const [visible, setVisible] = useState(false);
    const isPassword = type === 'password';

    return (
        <div>
            <div className="flex items-baseline justify-between mb-2">
                <label htmlFor={id} className="text-xs font-bold uppercase tracking-[0.15em] text-ink-light">{label}</label>
                {trailing}
            </div>
            <div className={`group flex items-center gap-3 bg-white/70 border rounded-sm px-4 transition-colors focus-within:bg-white focus-within:border-ink focus-within:ring-4 focus-within:ring-accent-olive/10 ${invalid ? 'border-red-400' : 'border-border-linen'}`}>
                <span className={`shrink-0 transition-colors ${invalid ? 'text-red-500' : 'text-ink-light group-focus-within:text-ink'}`}><Icon name={icon} /></span>
                <input
                    id={id}
                    type={isPassword && visible ? 'text' : type}
                    aria-invalid={invalid || undefined}
                    aria-describedby={hint ? `${id}-hint` : undefined}
                    onKeyUp={onKeyUp}
                    className="flex-1 min-w-0 bg-transparent py-3.5 font-body text-ink placeholder:text-ink-light/50 focus:outline-none"
                    {...inputProps}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setVisible(v => !v)}
                        className="shrink-0 text-xs font-bold uppercase tracking-widest text-ink-light hover:text-ink"
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        aria-pressed={visible}
                    >
                        {visible ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>
            {hint && <div id={`${id}-hint`} className="mt-2">{hint}</div>}
        </div>
    );
};

export const Banner = ({ tone = 'info', children }) => (
    <div
        role={tone === 'error' ? 'alert' : 'status'}
        className={`flex gap-3 rounded-sm border px-4 py-3 font-body text-sm ${tone === 'error'
            ? 'border-red-200 bg-red-50 text-red-800'
            : 'border-accent-olive/30 bg-[#eef2e6] text-ink'}`}
    >
        <span aria-hidden="true" className="font-bold">{tone === 'error' ? '!' : 'i'}</span>
        <span>{children}</span>
    </div>
);

export const SubmitButton = ({ loading, children, loadingText }) => (
    <button
        type="submit"
        disabled={loading}
        className="group w-full flex items-center justify-center gap-3 rounded-sm bg-ink text-paper py-4 font-serif text-lg tracking-wide transition-all hover:bg-accent-olive hover:shadow-[0_10px_30px_-10px_rgba(85,107,47,0.7)] disabled:opacity-60 disabled:hover:bg-ink"
    >
        {loading ? (
            <>
                <span className="h-5 w-5 rounded-full border-2 border-paper/30 border-t-paper animate-spin" aria-hidden="true" />
                {loadingText}
            </>
        ) : (
            <>
                {children}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </>
        )}
    </button>
);

/** Live checklist + strength bar for a new password. */
export const PasswordStrength = ({ password }) => {
    const checks = [
        ['At least 6 characters', password.length >= 6],
        ['Upper and lower case', /[a-z]/.test(password) && /[A-Z]/.test(password)],
        ['A number or symbol', /[\d\W_]/.test(password)],
    ];
    const longEnough = password.length >= 10;
    const score = checks.filter(([, ok]) => ok).length + (longEnough && checks[0][1] ? 1 : 0);
    const levels = [
        ['Too short', 'bg-red-400'],
        ['Weak', 'bg-red-400'],
        ['Fair', 'bg-amber-500'],
        ['Good', 'bg-accent-olive'],
        ['Strong', 'bg-accent-olive'],
    ];
    const [label, color] = password ? levels[checks[0][1] ? Math.max(1, score) : 0] : ['', ''];

    return (
        <div aria-live="polite">
            <div className="flex gap-1.5" aria-hidden="true">
                {[1, 2, 3, 4].map(i => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${password && score >= i ? color : 'bg-border-linen'}`} />
                ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-body">
                    {checks.map(([text, ok]) => (
                        <li key={text} className={ok ? 'text-accent-olive' : 'text-ink-light'}>
                            <span aria-hidden="true">{ok ? '✓ ' : '○ '}</span>{text}
                        </li>
                    ))}
                </ul>
                {label && <span className="text-xs font-bold uppercase tracking-widest text-ink-light">{label}</span>}
            </div>
        </div>
    );
};
