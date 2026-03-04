export interface MotivationQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
  tags: string[];
}

export const motivationQuotes: MotivationQuote[] = [
  {
    id: '1',
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Career",
    tags: ["passion", "work", "success"],
  },
  {
    id: '2',
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Mindset",
    tags: ["belief", "confidence", "determination"],
  },
  {
    id: '3',
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "Life",
    tags: ["time", "authenticity", "purpose"],
  },
  {
    id: '4',
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Dreams",
    tags: ["future", "dreams", "belief"],
  },
  {
    id: '5',
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "Perseverance",
    tags: ["persistence", "progress", "consistency"],
  },
  {
    id: '6',
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Mindset",
    tags: ["doubt", "potential", "future"],
  },
  {
    id: '7',
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Perseverance",
    tags: ["time", "persistence", "action"],
  },
  {
    id: '8',
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Action",
    tags: ["action", "start", "execution"],
  },
  {
    id: '9',
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "Dreams",
    tags: ["age", "goals", "dreams"],
  },
  {
    id: '10',
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Action",
    tags: ["start", "initiative", "progress"],
  },
  {
    id: '11',
    quote: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    author: "Roy T. Bennett",
    category: "Mindset",
    tags: ["fear", "dreams", "courage"],
  },
  {
    id: '12',
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Perseverance",
    tags: ["success", "failure", "courage"],
  },
  {
    id: '13',
    quote: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    category: "Personal Growth",
    tags: ["destiny", "choice", "growth"],
  },
  {
    id: '14',
    quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar",
    category: "Goals",
    tags: ["growth", "achievement", "transformation"],
  },
  {
    id: '15',
    quote: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "Mindset",
    tags: ["mind", "thoughts", "manifestation"],
  },
  {
    id: '16',
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Action",
    tags: ["timing", "action", "now"],
  },
  {
    id: '17',
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "Opportunity",
    tags: ["risk", "opportunity", "action"],
  },
  {
    id: '18',
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    category: "Perseverance",
    tags: ["failure", "learning", "persistence"],
  },
  {
    id: '19',
    quote: "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
    author: "Jordan Belfort",
    category: "Mindset",
    tags: ["limiting beliefs", "goals", "mindset"],
  },
  {
    id: '20',
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "Action",
    tags: ["start", "resources", "action"],
  },
];

export class QuoteService {
  /**
   * Get a random quote
   */
  static getRandomQuote(): MotivationQuote {
    const randomIndex = Math.floor(Math.random() * motivationQuotes.length);
    return motivationQuotes[randomIndex];
  }

  /**
   * Get quote by ID
   */
  static getQuoteById(id: string): MotivationQuote | undefined {
    return motivationQuotes.find(quote => quote.id === id);
  }

  /**
   * Get quotes by category
   */
  static getQuotesByCategory(category: string): MotivationQuote[] {
    return motivationQuotes.filter(quote => 
      quote.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get quotes by tag
   */
  static getQuotesByTag(tag: string): MotivationQuote[] {
    return motivationQuotes.filter(quote =>
      quote.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Get daily quote (deterministic based on date)
   */
  static getDailyQuote(): MotivationQuote {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
      1000 / 60 / 60 / 24
    );
    
    const index = dayOfYear % motivationQuotes.length;
    return motivationQuotes[index];
  }

  /**
   * Get all categories
   */
  static getAllCategories(): string[] {
    const categories = motivationQuotes.map(quote => quote.category);
    return [...new Set(categories)];
  }

  /**
   * Get all tags
   */
  static getAllTags(): string[] {
    const allTags = motivationQuotes.flatMap(quote => quote.tags);
    return [...new Set(allTags)];
  }

  /**
   * Search quotes by keyword
   */
  static searchQuotes(keyword: string): MotivationQuote[] {
    const searchTerm = keyword.toLowerCase();
    return motivationQuotes.filter(quote =>
      quote.quote.toLowerCase().includes(searchTerm) ||
      quote.author.toLowerCase().includes(searchTerm) ||
      quote.category.toLowerCase().includes(searchTerm) ||
      quote.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

// Export singleton instance
export const quoteService = new QuoteService();