const QuoteOfTheWeek = () => {
    return (
        <section className="py-16 my-8 bg-paper mx-4 md:mx-0">
            <div className="max-w-4xl mx-auto border border-border-linen p-2 relative shadow-[10px_10px_0_0_#f4f1ea]">
                <div className="border border-border-linen p-12 text-center relative bg-paper">

                    {/* Vintage Corner Ornaments (CSS pseudo-elements simulated via DIVs here for simplicity) */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent-olive"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent-olive"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent-olive"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent-olive"></div>

                    <p className="font-serif italic text-accent-leather text-sm tracking-widest uppercase mb-8 relative inline-block px-4 bg-paper z-10">
                        Words of Wisdom
                    </p>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-px bg-border-linen -z-0"></div>

                    <blockquote className="text-3xl md:text-4xl font-serif text-ink leading-relaxed mb-8 relative">
                        <span className="text-6xl text-border-linen absolute -top-8 -left-8 font-serif select-none">“</span>
                        A reader lives a thousand lives before he dies. The man who never reads lives only one.
                        <span className="text-6xl text-border-linen absolute -bottom-12 -right-4 font-serif select-none">”</span>
                    </blockquote>

                    <cite className="not-italic text-lg font-body text-ink-light flex items-center justify-center gap-4">
                        <span className="w-8 h-px bg-accent-olive"></span>
                        George R.R. Martin
                        <span className="w-8 h-px bg-accent-olive"></span>
                    </cite>
                </div>
            </div>
        </section>
    );
};

export default QuoteOfTheWeek;
