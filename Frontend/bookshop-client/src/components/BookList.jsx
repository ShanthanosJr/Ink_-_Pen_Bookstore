import { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from './shop/ProductCard';
import { motion } from 'framer-motion';

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

    if (loading) return (
        <div className="text-center py-20 font-serif italic text-ink-light animate-pulse">
            Retrieving volumes from archive...
        </div>
    );

    const displayedBooks = limit ? books.slice(0, limit) : books;

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    return (
        <section className={limit ? "py-10" : "py-6"}>
            {title && (
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={titleVariants}
                    className="flex items-center justify-between mb-8 border-b border-border-linen pb-2"
                >
                    <h2 className="text-3xl font-serif font-bold text-ink">{title}</h2>
                    <div className="h-px flex-grow bg-accent-olive/20 ml-6 hidden sm:block"></div>
                </motion.div>
            )}

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {displayedBooks.map(book => (
                    <ProductCard key={book.id} book={book} isAnimated={true} />
                ))}
            </motion.div>

            {books.length === 0 && (
                <div className="text-center py-20 bg-paper-dark rounded-sm border border-border-linen">
                    <p className="font-serif text-ink-light text-lg mb-4">The shelves are currently bare.</p>
                </div>
            )}
        </section>
    );
};

export default BookList;
