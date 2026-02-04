import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import ShopSidebar from '../components/shop/ShopSidebar';
import ShopHeader from '../components/shop/ShopHeader';
import ProductCard from '../components/shop/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    // Pagination State
    const [visibleCount, setVisibleCount] = useState(8);

    const categories = ['Fiction', 'Non-Fiction', 'Technology', 'Education', 'Business', 'History'];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get('/books');
                const booksWithMetadata = response.data.map((book, index) => ({
                    ...book,
                    category: categories[index % categories.length],
                    dateAdded: new Date(Date.now() - (index * 86400000))
                }));
                setBooks(booksWithMetadata);

                if (booksWithMetadata.length > 0) {
                    const maxPrice = Math.max(...booksWithMetadata.map(b => b.price));
                    setPriceRange([0, Math.ceil(maxPrice)]);
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Filter Logic
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
            const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
            const matchesStock = !inStockOnly || book.stockQuantity > 0;
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesPrice && matchesStock && matchesSearch;
        }).sort((a, b) => {
            switch (sortOption) {
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                case 'alpha_asc': return a.title.localeCompare(b.title);
                case 'newest': default: return b.dateAdded - a.dateAdded;
            }
        });
    }, [books, selectedCategory, priceRange, inStockOnly, searchQuery, sortOption]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 4);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-paper">
            <div className="font-serif italic text-ink text-xl animate-pulse">Cataloging archives...</div>
        </div>
    );

    return (
        <div className="bg-paper-dark min-h-screen">
            {/* Shop Header Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-paper border-b border-border-linen mb-12 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
                <div className="container mx-auto px-4 py-16 text-center relative z-10">
                    <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1 px-3 border border-accent-olive text-accent-olive font-serif italic text-xs mb-4 tracking-widest uppercase"
                    >
                        The library archives
                    </motion.span>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-ink mb-4 tracking-tight"
                    >
                        Explore Our Collection
                    </motion.h1>
                    <div className="w-16 h-px bg-accent-olive mx-auto opacity-30"></div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4 flex-shrink-0">
                        <div className="sticky top-24">
                            <ShopSidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                inStockOnly={inStockOnly}
                                setInStockOnly={setInStockOnly}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <ShopHeader
                            totalBooks={filteredBooks.length}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                        />

                        {filteredBooks.length > 0 ? (
                            <>
                                <motion.div
                                    key={selectedCategory + priceRange[1] + sortOption + searchQuery}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {filteredBooks.slice(0, visibleCount).map(book => (
                                            <ProductCard key={book.id} book={book} isAnimated={true} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {visibleCount < filteredBooks.length && (
                                    <div className="mt-16 text-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleLoadMore}
                                            className="px-10 py-4 bg-paper border border-ink text-ink font-serif font-bold uppercase tracking-widest text-xs hover:bg-ink hover:text-paper transition-all shadow-[4px_4px_0_0_rgba(44,44,44,0.1)]"
                                        >
                                            View More Volumes
                                        </motion.button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-24 bg-paper border-2 border-dashed border-border-linen"
                            >
                                <span className="text-4xl block mb-4 grayscale opacity-30">🕭</span>
                                <h3 className="text-xl font-serif font-bold text-ink mb-2">No volumes identified</h3>
                                <p className="text-ink-light font-body italic mb-6">Our librarians could not find a match for your inquiry.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                        setPriceRange([0, 200]);
                                    }}
                                    className="text-accent-olive font-serif italic border-b border-accent-olive hover:text-ink hover:border-ink transition-all"
                                >
                                    Clear all search parameters
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
