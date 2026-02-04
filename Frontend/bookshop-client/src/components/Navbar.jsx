import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-paper/95 backdrop-blur-sm border-b border-border-linen sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto px-6 py-5 flex justify-between items-center">

                {/* Logo Section */}
                <Link to="/" className="group flex items-center gap-3">
                    <div className="w-10 h-10 bg-ink text-paper rounded-sm flex items-center justify-center font-serif text-xl border border-ink shadow-[2px_2px_0_0_rgba(44,44,44,0.3)] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0_0_rgba(44,44,44,0.3)]">
                        IP
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-xl font-bold text-ink tracking-tight leading-none group-hover:text-accent-olive transition-colors">Ink & Pens</span>
                        <span className="font-body text-[10px] text-ink-light tracking-[0.2em] uppercase mt-0.5">Est. 2026</span>
                    </div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Home', 'Shop', 'Support', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            className="font-serif text-ink-light hover:text-accent-olive text-lg transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-accent-olive after:transition-all hover:after:w-full"
                        >
                            {item}
                        </Link>
                    ))}
                    <a href="#about" className="font-serif text-ink-light hover:text-accent-olive text-lg transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-accent-olive after:transition-all hover:after:w-full">About</a>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-6">
                    {/* Library Card Style Profile */}
                    <div className="flex items-center gap-3 border-l border-border-linen pl-6">
                        <div className="text-right hidden sm:block">
                            <p className="font-serif font-bold text-ink text-sm leading-none">MK. Kavishka</p>
                            <p className="font-body text-[10px] text-accent-olive uppercase tracking-wider mt-0.5">Mem. No. 4921</p>
                        </div>
                        <div className="w-9 h-9 border border-border-linen bg-white rounded-full flex items-center justify-center text-ink-light font-serif text-sm italic group cursor-pointer hover:border-accent-olive transition-colors">
                            K.R
                        </div>
                    </div>

                    <button
                        onClick={() => alert('Signed out successfully (Mock)')}
                        className="text-ink-light hover:text-red-800 transition transform hover:rotate-12"
                        title="Sign Out"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
