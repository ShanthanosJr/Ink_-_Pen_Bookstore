import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ book, isAnimated = false }) => {
    // Deterministic "Staff Pick", "Reading Time", and "First Edition" for variety
    const isStaffPick = book.id % 5 === 0;
    const isFirstEdition = book.id % 7 === 0;
    const readingTime = (book.id % 8) + 3;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    const Wrapper = isAnimated ? motion.div : 'div';

    return (
        <Wrapper
            variants={cardVariants}
            className="group bg-paper-dark border border-border-linen rounded-sm p-5 flex flex-col h-full relative hover:border-accent-olive/30 transition-all duration-500"
        >

            {/* Decorative Corner Flaps */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-paper border-b border-l border-border-linen group-hover:border-accent-olive/30 transition-colors z-10"></div>

            {/* Badges - Styled like Stamps/Seals */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
                {book.id % 3 === 0 && (
                    <div className="bg-ink text-paper text-[9px] tracking-widest uppercase font-bold px-2 py-1 shadow-sm border border-ink transform -rotate-2">
                        Bestseller
                    </div>
                )}
                {book.id % 4 === 0 && (
                    <div className="bg-accent-leather text-white text-[9px] tracking-widest uppercase font-bold px-2 py-1 shadow-sm border border-accent-leather transform rotate-1">
                        New Arrival
                    </div>
                )}
                {isStaffPick && (
                    <div className="bg-transparent text-accent-olive border border-accent-olive text-[9px] tracking-widest uppercase font-bold px-2 py-1 flex items-center gap-1 transform -rotate-1">
                        <span>★</span> Curator Pick
                    </div>
                )}
            </div>

            {/* Image Area */}
            <div className="relative aspect-[2/3] bg-[#e3ddd3] mb-5 border border-border-linen/50 flex items-center justify-center overflow-hidden group-hover:shadow-[4px_4px_0_0_rgba(85,107,47,0.1)] transition-all duration-500">
                {/* Rustic Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-10 z-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover transition duration-700 transform group-hover:scale-110" />
                ) : (
                    <span className="text-6xl text-ink/20 group-hover:text-ink/60 transition duration-700 transform group-hover:scale-110 font-serif">❦</span>
                )}

                {/* Quick Action - Styled as a bookmark/label */}
                <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-20">
                    <Link to={`/product/${book.id}`} className="block w-full bg-paper text-ink font-serif uppercase tracking-widest text-xs font-bold text-center py-3 border border-ink hover:bg-ink hover:text-paper transition-colors shadow-lg">
                        Examine
                    </Link>
                </div>
            </div>

            <div className="flex flex-col flex-grow text-center px-2">
                <div className="mb-3">
                    <h3 className="text-lg font-serif font-bold text-ink leading-tight group-hover:text-accent-olive transition-colors mb-1">{book.title}</h3>
                    <div className="h-px w-8 bg-accent-olive/30 mx-auto my-2 group-hover:w-16 transition-all duration-500"></div>
                    <span className="text-xs font-body italic text-ink-light">by {book.author}</span>
                </div>

                {/* Metadata Grid */}
                <div className="mt-auto grid grid-cols-2 gap-2 text-[10px] text-ink-light uppercase tracking-wider border-t border-border-linen pt-3">
                    <div className="text-left border-r border-border-linen">
                        Est. Time
                        <span className="block font-bold text-ink normal-case mt-0.5">{readingTime} hrs</span>
                    </div>
                    <div className="text-right">
                        Edition
                        <span className="block font-bold text-ink normal-case mt-0.5">{isFirstEdition ? 'First' : 'Standard'}</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dotted border-border-linen flex items-center justify-between">
                    <span className="text-xl font-serif font-bold text-ink">${book.price.toFixed(2)}</span>
                    {book.stockQuantity > 0 ? (
                        <span className="text-[10px] text-accent-olive font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-olive"></span> In Library
                        </span>
                    ) : (
                        <span className="text-[10px] text-accent-leather font-bold uppercase tracking-widest line-through decoration-1">
                            Checked Out
                        </span>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

export default ProductCard;
