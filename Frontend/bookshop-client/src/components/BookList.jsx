import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const BookList = ({ limit, showAdminControls = true, title }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
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
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Failed to delete book.");
        }
    };

    if (loading) return <div className="text-center py-20 text-xl text-gray-500 animate-pulse">Loading library...</div>;

    const displayedBooks = limit ? books.slice(0, limit) : books;

    return (
        <section className={limit ? "py-10" : "py-6"}>
            {title && <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedBooks.map(book => (
                    <div key={book.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
                        <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder pattern since we don't have real images yet */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-50"></div>
                            <span className="text-4xl filter grayscale group-hover:grayscale-0 transition duration-300 transform group-hover:scale-110">📚</span>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 shadow-sm">
                                ${book.price.toFixed(2)}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition">{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">by {book.author}</p>

                            <div className="mt-auto">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${book.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {book.stockQuantity > 0 ? 'In Stock' : 'Sold Out'}
                                </span>
                            </div>

                            {showAdminControls && (
                                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                                    <Link to={`/edit/${book.id}`} className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm text-center hover:bg-indigo-50 hover:text-indigo-600 transition font-medium">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(book.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm text-center hover:bg-red-100 transition font-medium">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">The library is currently empty.</p>
                    {showAdminControls && (
                        <Link to="/add" className="text-indigo-600 font-bold hover:underline">Add First Book</Link>
                    )}
                </div>
            )}
        </section>
    );
};

export default BookList;
