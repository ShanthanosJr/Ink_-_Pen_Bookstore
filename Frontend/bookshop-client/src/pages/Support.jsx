import React from 'react';
import FAQSection from '../components/support/FAQSection';
import ReviewsSection from '../components/support/ReviewsSection';

const Support = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Hero for Support Page */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-16 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs mb-4 tracking-wide uppercase">Help Center</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">How can we help you?</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Everything you need to know about our books, shipping, and community.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                <FAQSection />
                <ReviewsSection />
            </div>

            {/* Still need help banner */}
            <div className="container mx-auto px-4 mt-20">
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                    <p className="text-gray-500 mb-8">Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        Get in Touch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
