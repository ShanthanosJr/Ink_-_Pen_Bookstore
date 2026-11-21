import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Support from './pages/Support'
import Contact from './pages/Contact'
import About from './pages/About'
import Admin from './pages/Admin'
import AdminOrderDetails from './pages/AdminOrderDetails'
import BookDetails from './pages/BookDetails'
import BookForm from './components/BookForm'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderDetails from './pages/OrderDetails'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// New pages start at the top instead of keeping the previous page's scroll position
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const NotFound = () => (
  <div className="min-h-[60vh] bg-paper flex flex-col items-center justify-center px-4 text-center">
    <p className="font-serif italic text-accent-olive mb-2">Page 404</p>
    <h1 className="text-3xl font-serif font-bold text-ink mb-4">This page has gone missing from the shelves</h1>
    <Link to="/shop" className="px-6 py-3 bg-ink text-paper font-serif uppercase tracking-widest text-xs font-bold">
      Browse the collection
    </Link>
  </div>
)

function App() {
  return (
    // Router is outermost so the providers can navigate (e.g. send guests to login)
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/product/:id" element={<BookDetails />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

                  <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                  <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetails /></AdminRoute>} />
                  <Route path="/add" element={
                    <AdminRoute>
                      <div className="container mx-auto p-4 mt-6">
                        <BookForm />
                      </div>
                    </AdminRoute>
                  } />
                  <Route path="/edit/:id" element={
                    <AdminRoute>
                      <div className="container mx-auto p-4 mt-6">
                        <BookForm />
                      </div>
                    </AdminRoute>
                  } />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
