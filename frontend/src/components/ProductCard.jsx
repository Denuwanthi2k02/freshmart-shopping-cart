import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product._id);
    setAdding(false);
  };

  return (
    <div className="card group hover:shadow-md transition-shadow duration-200 fade-in">
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-gray-50">
        <img
          src={product.image || `https://via.placeholder.com/300x200?text=${product.name}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`; }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white text-primary-600 text-xs font-semibold px-2 py-1 rounded-full shadow">
            {product.category?.icon} {product.category?.name}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-3 line-clamp-1">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400 ml-1">/{product.unit}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-60"
          >
            {adding ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}