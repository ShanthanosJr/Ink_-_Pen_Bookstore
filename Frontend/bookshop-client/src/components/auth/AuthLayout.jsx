import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import logo from '../../assets/inkandpens.png';
import BookCover from '../shop/BookCover';

const PERKS = [
    ['Track every order', 'From review to your doorstep, step by step.'],
    ['Save books for later', 'Keep a wishlist of what you want to read next.'],
    ['50% off your first order', 'Use WELCOME50 at checkout.'],
];

// Fan of real covers from the catalogue (falls back to plain spines if none load)
const CoverFan = () => {
    const [covers, setCovers] = useState([]);

    useEffect(() => {
        api.get('/books')
            .then(res => setCovers(res.data.filter(b => b.imageUrl).slice(0, 5)))
            .catch(() => setCovers([]));
    }, []);

    const slots = covers.length ? covers : Array.from({ length: 5 }, (_, i) => ({ id: i }));
    const middle = (slots.length - 1) / 2;

    return (
        <div className="relative h-56 xl:h-64 w-full max-w-md mx-auto" aria-hidden="true">
            {slots.map((book, i) => {
                const offset = i - middle;
                return (
                    <div
                        key={book.id}
                        className="absolute left-1/2 bottom-0 w-28 xl:w-32 aspect-[2/3] origin-bottom transition-transform duration-500 ease-out hover:-translate-y-3"
                        style={{
                            transform: `translateX(calc(-50% + ${offset * 84}px)) rotate(${offset * 8}deg) translateY(${Math.abs(offset) * 14}px)`,
                            zIndex: 10 - Math.abs(Math.round(offset)),
                        }}
                    >
                        <div className="w-full h-full rounded-[3px] overflow-hidden bg-[#3a3a36] border border-white/10 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]">
                            <BookCover book={book} loading="eager" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Split-screen frame for the login and sign-up pages:
 * a dark "library" panel on the left (top band on phones) and the form on the right.
 */
const AuthLayout = ({ mode, eyebrow, title, subtitle, children }) => (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-paper">
        {/* Library panel */}
        <aside className="relative overflow-hidden bg-ink text-paper px-6 py-10 lg:px-14 lg:py-16 flex flex-col">
            {/* Soft light and paper grain, drawn with CSS only */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
                style={{
                    backgroundImage:
                        'radial-gradient(ellipse at 20% 0%, rgba(85,107,47,0.45), transparent 55%),' +
                        'radial-gradient(ellipse at 90% 100%, rgba(139,69,19,0.35), transparent 50%),' +
                        'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 4px)'
                }}
            />
            <div className="relative z-10 flex flex-col h-full">
                {/* No site navbar on these pages, so the logo leads home */}
                <Link to="/" className="group inline-flex items-center gap-3 self-start" aria-label="Ink & Pens home">
                    <img src={logo} alt="" className="w-11 h-11 rounded-sm border border-paper/20 shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] transition-transform group-hover:-translate-y-0.5" />
                    <span className="flex flex-col">
                        <span className="font-serif text-xl font-bold leading-none group-hover:text-[#b5c48f] transition-colors">Ink &amp; Pens</span>
                        <span className="font-serif italic text-[#b5c48f] text-xs tracking-wide mt-1">Members' entrance</span>
                    </span>
                </Link>

                <div className="hidden lg:block mt-14">
                    <CoverFan />
                </div>

                <blockquote className="mt-6 lg:mt-14 max-w-lg">
                    <p className="font-serif text-2xl lg:text-4xl leading-snug">
                        “A room without books is like a body without a soul.”
                    </p>
                    <footer className="mt-3 font-body italic text-paper/70 text-sm">Marcus Tullius Cicero</footer>
                </blockquote>

                <ul className="hidden lg:grid gap-5 mt-auto pt-12 max-w-lg">
                    {PERKS.map(([perk, detail]) => (
                        <li key={perk} className="flex gap-4">
                            <span className="mt-1 h-6 w-6 shrink-0 rounded-full border border-[#b5c48f]/60 text-[#b5c48f] flex items-center justify-center text-xs" aria-hidden="true">✓</span>
                            <span>
                                <span className="block font-serif font-bold">{perk}</span>
                                <span className="block font-body text-sm text-paper/70">{detail}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>

        {/* Form panel */}
        <section className="flex items-center justify-center px-5 py-12 lg:px-16">
            <div className="w-full max-w-md">
                <Link to="/shop" className="inline-flex items-center gap-2 mb-8 font-body text-sm text-ink-light hover:text-ink">
                    <span aria-hidden="true">←</span> Back to the shop
                </Link>

                {/* Switch between the two pages */}
                <nav className="grid grid-cols-2 p-1 mb-10 bg-paper-dark border border-border-linen rounded-sm" aria-label="Account">
                    {[['login', 'Log in', '/login'], ['register', 'Create account', '/register']].map(([id, label, to]) => (
                        <Link
                            key={id}
                            to={to}
                            replace
                            aria-current={mode === id ? 'page' : undefined}
                            className={`text-center py-2.5 rounded-sm font-serif text-sm transition-colors ${mode === id ? 'bg-ink text-paper shadow-sm' : 'text-ink-light hover:text-ink'}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <p className="font-serif italic text-accent-olive">{eyebrow}</p>
                <h1 className="mt-1 text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight">{title}</h1>
                {subtitle && <p className="mt-3 font-body text-ink-light">{subtitle}</p>}

                <div className="mt-8">{children}</div>
            </div>
        </section>
    </div>
);

export default AuthLayout;
