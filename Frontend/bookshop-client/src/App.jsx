import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Support from './pages/Support'
import Contact from './pages/Contact'
import About from './pages/About'
import Admin from './pages/Admin'
import BookDetails from './pages/BookDetails'
import BookList from './components/BookList'
import BookForm from './components/BookForm'

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/product/:id" element={<BookDetails />} />
            <Route path="/add" element={
              <div className="container mx-auto p-4 mt-6">
                <BookForm />
              </div>
            } />
            <Route path="/edit/:id" element={
              <div className="container mx-auto p-4 mt-6">
                <BookForm />
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
