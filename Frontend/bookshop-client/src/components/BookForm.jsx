import { usePageTitle } from '../hooks/usePageTitle';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { assetUrl } from '../api';
import { CATEGORIES } from '../constants/categories';
import { errorMessage } from '../constants/orders';
import { useToast } from '../context/ToastContext';

const EMPTY = {
    title: '', author: '', price: '', stockQuantity: '', imageUrl: '', category: '',
    description: '', publisher: '', publishedYear: '', pageCount: '', isbn: ''
};

const labelClass = 'block text-xs font-serif font-bold text-ink uppercase tracking-widest mb-2';
const inputClass = 'w-full px-4 py-3 bg-paper border-b border-ink/20 focus:border-accent-olive outline-none font-serif text-ink transition-colors placeholder-ink-light/40 shadow-sm';

const BookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const isEditing = !!id;
    const [book, setBook] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    usePageTitle(isEditing ? 'Edit book' : 'Add a book');

    useEffect(() => {
        if (!isEditing) return;
        api.get(`/books/${id}`)
            .then(res => {
                // Inputs need strings, not nulls
                const data = Object.fromEntries(Object.keys(EMPTY).map(key => [key, res.data[key] ?? '']));
                setBook(data);
            })
            .catch(err => setError(errorMessage(err, 'Failed to load book details.')));
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook(prev => ({ ...prev, [name]: value }));
    };

    const uploadCover = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            setError('Cover images must be smaller than 3 MB.');
            e.target.value = '';
            return;
        }
        setUploading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('file', file);
            const res = await api.post('/books/cover', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setBook(prev => ({ ...prev, imageUrl: res.data.path }));
            showToast('Cover uploaded.', 'success');
        } catch (err) {
            setError(errorMessage(err, 'The cover could not be uploaded.'));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const toNumber = (v) => (v === '' || v === null ? null : Number(v));
        const payload = {
            ...book,
            price: Number(book.price),
            stockQuantity: Number(book.stockQuantity),
            publishedYear: toNumber(book.publishedYear),
            pageCount: toNumber(book.pageCount),
        };

        try {
            if (isEditing) {
                await api.put(`/books/${id}`, payload);
                showToast(`"${book.title}" updated.`, 'success');
            } else {
                await api.post('/books', payload);
                showToast(`"${book.title}" added to the catalogue.`, 'success');
            }
            navigate('/admin?tab=inventory');
        } catch (err) {
            setError(errorMessage(err, 'Failed to save the book.'));
            setSaving(false);
        }
    };

    const field = (name, label, props = {}) => (
        <div className={props.wide ? 'md:col-span-2' : ''}>
            <label htmlFor={`book-${name}`} className={labelClass}>{label}</label>
            <input id={`book-${name}`} name={name} value={book[name]} onChange={handleChange} className={inputClass} {...props.input} />
        </div>
    );

    return (
        <div className="bg-paper min-h-screen py-8 px-1">
            <div className="max-w-3xl mx-auto bg-paper-dark border border-border-linen p-6 md:p-12 shadow-[8px_8px_0_0_#e5e0d8]">
                <h2 className="text-3xl font-serif font-bold text-ink mb-8 border-b border-border-linen pb-4">
                    {isEditing ? 'Edit book' : 'Add a book'}
                </h2>

                {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 text-sm font-serif" role="alert">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        {field('title', 'Title', { wide: true, input: { required: true, maxLength: 200, placeholder: 'e.g. Meditations' } })}
                        {field('author', 'Author', { input: { required: true, maxLength: 150, placeholder: 'e.g. Marcus Aurelius' } })}
                        <div>
                            <label htmlFor="book-category" className={labelClass}>Category</label>
                            <select id="book-category" name="category" value={book.category} onChange={handleChange} required className={inputClass}>
                                <option value="" disabled>Select a category</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        {field('price', 'Price ($)', { input: { type: 'number', required: true, min: 0, step: '0.01', placeholder: '0.00' } })}
                        {field('stockQuantity', 'Stock', { input: { type: 'number', required: true, min: 0, step: 1, placeholder: '0' } })}

                        <div className="md:col-span-2">
                            <label htmlFor="book-description" className={labelClass}>Description</label>
                            <textarea id="book-description" name="description" rows={4} maxLength={4000} value={book.description} onChange={handleChange}
                                className={inputClass} placeholder="A short summary shown on the book page." />
                        </div>

                        {field('publisher', 'Publisher (optional)', { input: { maxLength: 150 } })}
                        {field('publishedYear', 'First published (optional)', { input: { type: 'number', min: 0, max: 3000, placeholder: 'e.g. 1949' } })}
                        {field('pageCount', 'Pages (optional)', { input: { type: 'number', min: 1, max: 20000 } })}
                        {field('isbn', 'ISBN (optional)', { input: { maxLength: 20, placeholder: '978-…' } })}

                        <div className="md:col-span-2 space-y-3">
                            <span className={labelClass}>Cover</span>
                            <div className="flex flex-wrap items-start gap-4">
                                <div className="w-24 aspect-[2/3] bg-[#e3ddd3] border border-border-linen overflow-hidden flex items-center justify-center">
                                    {book.imageUrl
                                        ? <img src={assetUrl(book.imageUrl)} alt="Cover preview" className="w-full h-full object-cover" />
                                        : <span className="text-3xl text-ink/20 font-serif">❦</span>}
                                </div>
                                <div className="flex-1 min-w-56 space-y-3">
                                    <div>
                                        <label htmlFor="book-cover-file" className="inline-block px-4 py-2 border border-ink font-serif text-xs uppercase tracking-widest font-bold cursor-pointer hover:bg-ink hover:text-paper">
                                            {uploading ? 'Uploading…' : 'Upload image'}
                                        </label>
                                        <input id="book-cover-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadCover} className="sr-only" disabled={uploading} />
                                        <p className="text-xs font-serif text-ink-light mt-1">JPG, PNG, WebP or GIF, up to 3 MB.</p>
                                    </div>
                                    <div>
                                        <label htmlFor="book-imageUrl" className="block text-[11px] font-serif text-ink-light mb-1">…or paste an image URL</label>
                                        <input id="book-imageUrl" name="imageUrl" type="text" value={book.imageUrl} onChange={handleChange} className={inputClass} placeholder="https://…" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-4 pt-6 border-t border-border-linen">
                        <button type="button" onClick={() => navigate('/admin?tab=inventory')}
                            className="px-8 py-3 border border-ink text-ink font-serif uppercase tracking-widest text-xs font-bold hover:bg-ink/5">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving || uploading}
                            className="px-8 py-3 bg-ink text-paper font-serif uppercase tracking-widest text-xs font-bold hover:bg-accent-olive disabled:opacity-50">
                            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
