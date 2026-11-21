import { Link } from 'react-router-dom';
import logo from '../assets/inkandpens.png';

const Footer = () => {
    return (
        <footer className="bg-ink text-paper-dark py-16 border-t-8 border-accent-olive relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 paper-grain"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={logo} alt="" className="w-9 h-9 bg-ink rounded-sm border border-paper/20" />
                            <h3 className="text-2xl font-serif font-bold text-paper">Ink & Pens</h3>
                        </div>
                        <p className="text-sm font-body leading-relaxed mb-6 opacity-80">
                            A sanctuary for stories. We believe in the power of the written word and the beauty of a well-crafted book.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-accent-olive-light font-serif font-bold tracking-widest uppercase text-xs mb-6 border-b border-paper/10 pb-2 inline-block">Collection</h4>
                        <ul className="space-y-3 text-sm font-body opacity-80">
                            <li><Link to="/shop?category=Fiction" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Fiction</Link></li>
                            <li><Link to="/shop?category=Non-Fiction" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Non-Fiction</Link></li>
                            <li><Link to="/shop?category=Technology" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Technology</Link></li>
                            <li><Link to="/shop?category=History" className="hover:text-paper hover:underline underline-offset-4 transition-colors">History</Link></li>
                            <li><Link to="/shop?category=Art%20%26%20Design" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Art &amp; Design</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-accent-olive-light font-serif font-bold tracking-widest uppercase text-xs mb-6 border-b border-paper/10 pb-2 inline-block">Assistance</h4>
                        <ul className="space-y-3 text-sm font-body opacity-80">
                            <li><Link to="/about" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Our Story</Link></li>
                            <li><Link to="/orders" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Order Status</Link></li>
                            <li><Link to="/support" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Shipping &amp; Returns</Link></li>
                            <li><Link to="/contact" className="hover:text-paper hover:underline underline-offset-4 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-accent-olive-light font-serif font-bold tracking-widest uppercase text-xs mb-6 border-b border-paper/10 pb-2 inline-block">Contact</h4>
                        <ul className="space-y-3 text-sm font-body opacity-80">
                            <li>123 Book Lane, Sri Lanka</li>
                            <li><a href="mailto:support@inkandpens.com" className="hover:text-paper hover:underline underline-offset-4 transition-colors">support@inkandpens.com</a></li>
                            <li>+94 74 123-4567</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-paper/10 pt-8 text-center text-xs font-serif uppercase tracking-widest opacity-70">
                    &copy; {new Date().getFullYear()} Ink & Pens Bookstore. Est. 2026.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
