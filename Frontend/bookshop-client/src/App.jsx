import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Pages are loaded on demand so the first visit downloads less JavaScript
const Shop = lazy(() => import('./pages/Shop'))
const Support = lazy(() => import('./pages/Support'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const BookDetails = lazy(() => import('./pages/BookDetails'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const ForgotPassword = lazy(() => import('./pages/PasswordReset').then(m => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/PasswordReset').then(m => ({ default: m.ResetPassword })))
const Admin = lazy(() => import('./pages/Admin'))
const AdminOrderDetails = lazy(() => import('./pages/AdminOrderDetails'))
const BookForm = lazy(() => import('./components/BookForm'))

// New pages start at the top instead of keeping the previous page's scroll position
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const PageLoading = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-paper" aria-busy="true">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ink" aria-label="Loading"></div>
  </div>
)

const NotFound = () => (
  <div className="min-h-[60vh] bg-paper flex flex-col items-center justify-center px-4 text-center">
    <p className="font-serif italic text-accent-olive mb-2">Page 404</p>
    <h1 className="text-3xl font-serif font-bold text-ink mb-4">This page has gone missing from the shelves</h1>
    <Link to="/shop" className="px-6 py-3 bg-ink text-paper font-serif uppercase tracking-widest text-xs font-bold">
      Browse the collection
    </Link>
  </div>
)

const AdminPage = ({ children }) => (
  <AdminRoute>
    <div className="container mx-auto p-4 mt-6">{children}</div>
  </AdminRoute>
)

function App() {
  return (
    // Router is outermost so the providers can navigate (e.g. send guests to login)
    <Router>
      <ScrollToTop />
      {/* Respect the visitor's "reduce motion" system setting for every animation */}
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
                  <Navbar />

                  <main className="flex-grow">
                    <Suspense fallback={<PageLoading />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/product/:id" element={<BookDetails />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

                        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetails /></AdminRoute>} />
                        <Route path="/add" element={<AdminPage><BookForm /></AdminPage>} />
                        <Route path="/edit/:id" element={<AdminPage><BookForm /></AdminPage>} />

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </main>

                  <Footer />
                </div>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </MotionConfig>
    </Router>
  )
}

export default App
