import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Promotions = () => {
    return (
        <section
            className="py-16 bg-ink text-paper my-16 px-8 relative overflow-hidden border-4 border-double border-accent-olive/40 mx-4 md:mx-0"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none paper-grain"></div>

            {/* Decorative Corner Ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-accent-olive/40"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-accent-olive/40"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                    <span
                        className="inline-block py-1 px-4 border border-accent-olive-light/60 text-accent-olive-light font-serif italic text-xs mb-6 tracking-widest uppercase bg-ink/50"
                    >
                        Limited Time Proclamation
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight"
                    >
                        Get 50% Off Your <br /><span className="italic font-normal text-accent-olive-light">First Purchase</span>
                    </h2>
                    <p
                        className="text-paper/80 text-lg mb-8 font-body leading-relaxed"
                    >
                        Join the <span className="text-paper font-bold">Ink & Pens</span> community today and discover a world of stories awaiting you.
                        Use code <span className="bg-paper text-ink px-3 py-1 font-serif font-bold mx-1 border border-ink shadow-[2px_2px_0_0_rgba(85,107,47,0.5)]">WELCOME50</span> at checkout on your first order.
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Link to="/shop" className="bg-paper text-ink px-10 py-4 font-serif font-bold uppercase tracking-widest text-sm hover:bg-accent-olive hover:text-paper transition-all border border-ink shadow-[4px_4px_0_0_rgba(85,107,47,0.3)] inline-block">
                            Claim Offer
                        </Link>
                    </motion.div>
                </div>

                <div className="md:w-1/2 flex justify-center">
                    <div className="bg-paper-dark text-ink p-8 border border-border-linen shadow-xl max-w-sm w-full">
                        <p className="font-serif font-bold text-lg uppercase tracking-widest border-b border-border-linen pb-4 mb-4">How it works</p>
                        <ol className="space-y-3 font-serif text-sm list-decimal list-inside">
                            <li>Create a free account.</li>
                            <li>Fill your cart with any books you like.</li>
                            <li>Enter <strong>WELCOME50</strong> at checkout for 50% off your first order.</li>
                        </ol>
                        <p className="mt-6 pt-4 border-t border-border-linen text-xs font-serif text-ink-light">
                            Shipping is free on orders over $50.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Promotions;
