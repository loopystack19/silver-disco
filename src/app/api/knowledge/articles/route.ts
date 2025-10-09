import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { promises as fs } from 'fs';
import path from 'path';

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

interface CachedData {
  articles: Article[];
  timestamp: number;
}

const RSS_FEEDS = [
  {
    url: 'https://www.fao.org/rss-feed/en/',
    source: 'FAO',
    category: 'General',
  },
  {
    url: 'https://agrilinks.org/rss.xml',
    source: 'Agrilinks',
    category: 'General',
  },
];

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'articles-cache.json');
const FALLBACK_FILE_PATH = path.join(process.cwd(), 'data', 'articles.json');

// Knowledge hub images for random assignment
const KNOWLEDGE_IMAGES = [
  '/images/knowledge/irrigation-tips.jpg',
  '/images/knowledge/maize-care.jpg',
  '/images/knowledge/greenhouse.jpg',
  '/images/knowledge/composting.jpg',
  '/images/knowledge/pest-control.jpg',
  '/images/knowledge/crop-rotation.jpg',
  '/images/knowledge/soil-health.jpg',
  '/images/knowledge/water-conservation.jpg',
  '/images/knowledge/organic-farming.jpg',
  '/images/knowledge/climate-smart.jpg',
  '/images/knowledge/market-trends.jpg',
  '/images/knowledge/livestock-care.jpg',
  '/images/knowledge/sustainable-farming.jpg',
  '/images/knowledge/crop-diseases.jpg',
  '/images/knowledge/fertilizer-use.jpg',
];

// Function to get random image
function getRandomImage(): string {
  return KNOWLEDGE_IMAGES[Math.floor(Math.random() * KNOWLEDGE_IMAGES.length)];
}

// Function to categorize articles based on title/description
function categorizeArticle(title: string, description: string): string {
  const content = (title + ' ' + description).toLowerCase();
  
  if (content.includes('irrigation') || content.includes('water')) {
    return 'Irrigation & Water Management';
  } else if (content.includes('disease') || content.includes('pest')) {
    return 'Crop Diseases & Solutions';
  } else if (content.includes('climate') || content.includes('weather')) {
    return 'Climate-Smart Agriculture';
  } else if (content.includes('market') || content.includes('price')) {
    return 'Market Trends & Pricing Insights';
  } else if (content.includes('sustain') || content.includes('organic')) {
    return 'Sustainable Farming';
  }
  
  return 'General Agriculture';
}

// Load cache
async function loadCache(): Promise<CachedData | null> {
  try {
    const cacheData = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    const parsed: CachedData = JSON.parse(cacheData);
    
    // Check if cache is still valid
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      return parsed;
    }
  } catch (error) {
    // Cache doesn't exist or is invalid
  }
  return null;
}

// Save cache
async function saveCache(articles: Article[]): Promise<void> {
  try {
    const cacheData: CachedData = {
      articles,
      timestamp: Date.now(),
    };
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

// Load fallback articles
async function loadFallbackArticles(): Promise<Article[]> {
  try {
    const fallbackData = await fs.readFile(FALLBACK_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(fallbackData);
    return parsed.articles || [];
  } catch (error) {
    console.error('Error loading fallback articles:', error);
    return [];
  }
}

// Fetch articles from RSS feeds
async function fetchArticlesFromRSS(): Promise<Article[]> {
  const parser = new Parser({
    timeout: 10000,
    headers: {
      'User-Agent': 'UmojaHub/1.0',
    },
  });

  const allArticles: Article[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      
      const articles = feedData.items.slice(0, 10).map((item, index) => ({
        id: `${feed.source}-${index}`,
        title: item.title || 'Untitled',
        description: item.contentSnippet || item.content || 'No description available',
        link: item.link || '#',
        category: categorizeArticle(item.title || '', item.contentSnippet || ''),
        source: feed.source,
        pubDate: item.pubDate || new Date().toISOString(),
        image: getRandomImage(),
      }));

      allArticles.push(...articles);
    } catch (error) {
      console.error(`Error fetching from ${feed.source}:`, error);
    }
  }

  return allArticles;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Try to load from cache first
    const cachedData = await loadCache();
    
    let articles: Article[];
    
    if (cachedData) {
      articles = cachedData.articles;
    } else {
      // Fetch fresh articles
      articles = await fetchArticlesFromRSS();
      
      // If no articles fetched, use fallback
      if (articles.length === 0) {
        articles = await loadFallbackArticles();
      } else {
        // Save to cache
        await saveCache(articles);
      }
    }

    // Filter by category if specified
    if (category && category !== 'all') {
      articles = articles.filter((article) => article.category === category);
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase();
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (most recent first)
    articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json({
      success: true,
      articles,
      total: articles.length,
    });
  } catch (error) {
    console.error('Error in articles API:', error);
    
    // Return fallback articles on error
    try {
      const fallbackArticles = await loadFallbackArticles();
      return NextResponse.json({
        success: true,
        articles: fallbackArticles,
        total: fallbackArticles.length,
        fallback: true,
      });
    } catch (fallbackError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch articles',
          articles: [],
        },
        { status: 500 }
      );
    }
  }
}
