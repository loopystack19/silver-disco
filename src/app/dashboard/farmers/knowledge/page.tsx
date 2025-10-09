'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  source: string;
  pubDate: string;
  image: string;
}

const CATEGORIES = [
  'All',
  'Sustainable Farming',
  'Crop Diseases & Solutions',
  'Climate-Smart Agriculture',
  'Irrigation & Water Management',
  'Market Trends & Pricing Insights',
];

export default function KnowledgeHubPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchArticles();
    }
  }, [session]);

  useEffect(() => {
    filterArticles();
  }, [selectedCategory, searchQuery, articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/knowledge/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading knowledge hub...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/farmers"
                className="text-sm text-green-600 hover:text-green-700 mb-2 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Farmers Knowledge Hub</h1>
              <p className="text-gray-600 mt-1">Stay informed with the latest agricultural insights</p>
            </div>
            <Link
              href="/dashboard/farmers/knowledge/chat"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Ask Farming Assistant
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredArticles.length}</span> article
            {filteredArticles.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && (
              <span>
                {' '}
                in <span className="font-semibold text-green-600">{selectedCategory}</span>
              </span>
            )}
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/knowledge/sustainable-farming.jpg';
                  }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(article.pubDate)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{article.source}</span>
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const router = useRouter();

  const handleAskChatbot = () => {
    // Store article context in session storage for chatbot
    sessionStorage.setItem('chatbotContext', JSON.stringify({
      articleTitle: article.title,
      articleDescription: article.description,
    }));
    router.push('/dashboard/farmers/knowledge/chat');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                {article.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">{article.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{article.source}</span>
                <span>•</span>
                <span>{new Date(article.pubDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image */}
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/knowledge/sustainable-farming.jpg';
            }}
          />

          {/* Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed">{article.description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
            >
              Open Full Article
            </a>
            <button
              onClick={handleAskChatbot}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Ask Chatbot About This
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
