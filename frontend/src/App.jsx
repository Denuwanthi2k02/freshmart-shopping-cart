import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <footer className="bg-white border-t py-6 text-center text-sm text-gray-400">
            <p>© 2024 FreshMart — Fresh groceries delivered fast 🛒</p>
          </footer>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif' },
            success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}