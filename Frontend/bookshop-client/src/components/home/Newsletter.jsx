const Newsletter = () => {
    return (
        <section className="py-20 text-center">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay in the Loop</h2>
                <p className="text-gray-600 mb-8 text-lg">Subscribe to our newsletter for the latest book releases, author interviews, and exclusive discounts delivered straight to your inbox.</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    />
                    <button className="px-8 py-4 bg-indigo-900 text-white rounded-full font-bold hover:bg-indigo-800 transition shadow-lg">
                        Subscribe
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </div>
        </section>
    );
};

export default Newsletter;
