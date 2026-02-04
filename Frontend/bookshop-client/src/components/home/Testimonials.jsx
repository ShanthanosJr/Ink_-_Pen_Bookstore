const Testimonials = () => {
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Fiction Enthusiast",
            content: "The curated collection at Ink & Pens is unmatched. I found rare editions here that I couldn't find anywhere else. A true literary sanctuary.",
            rating: 5,
            initials: "SJ"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Tech Lead",
            content: "Excellent selection of technical volumes. The interface is dignified and easy to navigate. Highly recommended for the discerning professional.",
            rating: 5,
            initials: "MC"
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Scholar",
            content: "Affordable prices and exceptional quality. The educational archives helped me immensely with my research. A cherished resource.",
            rating: 5,
            initials: "ED"
        }
    ];

    return (
        <section className="py-20 bg-paper-dark my-16 px-6 border-y border-border-linen relative overflow-hidden">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <div className="relative z-10">
                <div className="text-center mb-16">
                    <span className="font-serif italic text-accent-olive text-sm mb-2 block tracking-widest uppercase">Reader Reflections</span>
                    <h2 className="text-4xl font-serif font-bold text-ink">What Our Patrons Say</h2>
                    <div className="w-16 h-px bg-accent-olive mx-auto mt-4 opacity-40"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-paper p-8 border border-border-linen shadow-[6px_6px_0_0_#e5e0d8] flex flex-col relative group hover:-translate-y-2 transition-transform duration-500">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 bg-paper-dark border-b border-l border-border-linen z-10 transition-colors group-hover:bg-accent-olive/10"></div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-xs ${i < review.rating ? "text-accent-leather" : "text-border-linen"}`}>★</span>
                                ))}
                            </div>

                            <blockquote className="text-ink-light mb-8 flex-grow font-body italic leading-relaxed text-sm">
                                "{review.content}"
                            </blockquote>

                            <div className="flex items-center gap-4 border-t border-dotted border-border-linen pt-6">
                                <div className="w-10 h-10 border border-ink/20 bg-paper-dark flex items-center justify-center font-serif text-sm italic group-hover:border-accent-olive transition-colors">
                                    {review.initials}
                                </div>
                                <div>
                                    <div className="font-serif font-bold text-ink text-sm leading-tight">{review.name}</div>
                                    <div className="text-[10px] text-accent-olive uppercase tracking-widest mt-1 font-bold">{review.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
