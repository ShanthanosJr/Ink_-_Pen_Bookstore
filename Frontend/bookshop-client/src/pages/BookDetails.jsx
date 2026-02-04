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
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!book) return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
            <Link to="/shop" className="text-indigo-600 hover:underline">Return to Shop</Link>
        </div>
    );

    const readingTime = (book.id % 8) + 3; // Consistent simulated data

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition">
                    ← Back to Shop
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/2 bg-gray-100 p-12 flex items-center justify-center relative">
                        <div className="aspect-[3/4] w-64 bg-white rounded-lg shadow-2xl flex items-center justify-center transform rotate-y-12">
                            <span className="text-8xl">📚</span>
                        </div>
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-12 flex flex-col">
                        <div className="mb-auto">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {book.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                    ☕ {readingTime}h read
                                </span>
                            </div>

                            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-2">{book.title}</h1>
                            <p className="text-xl text-gray-500 font-medium mb-8">by {book.author}</p>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl font-bold text-gray-900">${book.price.toFixed(2)}</span>
                                <span className="text-lg text-gray-400 line-through">${(book.price * 1.2).toFixed(2)}</span>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                Immerse yourself in this captivating journey by {book.author}.
                                Perfect for readers looking to expand their horizons and dive into a world of knowledge and imagination.
                                This edition features high-quality paper and a durable binding, making it a perfect addition to any collection.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex gap-4">
                                <button className="flex-1 bg-indigo-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-800 transition shadow-lg shadow-indigo-200">
                                    Add to Cart
                                </button>
                                <button className="w-14 h-14 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-400 hover:text-red-500">
                                    ♥
                                </button>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                Free shipping on orders over $50 • 30-day returns
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
