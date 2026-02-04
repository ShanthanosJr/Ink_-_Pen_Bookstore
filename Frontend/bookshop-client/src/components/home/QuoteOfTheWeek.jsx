import { motion } from 'framer-motion';

const QuoteOfTheWeek = () => {
    return (
        <section className="py-16 my-8 bg-paper mx-4 md:mx-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="max-w-4xl mx-auto border border-border-linen p-2 relative shadow-[10px_10px_0_0_#f4f1ea]"
            >
                <div className="border border-border-linen p-12 text-center relative bg-paper">

                    {/* Vintage Corner Ornaments */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent-olive"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent-olive"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent-olive"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent-olive"></div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="font-serif italic text-accent-leather text-sm tracking-widest uppercase mb-8 relative inline-block px-4 bg-paper z-10"
                    >
                        Words of Wisdom
                    </motion.p>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-px bg-border-linen -z-0"></div>

                    <motion.blockquote
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="text-3xl md:text-4xl font-serif text-ink leading-relaxed mb-8 relative"
                    >
                        <span className="text-6xl text-border-linen absolute -top-8 -left-8 font-serif select-none">“</span>
                        A reader lives a thousand lives before he dies. The man who never reads lives only one.
                        <span className="text-6xl text-border-linen absolute -bottom-12 -right-4 font-serif select-none">”</span>
                    </motion.blockquote>

                    <motion.cite
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="not-italic text-lg font-body text-ink-light flex items-center justify-center gap-4"
                    >
                        <span className="w-8 h-px bg-accent-olive"></span>
                        George R.R. Martin
                        <span className="w-8 h-px bg-accent-olive"></span>
                    </motion.cite>
                </div>
            </motion.div>
        </section>
    );
};

export default QuoteOfTheWeek;
