import React from 'react';

const StarRating = ({ rating, size = "text-accent-olive" }) => {
    return (
        <div className={`flex ${size}`}>
            {[...Array(5)].map((_, i) => (
                <span key={i}>
                    {i < Math.floor(rating) ? '★' : i < rating ? '½' : '☆'}
                </span>
            ))}
        </div>
    );
};

const ReviewCard = ({ name, date, rating, title, content, verified }) => (
    <div className="bg-paper p-8 border border-border-linen shadow-[4px_4px_0_0_#e5e0d8] relative hover:-translate-y-1 transition duration-300">
        <div className="flex justify-between items-start mb-6 border-b border-border-linen pb-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-accent-olive text-accent-olive flex items-center justify-center font-serif italic text-lg bg-paper-dark">
                    {name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-serif font-bold text-ink text-sm flex items-center gap-2">
                        {name}
                        {verified && (
                            <span className="text-accent-olive text-[10px] uppercase border border-accent-olive px-2 flex items-center gap-1 tracking-widest bg-paper-dark">
                                Verified
                            </span>
                        )}
                    </h4>
                    <p className="text-[10px] uppercase tracking-widest text-ink-light mt-0.5">{date}</p>
                </div>
            </div>
            <StarRating rating={rating} size="text-xs text-accent-leather" />
        </div>
        <h5 className="font-serif font-bold text-ink mb-3 italic">"{title}"</h5>
        <p className="text-ink-light text-sm leading-relaxed font-body">
            {content}
        </p>
    </div>
);

const ReviewsSection = () => {
    const reviews = [
        {
            id: 1,
            name: "Alice M.",
            date: "October 12, 2023",
            rating: 5,
            title: "A wonderful discovery",
            content: "I ordered a rare edition of 'The Hobbit' and it arrived in pristine condition. The packaging was reminiscent of old-world care.",
            verified: true
        },
        {
            id: 2,
            name: "James Wilson",
            date: "September 28, 2023",
            rating: 4.5,
            title: "Superb selection",
            content: "The technical volume selection is vastly superior to other local stores. Shipping was prompt and dignified.",
            verified: true
        },
        {
            id: 3,
            name: "Sophia Li",
            date: "November 05, 2023",
            rating: 5,
            title: "My favorite haunt",
            content: "Browsing this catalog is so calming. Finding volumes by category is intuitive. A beautifully curated experience.",
            verified: true
        }
    ];

    return (
        <div className="mt-16">
            <div className="bg-ink text-paper rounded-sm p-10 md:p-12 mb-12 relative overflow-hidden border-4 border-double border-accent-olive/40">
                {/* Vintage decorative elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-9xl leading-none select-none">❞</div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <span className="font-serif italic text-accent-olive text-sm mb-2 block">Community Voices</span>
                        <h2 className="text-3xl font-serif font-bold mb-2">Reader Testimonials</h2>
                        <p className="text-ink-light opacity-70 font-body">Reflections from our esteemed patrons.</p>
                    </div>
                    <div className="flex items-center gap-8 border-l border-paper/20 pl-8">
                        <div className="text-center">
                            <span className="block text-5xl font-serif font-bold text-paper">4.8</span>
                            <div className="text-accent-olive text-xs tracking-widest uppercase mt-2">Average Rating</div>
                        </div>
                        <div>
                            <p className="text-xs font-serif italic text-paper/60">Based on</p>
                            <p className="text-xl font-serif font-bold">1,240+ Reviews</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {reviews.map(review => (
                    <ReviewCard key={review.id} {...review} />
                ))}
            </div>

            <div className="text-center mt-12">
                <button className="text-ink font-serif font-bold hover:text-accent-olive transition flex items-center justify-center gap-2 mx-auto border-b border-ink/30 hover:border-accent-olive pb-1">
                    Read all 1,240 testimonials
                    <span>→</span>
                </button>
            </div>
        </div>
    );
};

export default ReviewsSection;
