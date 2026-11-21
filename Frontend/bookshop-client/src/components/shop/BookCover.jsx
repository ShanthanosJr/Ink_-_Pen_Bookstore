import { useState } from 'react';
import { assetUrl } from '../../api';

// Cloth-binding colours for books whose cover image is missing or fails to load
const BINDINGS = [
    'bg-[#556b2f] text-[#f4f1ea]',
    'bg-[#8b4513] text-[#f5ebe0]',
    'bg-[#2c2c2c] text-[#e3c6a0]',
    'bg-[#5e3113] text-[#eddcc5]',
    'bg-[#3f4f5a] text-[#f4f1ea]',
    'bg-[#6b4e71] text-[#f4f1ea]',
];

// Fills its parent box. Shows the cover image, or a typeset stand-in cover when there is none / it won't load.
// `compact` is for small thumbnails, where only the first letter fits.
const BookCover = ({ book, alt = '', loading = 'lazy', compact = false, className = '' }) => {
    const [failedSrc, setFailedSrc] = useState(null);
    const src = book?.imageUrl ? assetUrl(book.imageUrl) : null;

    if (src && failedSrc !== src) {
        return (
            <img
                src={src}
                alt={alt}
                loading={loading}
                onError={() => setFailedSrc(src)}
                className={`w-full h-full object-cover ${className}`}
            />
        );
    }

    const binding = BINDINGS[(book?.id ?? 0) % BINDINGS.length];
    return (
        <div
            role={alt ? 'img' : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : 'true'}
            className={`@container w-full h-full flex flex-col items-center justify-center text-center relative ${binding} ${className}`}
        >
            {compact ? (
                <span className="font-serif font-bold text-lg leading-none">{book?.title?.charAt(0) ?? '❦'}</span>
            ) : (
                <>
                    <div className="absolute inset-2 border border-current opacity-30 pointer-events-none" />
                    <div className="px-[12%] flex flex-col items-center gap-[0.6em]">
                        <span className="font-serif font-bold leading-tight text-[clamp(0.9rem,7cqw,1.75rem)] line-clamp-4">{book?.title}</span>
                        <span className="w-8 h-px bg-current opacity-60" />
                        {book?.author && <span className="font-body italic opacity-80 text-[clamp(0.65rem,4.5cqw,1rem)] line-clamp-2">{book.author}</span>}
                    </div>
                </>
            )}
        </div>
    );
};

export default BookCover;
