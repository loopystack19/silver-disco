'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import { CropListing, User } from '@/types/user';

export default function FarmerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingListing, setEditingListing] = useState<CropListing | null>(null);
  const [farmer, setFarmer] = useState<User | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchFarmerData();
      fetchListings();
    }
  }, [session]);

  const fetchFarmerData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setFarmer(data.user);
      }
    } catch (error) {
      console.error('Error fetching farmer data:', error);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crops?farmerId=${session?.user?.email}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const res = await fetch(`/api/crops/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setListings(listings.filter((l) => l.id !== id));
        alert('Listing deleted successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'available' | 'sold') => {
    try {
      const res = await fetch(`/api/crops/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setListings(listings.map((l) => (l.id === id ? data.listing : l)));
        alert('Status updated successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
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

  const stats = {
    total: listings.length,
    verified: listings.filter((l) => l.status === 'available').length,
    sold: listings.filter((l) => l.status === 'sold').length,
    pending: listings.filter((l) => l.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-600">UmojaHub - Farmer Dashboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{session.user.name}</span>
                {farmer && <VerifiedBadge isVerified={farmer.isVerified} size="sm" />}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/dashboard/farmers/knowledge')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Knowledge Hub
                </button>
                <button
                  onClick={() => router.push('/marketplace')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Marketplace
                </button>
              </div>
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
        {/* Verification Alert */}
        {farmer && !farmer.isVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800">Email Verification Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please verify your email to create crop listings. Check your inbox for the verification link.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Listings</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Available</div>
            <div className="text-3xl font-bold text-green-600">{stats.verified}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Sold</div>
            <div className="text-3xl font-bold text-red-600">{stats.sold}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
        </div>

        {/* Create Listing Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              if (farmer?.isVerified) {
                setShowCreateModal(true);
              } else {
                alert('Please verify your email before creating listings');
              }
            }}
            disabled={!farmer?.isVerified}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              farmer?.isVerified
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            + Create New Listing
          </button>
        </div>

        {/* Listings Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
          </div>
          <div className="p-6">
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new crop listing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <img
                      src={listing.image}
                      alt={listing.cropName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/farmers/default-crop.jpg';
                      }}
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{listing.cropName}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            listing.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : listing.status === 'sold'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {listing.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <p className="font-semibold text-green-600">KSh {listing.pricePerUnit.toLocaleString()} per {listing.unit}</p>
                        <p>Quantity: {listing.quantity} {listing.unit}</p>
                        <p>Location: {listing.location}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingListing(listing)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        {listing.status === 'available' && (
                          <button
                            onClick={() => handleStatusChange(listing.id, 'sold')}
                            className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition"
                          >
                            Mark Sold
                          </button>
                        )}
                        {listing.status === 'sold' && (
                          <button
                            onClick={() => handleStatusChange(listing.id, 'available')}
                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingListing) && (
        <ListingModal
          listing={editingListing}
          onClose={() => {
            setShowCreateModal(false);
            setEditingListing(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setEditingListing(null);
            fetchListings();
          }}
        />
      )}
    </div>
  );
}

function ListingModal({
  listing,
  onClose,
  onSuccess,
}: {
  listing: CropListing | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    cropName: listing?.cropName || '',
    quantity: listing?.quantity || '',
    unit: listing?.unit || 'bags',
    pricePerUnit: listing?.pricePerUnit || '',
    description: listing?.description || '',
    location: listing?.location || '',
    image: listing?.image || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Kakamega', 'Meru', 'Nyeri', 'Machakos', 'Garissa', 'Kitale', 'Kericho',
    'Naivasha', 'Nanyuki', 'Murang\'a', 'Embu', 'Kisii', 'Bungoma', 'Kitui',
    'Homa Bay', 'Migori', 'Vihiga', 'Siaya', 'Busia', 'Bomet', 'Kajiado',
    'Kiambu', 'Kilifi', 'Kwale', 'Lamu', 'Tana River', 'Taita Taveta',
    'Marsabit', 'Isiolo', 'Wajir', 'Mandera', 'Samburu', 'Trans Nzoia',
    'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia',
    'Nakuru', 'Narok', 'West Pokot', 'Turkana'
  ].sort();

  const units = ['bags', 'kg', 'tonnes', 'crates', 'pieces', 'liters'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = listing ? `/api/crops/${listing.id}` : '/api/crops';
      const method = listing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(listing ? 'Listing updated successfully' : 'Listing created successfully');
        onSuccess();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save listing');
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Failed to save listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {listing ? 'Edit Listing' : 'Create New Listing'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Name *
              </label>
              <input
                type="text"
                required
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Maize, Tomatoes, Beans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Unit (KSh) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 3500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (County) *
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Describe your crop, quality, delivery options, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {submitting ? 'Saving...' : listing ? 'Update Listing' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
