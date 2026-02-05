import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/inkandpens.png';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

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
            <div className="container mx-auto px-6 py-5 flex justify-between items-center">

                {/* Logo Section */}
                <Link to="/" className="group flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 5 }}
                        className="flex items-center gap-2"
                    >
                        <img
                            src={logo}
                            alt=""
                            className="w-10 h-10 bg-ink text-paper rounded-sm flex items-center justify-center font-serif text-xl border border-ink shadow-[2px_2px_0_0_rgba(44,44,44,0.3)] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0_0_rgba(44,44,44,0.3)]"
                        />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="font-serif text-xl font-bold text-ink tracking-tight leading-none group-hover:text-accent-olive transition-colors">Ink & Pens</span>
                        <span className="font-body text-[10px] text-ink-light tracking-[0.2em] uppercase mt-0.5">Est. 2026</span>
                    </div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Home', 'Shop', 'About', 'Support', 'Contact'].map((item, idx) => (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                            <NavLink
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className={({ isActive }) =>
                                    `font-serif text-lg transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent-olive after:transition-all ${isActive
                                        ? 'text-accent-olive after:w-full font-bold'
                                        : 'text-ink-light hover:text-accent-olive after:w-0 hover:after:w-full'
                                    }`
                                }
                            >
                                {item}
                            </NavLink>
                        </motion.div>
                    ))}
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-6">
                    {/* Cart Icon */}
                    <Link to="/cart" className="relative group text-ink hover:text-accent-olive transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-accent-leather text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-paper"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Link>

                    {user ? (
                        <>
                            {/* Library Card Style Profile */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3 border-l border-border-linen pl-6"
                            >
                                <Link to="/profile" className="flex items-center gap-3 group">
                                    <div className="text-right hidden sm:block">
                                        <p className="font-serif font-bold text-ink text-sm leading-none group-hover:text-primary-700 transition-colors">{user.fullName}</p>
                                        <p className="font-body text-[10px] text-accent-olive uppercase tracking-wider mt-0.5">Bookworm Mode</p>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-9 h-9 border border-border-linen bg-white rounded-full flex items-center justify-center text-ink-light font-serif text-sm italic hover:border-accent-olive transition-colors"
                                    >
                                        {user.fullName.charAt(0)}
                                    </motion.div>
                                </Link>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, rotate: -30 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                onClick={handleLogout}
                                className="text-ink-light hover:text-red-800 transition transform hover:rotate-12"
                                title="Sign Out"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </motion.button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4 border-l border-border-linen pl-6">
                            <Link to="/login" className="font-serif text-ink-light hover:text-accent-olive transition-colors">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-primary-800 text-white px-4 py-2 rounded shadow-sm hover:bg-primary-900 transition-all font-serif text-sm"
                            >
                                Join
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
