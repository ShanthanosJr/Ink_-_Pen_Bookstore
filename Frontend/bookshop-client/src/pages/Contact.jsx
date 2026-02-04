import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';

const Contact = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 mb-12">
                <div className="container mx-auto px-4 py-16 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs mb-4 tracking-wide uppercase">Get in Touch</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">We'd Love to Hear from You</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Whether you have a question about an order, a book recommendation, or just want to say hello, our team is ready to answer all your questions.
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
