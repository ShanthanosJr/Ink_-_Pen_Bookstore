import React from 'react';

const StarRating = ({ rating, size = "text-yellow-400" }) => {
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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        {name}
                        {verified && (
                            <span className="text-green-500 text-xs bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                ✓ Verified Buyer
                            </span>
                        )}
                    </h4>
                    <p className="text-xs text-gray-400">{date}</p>
                </div>
            </div>
            <StarRating rating={rating} size="text-sm text-yellow-400" />
        </div>
        <h5 className="font-bold text-gray-800 mb-2">{title}</h5>
        <p className="text-gray-600 text-sm leading-relaxed">
            "{content}"
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
            title: "Absolutely wonderful experience!",
            content: "I ordered a rare edition of 'The Hobbit' and it arrived in perfect condition. The packaging was eco-friendly which I really appreciate. Will definitely be buying again!",
            verified: true
        },
        {
            id: 2,
            name: "James Wilson",
            date: "September 28, 2023",
            rating: 4.5,
            title: "Great selection, fast shipping",
            content: "The technical book selection is vastly superior to other local stores. Shipping was faster than expected. One corner of the box was dented but the books were fine.",
            verified: true
        },
        {
            id: 3,
            name: "Sophia Li",
            date: "November 05, 2023",
            rating: 5,
            title: "My favorite bookstore now",
            content: "Love the website design, it makes browsing so calming. Finding books by category is super easy. The 'Fiction' collection is curated beautifully.",
            verified: true
        }
    ];

    return (
        <div className="mt-16">
            <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl font-black mb-2">Customer Reviews</h2>
                        <p className="text-indigo-200">See what our community has to say about us.</p>
                    </div>
                    <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                        <div className="text-center">
                            <span className="block text-5xl font-black text-white">4.8</span>
                            <StarRating rating={5} size="text-yellow-400 text-lg justify-center mt-1" />
                        </div>
                        <div className="h-12 w-px bg-indigo-400/30"></div>
                        <div>
                            <p className="text-sm font-medium text-indigo-200 uppercase tracking-wide">Based on</p>
                            <p className="text-xl font-bold">1,240+ Reviews</p>
                        </div>
                    </div>
                </div>
                {/* Decorative background */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {reviews.map(review => (
                    <ReviewCard key={review.id} {...review} />
                ))}
            </div>

            <div className="text-center mt-12">
                <button className="text-indigo-600 font-bold hover:text-indigo-800 transition flex items-center justify-center gap-2 mx-auto">
                    View all 1,240 reviews
                    <span>→</span>
                </button>
            </div>
        </div>
    );
};

export default ReviewsSection;
