import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs'; // Force server-side only
export const dynamic = 'force-dynamic'; // Don't cache

// Site-specific scraper configurations
const SITE_CONFIGS = {
  'wired.com': {
    listSelector: 'div[data-testid="SummaryItemWrapper"], article, li.summary-item, div.summary-item, div[class*="SummaryItem"]',
    itemSelectors: {
      title: 'h3, h2, h1, a[data-testid="SummaryItemHedLink"], [class*="hed"]',
      link: 'a',
      image: 'img',
      date: 'time',
      description: 'p[class*="dek"], div[class*="dek"], p[class*="excerpt"], div[class*="excerpt"], p[class*="summary"], div[class*="description"], p',
    },
    extractLink: (el) => {
      const link = el.find('a').first().attr('href');
      return link;
    },
  },
  'datacenterdynamics.com': {
    listSelector: 'article, div[class*="card"], div[class*="item"], div[class*="story"], div[class*="post"]',
    itemSelectors: {
      title: 'h2, h3, h1, a[class*="title"], a[class*="headline"]',
      link: 'a',
      image: 'img',
      date: 'time, span[class*="date"], div[class*="date"], span[class*="time"]',
      description: 'p, div[class*="excerpt"], div[class*="summary"], div[class*="description"], span[class*="desc"]',
    },
  },
  'techcrunch.com': {
    listSelector: 'article.post-block, div.post-block, article, div[class*="post"]',
    itemSelectors: {
      title: 'h2, h3, a',
      link: 'a',
      image: 'img',
      date: 'time',
      description: 'div.post-block__content, p',
    },
  },
  'datacenterknowledge.com': {
    listSelector: 'article, div.article-card, div[class*="article"]',
    itemSelectors: {
      title: 'h2, h3, a[rel="bookmark"]',
      link: 'a[rel="bookmark"], h2 a, h3 a, a',
      image: 'img',
      date: 'time, span.date',
      description: 'div.entry-content, p',
    },
  },
  'arstechnica.com': {
    listSelector: 'article, div.article, div[class*="article"]',
    itemSelectors: {
      title: 'h2, h1.heading, h3',
      link: 'a',
      image: 'img',
      date: 'time, p.date',
      description: 'p.excerpt, div.excerpt, p',
    },
  },
  'bloomberg.com': {
    listSelector: 'article, div.story-package-module__story, div[class*="story"]',
    itemSelectors: {
      title: 'a[data-component="headline-link"], h3, h2',
      link: 'a[data-component="headline-link"], a',
      image: 'img',
      date: 'time, div.published-at',
      description: 'div[data-component="abstract"], p',
    },
  },
};

async function scrapeGenericSite(url, maxArticles = 50) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Detect site from URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const config = SITE_CONFIGS[domain];

    if (!config) {
      // Generic fallback
      console.log(`No specific config for ${domain}, using generic scraper`);
      return scrapeGenericFallback($, maxArticles);
    }

    console.log(`Using site-specific config for ${domain}`);
    const articles = [];
    const items = $(config.listSelector).slice(0, maxArticles);

    console.log(`Found ${items.length} items with selector: ${config.listSelector}`);

    items.each((i, element) => {
      const $el = $(element);
      
      let title = $el.find(config.itemSelectors.title).first().text().trim();
      
      let link = '';
      if (config.extractLink) {
        link = config.extractLink($el);
      } else {
        link = $el.find(config.itemSelectors.link).first().attr('href');
      }
      
      // Make link absolute if relative
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).href;
      }

      const image = $el.find(config.itemSelectors.image).first().attr('src') || 
                    $el.find(config.itemSelectors.image).first().attr('data-src');
      
      const date = $el.find(config.itemSelectors.date).first().attr('datetime') || 
                   $el.find(config.itemSelectors.date).first().text().trim();
      
      // Try multiple ways to get description
      let description = '';
      
      // Method 1: Use configured selector
      description = $el.find(config.itemSelectors.description).first().text().trim();
      
      // Method 2: If no description, try to find any paragraph that's not the title
      if (!description) {
        $el.find('p').each((idx, p) => {
          const text = $(p).text().trim();
          if (text && text !== title && text.length > 20) {
            description = text;
            return false; // break
          }
        });
      }
      
      // Method 3: Look for divs with content
      if (!description) {
        $el.find('div').each((idx, div) => {
          const text = $(div).text().trim();
          if (text && text !== title && text.length > 20 && text.length < 500) {
            description = text;
            return false; // break
          }
        });
      }
      
      description = description.substring(0, 250);

      if (title && link) {
        console.log(`Scraped: "${title.substring(0, 50)}..." | Description: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
        articles.push({
          id: `scraped-${Date.now()}-${i}`,
          title,
          link,
          imageUrl: image,
          pubDate: date || new Date().toISOString(),
          description: description || '',
        });
      }
    });

    if (articles.length === 0) {
      console.log('No articles found with site-specific config, trying generic fallback');
      return scrapeGenericFallback($, maxArticles);
    }

    return articles;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
}

function scrapeGenericFallback($, maxArticles) {
  // Generic fallback that tries common patterns
  console.log('[GENERIC FALLBACK] Attempting to scrape with common patterns');
  const articles = [];
  
  const commonSelectors = [
    'article',
    'div.post',
    'div.article',
    'div[class*="article"]',
    'div[class*="story"]',
    'div[class*="post"]',
    'li[class*="item"]',
    'div[class*="item"]',
    'div[class*="card"]',
  ];

  let items = $();
  for (const selector of commonSelectors) {
    items = $(selector);
    if (items.length >= 3) break; // Need at least 3 items to be a valid list
  }

  // If still no items, try super generic
  if (items.length < 3) {
    // Look for any div with an h2 or h3 and a link
    items = $('div').filter((i, el) => {
      const $el = $(el);
      return $el.find('h2, h3').length > 0 && $el.find('a').length > 0;
    });
  }
  
  console.log(`[GENERIC FALLBACK] Found ${items.length} potential article items`);

  items.slice(0, maxArticles).each((i, element) => {
    const $el = $(element);
    
    // Try to find title - be aggressive
    let title = '';
    const titleEl = $el.find('h1, h2, h3, h4').first();
    title = titleEl.text().trim();
    
    // If no title in heading, try link text
    if (!title) {
      title = $el.find('a').first().text().trim();
    }
    
    // Try to find link
    let link = $el.find('a').first().attr('href');
    
    // Try to get link from title element if it's a link
    if (!link && titleEl.is('a')) {
      link = titleEl.attr('href');
    }
    
    // Try parent link
    if (!link) {
      link = $el.closest('a').attr('href');
    }
    
    const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
    
    // Try to find description - be aggressive
    let description = '';
    
    // Method 1: Look for common description classes
    const descSelectors = [
      'p[class*="excerpt"]',
      'p[class*="description"]',
      'p[class*="summary"]',
      'div[class*="excerpt"]',
      'div[class*="description"]',
      'p'
    ];
    
    for (const selector of descSelectors) {
      description = $el.find(selector).first().text().trim();
      if (description && description.length > 20) break;
    }
    
    // Method 2: If no description, find first paragraph that's not the title
    if (!description || description.length < 20) {
      $el.find('p').each((idx, p) => {
        const text = $(p).text().trim();
        if (text && text !== title && text.length > 20) {
          description = text;
          return false; // break
        }
      });
    }
    
    description = description.substring(0, 250);

    if (title && link) {
      console.log(`[GENERIC] Scraped: "${title.substring(0, 50)}..." | Description: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
      articles.push({
        id: `scraped-${Date.now()}-${i}`,
        title,
        link: link.startsWith('http') ? link : '',
        imageUrl: image,
        pubDate: new Date().toISOString(),
        description: description || '',
      });
    }
  });

  return articles;
}

export async function POST(request) {
  try {
    const { url, maxArticles = 50, keywords = '' } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log(`Scraping ${url} with maxArticles=${maxArticles}`);
    let articles = await scrapeGenericSite(url, maxArticles);

    // Filter by keywords if provided
    if (keywords && keywords.trim()) {
      const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
      const beforeFilter = articles.length;
      articles = articles.filter(article => {
        const searchText = `${article.title} ${article.description}`.toLowerCase();
        return keywordList.some(keyword => searchText.includes(keyword));
      });
      console.log(`Filtered ${beforeFilter} articles to ${articles.length} using keywords: ${keywords}`);
    }

    if (articles.length === 0) {
      return NextResponse.json(
        { 
          error: 'No articles found',
          message: 'The scraper could not find any articles on this page. Try: 1) Using the homepage URL instead, 2) Using RSS feed if available, 3) Checking if the URL is correct',
          url: url
        },
        { status: 404 }
      );
    }

    console.log(`Successfully scraped ${articles.length} articles from ${url}`);

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
    });

  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to scrape site',
        message: error.message,
        details: 'The scraper encountered an error. The site may be blocking scraping or the page structure is incompatible.'
      },
      { status: 500 }
    );
  }
}
