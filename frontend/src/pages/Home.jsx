import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const HERO_CATEGORIES = [
  { icon: '🥦', name: 'Vegetables', slug: 'vegetables', color: 'from-green-400 to-green-600' },
  { icon: '🍎', name: 'Fruits', slug: 'fruits', color: 'from-red-400 to-red-500' },
  { icon: '🎂', name: 'Cakes', slug: 'cakes', color: 'from-pink-400 to-pink-600' },
  { icon: '🍪', name: 'Biscuits', slug: 'biscuits', color: 'from-yellow-400 to-orange-400' },
  { icon: '🥛', name: 'Dairy', slug: 'dairy', color: 'from-blue-300 to-blue-500' },
  { icon: '🧃', name: 'Beverages', slug: 'beverages', color: 'from-purple-400 to-purple-600' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products').then(r => setFeatured(r.data.slice(0, 8))).catch(() => {});
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-green-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 fade-in">
            <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block">🌿 Fresh & Organic</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Fresh Groceries<br />Delivered Fast
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Shop fruits, vegetables, cakes, biscuits and more — all at great prices with same-day delivery.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/products" className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition shadow-lg">
                Shop Now →
              </Link>
              <Link to="/products" className="bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition border border-white/30">
                View Categories
              </Link>
            </div>
          </div>
          {/* <div className="hidden md:flex text-9xl select-none">🛒</div> */}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {HERO_CATEGORIES.map(cat => {
            const found = categories.find(c => c.slug === cat.slug);
            return (
              <button
                key={cat.slug}
                onClick={() => navigate(`/products?category=${found?._id || ''}&name=${cat.name}`)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-600">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-primary-600 font-semibold text-sm hover:underline">View all →</Link>
        </div>
        {featured.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-primary-50 border-y border-primary-100">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery available' },
            { icon: '✅', title: 'Quality Assured', desc: 'Fresh & certified products' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'Safe & encrypted payments' },
          ].map(item => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}