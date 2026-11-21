import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import api from '../api';
import ShopSidebar from '../components/shop/ShopSidebar';
import ShopHeader from '../components/shop/ShopHeader';
import ProductCard from '../components/shop/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const SORTS = ['newest', 'price_asc', 'price_desc', 'alpha_asc', 'rating', 'popular'];
const PAGE_STEP = 8;

const Shop = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [params, setParams] = useSearchParams();

    // All filters live in the URL so they survive back/forward and can be shared or bookmarked
    const selectedCategory = CATEGORIES.includes(params.get('category')) ? params.get('category') : 'All';
    const inStockOnly = params.get('inStock') === '1';
    const sortOption = SORTS.includes(params.get('sort')) ? params.get('sort') : 'newest';
    const searchQuery = params.get('q') || '';
    const visibleCount = Math.max(PAGE_STEP, Number(params.get('show')) || PAGE_STEP);

    const maxPrice = useMemo(
        () => (books.length ? Math.ceil(Math.max(...books.map(b => b.price))) : 100),
        [books]
    );
    const priceCap = params.get('maxPrice') ? Math.min(Number(params.get('maxPrice')), maxPrice) : maxPrice;

    // Search box updates the URL after a short pause instead of on every keystroke
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [lastUrlQuery, setLastUrlQuery] = useState(searchQuery);
    if (searchQuery !== lastUrlQuery) {
        // URL changed from outside (back button, "clear"): keep the input in sync
        setLastUrlQuery(searchQuery);
        setSearchInput(searchQuery);
    }

    const updateParams = (changes) => {
        const next = new URLSearchParams(params);
        Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === false) next.delete(key);
            else next.set(key, String(value));
        });
        if (!('show' in changes)) next.delete('show');
        setParams(next, { replace: true });
    };

    useEffect(() => {
        if (searchInput === searchQuery) return;
        const timer = setTimeout(() => {
            const next = new URLSearchParams(params);
            if (searchInput.trim()) next.set('q', searchInput); else next.delete('q');
            next.delete('show');
            setLastUrlQuery(searchInput.trim() ? searchInput : '');
            setParams(next, { replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput, searchQuery, params, setParams]);

    const loadBooks = async () => {
        setLoading(true);
        setLoadError(false);
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const filteredBooks = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();
        return books.filter(book => {
            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
            const matchesPrice = book.price <= priceCap;
            const matchesStock = !inStockOnly || book.stockQuantity > 0;
            const matchesSearch = !term || book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);
            return matchesCategory && matchesPrice && matchesStock && matchesSearch;
        }).sort((a, b) => {
            switch (sortOption) {
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                case 'alpha_asc': return a.title.localeCompare(b.title);
                case 'rating': return (b.averageRating || 0) - (a.averageRating || 0) || b.reviewCount - a.reviewCount;
                case 'popular': return b.soldCount - a.soldCount;
                case 'newest': default: return new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id;
            }
        });
    }, [books, selectedCategory, priceCap, inStockOnly, searchQuery, sortOption]);

    const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + (inStockOnly ? 1 : 0) + (priceCap < maxPrice ? 1 : 0);
    const clearAll = () => {
        setSearchInput('');
        setParams({}, { replace: true });
    };

    const sidebar = (
        <ShopSidebar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={(category) => updateParams({ category: category === 'All' ? null : category })}
            priceRange={[0, priceCap]}
            setPriceRange={([, max]) => updateParams({ maxPrice: max >= maxPrice ? null : max })}
            inStockOnly={inStockOnly}
            setInStockOnly={(value) => updateParams({ inStock: value ? '1' : null })}
            maxPrice={maxPrice}
        />
    );

    return (
        <div className="bg-paper-dark min-h-screen">
            <div className="bg-paper border-b border-border-linen mb-8 md:mb-12">
                <div className="container mx-auto px-4 py-10 md:py-14 text-center">
                    <span className="inline-block py-1 px-3 border border-accent-olive text-accent-olive font-serif italic text-sm mb-4">
                        The library archives
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-2 tracking-tight">
                        {selectedCategory === 'All' ? 'Explore Our Collection' : selectedCategory}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar on large screens */}
                    <aside className="hidden lg:block lg:w-1/4 flex-shrink-0">
                        <div className="sticky top-28">{sidebar}</div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        {/* Filters button on small screens */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setFiltersOpen(true)}
                                className="w-full flex items-center justify-center gap-2 border border-ink bg-paper py-3 font-serif font-bold uppercase tracking-widest text-xs text-ink"
                                aria-haspopup="dialog"
                            >
                                Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                            </button>
                        </div>

                        <ShopHeader
                            totalBooks={filteredBooks.length}
                            searchQuery={searchInput}
                            setSearchQuery={setSearchInput}
                            sortOption={sortOption}
                            setSortOption={(value) => updateParams({ sort: value === 'newest' ? null : value })}
                        />

                        {loading ? (
                            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6" aria-busy="true" aria-label="Loading books">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-paper border border-border-linen p-3 sm:p-5 animate-pulse">
                                        <div className="aspect-[2/3] bg-border-linen/60 mb-4" />
                                        <div className="h-4 bg-border-linen/60 w-3/4 mx-auto mb-2" />
                                        <div className="h-3 bg-border-linen/60 w-1/2 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        ) : loadError ? (
                            <div className="text-center py-20 bg-paper border border-border-linen">
                                <p className="font-serif text-ink mb-4">We couldn't load the catalogue.</p>
                                <button onClick={loadBooks} className="px-6 py-3 bg-ink text-paper font-serif uppercase tracking-widest text-xs font-bold">Try again</button>
                            </div>
                        ) : filteredBooks.length > 0 ? (
                            <>
                                {/* Plain grid: books must never depend on an animation to become visible */}
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                                    {filteredBooks.slice(0, visibleCount).map(book => (
                                        <ProductCard key={book.id} book={book} />
                                    ))}
                                </div>
                                {visibleCount < filteredBooks.length && (
                                    <div className="mt-12 text-center">
                                        <button
                                            onClick={() => updateParams({ show: visibleCount + PAGE_STEP })}
                                            className="px-10 py-4 bg-paper border border-ink text-ink font-serif font-bold uppercase tracking-widest text-xs hover:bg-ink hover:text-paper transition-colors"
                                        >
                                            Show more ({filteredBooks.length - visibleCount} left)
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-paper border-2 border-dashed border-border-linen">
                                <h3 className="text-xl font-serif font-bold text-ink mb-2">No books match</h3>
                                <p className="text-ink-light font-body italic mb-6">Try a different search or fewer filters.</p>
                                <button onClick={clearAll} className="text-accent-olive font-serif italic border-b border-accent-olive">
                                    Clear search and filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter drawer for small screens */}
            <AnimatePresence>
                {filtersOpen && (
                    <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <button className="absolute inset-0 bg-ink/40 w-full" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Filters"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-paper-dark overflow-y-auto p-5 flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="font-serif font-bold text-lg text-ink uppercase tracking-widest">Filters</h2>
                                <button onClick={() => setFiltersOpen(false)} className="text-2xl leading-none text-ink" aria-label="Close filters">×</button>
                            </div>
                            {sidebar}
                            <div className="mt-auto flex gap-3 sticky bottom-0 bg-paper-dark pt-3">
                                <button onClick={clearAll} className="flex-1 border border-ink py-3 font-serif text-sm text-ink">Clear</button>
                                <button onClick={() => setFiltersOpen(false)} className="flex-[2] bg-ink text-paper py-3 font-serif font-bold uppercase tracking-widest text-xs">
                                    Show {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
