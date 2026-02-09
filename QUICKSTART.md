# 🚀 QUICK START GUIDE

## Test Locally (5 minutes)

### 1. Install Node.js
If you don't have it: https://nodejs.org/ (download LTS version)

### 2. Open in VS Code
- Open VS Code
- File → Open Folder → select `datacenter-feed-nextjs`

### 3. Open Terminal
- Press `Ctrl + `` (backtick) or go to Terminal → New Terminal

### 4. Install & Run
```bash
npm install
npm run dev
```

### 5. Open Browser
Go to: http://localhost:3000

**That's it!** Your app is running locally. 🎉

---

## Deploy to Cloud (10 minutes)

### Easiest Method: Vercel

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub
3. **Import** your project (or push to GitHub first)
4. **Click Deploy**
5. **Get your URL!** Something like: `your-app.vercel.app`

### Quick Deploy Commands

**If you don't want to use GitHub:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow the prompts and you're live!

---

## First Time Testing

1. Click **"Add Source"**
2. Click **"Wired Energy"** quick-add button  
3. Click **"Add Source"** to save
4. Watch articles load!

Try these RSS feeds:
- `https://www.wired.com/feed/tag/energy/latest/rss`
- `https://www.theverge.com/rss/index.xml`
- `https://news.ycombinator.com/rss`

---

## Need Help?

**Problem:** "npm: command not found"  
**Solution:** Install Node.js from https://nodejs.org/

**Problem:** Port 3000 in use  
**Solution:** Run `npm run dev -- -p 3001` instead

**Problem:** Feed won't load  
**Solution:** Try a different RSS feed URL

---

## File Structure

```
📁 datacenter-feed-nextjs/
  📁 app/
    📁 api/fetch-feed/
      📄 route.js         ← Server fetches RSS feeds here
    📄 page.js            ← Your main app UI
    📄 layout.js          ← App wrapper
    📄 globals.css        ← Styles
  📄 package.json         ← Dependencies
  📄 README.md            ← Full documentation
```

---

**You're all set!** 🚀

See README.md for full documentation and customization options.
