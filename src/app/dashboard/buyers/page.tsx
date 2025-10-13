'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  ordersPlaced: number;
  ordersCompleted: number;
  pendingDeliveries: number;
  favoritesCount: number;
  cartItemsCount: number;
}

interface RecentOrder {
  id: string;
  cropName: string;
  farmerName: string;
  totalAmount: number;
  status: string;
  placedAt: string;
}

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    ordersPlaced: 0,
    ordersCompleted: 0,
    pendingDeliveries: 0,
    favoritesCount: 0,
    cartItemsCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const ordersRes = await fetch('/api/buyers/orders');
      const ordersData = await ordersRes.json();
      const orders = ordersData.orders || [];

      // Fetch favorites
      const favoritesRes = await fetch('/api/buyers/favorites');
      const favoritesData = await favoritesRes.json();
      const favorites = favoritesData.favorites || [];

      // Fetch cart
      const cartRes = await fetch('/api/buyers/cart');
      const cartData = await cartRes.json();
      const cart = cartData.cartItems || [];

      // Calculate stats
      const completedOrders = orders.filter((o: any) => o.status === 'completed');
      const pendingOrders = orders.filter((o: any) =>
        ['pending', 'confirmed', 'shipped'].includes(o.status)
      );

      setStats({
        ordersPlaced: orders.length,
        ordersCompleted: completedOrders.length,
        pendingDeliveries: pendingOrders.length,
        favoritesCount: favorites.length,
        cartItemsCount: cart.length,
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">Buyer Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {session.user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/marketplace"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Browse Marketplace
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Orders Placed</div>
              <div className="text-2xl">📦</div>
            </div>
            <div className="text-3xl font-bold text-emerald-600">{stats.ordersPlaced}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl">✅</div>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.ordersCompleted}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl">🚚</div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.pendingDeliveries}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Favorites</div>
              <div className="text-2xl">❤️</div>
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.favoritesCount}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Cart Items</div>
              <div className="text-2xl">🛒</div>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.cartItemsCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <Link
                  href="/dashboard/buyers/orders"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <Link
                    href="/marketplace"
                    className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/dashboard/buyers/orders/${order.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.cropName}</h4>
                          <p className="text-sm text-gray-600">from {order.farmerName}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {new Date(order.placedAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-emerald-600">
                          KSh {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/marketplace"
                  className="block p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🌾</div>
                    <div>
                      <div className="font-semibold text-gray-900">Browse Marketplace</div>
                      <div className="text-sm text-gray-600">View available crops</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/buyers/cart"
                  className="block p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🛒</div>
                    <div>
                      <div className="font-semibold text-gray-900">My Cart</div>
                      <div className="text-sm text-gray-600">
                        {stats.cartItemsCount} item{stats.cartItemsCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/buyers/favorites"
                  className="block p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">❤️</div>
                    <div>
                      <div className="font-semibold text-gray-900">My Favorites</div>
                      <div className="text-sm text-gray-600">Saved listings</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/buyers/orders"
                  className="block p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📦</div>
                    <div>
                      <div className="font-semibold text-gray-900">Track Orders</div>
                      <div className="text-sm text-gray-600">View order status</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/buyers/profile"
                  className="block p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">👤</div>
                    <div>
                      <div className="font-semibold text-gray-900">Edit Profile</div>
                      <div className="text-sm text-gray-600">Update information</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
