import React from 'react';

const ShopSidebar = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly
}) => {
    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium ${selectedCategory === 'All'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                                }`}
                        >
                            All Categories
                        </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category}>
                            <button
                                onClick={() => setSelectedCategory(category)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium ${selectedCategory === category
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                                    }`}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>${priceRange[0]}</span>
                        <span className="font-semibold text-indigo-700">${priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition"
                    />
                    <span className="text-gray-700 group-hover:text-indigo-700 transition">In Stock Only</span>
                </label>
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl p-6 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-xs font-bold tracking-wider uppercase opacity-80 mb-2">Weekend Deal</p>
                    <h4 className="text-2xl font-bold mb-4">Save 20% on Tech Books</h4>
                    <button className="bg-white text-indigo-900 text-xs font-bold py-2 px-4 rounded-full hover:bg-indigo-50 transition">
                        Use Code: TECH20
                    </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
            </div>
        </div>
    );
};

export default ShopSidebar;
