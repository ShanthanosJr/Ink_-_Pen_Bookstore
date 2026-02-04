import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

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
                <Link to="/shop" className="inline-flex items-center text-ink-light hover:text-accent-olive mb-8 transition font-serif italic">
                    ← Back to Catalog
                </Link>

                <div className="bg-paper-dark rounded-sm shadow-[8px_8px_0_0_#e5e0d8] border border-border-linen overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/2 bg-[#e3ddd3] p-12 flex items-center justify-center relative border-r border-border-linen">
                        <div className="aspect-[3/4] w-64 bg-paper rounded-sm shadow-2xl flex items-center justify-center border border-border-linen relative group overflow-hidden">
                            {/* Book Spine Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10 z-10"></div>

                            {book.imageUrl ? (
                                <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover shadow-inner" />
                            ) : (
                                <span className="text-8xl text-ink/80 font-serif">❦</span>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-12 flex flex-col">
                        <div className="mb-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="border border-ink text-ink px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                    {book.stockQuantity > 0 ? 'Available' : 'Out of Print'}
                                </span>
                                <span className="text-ink-light text-xs font-serif italic flex items-center gap-1">
                                    Est. Reading Time: {readingTime} hours
                                </span>
                            </div>

                            <h1 className="text-4xl font-serif font-bold text-ink leading-tight mb-2">{book.title}</h1>
                            <p className="text-xl text-accent-olive font-serif italic mb-8">by {book.author}</p>

                            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-dotted border-border-linen">
                                <span className="text-4xl font-serif font-bold text-ink">${book.price.toFixed(2)}</span>
                            </div>

                            <p className="text-ink-light leading-relaxed mb-8 font-body text-lg">
                                "A compelling addition to any library. This volume explores the depths of {book.title},
                                offering readers a journey through the mind of {book.author}. Finely printed on archival paper."
                            </p>
                        </div>

                        <div className="pt-8">
                            <div className="flex gap-4">
                                <button className="flex-1 bg-ink text-paper font-serif font-bold uppercase tracking-widest py-4 hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(44,44,44,0.2)]">
                                    Acquire Volume
                                </button>
                                <button className="w-16 flex items-center justify-center border border-ink text-ink hover:bg-paper-dark transition text-2xl">
                                    ♡
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-ink-light mt-4 uppercase tracking-widest">
                                Secure Packaging • 30-Day Return Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
