// Utility for fetching agricultural articles from various sources
export interface Article {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedDate: string;
  link: string;
  category: 'Crops' | 'Livestock' | 'Market' | 'Technology' | 'Climate';
  image: string;
}

// Local images to randomly assign to articles
const localImages = [
  '/images/articles/maize.jpg',
  '/images/articles/livestock.jpg',
  '/images/articles/greenhouse.jpg',
  '/images/articles/soil.jpg',
  '/images/articles/market.jpg',
  '/images/articles/tractors.jpg',
  '/images/articles/irrigation.jpg',
  '/images/articles/coffee.jpg',
  '/images/articles/beans.jpg',
  '/images/articles/poultry.jpg',
];

// Fallback static articles in case API fails
const fallbackArticles: Article[] = [
  {
    id: '1',
    title: 'Boosting Maize Yields in Dry Areas',
    description: 'Practical drought-resistant farming tips to maximize maize production even in water-scarce regions.',
    source: 'FarmBiz Africa',
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://farmbizafrica.com',
    category: 'Crops',
    image: '/images/articles/maize.jpg',
  },
  {
    id: '2',
    title: 'Modern Greenhouse Techniques for Small-Scale Farmers',
    description: 'Affordable greenhouse solutions that can triple your vegetable production throughout the year.',
    source: 'AgroNews',
    publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://agronews.com',
    category: 'Technology',
    image: '/images/articles/greenhouse.jpg',
  },
  {
    id: '3',
    title: 'Understanding Market Trends: Coffee Export Prices Rise',
    description: 'Global coffee demand pushes prices up by 15%. What this means for Kenyan coffee farmers.',
    source: 'FAO News',
    publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://fao.org/news',
    category: 'Market',
    image: '/images/articles/coffee.jpg',
  },
  {
    id: '4',
    title: 'Climate-Smart Agriculture: Adapting to Changing Weather',
    description: 'Strategies for building resilience against unpredictable rainfall and temperature shifts.',
    source: 'KALRO',
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://kalro.org',
    category: 'Climate',
    image: '/images/articles/soil.jpg',
  },
  {
    id: '5',
    title: 'Poultry Farming: Disease Prevention and Management',
    description: 'Essential vaccination schedules and biosecurity measures for healthy chicken flocks.',
    source: 'Modern Farmer',
    publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://modernfarmer.com',
    category: 'Livestock',
    image: '/images/articles/poultry.jpg',
  },
  {
    id: '6',
    title: 'Smart Irrigation Systems Save Water and Money',
    description: 'How drip irrigation technology can reduce water usage by up to 60% while improving crop yields.',
    source: 'AgriBusiness Global',
    publishedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://agribusinessglobal.com',
    category: 'Technology',
    image: '/images/articles/irrigation.jpg',
  },
  {
    id: '7',
    title: 'Dairy Farming: Maximizing Milk Production',
    description: 'Nutrition, breeding, and milking best practices for profitable dairy operations.',
    source: 'FarmBiz Africa',
    publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://farmbizafrica.com',
    category: 'Livestock',
    image: '/images/articles/livestock.jpg',
  },
  {
    id: '8',
    title: 'Bean Varieties Resistant to Pests and Drought',
    description: 'New seed varieties promise better harvests with less water and fewer pesticides.',
    source: 'KALRO',
    publishedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://kalro.org',
    category: 'Crops',
    image: '/images/articles/beans.jpg',
  },
  {
    id: '9',
    title: 'Digital Marketing for Farmers: Selling Direct to Consumers',
    description: 'Use social media and mobile apps to connect directly with buyers and increase profit margins.',
    source: 'AgroNews',
    publishedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://agronews.com',
    category: 'Market',
    image: '/images/articles/market.jpg',
  },
  {
    id: '10',
    title: 'Soil Health: The Foundation of Successful Farming',
    description: 'Testing, composting, and regenerative practices to improve soil fertility naturally.',
    source: 'FAO News',
    publishedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://fao.org/news',
    category: 'Crops',
    image: '/images/articles/soil.jpg',
  },
];

// Helper function to randomly assign local image
function assignRandomImage(): string {
  return localImages[Math.floor(Math.random() * localImages.length)];
}

// Helper function to categorize article based on keywords
function categorizeArticle(title: string, description: string): Article['category'] {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('livestock') || text.includes('dairy') || text.includes('poultry') || text.includes('cattle') || text.includes('chicken')) {
    return 'Livestock';
  }
  if (text.includes('market') || text.includes('price') || text.includes('trade') || text.includes('export') || text.includes('selling')) {
    return 'Market';
  }
  if (text.includes('technology') || text.includes('irrigation') || text.includes('greenhouse') || text.includes('digital') || text.includes('app')) {
    return 'Technology';
  }
  if (text.includes('climate') || text.includes('weather') || text.includes('drought') || text.includes('rain') || text.includes('temperature')) {
    return 'Climate';
  }
  return 'Crops'; // Default category
}

// Cache management
const CACHE_KEY = 'farmers_knowledge_hub_articles';
const CACHE_TIMESTAMP_KEY = 'farmers_knowledge_hub_timestamp';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Save articles to localStorage
export function cacheArticles(articles: Article[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(articles));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache articles:', error);
  }
}

// Load articles from localStorage
export function getCachedArticles(): Article[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CACHE_DURATION) {
      // Cache expired
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Failed to retrieve cached articles:', error);
    return null;
  }
}

// Main function to fetch articles
export async function fetchArticles(): Promise<Article[]> {
  // First, try to load from cache
  const cached = getCachedArticles();
  if (cached && cached.length > 0) {
    console.log('Loading articles from cache');
    return cached;
  }

  console.log('Fetching fresh articles...');
  
  try {
    // Try to fetch from RSS feeds using RSS2JSON (free service)
    const articles: Article[] = [];
    
    // RSS feeds to fetch from (using rss2json free service)
    const feeds = [
      'https://www.farmingfirst.org/feed/',
      'https://www.modernfarmer.com/feed/',
    ];
    
    for (const feedUrl of feeds) {
      try {
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.items && Array.isArray(data.items)) {
            data.items.slice(0, 15).forEach((item: any, index: number) => {
              articles.push({
                id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                title: item.title || 'Untitled Article',
                description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) || 'No description available',
                source: data.feed?.title || 'Agricultural News',
                publishedDate: item.pubDate || new Date().toISOString(),
                link: item.link || '#',
                category: categorizeArticle(item.title || '', item.description || ''),
                image: assignRandomImage(),
              });
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${feedUrl}:`, error);
      }
    }

    // If we got articles, cache and return them
    if (articles.length > 0) {
      cacheArticles(articles);
      return articles;
    }
    
    // If fetching failed, use fallback articles
    console.log('Using fallback articles');
    cacheArticles(fallbackArticles);
    return fallbackArticles;
    
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return fallback articles on error
    cacheArticles(fallbackArticles);
    return fallbackArticles;
  }
}

// Search and filter articles
export function filterArticles(
  articles: Article[],
  searchQuery: string,
  category: string | null
): Article[] {
  let filtered = [...articles];
  
  // Apply category filter
  if (category && category !== 'All') {
    filtered = filtered.filter(article => article.category === category);
  }
  
  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query)
    );
  }
  
  return filtered;
}
