const Promotions = () => {
    return (
        <section className="py-16 bg-gray-900 rounded-3xl text-white my-16 px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 text-indigo-300 font-semibold text-sm mb-4 border border-indigo-500/50">Limited Time Offer</span>
                    <h2 className="text-4xl font-bold mb-4">Get 50% Off Your First Purchase</h2>
                    <p className="text-gray-300 text-lg mb-8">Join the Ink & Pens community today and discover a world of stories awaiting you. Use code <span className="text-white font-mono bg-indigo-600 px-2 py-1 rounded">WELCOME50</span> at checkout.</p>
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">Claim Offer</button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30 transform rotate-6"></div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl w-full max-w-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl">📚</div>
                                <div>
                                    <div className="font-bold text-lg">Bundle Deal</div>
                                    <div className="text-sm text-gray-400">Technology & Design</div>
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-2">$49.99 <span className="text-lg text-gray-400 line-through font-normal">$99.99</span></div>
                            <div className="text-sm text-gray-300">Includes 3 bestseller books on modern web development and UI design.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Promotions;
