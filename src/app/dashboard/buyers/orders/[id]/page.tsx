'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types/user';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrder();
    }
  }, [session, params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/buyers/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        console.error('Order not found');
        router.push('/dashboard/buyers/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      const res = await fetch(`/api/buyers/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          cancellationReason,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setShowCancelModal(false);
        setCancellationReason('');
        alert('Order cancelled successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const res = await fetch('/api/buyers/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order?.id,
          rating,
          comment: ratingComment,
        }),
      });

      if (res.ok) {
        alert('Rating submitted successfully!');
        setShowRatingModal(false);
        setRating(0);
        setRatingComment('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getOrderTimeline = () => {
    if (!order) return [];

    const timeline = [
      {
        status: 'pending',
        label: 'Order Placed',
        date: order.placedAt,
        completed: true,
      },
      {
        status: 'confirmed',
        label: 'Order Confirmed',
        date: order.confirmedAt,
        completed: !!order.confirmedAt,
      },
      {
        status: 'shipped',
        label: 'Shipped',
        date: order.shippedAt,
        completed: !!order.shippedAt,
      },
      {
        status: 'completed',
        label: 'Delivered',
        date: order.completedAt,
        completed: !!order.completedAt,
      },
    ];

    if (order.status === 'cancelled') {
      return [
        timeline[0],
        {
          status: 'cancelled',
          label: 'Order Cancelled',
          date: order.cancelledAt,
          completed: true,
        },
      ];
    }

    return timeline;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading order details...</div>
      </div>
    );
  }

  if (!session || !order) {
    return null;
  }

  const timeline = getOrderTimeline();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">Order Details</h1>
              <p className="text-sm text-gray-600 mt-1">Order #{order.id.substring(0, 8)}...</p>
            </div>
            <Link
              href="/dashboard/buyers/orders"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
                {order.status === 'cancelled' && order.cancellationReason && (
                  <p className="text-sm text-gray-600">Reason: {order.cancellationReason}</p>
                )}
              </div>

              {/* Timeline */}
              <div className="relative">
                {timeline.map((item, index) => (
                  <div key={item.status} className="flex items-start mb-8 last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.completed ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        {item.completed && (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className={`w-0.5 h-16 ${item.completed ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.label}
                      </h3>
                      {item.date && (
                        <p className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                {order.status === 'pending' || order.status === 'confirmed' ? (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel Order
                  </button>
                ) : null}
                {order.status === 'completed' && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Rate This Order
                  </button>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Crop</span>
                  <span className="font-medium text-gray-900">{order.cropName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium text-gray-900">
                    {order.quantity} {order.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per unit</span>
                  <span className="font-medium text-gray-900">KSh {order.pricePerUnit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-semibold">Total Amount</span>
                  <span className="font-bold text-emerald-600 text-xl">
                    KSh {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Farmer Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Farmer Details</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Name:</span> {order.farmerName}
                </p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Name:</span> {order.deliveryDetails.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {order.deliveryDetails.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">County:</span> {order.deliveryDetails.county}
                </p>
                {order.deliveryDetails.subCounty && (
                  <p className="text-gray-600">
                    <span className="font-medium">Sub-County:</span> {order.deliveryDetails.subCounty}
                  </p>
                )}
                {order.deliveryDetails.address && (
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> {order.deliveryDetails.address}
                  </p>
                )}
                {order.deliveryDetails.instructions && (
                  <p className="text-gray-600">
                    <span className="font-medium">Instructions:</span> {order.deliveryDetails.instructions}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Details */}
            {order.mpesaReceiptNumber && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">M-Pesa Receipt:</span>
                  </p>
                  <p className="text-emerald-600 font-mono text-sm">{order.mpesaReceiptNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for cancelling this order:
            </p>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
              rows={4}
              placeholder="e.g., Changed my mind, Found a better deal, etc."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                disabled={cancelling}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Order</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">How would you rate this order?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 mb-4"
              rows={4}
              placeholder="Share your experience (optional)"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setRatingComment('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
