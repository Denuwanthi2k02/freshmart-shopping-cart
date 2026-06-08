import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to view your cart</p>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items to get started!</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    toast.success('Order placed! (Payment gateway coming soon) 🎉');
    clearCart();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 font-medium transition">
          Clear all
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-3">
          {cart.items.map(item => (
            <div key={item.product?._id || item._id} className="card p-4 flex gap-4 fade-in">
              {/* Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img
                  src={item.product?.image || `https://via.placeholder.com/80?text=${item.product?.name}`}
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = `https://via.placeholder.com/80`; }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">{item.product?.name}</h3>
                <p className="text-primary-600 font-bold">${item.price.toFixed(2)} <span className="text-gray-400 font-normal text-xs">/{item.product?.unit}</span></p>

                {/* Qty Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                  >−</button>
                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                  >+</button>
                </div>
              </div>

              {/* Subtotal + Delete */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-gray-300 hover:text-red-400 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4">
              {cart.items.map(item => (
                <div key={item.product?._id} className="flex justify-between text-gray-500">
                  <span className="truncate flex-1 mr-2">{item.product?.name} ×{item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-5">
              <div className="flex justify-between text-gray-500 text-sm mb-1">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm mb-1">
                <span>Delivery</span>
                <span className="text-primary-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3">
                <span>Total</span>
                <span className="text-primary-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="w-full btn-primary py-3 text-center block">
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-primary-600 hover:underline mt-3">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}