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
        stockQuantity: ''
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
        // Handle number inputs specifically to avoid storing strings in number fields
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
                // Ensure ID is included (though API might not need it in body if in URL, standard practice to include)
                await api.put(`/books/${id}`, { ...payload, id: Number(id) });
            } else {
                await api.post('/books', payload);
            }
            navigate('/');
        } catch (error) {
            console.error("Error saving book:", error);
            alert("Failed to save book. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        placeholder="e.g. The Great Gatsby"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                        type="text"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        placeholder="e.g. F. Scott Fitzgerald"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={book.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            name="stockQuantity"
                            value={book.stockQuantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Book' : 'Add Book')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookForm;
