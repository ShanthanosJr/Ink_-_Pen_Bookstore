import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

let nextId = 1;

// Small notification stack used instead of window.alert()
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'success', options = {}) => {
        const id = nextId++;
        setToasts(prev => [...prev, { id, message, type, action: options.action }]);
        setTimeout(() => dismiss(id), options.duration ?? 4000);
    }, [dismiss]);

    const styles = {
        success: 'border-accent-olive',
        error: 'border-red-700',
        info: 'border-ink'
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div
                className="fixed z-[100] bottom-4 right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-3 pointer-events-none"
                role="status"
                aria-live="polite"
            >
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className={`pointer-events-auto bg-paper border border-border-linen border-l-4 ${styles[toast.type] || styles.info} shadow-[4px_4px_0_0_rgba(44,44,44,0.12)] px-4 py-3 flex items-start gap-3`}
                        >
                            <p className="flex-1 font-serif text-sm text-ink">{toast.message}</p>
                            {toast.action && (
                                <button
                                    onClick={() => { toast.action.onClick(); dismiss(toast.id); }}
                                    className="font-serif text-sm font-bold text-accent-olive underline underline-offset-2 whitespace-nowrap"
                                >
                                    {toast.action.label}
                                </button>
                            )}
                            <button
                                onClick={() => dismiss(toast.id)}
                                aria-label="Dismiss notification"
                                className="text-ink-light hover:text-ink leading-none text-lg"
                            >
                                ×
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
