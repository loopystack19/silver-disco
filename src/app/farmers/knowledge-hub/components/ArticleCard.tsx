import Image from 'next/image';
import { Article } from '../utils/fetchArticles';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback to placeholder on error
            const target = e.target as HTMLImageElement;
            target.src = '/images/articles/maize.jpg';
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {article.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="font-medium">{article.source}</span>
          <span>{formatDate(article.publishedDate)}</span>
        </div>

        {/* Read More button */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Read More →
        </a>
      </div>
    </div>
  );
}
