'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import MpesaPaymentModal from '@/components/marketplace/MpesaPaymentModal';
import { CropListing, User } from '@/types/user';

export default function MarketplacePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [listings, setListings] = useState<CropListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<Map<string, User>>(new Map());

  // M-Pesa payment modal state
  const [selectedListing, setSelectedListing] = useState<CropListing | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Cart and Favorites states
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addingToFavorites, setAddingToFavorites] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [statusFilter, setStatusFilter] = useState('available');

  const kenyanCounties = [
    'All Locations',
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Kakamega', 'Meru', 'Nyeri', 'Machakos', 'Garissa', 'Kitale', 'Kericho',
    'Naivasha', 'Nanyuki', 'Murang\'a', 'Embu', 'Kisii', 'Bungoma', 'Kitui',
    'Homa Bay', 'Migori', 'Vihiga', 'Siaya', 'Busia', 'Bomet', 'Kajiado',
    'Kiambu', 'Kilifi', 'Kwale', 'Lamu', 'Tana River', 'Taita Taveta',
    'Marsabit', 'Isiolo', 'Wajir', 'Mandera', 'Samburu', 'Trans Nzoia',
    'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia',
    'Narok', 'West Pokot', 'Turkana'
  ].sort();

  useEffect(() => {
    fetchListings();
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  useEffect(() => {
    applyFilters();
  }, [listings, searchQuery, selectedLocation, sortBy, minPrice, maxPrice, statusFilter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crops');
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings);
        
        // Fetch farmer verification status
        const farmerIds = [...new Set(data.listings.map((l: CropListing) => l.farmerId))] as string[];
        const farmerMap = new Map<string, User>();
        
        for (const farmerId of farmerIds) {
          try {
            const userRes = await fetch(`/api/user/${farmerId}`);
            if (userRes.ok) {
              const userData = await userRes.json();
              farmerMap.set(farmerId, userData.user);
            }
          } catch (error) {
            console.error('Error fetching farmer:', error);
          }
        }
        
        setFarmers(farmerMap);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((listing) => listing.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.cropName.toLowerCase().includes(query) ||
          listing.farmerName.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (selectedLocation && selectedLocation !== 'All Locations') {
      filtered = filtered.filter(
        (listing) => listing.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter((listing) => listing.pricePerUnit >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((listing) => listing.pricePerUnit <= parseFloat(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
        );
        break;
      case 'oldest':
        filtered.sort(
          (a, b) => new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
        );
        break;
      case 'price-low':
        filtered.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
        break;
      case 'location':
        filtered.sort((a, b) => a.location.localeCompare(b.location));
        break;
    }

    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setStatusFilter('available');
  };

  const handleContactSeller = (listing: CropListing) => {
    alert(`Contact ${listing.farmerName} for ${listing.cropName}\n\nThis is a demo feature. In production, this would open a contact form or messaging system.`);
  };

  const handleBuyWithMpesa = (listing: CropListing) => {
    // Check if user is logged in
    if (!session) {
      alert('Please log in to make a purchase');
      router.push('/login');
      return;
    }

    // Open M-Pesa payment modal
    setSelectedListing(listing);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedListing(null);
    fetchListings(); // Refresh listings after purchase
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/buyers/favorites');
      if (res.ok) {
        const data = await res.json();
        const favoriteIds = new Set(data.favorites.map((fav: any) => fav.listingId));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleAddToCart = async (listing: CropListing) => {
    if (!session) {
      alert('Please log in to add items to cart');
      router.push('/login');
      return;
    }

    try {
      setAddingToCart(listing.id);
      const res = await fetch('/api/buyers/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          quantity: 1, // Default quantity
        }),
      });

      if (res.ok) {
        alert('Added to cart successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleFavorite = async (listing: CropListing) => {
    if (!session) {
      alert('Please log in to save favorites');
      router.push('/login');
      return;
    }

    try {
      setAddingToFavorites(listing.id);
      const isFavorited = favorites.has(listing.id);

      if (isFavorited) {
        const res = await fetch(`/api/buyers/favorites?listingId=${listing.id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.delete(listing.id);
          setFavorites(newFavorites);
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to remove from favorites');
        }
      } else {
        const res = await fetch('/api/buyers/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: listing.id }),
        });

        if (res.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.add(listing.id);
          setFavorites(newFavorites);
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('An error occurred');
    } finally {
      setAddingToFavorites(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-emerald-700">UmojaHub Marketplace</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Buy fresh crops directly from verified farmers</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => router.push('/')}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/login')}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
              >
                Farmer Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Crops
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, farmer, or location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {kenyanCounties.map((county) => (
                  <option key={county} value={county === 'All Locations' ? '' : county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="location">Location (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (KSh)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (KSh)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredListings.length} of {listings.length} listings
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const farmer = farmers.get(listing.farmerId);
              const isVerified = farmer?.isVerified || false;

              return (
                <div key={listing.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition">
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image
                      src={listing.image || '/images/farming/maize.jpg'}
                      alt={listing.cropName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{listing.cropName}</h3>
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

                    <div className="mb-3">
                      <p className="text-2xl font-bold text-emerald-700">
                        KSh {listing.pricePerUnit.toLocaleString()}
                        <span className="text-sm text-gray-600 font-normal"> per {listing.unit}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {listing.quantity} {listing.unit}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {listing.description}
                    </p>

                    <div className="border-t border-gray-200 pt-3 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{listing.farmerName}</span>
                          <VerifiedBadge isVerified={isVerified} size="sm" showLabel={false} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">📍 {listing.location}</p>
                      <p className="text-xs text-gray-500">
                        Posted {new Date(listing.datePosted).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {listing.status === 'available' && isVerified && (
                          <>
                            <button
                              onClick={() => handleAddToCart(listing)}
                              disabled={addingToCart === listing.id}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-semibold disabled:opacity-50"
                            >
                              {addingToCart === listing.id ? 'Adding...' : '🛒 Add to Cart'}
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(listing)}
                              disabled={addingToFavorites === listing.id}
                              className={`px-3 py-2 rounded-lg transition text-xs font-semibold disabled:opacity-50 ${
                                favorites.has(listing.id)
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {addingToFavorites === listing.id ? '...' : favorites.has(listing.id) ? '❤️' : '🤍'}
                            </button>
                          </>
                        )}
                        {listing.status === 'available' && !isVerified && (
                          <button
                            disabled
                            className="flex-1 px-3 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-xs font-semibold"
                            title="Farmer not verified"
                          >
                            Unavailable
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleContactSeller(listing)}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-xs font-semibold"
                        >
                          Contact Seller
                        </button>
                        {listing.status === 'available' && isVerified && (
                          <button
                            onClick={() => handleBuyWithMpesa(listing)}
                            className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Buy Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 UmojaHub. Connecting farmers and buyers across Kenya.
          </p>
        </div>
      </footer>

      {/* M-Pesa Payment Modal */}
      {selectedListing && (
        <MpesaPaymentModal
          listing={selectedListing}
          farmerName={selectedListing.farmerName}
          farmerLocation={selectedListing.location}
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
        />
      )}
    </div>
  );
}
