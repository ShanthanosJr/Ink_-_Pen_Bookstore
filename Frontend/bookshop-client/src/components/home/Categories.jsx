import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categories';

const categoryStyles = {
    Fiction: {
        description: 'Novels & classics',
        backdrop: 'bg-[#eadbd6]',
        cover: 'bg-[#77443f]',
        companion: 'bg-[#ad7669]',
    },
    'Non-Fiction': {
        description: 'Ideas & real stories',
        backdrop: 'bg-[#e7e6d7]',
        cover: 'bg-[#515c41]',
        companion: 'bg-[#8f9371]',
    },
    Technology: {
        description: 'Coding & computing',
        backdrop: 'bg-[#dbe4e3]',
        cover: 'bg-[#385b62]',
        companion: 'bg-[#729095]',
    },
    Education: {
        description: 'Learning & reference',
        backdrop: 'bg-[#eee4d3]',
        cover: 'bg-[#7b5b36]',
        companion: 'bg-[#b99563]',
    },
    History: {
        description: 'People & the past',
        backdrop: 'bg-[#eae0d4]',
        cover: 'bg-[#774d35]',
        companion: 'bg-[#aa7b57]',
    },
    'Art & Design': {
        description: 'Art & visual culture',
        backdrop: 'bg-[#e6dee5]',
        cover: 'bg-[#604b64]',
        companion: 'bg-[#927995]',
    },
};

const BookPair = ({ style }) => (
    <div aria-hidden="true" className={`relative flex h-24 items-end justify-center overflow-hidden sm:h-28 lg:h-32 ${style.backdrop}`}>
        <div className="absolute inset-x-3 bottom-3 h-px bg-ink/15 sm:inset-x-5 sm:bottom-4" />
        <div className="relative mb-3 flex h-17 w-21 items-end transition-none sm:mb-4 sm:h-21 sm:w-26 lg:h-24 lg:w-29 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1">
            <div className={`absolute bottom-1 right-1 h-[86%] w-[53%] origin-bottom rotate-[13deg] rounded-r-sm rounded-l-md border border-white/20 shadow-sm ${style.companion}`}>
                <div className="absolute inset-y-0 left-0 w-1.5 rounded-l-md bg-black/15" />
                <div className="absolute inset-x-2 bottom-2 h-px bg-paper/60" />
            </div>
            <div className={`absolute bottom-0 left-1 h-full w-[58%] origin-bottom -rotate-[10deg] rounded-r-sm rounded-l-md border border-white/20 shadow-md ${style.cover}`}>
                <div className="absolute inset-y-0 left-0 w-1.5 rounded-l-md bg-black/20" />
                <div className="absolute inset-y-2 right-1.5 left-2.5 flex items-center justify-center border border-paper/45">
                    <span className="size-2.5 rotate-45 border border-paper/70 sm:size-3" />
                </div>
            </div>
        </div>
        <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-paper/85 text-sm text-ink transition-colors group-hover:bg-paper group-focus-visible:bg-paper sm:top-2.5 sm:right-2.5 sm:size-7" aria-hidden="true">↗</span>
    </div>
);

const Categories = () => (
    <section aria-labelledby="browse-archives" className="py-9 sm:py-12">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border-linen pb-2 sm:mb-5">
            <h2 id="browse-archives" className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Browse Archives
            </h2>
            <Link to="/shop" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm text-sm font-semibold text-accent-olive decoration-1 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-olive">
                All books <span aria-hidden="true">→</span>
            </Link>
        </div>

        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
            {CATEGORIES.map(category => {
                const style = categoryStyles[category];
                return (
                    <li key={category} className="min-w-0">
                        <Link
                            to={`/shop?category=${encodeURIComponent(category)}`}
                            className="group flex h-full flex-col overflow-hidden rounded-sm border border-border-linen bg-paper text-ink shadow-xs transition-colors hover:border-accent-olive/55 hover:bg-paper-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-olive"
                        >
                            <BookPair style={style} />
                            <div className="px-2.5 py-2.5 sm:px-3.5 sm:py-3">
                                <span className="block font-serif text-base leading-tight font-bold group-hover:text-accent-olive sm:text-lg">{category}</span>
                                <span className="mt-1 block text-xs leading-snug text-ink-light">{style.description}</span>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    </section>
);

export default Categories;
