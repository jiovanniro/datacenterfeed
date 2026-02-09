import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Force server-side only
export const dynamic = 'force-dynamic'; // Don't cache

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'DataCenterFeed/1.0',
  },
});

export async function POST(request) {
  try {
    const { url, keywords } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Feed URL is required' },
        { status: 400 }
      );
    }

    const feed = await parser.parseURL(url);
    
    // Fetch more articles (100) so we have enough after filtering
    let articles = feed.items.slice(0, 100).map((item, index) => {
      // Extract image from various possible sources
      let imageUrl = null;
      if (item.enclosure?.url) {
        imageUrl = item.enclosure.url;
      } else if (item['media:thumbnail']?.$?.url) {
        imageUrl = item['media:thumbnail'].$.url;
      } else if (item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      // Clean description
      const description = (item.contentSnippet || item.content || '')
        .replace(/<[^>]*>/g, '')
        .substring(0, 250)
        .trim();

      return {
        id: `${url}-${index}-${Date.now()}`,
        title: item.title || 'Untitled Article',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: description + (description.length >= 250 ? '...' : ''),
        imageUrl: imageUrl,
      };
    });

    // Filter by keywords if provided
    if (keywords && keywords.length > 0) {
      const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
      articles = articles.filter(article => {
        const searchText = `${article.title} ${article.description}`.toLowerCase();
        return keywordList.some(keyword => searchText.includes(keyword));
      });
    }

    return NextResponse.json({
      success: true,
      articles,
      feedTitle: feed.title,
    });

  } catch (error) {
    console.error('Feed parsing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch feed',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
