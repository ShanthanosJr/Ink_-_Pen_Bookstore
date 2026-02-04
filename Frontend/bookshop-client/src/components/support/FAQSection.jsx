import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                className="w-full py-4 text-left flex justify-between items-center focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`font-medium transition-colors ${isOpen ? 'text-indigo-600' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                    {question}
                </span>
                <span className={`ml-6 flex-shrink-0 text-indigo-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-gray-500 leading-relaxed pr-8">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const faqs = [
        {
            category: "Orders & Shipping",
            items: [
                { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout." },
                { q: "Can I track my order?", a: "Absolutey! Once your order ships, we'll send you a tracking link via email so you can follow its journey." },
                { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries. International shipping times vary between 7-14 business days." }
            ]
        },
        {
            category: "Returns & Refunds",
            items: [
                { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. If you're not satisfied, simply return the book in its original condition for a full refund." },
                { q: "How do I initiate a return?", a: "Contact our support team at support@inkandpens.com with your order number, and we'll send you a prepaid return label." }
            ]
        },
        {
            category: "Payments",
            items: [
                { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and Apple Pay." },
                { q: "Is my payment information secure?", a: "Yes, all transactions are encrypted using industry-standard SSL technology. We do not store your credit card details." }
            ]
        }
    ];

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Have questions? We're here to help. If you can't find what you're looking for, please contact our support team.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {faqs.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                                {idx + 1}
                            </span>
                            {section.category}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, i) => (
                                <FAQItem key={i} question={item.q} answer={item.a} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;
