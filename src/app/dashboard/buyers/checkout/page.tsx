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

interface DeliveryDetails {
  name: string;
  phone: string;
  county: string;
  subCounty: string;
  address: string;
  instructions: string;
}

const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
  'Kakamega', 'Meru', 'Nyeri', 'Machakos', 'Garissa', 'Kitale', 'Kericho',
  'Naivasha', 'Nanyuki', 'Murang\'a', 'Embu', 'Kisii', 'Bungoma', 'Kitui',
  'Homa Bay', 'Migori', 'Vihiga', 'Siaya', 'Busia', 'Bomet', 'Kajiado',
  'Kiambu', 'Kilifi', 'Kwale', 'Lamu', 'Tana River', 'Taita Taveta',
  'Marsabit', 'Isiolo', 'Wajir', 'Mandera', 'Samburu', 'Trans Nzoia',
  'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia',
  'Narok', 'West Pokot', 'Turkana'
].sort();

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    name: '',
    phone: '',
    county: '',
    subCounty: '',
    address: '',
    instructions: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchCart();
      // Pre-fill with user data
      setDeliveryDetails((prev) => ({
        ...prev,
        name: session.user.name || '',
        phone: session.user.phone || '',
      }));
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/buyers/cart');
      const data = await res.json();
      const items = data.cartItems || [];

      if (items.length === 0) {
        router.push('/dashboard/buyers/cart');
      }

      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.listing.pricePerUnit * item.quantity;
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!deliveryDetails.name.trim()) {
      alert('Please enter your name');
      return false;
    }
    if (!deliveryDetails.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    if (!deliveryDetails.county) {
      alert('Please select your county');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setProcessing(true);

      // Process each cart item as a separate order
      const orderPromises = cartItems.map(async (item) => {
        // First initiate M-Pesa payment
        const paymentRes = await fetch('/api/mpesa/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: item.listing.id,
            phoneNumber: deliveryDetails.phone,
            quantity: item.quantity,
          }),
        });

        if (!paymentRes.ok) {
          const errorData = await paymentRes.json();
          throw new Error(errorData.error || 'Payment initiation failed');
        }

        const paymentData = await paymentRes.json();

        // Create order
        const orderRes = await fetch('/api/buyers/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: item.listing.id,
            quantity: item.quantity,
            deliveryDetails,
            transactionId: paymentData.transactionId,
          }),
        });

        if (!orderRes.ok) {
          const errorData = await orderRes.json();
          throw new Error(errorData.error || 'Order creation failed');
        }

        return await orderRes.json();
      });

      await Promise.all(orderPromises);

      // Clear cart after successful orders
      await fetch('/api/buyers/cart?clearAll=true', {
        method: 'DELETE',
      });

      alert('Orders placed successfully! Check your phone for M-Pesa prompts.');
      router.push('/dashboard/buyers/orders');
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to complete checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading checkout...</div>
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
              <h1 className="text-2xl font-bold text-emerald-700">Checkout</h1>
              <p className="text-sm text-gray-600 mt-1">Complete your order</p>
            </div>
            <Link
              href="/dashboard/buyers/cart"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryDetails.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryDetails.phone}
                    onChange={handleInputChange}
                    placeholder="+254712345678 or 0712345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    County <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="county"
                    value={deliveryDetails.county}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select County</option>
                    {kenyanCounties.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-County
                  </label>
                  <input
                    type="text"
                    name="subCounty"
                    value={deliveryDetails.subCounty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleInputChange}
                    placeholder="Street, Building, Apartment, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="instructions"
                    value={deliveryDetails.instructions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={item.listing.image || '/images/farming/maize.jpg'}
                        alt={item.listing.cropName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.listing.cropName}</h3>
                      <p className="text-sm text-gray-600">by {item.listing.farmerName}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.listing.unit} × KSh {item.listing.pricePerUnit.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">
                        KSh {(item.listing.pricePerUnit * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span className="font-medium text-gray-900">
                    KSh {calculateTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-900">TBD</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-emerald-600 text-xl">
                    KSh {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Place Order & Pay'}
              </button>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure M-Pesa payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Verified farmers only</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span>Fast & reliable delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
