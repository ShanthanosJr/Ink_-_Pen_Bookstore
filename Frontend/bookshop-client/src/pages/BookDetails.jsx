import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-paper">
            <div className="font-serif italic text-ink text-xl animate-pulse">Retrieving from archives...</div>
        </div>
    );

    if (!book) return (
        <div className="container mx-auto px-4 py-20 text-center bg-paper min-h-screen">
            <h2 className="text-2xl font-serif font-bold text-ink mb-4">Volume not found</h2>
            <Link to="/shop" className="text-accent-olive hover:underline font-serif italic">Return to Catalog</Link>
        </div>
    );

    const readingTime = (book.id % 8) + 3;

    return (
        <div className="bg-paper min-h-screen py-12 relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link to="/shop" className="inline-flex items-center text-ink-light hover:text-accent-olive mb-8 transition font-serif italic">
                        ← Back to Catalog
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-paper-dark rounded-sm shadow-[8px_8px_0_0_#e5e0d8] border border-border-linen overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row"
                >
                    {/* Image Section */}
                    <div className="md:w-1/2 bg-[#e3ddd3] p-12 flex items-center justify-center relative border-r border-border-linen">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="aspect-[3/4] w-64 bg-paper rounded-sm shadow-2xl flex items-center justify-center border border-border-linen relative group overflow-hidden"
                        >
                            {/* Book Spine Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10 z-10"></div>

                            {book.imageUrl ? (
                                <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover shadow-inner" />
                            ) : (
                                <span className="text-8xl text-ink/80 font-serif">❦</span>
                            )}
                        </motion.div>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-12 flex flex-col">
                        <div className="mb-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-4 mb-6"
                            >
                                <span className="border border-ink text-ink px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                    {book.stockQuantity > 0 ? 'Available' : 'Out of Print'}
                                </span>
                                <span className="text-ink-light text-xs font-serif italic flex items-center gap-1">
                                    Est. Reading Time: {readingTime} hours
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-4xl font-serif font-bold text-ink leading-tight mb-2"
                            >
                                {book.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="text-xl text-accent-olive font-serif italic mb-8"
                            >
                                by {book.author}
                            </motion.p>

                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="flex items-baseline gap-4 mb-8 pb-8 border-b border-dotted border-border-linen"
                            >
                                <span className="text-4xl font-serif font-bold text-ink">${book.price.toFixed(2)}</span>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-ink-light leading-relaxed mb-8 font-body text-lg"
                            >
                                "A compelling addition to any library. This volume explores the depths of {book.title},
                                offering readers a journey through the mind of {book.author}. Finely printed on archival paper."
                            </motion.p>
                        </div>

                        <div className="pt-8">
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 bg-ink text-paper font-serif font-bold uppercase tracking-widest py-4 hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(44,44,44,0.2)]"
                                >
                                    Acquire Volume
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="w-16 flex items-center justify-center border border-ink text-ink hover:bg-paper-dark transition text-2xl"
                                >
                                    ♡
                                </motion.button>
                            </div>
                            <p className="text-center text-[10px] text-ink-light mt-4 uppercase tracking-widest">
                                Secure Packaging • 30-Day Return Policy
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookDetails;
