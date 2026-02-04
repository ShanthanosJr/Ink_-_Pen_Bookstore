import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Full name is required";
        if (!formData.email.trim()) {
            tempErrors.email = "Address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Address is invalid";
        }
        if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
        if (!formData.message.trim()) tempErrors.message = "Message is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setTimeout(() => {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 1000);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isSubmitted ? (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-paper p-12 rounded-sm shadow-[4px_4px_0_0_#e5e0d8] border border-border-linen flex flex-col items-center justify-center text-center h-full min-h-[500px]"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="w-16 h-16 border-2 border-accent-olive text-accent-olive rounded-full flex items-center justify-center mb-6"
                    >
                        <span className="text-3xl font-serif">✓</span>
                    </motion.div>
                    <h3 className="text-2xl font-serif font-bold text-ink mb-2">Correspondence Received</h3>
                    <p className="text-ink-light font-body italic">We shall review your letter with haste.</p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-8 text-accent-olive font-serif font-bold hover:underline border-b border-accent-olive pb-1"
                    >
                        Write Another Letter
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-paper p-12 rounded-sm shadow-[8px_8px_0_0_#e5e0d8] border border-border-linen relative"
                >
                    <div className="absolute top-4 right-4 w-12 h-16 border border-ink/20 flex items-center justify-center opacity-30 rotate-3">
                        <span className="text-[8px] uppercase tracking-widest text-center leading-tight">Postage<br />Paid</span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-ink mb-8">Draft a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-transparent border-b-2 ${errors.name ? 'border-red-800' : 'border-ink/20 focus:border-accent-olive'} focus:outline-none transition-colors font-serif text-ink placeholder-ink-light/30`}
                                placeholder="e.g. Ernest H."
                            />
                            {errors.name && <p className="text-red-800 text-xs mt-1 font-serif italic">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Return Address (Email)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-transparent border-b-2 ${errors.email ? 'border-red-800' : 'border-ink/20 focus:border-accent-olive'} focus:outline-none transition-colors font-serif text-ink placeholder-ink-light/30`}
                                placeholder="e.g. ernest@writings.com"
                            />
                            {errors.email && <p className="text-red-800 text-xs mt-1 font-serif italic">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Topic</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-transparent border-b-2 ${errors.subject ? 'border-red-800' : 'border-ink/20 focus:border-accent-olive'} focus:outline-none transition-colors font-serif text-ink cursor-pointer`}
                            >
                                <option value="">Select a Inquiry Type</option>
                                <option value="Order Support">Order Inquiry</option>
                                <option value="General Inquiry">General Correspondence</option>
                                <option value="Feedback">Reader Feedback</option>
                                <option value="Other">Other Matters</option>
                            </select>
                            {errors.subject && <p className="text-red-800 text-xs mt-1 font-serif italic">{errors.subject}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Your Words</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-3 bg-paper-dark border border-ink/20 ${errors.message ? 'border-red-800' : 'focus:border-accent-olive'} focus:outline-none transition-colors font-serif text-ink resize-none leading-relaxed`}
                                placeholder="Dear Ink & Pens..."
                                style={{ backgroundImage: 'linear-gradient(transparent 1.9rem, rgba(0,0,0,0.05) 2rem)', backgroundSize: '100% 2rem', lineHeight: '2rem' }}
                            ></textarea>
                            {errors.message && <p className="text-red-800 text-xs mt-1 font-serif italic">{errors.message}</p>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-ink text-paper font-serif font-bold uppercase tracking-widest py-4 border border-ink shadow-[4px_4px_0_0_rgba(85,107,47,0.2)] hover:bg-accent-olive transition-colors"
                        >
                            Post Letter
                        </motion.button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContactForm;
