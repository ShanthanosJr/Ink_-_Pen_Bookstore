import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BookList from './components/BookList'
import BookForm from './components/BookForm'

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans">
        <nav className="bg-indigo-600 text-white p-4 shadow-lg sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              Ink & Pens
            </Link>
            <div className="space-x-4">
              <Link to="/" className="hover:text-indigo-200 transition">Home</Link>
              <Link to="/add" className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100 font-semibold transition shadow-sm">
                Add Book
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-4 mt-6">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/add" element={<BookForm />} />
            <Route path="/edit/:id" element={<BookForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
