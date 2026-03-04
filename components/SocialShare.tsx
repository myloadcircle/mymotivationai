'use client';

import { useState } from 'react';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Share2, 
  Link as LinkIcon,
  Copy,
  Check,
  MessageCircle,
  Award,
  Trophy,
  Star,
  BarChart3
} from 'lucide-react';

interface SocialShareProps {
  type: 'goal_completed' | 'milestone' | 'streak' | 'achievement' | 'quote';
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  metadata?: {
    streakDays?: number;
    goalTitle?: string;
    quoteText?: string;
    achievementName?: string;
  };
  compact?: boolean;
  onShare?: (platform: string) => void;
}

export default function SocialShare({
  type,
  title,
  description,
  imageUrl,
  url,
  metadata,
  compact = false,
  onShare
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const defaultUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareUrl = url || defaultUrl;
  
  const defaultDescription = description || getDefaultDescription(type, metadata);
  const shareTitle = `${title} | MyMotivationAI`;

  const platforms = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}&hashtags=mymotivationai,motivation,goals`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-700 hover:bg-blue-800',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(defaultDescription)}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-pink-600 hover:bg-pink-700',
      shareUrl: `https://www.instagram.com/`,
      disabled: true, // Instagram doesn't support direct sharing
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${defaultDescription} ${shareUrl}`)}`,
    },
  ];

  function getDefaultDescription(type: string, metadata?: any) {
    switch (type) {
      case 'goal_completed':
        return `I just completed my goal "${metadata?.goalTitle || 'a goal'}" on MyMotivationAI! 🎯`;
      case 'streak':
        return `I've maintained a ${metadata?.streakDays || 0}-day motivation streak on MyMotivationAI! 🔥`;
      case 'achievement':
        return `I unlocked the "${metadata?.achievementName || 'new achievement'}" achievement on MyMotivationAI! ⭐`;
      case 'quote':
        return `"${metadata?.quoteText?.substring(0, 100) || 'Great quote'}" - Shared via MyMotivationAI 💭`;
      default:
        return 'Check out my progress on MyMotivationAI!';
    }
  }

  function getShareImage(type: string) {
    switch (type) {
      case 'goal_completed':
        return '/images/share-goal-completed.png';
      case 'streak':
        return '/images/share-streak.png';
      case 'achievement':
        return '/images/share-achievement.png';
      default:
        return '/images/share-default.png';
    }
  }

  function handleShare(platformId: string, shareUrl: string) {
    if (platformId === 'instagram') {
      // Instagram requires manual sharing
      alert('For Instagram, please share manually using the copied link or image.');
      return;
    }

    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      shareUrl,
      'share',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
    );

    // Track the share event
    trackShareEvent(platformId);

    if (onShare) {
      onShare(platformId);
    }
  }

  function trackShareEvent(platformId: string) {
    // Send analytics event
    const analyticsData = {
      event: 'social_share',
      platform: platformId,
      share_type: type,
      share_title: title,
      timestamp: new Date().toISOString(),
      url: shareUrl
    };

    // Send to analytics API
    fetch('/api/analytics/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'social_share',
        eventData: analyticsData,
        userId: 'anonymous', // Would be actual user ID in production
        timestamp: new Date().toISOString()
      }),
    }).catch(error => {
      console.error('Failed to track share event:', error);
    });

    // Also log to console for development
    console.log(`📤 Share tracked: ${platformId} - ${type}`, analyticsData);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadImage() {
    // In a real app, this would generate and download a shareable image
    alert('Shareable image download would be implemented here with a canvas/image generation library.');
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: defaultDescription,
        url: shareUrl,
      })
      .then(() => {
        trackShareEvent('native');
        console.log('Native share successful');
      })
      .catch(error => {
        console.error('Native share failed:', error);
      });
    } else {
      // Fallback to showing all share options
      setShowShareOptions(true);
    }
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </button>

        {showShareOptions && (
          <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex space-x-2">
              {platforms.slice(0, 3).map(platform => (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform.id, platform.shareUrl)}
                  className={`p-2 rounded-lg ${platform.color} text-white`}
                  title={`Share on ${platform.name}`}
                >
                  {platform.icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Share Your Achievement</h2>
            <p className="text-sm text-gray-600">Inspire others with your progress</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mr-4">
            {type === 'goal_completed' && <Trophy className="h-8 w-8 text-blue-600" />}
            {type === 'streak' && <Award className="h-8 w-8 text-orange-600" />}
            {type === 'achievement' && <Star className="h-8 w-8 text-yellow-600" />}
            {type === 'quote' && <MessageCircle className="h-8 w-8 text-green-600" />}
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{defaultDescription}</p>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <LinkIcon className="h-3 w-3 mr-1" />
              {shareUrl.length > 50 ? `${shareUrl.substring(0, 50)}...` : shareUrl}
            </div>
          </div>
        </div>
      </div>

      {/* Share Platforms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Share on Social Media</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => handleShare(platform.id, platform.shareUrl)}
              disabled={platform.disabled}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                platform.disabled 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : `${platform.color} text-white hover:shadow-md`
              }`}
            >
              <div className="mb-2">{platform.icon}</div>
              <div className="text-sm font-medium">{platform.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Customize Your Message</h3>
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <textarea
            className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-none"
            rows={3}
            defaultValue={defaultDescription}
            placeholder="Customize your share message..."
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <div>Add hashtags: #MyMotivationAI #Goals #Motivation</div>
            <div>{defaultDescription.length}/280</div>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">More Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleDownloadImage}
            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <Instagram className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Download Shareable Image</div>
              <div className="text-sm text-gray-500">Perfect for Instagram stories</div>
            </div>
          </button>

          <button
            onClick={() => {
              // In a real app, this would generate an embed code
              const embedCode = `<iframe src="${shareUrl}" width="300" height="200" frameborder="0"></iframe>`;
              navigator.clipboard.writeText(embedCode);
              alert('Embed code copied to clipboard!');
            }}
            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-3">
              <LinkIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Get Embed Code</div>
              <div className="text-sm text-gray-500">Embed on your blog or website</div>
            </div>
          </button>
        </div>
      </div>

      {/* Stats & Impact */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-bold text-gray-900 mb-2">📈 Sharing Impact</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">87%</div>
            <div className="text-sm text-gray-600">More likely to achieve goals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">2.3x</div>
            <div className="text-sm text-gray-600">Accountability boost</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">64%</div>
            <div className="text-sm text-gray-600">Motivation increase</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Research shows that sharing goals publicly makes you significantly more likely to achieve them.
          You're not just sharing - you're building accountability!
        </p>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          🔒 Your personal data is never shared. Only the information you choose to share will be visible.
        </p>
      </div>
    </div>
  );
}

// Hook for social sharing analytics
export function useSocialSharing() {
  const [shares, setShares] = useState(0);

  const trackShare = async (platform: string, contentType: string, contentId?: string) => {
    try {
      const response = await fetch('/api/analytics/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          contentType,
          contentId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShares(prev => prev + 1);
        return data;
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const getShareStats = async () => {
    try {
      const response = await fetch('/api/analytics/shares/stats');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching share stats:', error);
    }
  };

  return {
    shares,
    trackShare,
    getShareStats,
  };
}