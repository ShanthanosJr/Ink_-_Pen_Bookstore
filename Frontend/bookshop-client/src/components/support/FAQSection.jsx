import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-border-linen last:border-0">
            <button
                className="w-full py-5 text-left flex justify-between items-start focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`font-serif italic text-lg transition-colors ${isOpen ? 'text-accent-olive font-bold' : 'text-ink group-hover:text-accent-olive'}`}>
                    Q: {question}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 flex-shrink-0 text-accent-olive"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="text-ink-light pl-6 border-l-2 border-accent-olive/30 font-body leading-relaxed mb-6">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => {
    const faqs = [
        {
            category: "Acquisitions & Delivery",
            items: [
                { q: "How long until my volume arrives?", a: "Standard delivery for our volumes takes 3-5 business days. Express courier service (1-2 days) is available upon request." },
                { q: "Do you offer tracking?", a: "Indeed. Once dispatched, a courier number will be sent for you to follow its journey." },
                { q: "Do you ship internationally?", a: "We ship to over 50 nations. International transits typically range from 7-14 days." }
            ]
        },
        {
            category: "Returns & Restorations",
            items: [
                { q: "What is your policy on returns?", a: "Use our 30-day inspection period. If the volume does not suit your library, return it in original condition." },
                { q: "How do I initiate a return?", a: "Correspondence regarding returns should be directed to support@inkandpens.com." }
            ]
        },
        {
            category: "Payments",
            items: [
                { q: "Which methods of payment are accepted?", a: "We accept all major credit cards, PayPal, and Apple Pay." },
                { q: "Is my transaction secure?", a: "Your privacy is paramount. All transactions are encrypted and no details are stored." }
            ]
        }
    ];

    return (
        <div className="bg-paper shadow-sm border border-border-linen p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <div className="text-center mb-12 relative z-10">
                <span className="font-serif italic text-accent-olive text-sm mb-2 block">Common Inquiries</span>
                <h2 className="text-3xl font-serif font-bold text-ink mb-4">The Librarian's Guide</h2>
                <div className="w-24 h-px bg-accent-olive mx-auto opacity-50"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 relative z-10">
                {faqs.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                    >
                        <h3 className="text-xl font-serif font-bold text-ink mb-6 flex items-center gap-3 border-b-2 border-ink pb-2">
                            <span className="w-6 h-6 rounded-full border border-ink text-ink flex items-center justify-center text-xs font-body">
                                {['I', 'II', 'III'][idx] || idx + 1}
                            </span>
                            {section.category}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, i) => (
                                <FAQItem key={i} question={item.q} answer={item.a} />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;
