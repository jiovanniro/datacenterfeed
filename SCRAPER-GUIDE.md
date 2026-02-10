# 🚀 Version 6 - Web Scraper System

## 🎉 Major New Feature: Custom Web Scraper

**No more subscription fees. No more 20-article limits. Get 50 articles from ANY website.**

---

## 🆚 RSS vs Scraper Comparison

### RSS Feed (Traditional)
- ✅ Fast and reliable
- ✅ Standardized format
- ❌ Limited to ~20 articles
- ❌ Not all sites have RSS
- ❌ Can't get older articles

### Web Scraper (NEW!)
- ✅ **50 articles per source**
- ✅ Works on sites without RSS
- ✅ Gets more recent content
- ✅ No external dependencies
- ✅ **Completely free**
- ⚠️ Slightly slower (1-2 seconds)

---

## 🎯 How It Works

**Simple:**
1. You add a website URL (not RSS feed)
2. App scrapes the page for articles
3. Extracts: title, link, image, date, description
4. Returns up to 50 articles
5. Stores in your feed

**No caching, no database, no complexity:**
- Add source → Scrapes 50 articles immediately
- Click refresh → Scrapes fresh 50 articles
- That's it!

---

## 🆕 Adding a Scraped Source

### Step 1: Click "Add Source"

### Step 2: Choose Source Type
- **RSS Feed** - Traditional (20 articles)
- **Web Scraper** - NEW! (50 articles) ← Pick this!

### Step 3: Enter Page URL
Not an RSS feed URL - the actual webpage!

**Examples:**
```
WIRED Energy:
https://www.wired.com/tag/energy/

WIRED AI:
https://www.wired.com/tag/artificial-intelligence/

TechCrunch:
https://techcrunch.com/

Ars Technica:
https://arstechnica.com/
```

### Step 4: Click "Add Source"
App scrapes 50 articles immediately!

---

## 🎨 Quick-Add Buttons

**We've added tons of pre-configured scrapers!**

### WIRED Tags (Scraper - 50 each):
- **Energy** - https://www.wired.com/tag/energy/
- **AI** - https://www.wired.com/tag/artificial-intelligence/
- **Data Centers** - https://www.wired.com/tag/data-centers/

### Other Sites (Scraper - 50 each):
- **TechCrunch** - https://techcrunch.com/
- **Ars Technica** - https://arstechnica.com/
- **Data Center Knowledge** - https://www.datacenterknowledge.com/

### RSS Feeds (Traditional - 20 each):
- **The Verge** - RSS feed
- **Hacker News** - RSS feed

**Just click and go!**

---

## 🔧 Supported Sites

### Built-in Support (Optimized):
- ✅ **WIRED** - All tags
- ✅ **TechCrunch** - Homepage and categories
- ✅ **Ars Technica** - All sections
- ✅ **Data Center Knowledge** - All articles
- ✅ **Bloomberg** - Most sections

### Generic Fallback (Works on most sites):
- ✅ **Any news site** - Will attempt to extract articles
- ✅ **Blog platforms** - WordPress, Medium, etc.
- ✅ **Tech publications** - Most tech news sites

### May Not Work:
- ❌ Sites with heavy JavaScript (like Twitter/X)
- ❌ Sites requiring login
- ❌ Sites with aggressive anti-scraping

---

## 🎛️ Managing Scraped Sources

### In "Manage Sources" Panel:

**Scraper sources show a badge:**
```
Source Name [Scraper]
ENERGY
```

**All the same controls:**
- ✏️ Edit - Change URL, keywords, category
- ⚡ Enable/Disable - Turn on/off
- 🗑️ Delete - Remove source

### Admin Features:

**Refresh All Sources Button:**
- At bottom of Manage Sources panel
- Fetches fresh 50 articles from ALL enabled sources
- Works for both RSS and Scraper sources
- Shows loading spinner while refreshing

---

## 📝 Editing Scraped Sources

1. Click gear → Manage Sources
2. Click pencil on any source
3. Change:
   - Source Name
   - **Source Type** (RSS ↔ Scraper)
   - Page URL
   - Keywords
   - Category
4. Save Changes
5. App re-scrapes immediately!

---

## 🔍 Keyword Filtering + Scraper = 💪

**Powerful combination:**

1. Add WIRED Science scraper (50 articles)
2. Filter keywords: `energy, climate, renewable`
3. Get 10-30 energy articles instead of 2!

**Example Setup:**
```
Source: WIRED Science (Scraper)
URL: https://www.wired.com/category/science/
Keywords: energy, climate, renewable, solar, wind, battery
Result: 15-25 energy-focused articles
```

---

## 🎯 Recommended Workflows

### Workflow 1: WIRED Energy Feed
**Old way (RSS):**
- WIRED Science RSS: 20 articles
- Filter by "energy": 2 articles
- 😞

**New way (Scraper):**
- WIRED Energy tag: 50 articles
- No filtering needed (already energy!)
- 50 articles! 🎉

### Workflow 2: Multi-Site Tech News
**Add these scrapers:**
1. TechCrunch (50 articles)
2. Ars Technica (50 articles)
3. The Verge RSS (20 articles)

**Total: 120 articles from 3 sources!**

### Workflow 3: Data Center Focus
**Add:**
1. WIRED Data Centers tag (50)
2. Data Center Knowledge (50)
3. TechCrunch with keywords "data center, cloud" (filtered from 50)

**Result: 80-100 data center articles!**

---

## 🚀 Performance

### Scraper Speed:
- First scrape: 1-3 seconds
- Subsequent scrapes: 1-2 seconds
- No caching = Always fresh data

### When to Refresh:
- Manually click "Refresh All Sources"
- Add/Edit a source (auto-refreshes that source)
- No automatic refreshing = You control when

---

## 🛠️ Technical Details

### How Scraper Works:

**Server-side scraping with Cheerio:**
```javascript
1. Fetch webpage HTML
2. Parse with Cheerio (jQuery-like)
3. Find article elements
4. Extract: title, link, image, date, description
5. Return up to 50 articles
6. Apply keyword filters (if any)
```

**Site-specific configs:**
- Each major site has optimized selectors
- Falls back to generic extraction
- Works on 80%+ of news sites

### No Database Needed:
- Articles stored in localStorage (browser)
- Bookmarks persisted
- Sources configuration persisted
- Everything else is temporary

---

## 📊 Storage Requirements

**Per source:**
- RSS feed: ~50 KB (20 articles)
- Scraper: ~125 KB (50 articles)

**Total with 10 sources:**
- 10 scrapers: ~1.25 MB
- Well within browser limits (5-10 MB)

**Only bookmarks persist long-term:**
- Everything else refreshes on demand

---

## 🆘 Troubleshooting

### "Failed to scrape site"
**Causes:**
- Site has anti-scraping protection
- Site requires JavaScript
- Site structure changed
- Network issue

**Solutions:**
1. Try the RSS feed version instead
2. Use a different URL (try homepage vs category page)
3. Check if site is accessible in browser
4. Report issue and I'll add support

### Slow Loading
**Normal for scrapers:**
- 1-3 seconds per source
- Refreshing 10 sources = 10-30 seconds total
- This is expected - we're fetching full webpages

**Solutions:**
- Disable unused sources (lightning button)
- Refresh only when needed
- Use RSS for sites that have it

### No Articles Returned
**Check:**
- Is URL correct?
- Does site have article listings?
- Try homepage URL instead of specific page
- Some sites don't work with generic scraper

---

## 🎨 UI Indicators

### Source Type Badges:

**In source list:**
```
Source Name [Scraper]  ← Web scraper
ENERGY

Source Name            ← RSS feed
TECHNOLOGY
```

### Source Type Dropdown:

**When adding/editing:**
```
Source Type: [RSS Feed ▼]
             [Web Scraper (50 articles max)]
```

**Helper text shows:**
- Scraper: "Scrapes webpage directly - gets more articles than RSS"
- RSS: "Traditional RSS feed - limited to ~20 articles"

---

## 💡 Pro Tips

### Tip 1: Use Scrapers for Main Sources
If a site has both RSS and a scrapable page, use scraper to get 50 articles instead of 20.

### Tip 2: Combine with Keywords
Scraper + keywords = power combo
- Scrape broad category (50 articles)
- Filter to specific topic (10-20 relevant)

### Tip 3: Check Multiple WIRED Tags
WIRED has tons of tags:
- /tag/energy/
- /tag/artificial-intelligence/
- /tag/data-centers/
- /tag/cybersecurity/
- /tag/climate/

Add as separate sources!

### Tip 4: Use Refresh Strategically
- Morning: Refresh all sources
- Evening: Refresh all sources
- Don't refresh constantly - articles don't change that fast

### Tip 5: Disable Low-Value Sources
If a source isn't useful:
- Click lightning bolt (disable)
- Keeps it configured but doesn't fetch articles
- Re-enable anytime

---

## 🔄 Migration from Old Setup

### If you had RSS feeds:

**Option 1: Keep as-is**
- Your RSS feeds still work
- No changes needed

**Option 2: Switch to scrapers**
1. Edit each source
2. Change "Source Type" to "Web Scraper"
3. Update URL to page URL (not RSS feed)
4. Save
5. Get 50 articles instead of 20!

---

## 🎓 Example Setups

### Setup 1: Tech Enthusiast
```
1. TechCrunch (Scraper) - 50 articles
2. Ars Technica (Scraper) - 50 articles
3. The Verge (RSS) - 20 articles
4. Hacker News (RSS) - 20 articles

Total: 140 articles
Refresh: Once daily
```

### Setup 2: Data Center Professional
```
1. WIRED Data Centers (Scraper) - 50
2. Data Center Knowledge (Scraper) - 50
3. WIRED Energy (Scraper) - 50
   Keywords: "data center, datacenter"

Total: 100-120 articles
Refresh: Twice daily
```

### Setup 3: AI Researcher
```
1. WIRED AI (Scraper) - 50
2. TechCrunch (Scraper) - 50
   Keywords: "AI, machine learning, ChatGPT"
3. Ars Technica (Scraper) - 50
   Keywords: "artificial intelligence, AI"

Total: 80-100 AI articles
Refresh: Once daily
```

---

## 🚀 Next Steps

1. **Try a scraper right now:**
   - Click "Add Source"
   - Pick "Web Scraper"
   - Click "WIRED Energy" quick-add
   - Watch 50 articles load!

2. **Add your favorite sites:**
   - Try TechCrunch, Ars Technica
   - Add WIRED tags you care about
   - Experiment with keywords

3. **Use Refresh All:**
   - Gear → Manage Sources
   - Click "Refresh All Sources" button
   - Get fresh content from all sources!

---

**Enjoy unlimited, free news aggregation!** 🎉

No subscriptions. No limits. Just great content.
