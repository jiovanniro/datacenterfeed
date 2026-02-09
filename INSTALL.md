# 🚀 V6.5 - Clean Install Instructions

## ✅ Step-by-Step Setup

### Step 1: Update Node to 20.18.1+

You have Node 20.17.0, but undici requires 20.18.1+

**Quick fix:**
```bash
nvm install 20
nvm use 20
node -v  # Should show v20.18.1 or higher
```

### Step 2: Extract v6.5-final.zip

Extract to your projects folder.

### Step 3: Clean Install

```bash
cd datacenter-feed-nextjs

# Clean everything
rm -rf node_modules package-lock.json .next

# Fresh install
npm install
```

**Should see:**
```
added 324 packages, and audited 325 packages in 15s
✓ All good!
```

### Step 4: Build (Test)

```bash
npm run build
```

**Should see:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
```

No webpack errors!

### Step 5: Run Dev Server

```bash
npm run dev
```

**Should see:**
```
✓ Ready in 2.1s
○ Local: http://localhost:3000
```

### Step 6: Test WIRED Scraper

1. Open http://localhost:3000
2. Click "Add Source"
3. Fill in:
   - Source Name: `WIRED Energy`
   - Source Type: `Web Scraper`
   - Max Articles: `50`
   - Page URL: `https://www.wired.com/tag/energy/`
   - Category: `Energy`
4. Click "Add Source"

**Should see:**
```
Console: 
Scraping: https://www.wired.com/tag/energy/
Found 47 items with selector: article
Successfully scraped 47 articles
```

**Feed should populate with 47 articles!** ✅

---

## 🔧 If npm install Still Fails

### Check Node Version
```bash
node -v
```

**Need:** v20.18.1 or higher

**If lower:**
```bash
# Install latest Node 20
nvm install 20

# Use it
nvm use 20

# Make it default
nvm alias default 20
```

### Clear npm Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 What's Fixed in v6.5-final

### package.json
- ✅ Next.js: 14.2.15 (real version that exists)
- ✅ React: 18.2.0
- ✅ All dependencies verified

### next.config.js
- ✅ Webpack config to exclude server packages from client
- ✅ Fallback settings for undici, cheerio, rss-parser

### API Routes
- ✅ Both routes marked as `runtime: 'nodejs'`
- ✅ Both routes marked as `dynamic: 'force-dynamic'`

---

## ✅ Success Checklist

- [ ] Node 20.18.1+ installed
- [ ] npm install completes without errors
- [ ] npm run build completes without webpack errors
- [ ] npm run dev starts successfully
- [ ] Can add WIRED Energy web scraper source
- [ ] Console shows "Successfully scraped X articles"

---

## 🆘 Still Having Issues?

### Error: "Next.js 13.5.0 not found"
→ You're using old package.json. Download v6.5-final.zip again.

### Error: "Unsupported engine: undici requires node >=20.18.1"
→ Update Node: `nvm install 20 && nvm use 20`

### Error: "Module parse failed: Unexpected token"
→ Clear .next folder: `rm -rf .next && npm run build`

### Scraper returns 0 articles
→ Check console for errors, try homepage URL instead of /tag/ URL

---

## 🎯 Quick Summary

```bash
# 1. Update Node
nvm install 20 && nvm use 20

# 2. Extract v6.5-final.zip

# 3. Install
cd datacenter-feed-nextjs
rm -rf node_modules .next
npm install

# 4. Run
npm run dev

# 5. Test at http://localhost:3000
```

That's it! 🚀
