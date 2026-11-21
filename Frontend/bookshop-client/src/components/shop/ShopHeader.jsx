import React from 'react';
import { motion } from 'framer-motion';

const ShopHeader = ({ totalBooks, searchQuery, setSearchQuery, sortOption, setSortOption }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-double border-border-linen pb-6"
        >
            <div className="font-serif text-ink italic">
                Catalog: <span className="font-bold not-italic text-lg">{totalBooks}</span> Volumes Found
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto items-end">
                {/* Search Bar - Underlined Style */}
                <div className="relative group w-full md:w-64">
                    <label htmlFor="shop-search" className="sr-only">Search by title or author</label>
                    <input
                        id="shop-search"
                        type="search"
                        placeholder="Search title or author…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-ink/30 focus:border-accent-olive font-serif text-ink placeholder-ink-light/50 focus:outline-none transition-colors"
                    />
                    <span className="absolute left-0 top-2.5 text-ink/40 text-sm">🔍</span>
                </div>

                {/* Sort Dropdown - Minimalist */}
                <div className="flex items-center gap-2">
                    <label htmlFor="shop-sort" className="font-serif text-sm italic text-ink-light">Sort by:</label>
                    <select
                        id="shop-sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="pl-2 pr-8 py-1 bg-transparent border-b border-ink/30 focus:border-accent-olive font-serif text-sm text-ink cursor-pointer focus:outline-none hover:text-accent-olive transition-colors"
                    >
                        <option value="newest">Newest first</option>
                        <option value="popular">Best selling</option>
                        <option value="rating">Highest rated</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="alpha_asc">Title: A to Z</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
};

export default ShopHeader;
