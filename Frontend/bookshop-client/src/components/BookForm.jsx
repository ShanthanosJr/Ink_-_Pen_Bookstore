import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const BookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [book, setBook] = useState({
        title: '',
        author: '',
        price: '',
        stockQuantity: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const fetchBook = async () => {
                try {
                    const response = await api.get(`/books/${id}`);
                    setBook(response.data);
                } catch (error) {
                    console.error("Error fetching book details:", error);
                    alert("Failed to load book details.");
                }
            };
            fetchBook();
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = (name === 'price' || name === 'stockQuantity')
            ? (value === '' ? '' : value)
            : value;

        setBook(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...book,
            price: Number(book.price),
            stockQuantity: Number(book.stockQuantity)
        };

        try {
            if (isEditing) {
                await api.put(`/books/${id}`, { ...payload, id: Number(id) });
            } else {
                await api.post('/books', payload);
            }
            navigate('/admin'); // Redirect to admin ledger
        } catch (error) {
            console.error("Error saving book:", error);
            alert("Failed to save book. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-paper min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto bg-paper-dark border border-border-linen p-8 md:p-12 shadow-[8px_8px_0_0_#e5e0d8] relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-accent-olive/30"></div>

                <h2 className="text-3xl font-serif font-bold text-ink mb-8 border-b border-border-linen pb-4 italic">
                    {isEditing ? 'Update Archive Entry' : 'Manual Entry: New Volume'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Book Title</label>
                            <input
                                type="text"
                                name="title"
                                value={book.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-paper border-b border-ink/20 focus:border-accent-olive outline-none font-serif text-ink transition-colors placeholder-ink-light/30 shadow-sm"
                                placeholder="e.g. Meditations"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Author</label>
                            <input
                                type="text"
                                name="author"
                                value={book.author}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-paper border-b border-ink/20 focus:border-accent-olive outline-none font-serif text-ink transition-colors placeholder-ink-light/30 shadow-sm"
                                placeholder="e.g. Marcus Aurelius"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Acquisition Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={book.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-paper border-b border-ink/20 focus:border-accent-olive outline-none font-serif text-ink transition-colors shadow-sm"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Stock Inventory</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={book.stockQuantity}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-3 bg-paper border-b border-ink/20 focus:border-accent-olive outline-none font-serif text-ink transition-colors shadow-sm"
                                placeholder="0"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2">Image URL (Archival Cover)</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={book.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-paper border-b border-ink/20 focus:border-accent-olive outline-none font-serif text-ink transition-colors placeholder-ink-light/30 shadow-sm"
                                placeholder="https://unsplash.com/photos/..."
                            />
                            {book.imageUrl && (
                                <div className="mt-4 p-2 border border-dotted border-border-linen bg-paper flex items-center gap-4">
                                    <img src={book.imageUrl} alt="Preview" className="w-16 h-20 object-cover border border-ink/10 shadow-sm" />
                                    <span className="text-[10px] font-serif italic text-ink-light uppercase tracking-widest leading-tight">Visual Preview<br />Detected</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-border-linen">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="flex-1 px-8 py-4 border border-ink/30 text-ink font-serif font-bold uppercase tracking-widest text-xs hover:bg-paper-dark transition-colors"
                        >
                            Abandon Entry
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-8 py-4 bg-ink text-paper border border-ink font-serif font-bold uppercase tracking-widest text-xs hover:bg-accent-olive transition-colors shadow-[4px_4px_0_0_rgba(85,107,47,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Committing...' : (isEditing ? 'Refine Entry' : 'Finalize Entry')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
