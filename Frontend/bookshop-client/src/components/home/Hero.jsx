import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative bg-paper-dark text-ink overflow-hidden mx-4 md:mx-0 border-y-4 border-double border-border-linen my-8">
            <div className="absolute inset-0">
                {/* Vintage Paper Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
                {/* Subtle Ink Stains/Texture */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-olive opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
                <span className="font-serif italic text-accent-olive text-xl mb-6 relative px-8 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-6 before:h-px before:bg-accent-olive after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-6 after:h-px after:bg-accent-olive">
                    Curators of Fine Stories
                </span>

                <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-8 leading-tight text-ink">
                    Where Every Page <br />
                    <span className="italic font-normal text-ink-light">Turns Into a Memory.</span>
                </h1>

                <p className="max-w-xl text-lg md:text-xl text-ink-light mb-12 leading-relaxed font-body">
                    Step into a world of timeless classics and modern masterpieces.
                    Hand-picked for the thoughtful reader.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <Link
                        to="/shop"
                        className="px-10 py-4 bg-ink text-paper font-serif uppercase tracking-widest text-sm font-bold hover:bg-accent-olive transition-colors border border-ink shadow-[4px_4px_0_0_rgba(85,107,47,0.2)]"
                    >
                        Browse Collection
                    </Link>
                    <a
                        href="#featured"
                        className="px-10 py-4 border border-ink text-ink font-serif uppercase tracking-widest text-sm font-bold hover:bg-paper-dark transition-colors"
                    >
                        Our Selections
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;
