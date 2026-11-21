import { Link } from 'react-router-dom';
import ProductCard from './shop/ProductCard';

// Different lists for the home page, all from real data
const SORTS = {
    bestsellers: (a, b) => b.soldCount - a.soldCount || (b.averageRating || 0) - (a.averageRating || 0),
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id,
    rated: (a, b) => (b.averageRating || 0) - (a.averageRating || 0) || b.reviewCount - a.reviewCount,
};

// `books` is fetched once by the page and shared by every list: null while loading, false if it failed
const BookList = ({ books, limit = 4, title, sort = 'newest', exclude = [], link, subtitle }) => {
    if (books === false) return null;

    const list = (books || [])
        .filter(b => b.stockQuantity > 0 && !exclude.includes(b.id))
        .filter(b => sort !== 'bestsellers' || b.soldCount > 0)
        .filter(b => sort !== 'rated' || b.reviewCount > 0)
        .sort(SORTS[sort])
        .slice(0, limit);

    if (books && list.length === 0) return null;

    return (
        <section className="py-8" aria-labelledby={`list-${sort}`}>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8 border-b border-border-linen pb-4">
                <div>
                    <h2 id={`list-${sort}`} className="text-3xl font-serif font-bold text-ink">{title}</h2>
                    {subtitle && <p className="font-serif italic text-ink-light mt-1">{subtitle}</p>}
                </div>
                {link && <Link to={link} className="font-serif text-sm underline text-ink-light hover:text-ink">See all</Link>}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {books === null
                    ? Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="bg-paper border border-border-linen p-3 sm:p-5 animate-pulse" aria-hidden="true">
                            <div className="aspect-[2/3] bg-border-linen/60 mb-4" />
                            <div className="h-4 bg-border-linen/60 w-3/4 mx-auto" />
                        </div>
                    ))
                    : list.map(book => <ProductCard key={book.id} book={book} />)}
            </div>
        </section>
    );
};

export default BookList;
