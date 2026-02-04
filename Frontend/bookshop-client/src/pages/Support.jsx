import React from 'react';
import FAQSection from '../components/support/FAQSection';
import ReviewsSection from '../components/support/ReviewsSection';

const Support = () => {
    return (
        <div className="bg-paper-dark min-h-screen pb-20">
            {/* Header / Hero for Support Page */}
            <div className="bg-paper border-b border-border-linen relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                <div className="container mx-auto px-4 py-20 text-center relative z-10">
                    <span className="inline-block py-1 px-3 border border-accent-olive text-accent-olive font-serif italic text-xs mb-6 tracking-wide uppercase bg-paper-dark">Assistance Desk</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-ink mb-6 tracking-tight">How may we assist you?</h1>
                    <p className="text-xl text-ink-light max-w-2xl mx-auto font-body italic">
                        Guidance on acquisitions, shipping, and our community.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <FAQSection />
                <ReviewsSection />
            </div>

            {/* Still need help banner */}
            <div className="container mx-auto px-4 mt-20">
                <div className="bg-paper rounded-sm p-12 text-center shadow-lg border border-border-linen relative">
                    <div className="absolute inset-0 border-4 border-double border-border-linen m-2 pointer-events-none"></div>
                    <h3 className="text-2xl font-serif font-bold text-ink mb-4">Further Inquiries?</h3>
                    <p className="text-ink-light mb-8 font-body italic">Our librarians are at your disposal for specific requests.</p>
                    <button className="bg-ink text-paper px-10 py-4 font-serif font-bold uppercase tracking-widest hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(44,44,44,0.2)]">
                        Correspond With Us
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
