import { useEffect } from 'react';

const SITE = 'Ink & Pens';

/** Sets the browser tab title, e.g. "Shop · Ink & Pens". Pass nothing for the plain site name. */
export const usePageTitle = (title, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;
        document.title = title ? `${title} · ${SITE}` : `${SITE} · Bookshop`;
    }, [title, enabled]);
};
