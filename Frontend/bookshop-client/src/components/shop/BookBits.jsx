// Small shared pieces for showing books: stars, badges, wishlist heart
import { useWishlist } from '../../context/WishlistContext';

export const Stars = ({ rating = 0, size = 'text-sm', label = true }) => {
    const rounded = Math.round(rating * 2) / 2;
    return (
        <span className={`inline-flex items-center ${size}`} aria-label={label ? `Rated ${rating} out of 5` : undefined} role={label ? 'img' : undefined}>
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} aria-hidden="true" className={i <= rounded ? 'text-accent-leather' : i - 0.5 === rounded ? 'text-accent-leather/60' : 'text-border-linen'}>★</span>
            ))}
        </span>
    );
};

export const RatingSummary = ({ book, className = '' }) => {
    if (!book.reviewCount) return <span className={`text-xs font-serif italic text-ink-light ${className}`}>No reviews yet</span>;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-serif text-ink-light ${className}`}>
            <Stars rating={book.averageRating} />
            <span>{book.averageRating?.toFixed(1)} ({book.reviewCount})</span>
        </span>
    );
};

// Badges based on real data: best sellers, recent additions, low stock
export const BookBadges = ({ book }) => (
    <>
        {book.isBestseller && (
            <div className="bg-ink text-paper text-[10px] tracking-widest uppercase font-bold px-2 py-1 shadow-sm border border-ink -rotate-2">Bestseller</div>
        )}
        {book.isNewArrival && (
            <div className="bg-accent-leather text-white text-[10px] tracking-widest uppercase font-bold px-2 py-1 shadow-sm border border-accent-leather rotate-1">New arrival</div>
        )}
        {book.stockQuantity > 0 && book.stockQuantity <= 5 && (
            <div className="bg-paper text-accent-leather border border-accent-leather text-[10px] tracking-widest uppercase font-bold px-2 py-1 -rotate-1">Only {book.stockQuantity} left</div>
        )}
    </>
);

export const WishlistButton = ({ book, className = '' }) => {
    const { isSaved, toggle } = useWishlist();
    const saved = isSaved(book.id);
    return (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(book); }}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
            title={saved ? 'Saved to wishlist' : 'Save to wishlist'}
            className={`flex items-center justify-center transition-colors ${saved ? 'text-accent-leather' : 'text-ink hover:text-accent-leather'} ${className}`}
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinejoin="round" d="M12 20s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 10c0 5.65-7 10-7 10z" />
            </svg>
        </button>
    );
};
