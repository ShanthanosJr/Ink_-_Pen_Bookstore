import React from 'react';
import { motion } from 'framer-motion';

const ShopSidebar = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly
}) => {
    const sidebarVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
            className="space-y-8"
        >
            {/* Categories - Styled as Index Card */}
            <div className="bg-paper border border-border-linen p-6 relative shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-paper px-2 border-l border-r border-border-linen z-10 font-bold">
                    <h3 className="text-sm font-serif font-bold text-ink uppercase tracking-widest">Index</h3>
                </div>

                <ul className="space-y-1 mt-2">
                    <li>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`w-full text-left px-3 py-2 text-sm font-serif transition-colors border-b border-dotted border-border-linen hover:text-accent-olive ${selectedCategory === 'All'
                                ? 'text-accent-olive font-bold italic bg-paper-dark'
                                : 'text-ink-light'
                                }`}
                        >
                            All Collections
                        </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category}>
                            <button
                                onClick={() => setSelectedCategory(category)}
                                className={`w-full text-left px-3 py-2 text-sm font-serif transition-colors border-b border-dotted border-border-linen hover:text-accent-olive ${selectedCategory === category
                                    ? 'text-accent-olive font-bold italic bg-paper-dark'
                                    : 'text-ink-light'
                                    }`}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Filter */}
            <div className="bg-paper border border-border-linen p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 border-b border-border-linen pb-2">
                    <h3 className="text-sm font-serif font-bold text-ink uppercase tracking-widest">Price Filter</h3>
                    <button
                        onClick={() => setPriceRange([0, 200])}
                        className="text-[10px] font-serif italic text-accent-leather hover:text-ink transition-colors uppercase tracking-widest"
                    >
                        Reset
                    </button>
                </div>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                        className="w-full h-1 bg-border-linen rounded-none appearance-none cursor-pointer accent-accent-olive"
                    />
                    <div className="flex justify-between text-xs font-serif text-ink-light mt-2">
                        <span>$0</span>
                        <span className="font-bold text-ink">${priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="px-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-4 h-4 border border-ink flex items-center justify-center transition-colors ${inStockOnly ? 'bg-accent-olive border-accent-olive' : 'bg-paper'}`}>
                        {inStockOnly && <span className="text-white text-xs">✓</span>}
                    </div>
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="hidden"
                    />
                    <span className="text-sm font-serif text-ink group-hover:text-accent-olive transition-colors underline decoration-dotted decoration-border-linen underline-offset-4">Available Now</span>
                </label>
            </div>

            {/* Promo Card - Vintage Style */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-ink text-paper p-6 text-center relative overflow-hidden border-4 border-double border-accent-olive/30 shadow-lg"
            >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }}></div>
                <div className="relative z-10">
                    <p className="font-serif italic text-accent-olive opacity-80 mb-2 text-xs">Limited Offer</p>
                    <h4 className="text-xl font-serif font-bold mb-4 leading-tight">Classics Collection <br /> 20% Off</h4>
                    <div className="inline-block border border-paper px-4 py-2 font-serif text-xs uppercase tracking-widest hover:bg-paper hover:text-ink transition-colors cursor-pointer">
                        Code: CLASSIC20
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ShopSidebar;
