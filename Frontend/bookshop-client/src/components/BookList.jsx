import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
            // alert("Failed to fetch books. Is the backend running?"); // Commented out to avoid annoyance during dev if backend is off
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await api.delete(`/books/${id}`);
            fetchBooks(); // Refresh list
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Failed to delete book.");
        }
    };

    if (loading) return <div className="text-center mt-10 text-xl text-gray-600 animate-pulse">Loading books...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
                <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
                        <p className="text-gray-600 mb-4">by <span className="font-medium text-gray-900">{book.author}</span></p>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-green-600">${book.price.toFixed(2)}</span>
                            <span className={`text-sm px-2 py-1 rounded ${book.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : 'Out of Stock'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Link to={`/edit/${book.id}`} className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-md text-center hover:bg-indigo-100 transition font-medium">
                            Edit
                        </Link>
                        <button onClick={() => handleDelete(book.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-md text-center hover:bg-red-100 transition font-medium">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            {books.length === 0 && (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg dashed border-2 border-gray-200">
                    <p className="text-gray-500 text-lg mb-4">No books found in the library.</p>
                    <Link to="/add" className="text-indigo-600 font-semibold hover:underline">Add your first book</Link>
                </div>
            )}
        </div>
    );
};

export default BookList;
