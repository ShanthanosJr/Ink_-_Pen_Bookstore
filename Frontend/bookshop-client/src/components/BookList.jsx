import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import ProductCard from './shop/ProductCard';

const BookList = ({ limit, showAdminControls = false, title }) => {
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

    // For the home page BookList, we reuse the premium ProductCard if admin controls are OFF.
    // If admin controls are ON (rare now, as we have a dedicated admin page), we keep a simpler view or redirect logic.
    // However, the user request is to fix "Project Code" techy-ness. 
    // Since we separated Admin, `showAdminControls` is likely false for the home page.

    if (loading) return (
        <div className="text-center py-20 font-serif italic text-ink-light animate-pulse">
            Retrieving volumes from archive...
        </div>
    );

    const displayedBooks = limit ? books.slice(0, limit) : books;

    return (
        <section className={limit ? "py-10" : "py-6"}>
            {title && (
                <div className="flex items-center justify-between mb-8 border-b border-border-linen pb-2">
                    <h2 className="text-3xl font-serif font-bold text-ink">{title}</h2>
                    <div className="h-px flex-grow bg-accent-olive/20 ml-6 hidden sm:block"></div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedBooks.map(book => (
                    <ProductCard key={book.id} book={book} />
                ))}
            </div>

            {books.length === 0 && (
                <div className="text-center py-20 bg-paper-dark rounded-sm border border-border-linen">
                    <p className="font-serif text-ink-light text-lg mb-4">The shelves are currently bare.</p>
                </div>
            )}
        </section>
    );
};

export default BookList;
