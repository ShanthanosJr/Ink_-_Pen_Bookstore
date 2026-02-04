const Promotions = () => {
    return (
        <section className="py-16 bg-ink text-paper my-16 px-8 relative overflow-hidden border-4 border-double border-accent-olive/40 mx-4 md:mx-0">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }}></div>

            {/* Decorative Corner Ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-accent-olive/40"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-accent-olive/40"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                    <span className="inline-block py-1 px-4 border border-accent-olive text-accent-olive font-serif italic text-xs mb-6 tracking-widest uppercase bg-ink/50">Limited Time Proclamation</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">Get 50% Off Your <br /><span className="italic font-normal text-accent-olive">First Purchase</span></h2>
                    <p className="text-paper/80 text-lg mb-8 font-body leading-relaxed">
                        Join the <span className="text-paper font-bold">Ink & Pens</span> community today and discover a world of stories awaiting you.
                        Use code <span className="bg-paper text-ink px-3 py-1 font-serif font-bold mx-1 border border-ink shadow-[2px_2px_0_0_rgba(85,107,47,0.5)]">WELCOME50</span> at checkout.
                    </p>
                    <button className="bg-paper text-ink px-10 py-4 font-serif font-bold uppercase tracking-widest text-sm hover:bg-accent-olive hover:text-paper transition-all border border-ink shadow-[4px_4px_0_0_rgba(85,107,47,0.3)]">
                        Claim Offer
                    </button>
                </div>

                <div className="md:w-1/2 flex justify-center">
                    <div className="relative group">
                        {/* Stacked Paper Effect */}
                        <div className="absolute inset-0 bg-paper/5 border border-paper/10 transform rotate-3 translate-x-2 translate-y-2 transition-transform group-hover:rotate-6"></div>
                        <div className="absolute inset-0 bg-paper/5 border border-paper/10 transform -rotate-2 -translate-x-1 -translate-y-1 transition-transform group-hover:-rotate-4"></div>

                        <div className="bg-paper-dark text-ink p-8 border border-border-linen relative shadow-xl w-full max-w-sm">
                            <div className="flex items-center gap-4 mb-6 border-b border-border-linen pb-4">
                                <div className="w-12 h-12 border-2 border-accent-olive flex items-center justify-center font-serif text-2xl text-accent-olive italic">❦</div>
                                <div>
                                    <div className="font-serif font-bold text-lg leading-tight uppercase tracking-widest text-ink">Bundle Deal</div>
                                    <div className="text-[10px] text-accent-olive font-bold uppercase tracking-widest mt-1">Foundational Archives</div>
                                </div>
                            </div>
                            <div className="text-4xl font-serif font-bold mb-4 text-ink flex items-baseline gap-3">
                                $49.99
                                <span className="text-lg text-ink-light/40 line-through font-normal">$99.99</span>
                            </div>
                            <p className="text-sm text-ink-light font-body italic border-l-2 border-accent-olive/30 pl-4 mb-6 leading-relaxed">
                                "Includes three essential volumes on modern architecture and aesthetic philosophy. A library staple."
                            </p>
                            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-ink-light/60 text-center border-t border-dotted border-border-linen pt-4">
                                Limited Availability Entry No. 492
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Promotions;
