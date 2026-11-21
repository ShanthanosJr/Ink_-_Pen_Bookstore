import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { errorMessage, formatMoney } from '../constants/orders';
import Dashboard from '../components/admin/Dashboard';
import OrdersTable from '../components/admin/OrdersTable';

const LOW_STOCK = 5;

const TABS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'inventory', label: 'Inventory' },
];

const Inventory = () => {
    const { showToast } = useToast();
    const [params, setParams] = useSearchParams();
    const [books, setBooks] = useState(null);
    const q = params.get('q') || '';
    const lowStockOnly = params.get('lowStock') === '1';

    useEffect(() => {
        api.get('/books')
            .then(res => setBooks(res.data))
            .catch(err => showToast(errorMessage(err, 'Could not load books.'), 'error'));
    }, [showToast]);

    const setFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value); else next.delete(key);
        setParams(next, { replace: true });
    };

    const visible = useMemo(() => {
        const term = q.trim().toLowerCase();
        return (books || [])
            .filter(b => !lowStockOnly || b.stockQuantity <= LOW_STOCK)
            .filter(b => !term || [b.title, b.author, b.category].some(v => v?.toLowerCase().includes(term)))
            .sort((a, b) => lowStockOnly ? a.stockQuantity - b.stockQuantity : a.title.localeCompare(b.title));
    }, [books, q, lowStockOnly]);

    const handleDeleteBook = async (book) => {
        if (!window.confirm(`Delete "${book.title}"? This can't be undone.`)) return;
        try {
            await api.delete(`/books/${book.id}`);
            setBooks(prev => prev.filter(b => b.id !== book.id));
            showToast(`"${book.title}" deleted.`, 'success');
        } catch (error) {
            showToast(errorMessage(error, 'Failed to delete book.'), 'error');
        }
    };

    if (!books) return <p className="font-serif italic text-ink-light animate-pulse">Counting the shelves…</p>;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
                <label className="sr-only" htmlFor="book-search">Search books</label>
                <input
                    id="book-search"
                    type="search"
                    value={q}
                    onChange={(e) => setFilter('q', e.target.value)}
                    placeholder="Search title, author, category"
                    className="flex-1 min-w-56 bg-paper border border-border-linen px-3 py-2 font-serif text-sm focus:outline-none focus:border-accent-olive"
                />
                <label className="flex items-center gap-2 font-serif text-sm text-ink">
                    <input type="checkbox" checked={lowStockOnly} onChange={(e) => setFilter('lowStock', e.target.checked ? '1' : '')} className="accent-[#556b2f]" />
                    Low stock only (≤{LOW_STOCK})
                </label>
                <Link to="/add" className="ml-auto bg-ink text-paper px-5 py-2 font-serif uppercase tracking-widest text-xs font-bold hover:bg-accent-olive transition-colors border border-ink">
                    + Add book
                </Link>
            </div>

            <div className="bg-paper border border-ink overflow-x-auto shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <table className="min-w-full divide-y divide-ink/20">
                    <thead className="bg-paper-dark">
                        <tr className="text-left text-xs font-serif font-bold text-ink uppercase tracking-widest">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Author</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3 text-right">Price</th>
                            <th className="px-4 py-3 text-right">Stock</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {visible.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-10 text-center font-serif italic text-ink-light">No books match.</td></tr>
                        )}
                        {visible.map(book => (
                            <tr key={book.id} className="hover:bg-paper-dark transition-colors">
                                <td className="px-4 py-3 text-sm font-serif font-bold text-ink">{book.title}</td>
                                <td className="px-4 py-3 text-sm font-serif text-ink italic">{book.author}</td>
                                <td className="px-4 py-3 text-sm font-serif text-ink">{book.category || <span className="text-ink-light italic">—</span>}</td>
                                <td className="px-4 py-3 text-sm font-serif text-ink text-right">{formatMoney(book.price)}</td>
                                <td className="px-4 py-3 text-sm font-serif text-right">
                                    <span className={book.stockQuantity === 0 ? 'text-red-800 font-bold' : book.stockQuantity <= LOW_STOCK ? 'text-accent-leather font-bold' : 'text-ink-light'}>
                                        {book.stockQuantity === 0 ? 'Sold out' : book.stockQuantity}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                    <Link to={`/edit/${book.id}`} className="text-accent-olive hover:text-ink mr-4 font-serif italic">Edit</Link>
                                    <button onClick={() => handleDeleteBook(book)} className="text-accent-leather hover:text-red-800 font-serif italic">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Admin = () => {
    const [params, setParams] = useSearchParams();
    const activeTab = TABS.some(t => t.id === params.get('tab')) ? params.get('tab') : 'dashboard';

    return (
        <div className="bg-paper-dark min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-wrap justify-between items-end gap-4 mb-8 border-b-4 border-double border-ink pb-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">Shop Admin</h1>
                    <nav className="flex gap-1" aria-label="Admin sections">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setParams({ tab: tab.id })}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                                className={`px-4 sm:px-6 py-2 font-serif font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors border border-ink ${activeTab === tab.id ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/5'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'orders' && <OrdersTable />}
                {activeTab === 'inventory' && <Inventory />}
            </div>
        </div>
    );
};

export default Admin;
