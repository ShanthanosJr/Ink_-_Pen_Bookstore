import React from 'react';
import { motion } from 'framer-motion';

const ContactInfo = () => {
    const cardVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2, delayChildren: 1 }}
            className="space-y-8"
        >
            {/* Contact Details Card - Visiting Card Style */}
            <motion.div
                variants={cardVariants}
                className="bg-paper p-10 rounded-sm shadow-sm border border-border-linen relative"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-accent-olive/30"></div>
                <h3 className="text-xl font-serif font-bold text-ink mb-8 border-b border-border-linen pb-4">Visiting Card</h3>

                <div className="space-y-8">
                    <div className="flex items-start gap-6">
                        <div className="w-8 h-8 rounded-full border border-ink/30 flex items-center justify-center flex-shrink-0 font-serif text-lg bg-paper-dark">
                            📍
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-ink mb-1">The Shoppe</h4>
                            <p className="text-ink-light font-body leading-relaxed italic">
                                123 Book Lane, Sri Lanka<br />
                                Book City, IP 10101
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-6">
                        <div className="w-8 h-8 rounded-full border border-ink/30 flex items-center justify-center flex-shrink-0 font-serif text-lg bg-paper-dark">
                            📞
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-ink mb-1">Telephone</h4>
                            <p className="text-ink-light font-body">+741 257 9316</p>
                            <p className="text-[10px] uppercase tracking-widest text-accent-olive mt-1">Weekdays, 9am - 6pm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-6">
                        <div className="w-8 h-8 rounded-full border border-ink/30 flex items-center justify-center flex-shrink-0 font-serif text-lg bg-paper-dark">
                            ✉️
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-ink mb-1">Post</h4>
                            <p className="text-ink-light font-body">hello@inkandpens.com</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Map Placeholder - Engraving Style */}
            <motion.div
                variants={cardVariants}
                className="bg-paper-dark rounded-sm h-64 w-full relative overflow-hidden group border border-border-linen p-2"
            >
                <div className="w-full h-full border border-ink/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center grayscale contrast-75 sepia group-hover:grayscale-0 transition duration-1000 transform group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524813686514-a57563d77965?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-paper/90 backdrop-blur-sm px-6 py-3 border border-ink/50 flex items-center gap-2 shadow-lg">
                            <span className="text-accent-leather animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-leather opacity-10"></span>
                            <span className="text-accent-leather relative">📍</span>
                            <span className="font-serif font-bold text-ink text-sm uppercase tracking-widest">Locate Us</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mission / Why Us - Manifesto Style */}
            <motion.div
                variants={cardVariants}
                className="bg-ink text-paper p-10 rounded-sm relative overflow-hidden border-4 border-double border-border-linen/20"
            >
                <div className="relative z-10">
                    <h3 className="text-xl font-serif font-bold mb-4 border-b border-paper/20 pb-4 inline-block">Our Manifesto</h3>
                    <p className="text-paper/80 text-sm leading-relaxed mb-4 font-body">
                        "We believe that every volume holds a universe waiting to be unfolded. Our mission is to bridge the gap between mind and page."
                    </p>
                    <p className="text-paper/80 text-sm leading-relaxed font-body italic">
                        — The Ink & Pens Collective
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ContactInfo;
