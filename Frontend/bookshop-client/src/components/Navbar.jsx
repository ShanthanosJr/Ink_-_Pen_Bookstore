import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white/80 backdrop-blur-md text-gray-900 border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-indigo-900 flex items-center gap-2 tracking-tighter">
                    <span className="text-3xl">✒️</span> Ink & Pens
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition hidden md:block">Home</Link>
                    <Link to="/shop" className="text-gray-600 hover:text-indigo-600 font-medium transition hidden md:block">Shop</Link>
                    <Link to="/support" className="text-gray-600 hover:text-indigo-600 font-medium transition hidden md:block">Support</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition hidden md:block">Contact</Link>
                    <a href="#about" className="text-gray-600 hover:text-indigo-600 font-medium transition hidden md:block">About</a>
                </div>

                <div className="flex items-center gap-4">
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
