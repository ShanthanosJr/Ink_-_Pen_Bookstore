const Testimonials = () => {
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Fiction Enthusiast",
            content: "The curated collection at Ink & Pens is unmatched. I found rare editions here that I couldn't find anywhere else. The delivery was incredibly fast too!",
            rating: 5,
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Tech Lead",
            content: "Excellent selection of technical books. The store interface is beautiful and easy to use. Highly recommended for developers looking to upgrade their skills.",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Student",
            content: "Affordable prices and great quality. The educational section helped me ace my semester exams. Thank you Ink & Pens!",
            rating: 4,
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    return (
        <section className="py-20 bg-indigo-50/50 rounded-3xl my-16 px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Readers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xl ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                            ))}
                        </div>
                        <p className="text-gray-600 mb-6 flex-grow italic">"{review.content}"</p>
                        <div className="flex items-center gap-4">
                            <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100" />
                            <div>
                                <div className="font-bold text-gray-900">{review.name}</div>
                                <div className="text-sm text-indigo-500">{review.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
