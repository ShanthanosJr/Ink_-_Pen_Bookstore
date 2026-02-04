import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';

const Contact = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    return (
        <div className="bg-paper-dark min-h-screen pb-20">
            {/* Header */}
            <motion.div
                initial="hidden"
                animate="visible"
                className="bg-paper border-b-2 border-border-linen mb-12 relative"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-olive to-ink opacity-20"></div>

                <div className="container mx-auto px-4 py-20 text-center">
                    <motion.span
                        variants={fadeIn}
                        className="inline-block py-1 px-3 border border-ink/30 text-ink font-serif italic text-xs mb-6 tracking-wide uppercase"
                    >
                        The Post
                    </motion.span>
                    <motion.h1
                        variants={fadeIn}
                        className="text-4xl md:text-5xl font-serif font-bold text-ink mb-6 tracking-tight"
                    >
                        Correspondence
                    </motion.h1>
                    <motion.p
                        variants={fadeIn}
                        className="text-xl text-ink-light max-w-2xl mx-auto font-body italic"
                    >
                        We eagerly await your letters, queries, and literary musings.
                    </motion.p>
                </div>
            </motion.div>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="order-2 lg:order-1"
                    >
                        <ContactForm />
                    </motion.div>

                    {/* Right Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="order-1 lg:order-2"
                    >
                        <ContactInfo />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
