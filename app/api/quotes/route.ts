import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { QuoteService, motivationQuotes } from '@/lib/quotes';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    
    const type = searchParams.get('type') || 'daily';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');

    let quotes = [...motivationQuotes];

    // Filter by category if specified
    if (category) {
      quotes = QuoteService.getQuotesByCategory(category);
    }

    // Search if specified
    if (search) {
      quotes = QuoteService.searchQuotes(search);
    }

    // Apply limit
    quotes = quotes.slice(0, limit);

    // Get daily quote
    if (type === 'daily') {
      const dailyQuote = QuoteService.getDailyQuote();
      return NextResponse.json({
        quote: dailyQuote,
        type: 'daily',
        totalQuotes: motivationQuotes.length,
      });
    }

    // Get random quote
    if (type === 'random') {
      const randomQuote = QuoteService.getRandomQuote();
      return NextResponse.json({
        quote: randomQuote,
        type: 'random',
        totalQuotes: motivationQuotes.length,
      });
    }

    // Get all quotes (filtered)
    return NextResponse.json({
      quotes,
      type: 'list',
      total: quotes.length,
      totalQuotes: motivationQuotes.length,
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, quoteId } = body;

    if (!action || !quoteId) {
      return NextResponse.json(
        { error: 'Action and quoteId are required' },
        { status: 400 }
      );
    }

    const quote = QuoteService.getQuoteById(quoteId);
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    if (action === 'save') {
      // Save quote to user's favorites
      // First check if quote already exists for this user
      const existingQuote = await prisma.motivationQuote.findFirst({
        where: {
          userId: session.user.id,
          quote: quote.quote,
        },
      });

      let savedQuote;
      if (existingQuote) {
        // Update existing quote
        savedQuote = await prisma.motivationQuote.update({
          where: { id: existingQuote.id },
          data: { favorite: true },
        });
      } else {
        // Create new favorite quote
        savedQuote = await prisma.motivationQuote.create({
          data: {
            userId: session.user.id,
            quote: quote.quote,
            author: quote.author,
            category: quote.category,
            favorite: true,
          },
        });
      }

      return NextResponse.json({
        message: 'Quote saved to favorites',
        quote: savedQuote,
      });
    }

    if (action === 'unsave') {
      // Remove from favorites
      await prisma.motivationQuote.updateMany({
        where: {
          userId: session.user.id,
          quote: quote.quote,
        },
        data: {
          favorite: false,
        },
      });

      return NextResponse.json({
        message: 'Quote removed from favorites',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing quote action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}