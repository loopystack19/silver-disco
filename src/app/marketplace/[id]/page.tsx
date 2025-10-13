'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CropListing, User } from '@/types/user';
import VerifiedBadge from '@/components/common/VerifiedBadge';

interface Rating {
  id: string;
  buyerName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [listing, setListing] = useState<CropListing | null>(null);
  const [farmer, setFarmer] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchListingDetails();
    fetchRatings();
    if (session) {
      checkFavorite();
    }
  }, [params.id, session]);

  const fetchListingDetails = async () => {
    try {
      const res = await fetch(`/api/crops/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setListing(data.listing);

        // Fetch farmer details
        const farmerRes = await fetch(`/api/user/${data.listing.farmerId}`);
        if (farmerRes.ok) {
          const farmerData = await farmerRes.json();
          setFarmer(farmerData.user);
        }
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await fetch(`/api/buyers/ratings?listingId=${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setRatings(data.ratings || []);
        if (data.averageRating) {
          setAverageRating(data.averageRating);
        }
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const checkFavorite = async () => {
    try {
      const res = await fetch('/api/buyers/favorites');
      if (res.ok) {
        const data = await res.json();
        const exists = data.favorites.some((f: any) => f.listingId === params.id);
        setIsFavorite(exists);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/buyers/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: params.id,
          quantity,
        }),
      });

      if (res.ok) {
        alert('Added to cart!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleToggleFavorite = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        const res = await fetch(`/api/buyers/favorites?listingId=${params.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsFavorite(false);
        }
      } else {
        const res = await fetch('/api/buyers/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: params.id }),
        });
        if (res.ok) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <Link href="/marketplace" className="text-emerald-600 hover:text-emerald-700">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/marketplace" className="text-emerald-600 hover:text-emerald-700 font-medium">
            ← Back to Marketplace
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={listing.image || '/images/farming/maize.jpg'}
              alt={listing.cropName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.cropName}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600">by {listing.farmerName}</span>
                  {farmer && <VerifiedBadge isVerified={farmer.isVerified} size="sm" />}
                </div>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorite ? 'text-red-500' : 'text-gray-400'
                } hover:bg-gray-100`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-emerald-600 mb-2">
                KSh {listing.pricePerUnit.toLocaleString()}
                <span className="text-lg text-gray-600 font-normal"> / {listing.unit}</span>
              </p>
              <p className="text-gray-600">
                Available: {listing.quantity} {listing.unit}
              </p>
              <p className="text-gray-600">📍 {listing.location}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{listing.description}</p>
            </div>

            {listing.status === 'available' && farmer?.isVerified && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold min-w-[4rem] text-center">
                      {quantity} {listing.unit}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(listing.quantity, quantity + 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href="/dashboard/buyers/checkout"
                    className="flex-1 px-6 py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition font-semibold"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            )}

            {!farmer?.isVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  This farmer is not yet verified. Only verified farmers can sell directly through the platform.
                </p>
              </div>
            )}

            {listing.status !== 'available' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">This listing is no longer available</p>
              </div>
            )}
          </div>
        </div>

        {/* Ratings Section */}
        {ratings.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Customer Reviews ({ratings.length})
            </h2>
            {averageRating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                <div className="flex text-yellow-400 text-xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.round(averageRating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-gray-600">({ratings.length} reviews)</span>
              </div>
            )}

            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{rating.buyerName}</p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rating.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && <p className="text-gray-700">{rating.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
