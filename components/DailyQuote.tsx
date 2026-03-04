'use client';

import { useState, useEffect } from 'react';
import { Heart, RefreshCw, Share2, Bookmark } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Quote {
  id: string;
  quote: string;
  author: string;
  category: string;
  tags: string[];
}

interface DailyQuoteProps {
  autoRefresh?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

export default function DailyQuote({
  autoRefresh = false,
  showActions = true,
  compact = false,
}: DailyQuoteProps) {
  const { data: session } = useSession();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (autoRefresh && quote) {
      const interval = setInterval(fetchQuote, 5 * 60 * 1000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, quote]);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/quotes?type=daily');
      const data = await response.json();
      
      if (data.quote) {
        setQuote(data.quote);
        checkIfFavorite(data.quote.id);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback to a default quote
      setQuote({
        id: '1',
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Career",
        tags: ["passion", "work", "success"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfFavorite = async (quoteId: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/quotes/user/favorites?quoteId=${quoteId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavorite = async () => {
    if (!session?.user?.id || !quote) return;

    setIsSaving(true);
    try {
      const action = isFavorite ? 'unsave' : 'save';
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          quoteId: quote.id,
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (!quote) return;

    const text = `"${quote.quote}" - ${quote.author}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Daily Motivation Quote',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Quote copied to clipboard!');
    }
  };

  const handleRefresh = () => {
    fetchQuote();
  };

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 ${compact ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
        <p className="text-gray-600">No quote available</p>
        <button
          onClick={fetchQuote}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <blockquote className="text-sm italic text-gray-700">
          "{quote.quote}"
        </blockquote>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">— {quote.author}</span>
          {showActions && session?.user && (
            <button
              onClick={handleFavorite}
              disabled={isSaving}
              className={`p-1 rounded ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-3">
            <Bookmark className="h-3 w-3 mr-1" />
            Daily Motivation
          </div>
          <h3 className="text-xl font-semibold">Today's Inspiration</h3>
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Refresh quote"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Share quote"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <blockquote className="text-2xl italic mb-6 leading-relaxed">
        "{quote.quote}"
      </blockquote>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">— {quote.author}</p>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-sm bg-white/20 px-2 py-1 rounded">
              {quote.category}
            </span>
            {quote.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-sm text-white/70">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {showActions && session?.user && (
          <button
            onClick={handleFavorite}
            disabled={isSaving}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isFavorite 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      {!session?.user && showActions && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-sm text-white/80 mb-2">
            Sign in to save your favorite quotes and get personalized motivation.
          </p>
          <a
            href="/auth/signin"
            className="inline-flex items-center text-sm font-medium bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Sign in to save quotes
          </a>
        </div>
      )}
    </div>
  );
}