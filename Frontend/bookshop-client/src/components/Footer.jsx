import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-ink text-paper-dark py-16 border-t-8 border-accent-olive relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 border border-paper-dark flex items-center justify-center font-serif text-lg">IP</div>
                            <h3 className="text-2xl font-serif font-bold text-paper">Ink & Pens</h3>
                        </div>
                        <p className="text-sm font-body leading-relaxed mb-6 opacity-80">
                            A sanctuary for stories. We believe in the power of the written word and the beauty of a well-crafted book.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons - Styled minimal */}
                            {['𝕏', '📘', '📸'].map((icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center border border-paper/20 hover:border-accent-olive hover:text-accent-olive transition-colors font-serif">
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-accent-olive font-serif font-bold tracking-widest uppercase text-xs mb-6 border-b border-paper/10 pb-2 inline-block">Collection</h4>
                        <ul className="space-y-3 text-sm font-body opacity-80">
                            <li><a href="#" className="hover:text-accent-olive transition-colors">Fiction</a></li>
                            <li><a href="#" className="hover:text-accent-olive transition-colors">Non-Fiction</a></li>
                            <li><a href="#" className="hover:text-accent-olive transition-colors">Children's Books</a></li>
                            <li><a href="#" className="hover:text-accent-olive transition-colors">Textbooks</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-accent-olive font-serif font-bold tracking-widest uppercase text-xs mb-6 border-b border-paper/10 pb-2 inline-block">Assistance</h4>
                        <ul className="space-y-3 text-sm font-body opacity-80">
                            <li><Link to="/about" className="hover:text-accent-olive transition-colors">Our Story</Link></li>
                            <li><a href="#" className="hover:text-accent-olive transition-colors">Order Status</a></li>
                            <li><a href="#" className="hover:text-accent-olive transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-accent-olive transition-colors">Returns</a></li>
                            <li><Link to="/contact" className="hover:text-accent-olive transition-colors">Contact Us</Link></li>
                            <li><Link to="/admin" className="hover:text-accent-olive transition-colors opacity-50 text-xs">Admin Ledger</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-accent-olive font-serif font-bold tracking-widest uppercase text-xs mb-6 border-b border-paper/10 pb-2 inline-block">Contact</h4>
                        <ul className="space-y-3 text-sm font-body opacity-80">
                            <li>123 Book Lane, Sri Lanka</li>
                            <li>support@inkandpens.com</li>
                            <li>+74 123-4567</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-paper/10 pt-8 text-center text-xs font-serif uppercase tracking-widest opacity-40">
                    &copy; {new Date().getFullYear()} Ink & Pens Bookstore. Est. 2026.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
