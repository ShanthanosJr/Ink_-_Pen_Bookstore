const QuoteOfTheWeek = () => {
    return (
        <section className="py-16 my-8">
            <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">

                {/* Decorative Quote Marks */}
                <div className="absolute top-4 left-8 text-8xl font-serif text-white opacity-10">“</div>
                <div className="absolute bottom-4 right-8 text-8xl font-serif text-white opacity-10">”</div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <p className="text-sm font-bold tracking-widest uppercase text-indigo-300 mb-6">Quote of the Week</p>
                    <blockquote className="text-2xl md:text-4xl font-serif italic leading-relaxed mb-8">
                        "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                    </blockquote>
                    <cite className="not-italic text-lg font-medium text-gray-300">— George R.R. Martin</cite>
                </div>
            </div>
        </section>
    );
};

export default QuoteOfTheWeek;
