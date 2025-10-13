'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CropListing } from '@/types/user';

interface CartItemWithListing {
  id: string;
  buyerId: string;
  listingId: string;
  quantity: number;
  addedAt: Date;
  updatedAt: Date;
  listing: CropListing;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchCart();
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/buyers/cart');
      const data = await res.json();
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    if (newQuantity > item.listing.quantity) {
      alert(`Only ${item.listing.quantity} ${item.listing.unit} available`);
      return;
    }

    try {
      setUpdating(itemId);
      const res = await fetch('/api/buyers/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: item.listingId,
          quantity: newQuantity,
        }),
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      const res = await fetch(`/api/buyers/cart?itemId=${itemId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      const res = await fetch('/api/buyers/cart?clearAll=true', {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.listing.pricePerUnit * item.quantity;
    }, 0);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading cart...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">Shopping Cart</h1>
              <p className="text-sm text-gray-600 mt-1">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/marketplace"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Continue Shopping
              </Link>
              <Link
                href="/dashboard/buyers"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mb-6">Start adding items to your cart</p>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={item.listing.image || '/images/farming/maize.jpg'}
                        alt={item.listing.cropName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            href={`/marketplace/${item.listing.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-emerald-600"
                          >
                            {item.listing.cropName}
                          </Link>
                          <p className="text-sm text-gray-600">by {item.listing.farmerName}</p>
                          <p className="text-sm text-gray-600">📍 {item.listing.location}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          {updating === item.id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="text-gray-900 font-medium min-w-[3rem] text-center">
                            {item.quantity} {item.listing.unit}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || item.quantity >= item.listing.quantity}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            KSh {item.listing.pricePerUnit.toLocaleString()} / {item.listing.unit}
                          </p>
                          <p className="text-lg font-bold text-emerald-600">
                            KSh {(item.listing.pricePerUnit * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.listing.quantity < 10 && (
                        <p className="text-sm text-orange-600 mt-2">
                          Only {item.listing.quantity} {item.listing.unit} left!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      KSh {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-gray-900">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-emerald-600 text-xl">
                      KSh {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard/buyers/checkout"
                  className="block w-full px-6 py-3 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition font-semibold"
                >
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout powered by M-Pesa
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
