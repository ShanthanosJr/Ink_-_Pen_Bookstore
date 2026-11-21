import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Only lets admins through. The API enforces this too; this just keeps others out of admin screens.
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh] bg-paper">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location, message: 'Please log in with an admin account.' }} replace />;
    }

    if (user.role !== 'Admin') {
        return (
            <div className="min-h-[60vh] bg-paper flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-serif font-bold text-ink mb-2">Staff only</h1>
                <p className="font-serif italic text-ink-light mb-6">This part of the shop is for administrators.</p>
                <Link to="/" className="px-6 py-3 bg-ink text-paper font-serif uppercase tracking-widest text-xs font-bold">
                    Back to the shop
                </Link>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
