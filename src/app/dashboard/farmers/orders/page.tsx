'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types/user';

interface OrderStats {
  pending: number;
  confirmed: number;
  shipped: number;
  completed: number;
  cancelled: number;
  total: number;
}

export default function FarmerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    pending: 0,
    confirmed: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  useEffect(() => {
    applyFilter();
  }, [filterStatus, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/farmers/orders');
      const data = await res.json();
      setOrders(data.orders || []);
      setStats(data.stats || {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filterStatus));
    }
  };

  const handleOrderAction = async (orderId: string, action: 'confirm' | 'ship' | 'complete') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const confirmMessages = {
      confirm: 'Are you sure you want to confirm this order?',
      ship: 'Mark this order as shipped?',
      complete: 'Mark this order as completed/delivered?',
    };

    if (!confirm(confirmMessages[action])) {
      return;
    }

    try {
      setProcessingOrders((prev) => new Set(prev).add(orderId));

      const res = await fetch(`/api/farmers/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    } finally {
      setProcessingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
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

  const getActionButton = (order: Order) => {
    const isProcessing = processingOrders.has(order.id);

    if (order.status === 'pending') {
      return (
        <button
          onClick={() => handleOrderAction(order.id, 'confirm')}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Confirm Order'}
        </button>
      );
    } else if (order.status === 'confirmed') {
      return (
        <button
          onClick={() => handleOrderAction(order.id, 'ship')}
          disabled={isProcessing}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-semibold disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Mark as Shipped'}
        </button>
      );
    } else if (order.status === 'shipped') {
      return (
        <button
          onClick={() => handleOrderAction(order.id, 'complete')}
          disabled={isProcessing}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Mark as Delivered'}
        </button>
      );
    }
    return null;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
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
              <h1 className="text-2xl font-bold text-emerald-700">My Orders</h1>
              <p className="text-sm text-gray-600 mt-1">Manage orders from buyers</p>
            </div>
            <Link
              href="/dashboard/farmers"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <div className="text-sm text-yellow-700 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <div className="text-sm text-blue-700 mb-1">Confirmed</div>
            <div className="text-2xl font-bold text-blue-700">{stats.confirmed}</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4">
            <div className="text-sm text-purple-700 mb-1">Shipped</div>
            <div className="text-2xl font-bold text-purple-700">{stats.shipped}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <div className="text-sm text-green-700 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <div className="text-sm text-red-700 mb-1">Cancelled</div>
            <div className="text-2xl font-bold text-red-700">{stats.cancelled}</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'shipped', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterStatus === status
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h3>
            <p className="text-sm text-gray-500">
              {filterStatus === 'all'
                ? 'Orders from buyers will appear here'
                : 'Try changing the filter to see other orders'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{order.cropName}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Order ID:</span>{' '}
                        <span className="font-medium">{order.id.substring(0, 8)}...</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Buyer:</span>{' '}
                        <span className="font-medium">{order.buyerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>{' '}
                        <span className="font-medium">{order.quantity} {order.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>{' '}
                        <span className="font-medium text-emerald-600">
                          KSh {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Placed:</span>{' '}
                        <span className="font-medium">
                          {new Date(order.placedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Delivery:</span>{' '}
                        <span className="font-medium">{order.deliveryDetails.county}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Contact:</span> {order.deliveryDetails.phone}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {getActionButton(order)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
