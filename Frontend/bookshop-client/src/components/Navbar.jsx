import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/inkandpens.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/authContextValue';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const NAV_ITEMS = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'About', to: '/about' },
    { label: 'Support', to: '/support' },
    { label: 'Contact', to: '/contact' },
];

const desktopLinkClass = ({ isActive }) =>
    `font-serif text-lg transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent-olive after:transition-all ${isActive
        ? 'text-accent-olive after:w-full font-bold'
        : 'text-ink-light hover:text-accent-olive after:w-0 hover:after:w-full'
    }`;

const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 font-serif text-lg border-b border-border-linen ${isActive ? 'text-accent-olive font-bold bg-paper-dark' : 'text-ink'}`;

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();
    // The menu remembers which page it was opened on, so it closes by itself after navigating
    const [menuOpenOn, setMenuOpenOn] = useState(null);
    const menuOpen = menuOpenOn === location.pathname;
    const isAdmin = user?.role === 'Admin';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-paper/95 backdrop-blur-sm border-b border-border-linen sticky top-0 z-50 transition-colors duration-300"
        >
            <div className="container mx-auto px-4 sm:px-6 py-3 md:py-5 flex justify-between items-center gap-3">

                {/* Logo Section */}
                <Link to="/" className="group flex items-center gap-3 min-w-0">
                    <motion.div whileHover={{ rotate: 5 }} className="flex items-center gap-2 shrink-0">
                        <img
                            src={logo}
                            alt="Ink & Pens logo"
                            className="w-9 h-9 md:w-10 md:h-10 bg-ink rounded-sm border border-ink shadow-[2px_2px_0_0_rgba(44,44,44,0.3)] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0_0_rgba(44,44,44,0.3)]"
                        />
                    </motion.div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-serif text-lg md:text-xl font-bold text-ink tracking-tight leading-none whitespace-nowrap group-hover:text-accent-olive transition-colors">Ink & Pens</span>
                        <span className="font-body text-[11px] text-ink-light tracking-[0.2em] uppercase mt-0.5 hidden sm:block">Est. 2026</span>
                    </div>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {NAV_ITEMS.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                            <NavLink to={item.to} end={item.to === '/'} className={desktopLinkClass}>
                                {item.label}
                            </NavLink>
                        </motion.div>
                    ))}
                    {isAdmin && (
                        <NavLink to="/admin" className={desktopLinkClass}>Admin</NavLink>
                    )}
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {user && (
                        <Link
                            to="/wishlist"
                            className="relative text-ink hover:text-accent-leather transition-colors"
                            aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} saved` : 'Wishlist'}
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                <path strokeLinejoin="round" d="M12 20s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 10c0 5.65-7 10-7 10z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-ink text-paper text-[11px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border border-paper">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    )}
                    <Link
                        to="/cart"
                        className="relative group text-ink hover:text-accent-olive transition-colors"
                        aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-accent-leather text-white text-[11px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border border-paper"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Link>

                    {/* Desktop account area */}
                    {user ? (
                        <div className="hidden lg:flex items-center gap-4 border-l border-border-linen pl-6">
                            <NavLink to="/orders" className={({ isActive }) => `font-serif text-sm ${isActive ? 'text-accent-olive font-bold' : 'text-ink-light hover:text-accent-olive'}`}>
                                My orders
                            </NavLink>
                            <Link to="/profile" className="flex items-center gap-3 group" aria-label="My account">
                                <div className="text-right hidden xl:block">
                                    <p className="font-serif font-bold text-ink text-sm leading-none group-hover:text-primary-700 transition-colors">{user.fullName}</p>
                                    <p className="font-body text-[11px] text-accent-olive uppercase tracking-wider mt-0.5">My account</p>
                                </div>
                                <div className="w-9 h-9 border border-border-linen bg-white rounded-full flex items-center justify-center text-ink-light font-serif text-sm italic group-hover:border-accent-olive transition-colors">
                                    {user.fullName?.charAt(0)}
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-ink-light hover:text-red-800 transition transform hover:rotate-12"
                                title="Sign out"
                                aria-label="Sign out"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center gap-4 border-l border-border-linen pl-6">
                            <Link to="/login" className="font-serif text-ink-light hover:text-accent-olive transition-colors">Login</Link>
                            <Link to="/register" className="bg-primary-800 text-white px-4 py-2 rounded shadow-sm hover:bg-primary-900 transition-all font-serif text-sm">
                                Join
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden w-10 h-10 flex items-center justify-center border border-border-linen text-ink"
                        onClick={() => setMenuOpenOn(menuOpen ? null : location.pathname)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {menuOpen
                                ? <path strokeLinecap="round" strokeWidth="1.5" d="M6 6l12 12M18 6L6 18" />
                                : <path strokeLinecap="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden overflow-hidden border-t border-border-linen bg-paper"
                    >
                        <nav aria-label="Mobile">
                            {NAV_ITEMS.map(item => (
                                <NavLink key={item.label} to={item.to} end={item.to === '/'} className={mobileLinkClass}>
                                    {item.label}
                                </NavLink>
                            ))}
                            {user ? (
                                <>
                                    <NavLink to="/orders" className={mobileLinkClass}>My Orders</NavLink>
                                    <NavLink to="/profile" className={mobileLinkClass}>My Account</NavLink>
                                    <NavLink to="/wishlist" className={mobileLinkClass}>Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}</NavLink>
                                    {isAdmin && <NavLink to="/admin" className={mobileLinkClass}>Admin Dashboard</NavLink>}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-3 font-serif text-lg text-red-800"
                                    >
                                        Sign out ({user.fullName})
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-3 p-4">
                                    <Link to="/login" className="flex-1 text-center border border-ink text-ink py-3 font-serif">Login</Link>
                                    <Link to="/register" className="flex-1 text-center bg-primary-800 text-white py-3 font-serif">Join</Link>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
