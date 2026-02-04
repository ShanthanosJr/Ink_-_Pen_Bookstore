import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import ShopSidebar from '../components/shop/ShopSidebar';
import ShopHeader from '../components/shop/ShopHeader';
import ProductCard from '../components/shop/ProductCard';

const Shop = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 100]); // Assuming max placeholder
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
                // Simulating categories since generic API doesn't have them
                const booksWithMetadata = response.data.map((book, index) => ({
                    ...book,
                    category: categories[index % categories.length], // Deterministic pseudo-random category
                    dateAdded: new Date(Date.now() - (index * 86400000)) // Deterministic pseudo-date
                }));
                setBooks(booksWithMetadata);

                // Set max price for slider dynamically
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Explore Our Collection</h1>

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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {filteredBooks.slice(0, visibleCount).map(book => (
                                    <ProductCard key={book.id} book={book} />
                                ))}
                            </div>

                            {visibleCount < filteredBooks.length && (
                                <div className="mt-12 text-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:border-indigo-300 transition shadow-sm"
                                    >
                                        Load More Books
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search query.</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('All');
                                    setSearchQuery('');
                                    setPriceRange([0, 200]);
                                }}
                                className="mt-4 text-indigo-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
