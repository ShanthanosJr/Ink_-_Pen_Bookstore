import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { BookBadges, RatingSummary, WishlistButton } from './BookBits';
import { assetUrl } from '../../api';

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

const ProductCard = ({ book, isAnimated = false }) => {
    const { addToCart } = useCart();
    const Wrapper = isAnimated ? motion.div : 'div';
    const soldOut = book.stockQuantity <= 0;

    return (
        <Wrapper
            variants={isAnimated ? cardVariants : undefined}
            className="group bg-paper-dark border border-border-linen rounded-sm p-5 flex flex-col h-full relative hover:border-accent-olive/30 transition-colors duration-300"
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-2 pointer-events-none">
                <BookBadges book={book} />
            </div>
            <WishlistButton book={book} className="absolute top-3 right-3 z-20 w-9 h-9 bg-paper/90 border border-border-linen rounded-full" />

            {/* Cover */}
            <Link to={`/product/${book.id}`} className="relative block aspect-[2/3] bg-[#e3ddd3] mb-4 border border-border-linen/50 overflow-hidden" tabIndex={-1} aria-hidden="true">
                {book.imageUrl ? (
                    <img src={assetUrl(book.imageUrl)} alt="" loading="lazy" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                    <span className="flex items-center justify-center h-full text-6xl text-ink/20 font-serif">❦</span>
                )}
            </Link>

            <div className="flex flex-col flex-grow text-center px-1">
                <h3 className="text-lg font-serif font-bold text-ink leading-tight">
                    <Link to={`/product/${book.id}`} className="hover:text-accent-olive transition-colors">{book.title}</Link>
                </h3>
                <span className="text-xs font-body italic text-ink-light mt-1">by {book.author}</span>
                <div className="mt-2"><RatingSummary book={book} /></div>

                <div className="mt-auto pt-3 border-t border-dotted border-border-linen flex items-center justify-between gap-2">
                    <span className="text-xl font-serif font-bold text-ink">${book.price.toFixed(2)}</span>
                    {/* Always visible: hover-only buttons don't work on touch screens */}
                    <button
                        onClick={() => addToCart(book, 1)}
                        disabled={soldOut}
                        className="px-3 py-2 bg-ink text-paper font-serif uppercase tracking-widest text-[11px] font-bold hover:bg-accent-olive transition-colors disabled:bg-transparent disabled:text-accent-leather disabled:border disabled:border-accent-leather/40"
                        aria-label={soldOut ? `${book.title} is sold out` : `Add ${book.title} to cart`}
                    >
                        {soldOut ? 'Sold out' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </Wrapper>
    );
};

export default ProductCard;
