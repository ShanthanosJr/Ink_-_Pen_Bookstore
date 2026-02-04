import { motion } from 'framer-motion';

const Newsletter = () => {
    return (
        <section className="py-20 my-10 bg-paper relative mx-4 md:mx-0">
            {/* Decorative Top Border as Envelope Flap */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent-olive via-ink to-accent-leather opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
                className="max-w-3xl mx-auto px-8 py-12 border border-border-linen bg-paper-dark shadow-[8px_8px_0_0_#e5e0d8]"
            >
                <div className="text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="font-serif italic text-accent-olive text-sm mb-4 block"
                    >
                        Correspondence
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-4xl font-serif font-bold text-ink mb-4"
                    >
                        Letters from the Editor
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-ink-light mb-10 text-lg font-body leading-relaxed max-w-xl mx-auto"
                    >
                        Join our circle of readers. Receive news on rare acquisitions,
                        author discourses, and literary gatherings.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        whileInView={{ opacity: 1, width: '100%' }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto border-b-2 border-ink"
                    >
                        <input
                            type="email"
                            placeholder="Your correspondence address..."
                            className="flex-1 px-4 py-3 bg-transparent font-serif text-ink placeholder-ink-light/50 focus:outline-none focus:bg-paper/50 transition-colors"
                        />
                        <button className="px-8 py-3 bg-transparent text-ink font-serif font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors text-sm border-l border-ink/20">
                            Subscribe
                        </button>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-[10px] uppercase tracking-widest text-ink-light mt-6"
                    >
                        We honor the privacy of your study.
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
};

export default Newsletter;
