import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ book }) => {
    // Deterministic "Staff Pick" and "Reading Time" based on ID
    const isStaffPick = book.id % 5 === 0;
    const readingTime = (book.id % 8) + 3; // Random 3-10 hours

    return (
        <div className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-xl border border-gray-100 flex flex-col h-full relative overflow-hidden">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {book.id % 3 === 0 && (
                    <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        BESTSELLER
                    </div>
                )}
                {book.id % 4 === 0 && (
                    <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        NEW
                    </div>
                )}
                {isStaffPick && (
                    <div className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <span>⭐</span> STAFF PICK
                    </div>
                )}
            </div>

            {/* Image Area */}
            <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center group-hover:bg-indigo-50 transition duration-500">
                <span className="text-6xl filter grayscale group-hover:grayscale-0 transition duration-500 transform group-hover:scale-110">📚</span>

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition duration-300 ease-out">
                    <Link to={`/product/${book.id}`} className="block w-full bg-white/90 backdrop-blur text-indigo-900 font-bold text-center py-3 rounded-lg shadow-lg hover:bg-white transition">
                        View Details
                    </Link>
                </div>
            </div>

            <div className="flex flex-col flex-grow">
                <div className="mb-2">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{book.author}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full flex items-center gap-1">
                            ☕ {readingTime}h read
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mt-1 group-hover:text-indigo-600 transition">{book.title}</h3>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div>
                        <span className="text-xl font-bold text-gray-900">${book.price.toFixed(2)}</span>
                    </div>
                    {book.stockQuantity > 0 ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In Stock
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Sold Out
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
