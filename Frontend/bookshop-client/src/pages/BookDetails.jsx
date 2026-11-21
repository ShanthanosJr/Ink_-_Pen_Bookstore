import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { assetUrl } from '../api';
import { useCart } from '../context/CartContext';
import { BookBadges, RatingSummary, WishlistButton } from '../components/shop/BookBits';
import ProductCard from '../components/shop/ProductCard';
import Reviews from '../components/shop/Reviews';

const RECENT_KEY = 'recentlyViewedBooks';
const RECENT_MAX = 8;

// Recently viewed books are remembered in this browser only
const readRecent = () => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
};
const rememberBook = (book) => {
    try {
        const entry = { id: book.id, title: book.title, author: book.author, imageUrl: book.imageUrl, price: book.price };
        const list = [entry, ...readRecent().filter(b => b.id !== book.id)].slice(0, RECENT_MAX);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch { /* storage unavailable */ }
};

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);
    const [recent, setRecent] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);

    const loadBook = useCallback(async () => {
        try {
            const response = await api.get(`/books/${id}`);
            setBook(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching book:", error);
            setBook(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        setLoading(true);
        setQuantity(1);
        setRecent(readRecent().filter(b => String(b.id) !== String(id)).slice(0, 4));
        loadBook().then(b => { if (b) rememberBook(b); });
        api.get(`/books/${id}/related`).then(res => setRelated(res.data)).catch(() => setRelated([]));
    }, [id, loadBook]);

    if (loading) return (
        <div className="min-h-[70vh] flex items-center justify-center bg-paper">
            <div className="font-serif italic text-ink text-xl animate-pulse">Fetching the book…</div>
        </div>
    );

    if (!book) return (
        <div className="container mx-auto px-4 py-20 text-center bg-paper min-h-[60vh]">
            <h2 className="text-2xl font-serif font-bold text-ink mb-4">Book not found</h2>
            <Link to="/shop" className="text-accent-olive hover:underline font-serif italic">Back to the shop</Link>
        </div>
    );

    const soldOut = book.stockQuantity <= 0;
    const details = [
        ['Category', book.category && <Link to={`/shop?category=${encodeURIComponent(book.category)}`} className="underline hover:text-accent-olive">{book.category}</Link>],
        ['First published', book.publishedYear],
        ['Publisher', book.publisher],
        ['Pages', book.pageCount],
        ['ISBN', book.isbn],
    ].filter(([, value]) => value);

    const add = async () => {
        setAdding(true);
        await addToCart(book, quantity);
        setAdding(false);
    };

    return (
        <div className="bg-paper min-h-screen py-10">
            <div className="container mx-auto px-4 space-y-10">
                <nav className="font-serif text-sm text-ink-light" aria-label="Breadcrumb">
                    <Link to="/shop" className="hover:text-accent-olive">Shop</Link>
                    {book.category && <> / <Link to={`/shop?category=${encodeURIComponent(book.category)}`} className="hover:text-accent-olive">{book.category}</Link></>}
                    {' / '}<span className="text-ink">{book.title}</span>
                </nav>

                <div className="bg-paper-dark rounded-sm shadow-[8px_8px_0_0_#e5e0d8] border border-border-linen flex flex-col md:flex-row overflow-hidden">
                    <div className="md:w-5/12 bg-[#e3ddd3] p-8 md:p-12 flex items-center justify-center relative">
                        <div className="absolute top-4 left-4 flex flex-col items-start gap-2"><BookBadges book={book} /></div>
                        <div className="aspect-[2/3] w-56 md:w-64 bg-paper shadow-2xl overflow-hidden">
                            {book.imageUrl
                                ? <img src={assetUrl(book.imageUrl)} alt={`Cover of ${book.title}`} className="w-full h-full object-cover" />
                                : <span className="flex items-center justify-center h-full text-8xl text-ink/30 font-serif">❦</span>}
                        </div>
                    </div>

                    <div className="md:w-7/12 p-6 md:p-12 flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink leading-tight mb-2">{book.title}</h1>
                        <p className="text-xl text-accent-olive font-serif italic mb-3">by {book.author}</p>
                        <a href="#reviews-heading" className="mb-6 self-start"><RatingSummary book={book} /></a>

                        <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-dotted border-border-linen">
                            <span className="text-4xl font-serif font-bold text-ink">${book.price.toFixed(2)}</span>
                            <span className={`text-xs font-bold uppercase tracking-widest ${soldOut ? 'text-red-800' : book.stockQuantity <= 5 ? 'text-accent-leather' : 'text-accent-olive'}`}>
                                {soldOut ? 'Sold out' : book.stockQuantity <= 5 ? `Only ${book.stockQuantity} left` : 'In stock'}
                            </span>
                        </div>

                        {book.description
                            ? <p className="text-ink-light leading-relaxed mb-6 font-body text-lg">{book.description}</p>
                            : <p className="text-ink-light italic mb-6 font-body">No description yet.</p>}

                        {details.length > 0 && (
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-serif mb-8">
                                {details.map(([label, value]) => (
                                    <div key={label} className="contents">
                                        <dt className="text-ink-light">{label}</dt>
                                        <dd className="text-ink">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        <div className="mt-auto flex flex-wrap gap-3">
                            {!soldOut && (
                                <div className="flex items-center border border-ink bg-white" role="group" aria-label="Quantity">
                                    <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}
                                        className="w-11 h-full text-lg disabled:opacity-30" aria-label="Decrease quantity">−</button>
                                    <span className="w-10 text-center font-mono" aria-live="polite">{quantity}</span>
                                    <button type="button" onClick={() => setQuantity(q => Math.min(book.stockQuantity, q + 1))} disabled={quantity >= book.stockQuantity}
                                        className="w-11 h-full text-lg disabled:opacity-30" aria-label="Increase quantity">+</button>
                                </div>
                            )}
                            <button
                                onClick={add}
                                disabled={adding || soldOut}
                                className={`flex-1 min-w-48 font-serif font-bold uppercase tracking-widest py-4 transition-colors border border-ink shadow-[4px_4px_0_0_rgba(44,44,44,0.2)] ${soldOut ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-ink text-paper hover:bg-accent-olive'}`}
                            >
                                {adding ? 'Adding…' : soldOut ? 'Sold out' : 'Add to cart'}
                            </button>
                            <WishlistButton book={book} className="w-14 border border-ink" />
                        </div>
                        <p className="text-[11px] text-ink-light mt-4 uppercase tracking-widest">
                            Free shipping over $50 · Cancel any time before we approve your order
                        </p>
                    </div>
                </div>

                <Reviews bookId={book.id} onChanged={loadBook} />

                {related.length > 0 && (
                    <section aria-labelledby="related-heading">
                        <h2 id="related-heading" className="font-serif font-bold text-2xl text-ink mb-6">You might also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map(b => <ProductCard key={b.id} book={b} />)}
                        </div>
                    </section>
                )}

                {recent.length > 0 && (
                    <section aria-labelledby="recent-heading">
                        <h2 id="recent-heading" className="font-serif font-bold text-xl text-ink mb-4">Recently viewed</h2>
                        <ul className="flex gap-4 overflow-x-auto pb-2">
                            {recent.map(b => (
                                <li key={b.id} className="w-28 flex-shrink-0">
                                    <Link to={`/product/${b.id}`} className="block group">
                                        <div className="aspect-[2/3] bg-[#e3ddd3] border border-border-linen overflow-hidden mb-2">
                                            {b.imageUrl && <img src={assetUrl(b.imageUrl)} alt="" loading="lazy" className="w-full h-full object-cover" />}
                                        </div>
                                        <p className="text-xs font-serif text-ink leading-tight group-hover:text-accent-olive line-clamp-2">{b.title}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default BookDetails;
