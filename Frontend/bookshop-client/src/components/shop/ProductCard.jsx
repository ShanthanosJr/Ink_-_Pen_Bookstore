import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { BookBadges, RatingSummary, WishlistButton } from './BookBits';
import BookCover from './BookCover';

const ProductCard = ({ book }) => {
    const { addToCart } = useCart();
    const soldOut = book.stockQuantity <= 0;

    return (
        <div
            className="@container group bg-paper-dark border border-border-linen rounded-sm p-3 sm:p-5 flex flex-col h-full relative hover:border-accent-olive/30 transition-colors duration-300"
        >
            {/* Badges */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex flex-col items-start gap-2 pointer-events-none">
                <BookBadges book={book} />
            </div>
            <WishlistButton book={book} className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-9 h-9 bg-paper/90 border border-border-linen rounded-full" />

            {/* Cover */}
            <Link to={`/product/${book.id}`} className="relative block aspect-[2/3] bg-[#e3ddd3] mb-4 border border-border-linen/50 overflow-hidden" tabIndex={-1} aria-hidden="true">
                <BookCover book={book} className="transition duration-700 group-hover:scale-105" />
            </Link>

            <div className="flex flex-col flex-grow text-center px-1">
                <h3 className="text-base sm:text-lg font-serif font-bold text-ink leading-tight line-clamp-2">
                    <Link to={`/product/${book.id}`} className="hover:text-accent-olive transition-colors">{book.title}</Link>
                </h3>
                <span className="text-xs font-body italic text-ink-light mt-1 mb-3 truncate">by {book.author}</span>
                {/* Only show a rating once there is one; "No reviews yet" on every card is noise */}
                {book.reviewCount > 0 && <div className="mt-2"><RatingSummary book={book} /></div>}

                <div className="mt-auto pt-3 border-t border-dotted border-border-linen flex flex-col items-stretch gap-2 @[15rem]:flex-row @[15rem]:items-center @[15rem]:justify-between">
                    <span className="text-lg sm:text-xl font-serif font-bold text-ink">${book.price.toFixed(2)}</span>
                    {/* Always visible: hover-only buttons don't work on touch screens */}
                    <button
                        onClick={() => addToCart(book, 1)}
                        disabled={soldOut}
                        className="px-3 py-2 whitespace-nowrap bg-ink text-paper font-serif uppercase tracking-widest text-[11px] font-bold hover:bg-accent-olive transition-colors disabled:bg-transparent disabled:text-accent-leather disabled:border disabled:border-accent-leather/40"
                        aria-label={soldOut ? `${book.title} is sold out` : `Add ${book.title} to cart`}
                    >
                        {soldOut ? 'Sold out' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
