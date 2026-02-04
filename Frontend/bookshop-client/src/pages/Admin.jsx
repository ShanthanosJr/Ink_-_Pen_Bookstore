import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Admin = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
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

        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await api.delete(`/books/${id}`);
                setBooks(books.filter(book => book.id !== id));
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Failed to delete book");
            }
        }
    };

    if (loading) return <div className="p-12 font-serif text-center text-ink italic">Opening Ledger...</div>;

    return (
        <div className="container mx-auto px-4 py-12 bg-paper min-h-screen">
            <div className="flex justify-between items-center mb-10 border-b-4 border-double border-ink pb-4">
                <h1 className="text-4xl font-serif font-bold text-ink">Inventory Ledger</h1>
                <Link to="/add" className="bg-ink text-paper px-6 py-3 font-serif uppercase tracking-widest text-xs font-bold hover:bg-accent-olive transition-colors border border-ink">
                    + New Entry
                </Link>
            </div>

            <div className="bg-paper border border-ink rounded-sm overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <table className="min-w-full divide-y divide-ink/20">
                    <thead className="bg-paper-dark">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Author</th>
                            <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Stock</th>
                            <th className="px-6 py-4 text-right text-xs font-serif font-bold text-ink uppercase tracking-widest border-b border-ink">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-paper divide-y divide-ink/10">
                        {books.map(book => (
                            <tr key={book.id} className="hover:bg-paper-dark transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink-light">{book.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-serif font-bold text-ink">{book.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink italic">{book.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink">${book.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-serif text-ink-light">{book.stockQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/edit/${book.id}`} className="text-accent-olive hover:text-ink mr-4 font-serif italic border-b border-transparent hover:border-ink transition-all">Edit</Link>
                                    <button onClick={() => handleDelete(book.id)} className="text-accent-leather hover:text-red-800 font-serif italic border-b border-transparent hover:border-red-800 transition-all">Strike</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
