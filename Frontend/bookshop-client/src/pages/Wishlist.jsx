import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { WishlistButton } from '../components/shop/BookBits';
import BookCover from '../components/shop/BookCover';

const Wishlist = () => {
    const { items } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="bg-paper min-h-[70vh] py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-8 border-b border-ink pb-4">Wishlist</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="font-serif italic text-ink-light mb-6">Nothing saved yet. Tap the heart on any book to keep it here for later.</p>
                        <Link to="/shop" className="px-8 py-3 bg-ink text-paper font-serif font-bold uppercase tracking-widest text-xs">Browse the collection</Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-border-linen">
                        {items.map(({ book }) => {
                            const soldOut = book.stockQuantity <= 0;
                            return (
                                <li key={book.id} className="flex gap-4 py-5 items-center">
                                    <Link to={`/product/${book.id}`} className="w-16 h-24 bg-[#e3ddd3] border border-border-linen overflow-hidden flex-shrink-0">
                                        <BookCover book={book} compact />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${book.id}`} className="font-serif font-bold text-ink hover:text-accent-olive">{book.title}</Link>
                                        <p className="text-sm font-serif italic text-ink-light">by {book.author}</p>
                                        <p className="text-sm font-serif text-ink mt-1">
                                            ${book.price.toFixed(2)}
                                            <span className={`ml-3 text-xs font-bold uppercase tracking-widest ${soldOut ? 'text-red-800' : 'text-accent-olive'}`}>
                                                {soldOut ? 'Sold out' : 'In stock'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => addToCart(book, 1)}
                                            disabled={soldOut}
                                            className="px-4 py-2 bg-ink text-paper font-serif uppercase tracking-widest text-[11px] font-bold disabled:opacity-40"
                                        >
                                            Add to cart
                                        </button>
                                        <WishlistButton book={book} className="w-10 h-10 border border-border-linen" />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
