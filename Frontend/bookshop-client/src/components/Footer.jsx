import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Ink & Pens</h3>
                        <p className="text-sm leading-relaxed mb-4">
                            Your one-stop destination for knowledge, stories, and inspiration. We bring the best books to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholder */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition">𝕏</a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition">📘</a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition">📸</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Fiction</a></li>
                            <li><a href="#" className="hover:text-white transition">Non-Fiction</a></li>
                            <li><a href="#" className="hover:text-white transition">Children's Books</a></li>
                            <li><a href="#" className="hover:text-white transition">Textbooks</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Order Status</a></li>
                            <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Returns</a></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                            <li><Link to="/admin" className="hover:text-white transition opacity-50 text-xs">Admin Panel</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>123 Book Lane, Sri Lanka</li>
                            <li>support@inkandpens.com</li>
                            <li>+74 123-4567</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Ink & Pens Bookstore. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
