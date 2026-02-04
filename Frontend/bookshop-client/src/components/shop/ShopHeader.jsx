import React from 'react';

const ShopHeader = ({ totalBooks, searchQuery, setSearchQuery, sortOption, setSortOption }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-600 font-medium">
                Showing <span className="font-bold text-gray-900">{totalBooks}</span> results
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative group w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search authors, titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>

                {/* Sort Dropdown */}
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="alpha_asc">Name: A to Z</option>
                </select>
            </div>
        </div>
    );
};

export default ShopHeader;
