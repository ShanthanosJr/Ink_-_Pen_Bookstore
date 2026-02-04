import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';

const Contact = () => {
    return (
        <div className="bg-paper-dark min-h-screen pb-20">
            {/* Header */}
            <div className="bg-paper border-b-2 border-border-linen mb-12 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-olive to-ink opacity-20"></div>

                <div className="container mx-auto px-4 py-20 text-center">
                    <span className="inline-block py-1 px-3 border border-ink/30 text-ink font-serif italic text-xs mb-6 tracking-wide uppercase">The Post</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-6 tracking-tight">Correspondence</h1>
                    <p className="text-xl text-ink-light max-w-2xl mx-auto font-body italic">
                        We eagerly await your letters, queries, and literary musings.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left Column: Form */}
                    <div className="order-2 lg:order-1">
                        <ContactForm />
                    </div>

                    {/* Right Column: Info */}
                    <div className="order-1 lg:order-2">
                        <ContactInfo />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
