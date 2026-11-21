import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { Stars } from '../shop/BookBits';

// Real reviews written by customers (replaces the made-up testimonials). Hidden until there are some.
const ReaderReviews = ({ title = 'What our readers say', eyebrow = 'Reader reflections', showSummary = false, limit = 3 }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('/reviews/highlights', { params: { limit } })
            .then(res => setData(res.data))
            .catch(() => setData(null));
    }, [limit]);

    if (!data || data.reviews.length === 0) return null;

    return (
        <section className="py-16 bg-paper-dark my-12 px-6 border-y border-border-linen" aria-labelledby="reader-reviews-heading">
            <div className="text-center mb-12">
                <span className="font-serif italic text-accent-olive text-sm mb-2 block tracking-widest">{eyebrow}</span>
                <h2 id="reader-reviews-heading" className="text-3xl md:text-4xl font-serif font-bold text-ink">{title}</h2>
                {showSummary && data.averageRating && (
                    <p className="mt-4 font-serif text-ink-light inline-flex items-center gap-2">
                        <Stars rating={data.averageRating} />
                        {data.averageRating.toFixed(1)} average from {data.reviewCount} {data.reviewCount === 1 ? 'review' : 'reviews'}
                    </p>
                )}
            </div>
            <ul className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {data.reviews.map(review => (
                    <li key={review.id} className="bg-paper p-8 border border-border-linen shadow-[6px_6px_0_0_#e5e0d8] flex flex-col">
                        <Stars rating={review.rating} />
                        {review.title && <p className="font-serif font-bold text-ink mt-3">{review.title}</p>}
                        <blockquote className="text-ink-light mt-3 mb-6 flex-grow font-body italic leading-relaxed line-clamp-6">
                            “{review.body}”
                        </blockquote>
                        <div className="border-t border-dotted border-border-linen pt-4 text-sm font-serif">
                            <span className="text-ink font-bold">{review.author}</span>
                            <span className="text-ink-light"> on </span>
                            <Link to={`/product/${review.bookId}`} className="text-accent-olive underline">{review.bookTitle}</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ReaderReviews;
