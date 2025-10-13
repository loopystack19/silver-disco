'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CropListing } from '@/types/user';

interface FavoriteWithListing {
  id: string;
  listingId: string;
  cropName: string;
  farmerName: string;
  addedAt: Date;
  listing: CropListing;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteWithListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/buyers/favorites');
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId: string) => {
    try {
      const res = await fetch(`/api/buyers/favorites?listingId=${listingId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchFavorites();
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading favorites...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">My Favorites</h1>
              <p className="text-sm text-gray-600 mt-1">Saved listings</p>
            </div>
            <Link
              href="/dashboard/buyers"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-sm text-gray-500 mb-6">Start adding items to your favorites</p>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
                <Link href={`/marketplace/${favorite.listing.id}`} className="block relative w-full h-48 bg-gray-200">
                  <Image
                    src={favorite.listing.image || '/images/farming/maize.jpg'}
                    alt={favorite.listing.cropName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
                <div className="p-4">
                  <Link href={`/marketplace/${favorite.listing.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-emerald-600">
                      {favorite.listing.cropName}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">by {favorite.listing.farmerName}</p>
                  <p className="text-2xl font-bold text-emerald-600 mb-3">
                    KSh {favorite.listing.pricePerUnit.toLocaleString()}
                    <span className="text-sm text-gray-600 font-normal"> / {favorite.listing.unit}</span>
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/marketplace/${favorite.listing.id}`}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition text-sm font-semibold"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => removeFavorite(favorite.listing.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                    >
                      Remove
                    </button>
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
