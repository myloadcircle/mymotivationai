'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, PartyPopper, Sparkles, Award } from 'lucide-react';

interface CelebrationProps {
  trigger: boolean;
  type?: 'goal_completed' | 'milestone' | 'streak' | 'achievement';
  title?: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Celebration({
  trigger,
  type = 'goal_completed',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (trigger && !isVisible) {
      setIsVisible(true);
      launchConfetti();
      
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onClose) onClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [trigger, isVisible, autoClose, duration, onClose]);

  const launchConfetti = () => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
    const newConfetti = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);
  };

  const getCelebrationConfig = () => {
    switch (type) {
      case 'milestone':
        return {
          icon: <Trophy className="h-12 w-12 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          defaultTitle: 'Milestone Achieved!',
          defaultMessage: 'You\'ve reached an important milestone. Keep up the amazing work!',
        };
      case 'streak':
        return {
          icon: <Sparkles className="h-12 w-12 text-purple-500" />,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          defaultTitle: 'Streak Maintained!',
          defaultMessage: 'You\'re building an incredible streak. Consistency is key!',
        };
      case 'achievement':
        return {
          icon: <Award className="h-12 w-12 text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          defaultTitle: 'New Achievement Unlocked!',
          defaultMessage: 'You\'ve earned a new achievement. Your dedication is paying off!',
        };
      default: // goal_completed
        return {
          icon: <Star className="h-12 w-12 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          defaultTitle: 'Goal Completed! 🎉',
          defaultMessage: 'Congratulations on completing your goal! Take a moment to celebrate this achievement.',
        };
    }
  };

  const config = getCelebrationConfig();

  if (!isVisible) return null;

  return (
    <>
      {/* Confetti overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {confetti.map((particle, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
              backgroundColor: particle.color,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Celebration modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
        />
        
        <div className={`relative ${config.bgColor} border-2 ${config.borderColor} rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in`}>
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              if (onClose) onClose();
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close celebration"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {config.icon}
                <div className="absolute -top-2 -right-2">
                  <PartyPopper className="h-6 w-6 text-pink-500 animate-pulse" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {title || config.defaultTitle}
            </h3>
            
            <p className="text-gray-700 mb-6">
              {message || config.defaultMessage}
            </p>

            {/* Stats or additional info */}
            <div className="bg-white/50 rounded-xl p-4 mb-6">
              <div className="flex justify-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">🎯</div>
                  <div className="text-sm text-gray-600">Goal Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">⭐</div>
                  <div className="text-sm text-gray-600">Great Job!</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">🚀</div>
                  <div className="text-sm text-gray-600">Keep Going!</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsVisible(false);
                  if (onClose) onClose();
                }}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue
              </button>
              
              <button
                onClick={() => {
                  setIsVisible(false);
                  if (onClose) onClose();
                  // In a real app, this would navigate to share or next goal
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Share Achievement
              </button>
            </div>

            {/* Progress tip */}
            <p className="mt-6 text-sm text-gray-500">
              💡 <strong>Pro Tip:</strong> Set your next goal within 24 hours to maintain momentum!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </>
  );
}

// Hook for triggering celebrations
export function useCelebration() {
  const [celebrations, setCelebrations] = useState<Array<{
    id: string;
    type: CelebrationProps['type'];
    title?: string;
    message?: string;
  }>>([]);

  const triggerCelebration = (
    type: CelebrationProps['type'] = 'goal_completed',
    title?: string,
    message?: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setCelebrations(prev => [...prev, { id, type, title, message }]);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      setCelebrations(prev => prev.filter(celeb => celeb.id !== id));
    }, 6000);
    
    return id;
  };

  const CelebrationManager = () => (
    <>
      {celebrations.map(celeb => (
        <Celebration
          key={celeb.id}
          trigger={true}
          type={celeb.type}
          title={celeb.title}
          message={celeb.message}
          onClose={() => {
            setCelebrations(prev => prev.filter(c => c.id !== celeb.id));
          }}
        />
      ))}
    </>
  );

  return { triggerCelebration, CelebrationManager };
}

// Quick celebration component for inline use
export function QuickCelebration({ type = 'goal_completed' }: { type?: CelebrationProps['type'] }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const icons = {
    goal_completed: <Star className="h-5 w-5 text-green-500" />,
    milestone: <Trophy className="h-5 w-5 text-yellow-500" />,
    streak: <Sparkles className="h-5 w-5 text-purple-500" />,
    achievement: <Award className="h-5 w-5 text-blue-500" />,
  };

  const messages = {
    goal_completed: 'Goal completed! 🎉',
    milestone: 'Milestone reached! 🏆',
    streak: 'Streak maintained! 🔥',
    achievement: 'Achievement unlocked! ⭐',
  };

  return (
    <div className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm animate-fade-in">
      {icons[type]}
      <span className="ml-2 text-sm font-medium text-gray-700">
        {messages[type]}
      </span>
    </div>
  );
}