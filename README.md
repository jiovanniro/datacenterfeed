# Data Center Feed - Professional RSS Reader

A modern, cloud-powered RSS feed aggregator designed for data center and tech professionals. Built with Next.js, Firebase, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-7.2-blue) ![Firebase](https://img.shields.io/badge/firebase-enabled-orange) ![Next.js](https://img.shields.io/badge/next.js-14-black)

---

## 🎯 What is Data Center Feed?

**Data Center Feed** is your personalized, private RSS reader that helps you stay current with the rapidly evolving data center, cloud, and AI infrastructure industries. Unlike generic RSS readers, this app is purpose-built for professionals who need to track multiple specialized sources across data centers, cloud computing, AI/ML, energy, and technology news.

### Why This App?

- 🔐 **Private & Secure** - Your feed, your data, your control with Firebase authentication
- ☁️ **Cloud-Synced** - Access your sources and bookmarks across all your devices
- 🎨 **Beautiful Design** - Modern dark theme optimized for long reading sessions
- 🚀 **Lightning Fast** - Server-side RSS parsing with Next.js API routes
- 🔖 **Smart Bookmarking** - Save articles permanently with intelligent deduplication
- 📱 **Mobile Friendly** - Responsive design works perfectly on phone, tablet, and desktop
- 🎯 **Industry Focused** - Pre-configured for data center and tech news sources

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Google Sign-In** - Secure authentication with Firebase Auth
- **Email Whitelist** - Only your authorized email can access your feed
- **Private Data** - All your sources, bookmarks, and articles are isolated to your account
- **Multi-Device** - Sign in on any device and see your synced feed

### 📰 RSS Feed Management
- **Unlimited Sources** - Add as many RSS feeds as you want
- **Smart Deduplication** - Same title from different sources = both kept
- **Category Organization** - Organize feeds by AI, Cloud, Data Centers, Energy, etc.
- **Custom Categories** - Create and manage your own category system
- **Source Filtering** - View articles from specific sources or all combined
- **Enable/Disable** - Toggle sources on/off without deleting them
- **Keyword Filtering** - Filter articles by keywords to reduce noise

### 🔖 Bookmark System
- **Permanent Bookmarks** - Save articles you want to keep forever
- **Refresh-Safe** - Bookmarked articles are preserved when refreshing feeds
- **Dedicated View** - Quick access to all your bookmarked content
- **Bulk Management** - Clear all bookmarks with one click when needed

### 📊 Article Management
- **Title + Source Deduplication** - Smart duplicate detection per source
- **Manual Cleanup** - YOU control when to clear articles (no auto-deletion)
- **Source Attribution** - See which feed each article came from
- **Rich Descriptions** - Article excerpts when available
- **Publication Dates** - Human-readable timestamps ("2 hours ago")
- **External Links** - Open articles in new tabs with proper attribution

### 🎨 User Experience
- **Dark Theme** - Easy on the eyes with amber accents
- **Responsive Design** - Perfect on any screen size
- **Clean Cards** - Each article in a well-designed card layout
- **Quick Actions** - One-click bookmark, refresh, and source management
- **Real-time Updates** - Changes sync instantly to Firestore
- **Loading States** - Clear feedback during data fetching

### ☁️ Cloud Infrastructure
- **Firebase Authentication** - Enterprise-grade auth system
- **Firestore Database** - NoSQL cloud database for all your data
- **Cross-Device Sync** - Automatic sync across all logged-in devices
- **Offline Resilience** - Works offline with cached data
- **Secure Storage** - Firestore security rules protect your data

---

## 🏗️ Technical Architecture

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Client Components** - Interactive UI with state management

### Backend
- **Next.js API Routes** - Server-side RSS fetching (no CORS!)
- **RSS Parser** - Server-side XML parsing
- **Cheerio** - Web scraping for sites without RSS
- **Custom Deduplication** - Smart algorithm using title + source

### Database & Auth
- **Firebase Auth** - Google sign-in with email whitelist
- **Firestore** - Real-time NoSQL database
- **Security Rules** - Row-level security per user
- **Automatic Sync** - Changes save immediately to cloud

### Deployment
- **Vercel** - Optimized Next.js hosting
- **Edge Network** - Global CDN for fast loading
- **Automatic Deploys** - Push to GitHub → Auto-deploy
- **Custom Domains** - Use your own domain name

---

## 🎯 Perfect For

### Data Center Professionals
- Infrastructure managers tracking industry trends
- Controls engineers following automation news
- Project managers monitoring construction updates
- Operations teams staying current on best practices

### Tech Professionals
- Developers following AI/ML advancements
- Cloud architects tracking AWS, Azure, Google Cloud news
- IT managers monitoring technology trends
- CTOs researching strategic initiatives

### Industry Analysts
- Market researchers aggregating industry sources
- Consultants tracking multiple client industries
- Journalists covering data center and tech beats
- Investors monitoring infrastructure trends

---

## 📱 How It Works

### Setup (One Time)
1. **Configure Firebase** - Set up your Firebase project (15 minutes)
2. **Add Your Email** - Whitelist your email in the config
3. **Deploy** - Push to Vercel or run locally
4. **Sign In** - Use Google to sign in

### Daily Use
1. **Sign In** - Quick Google sign-in on any device
2. **Add Sources** - Add RSS feeds from your favorite sites
3. **Read & Bookmark** - Browse articles, bookmark important ones
4. **Refresh Anytime** - Get fresh content while keeping bookmarks
5. **Access Anywhere** - Your feed syncs to all your devices

### Maintenance
- **Weekly** - Review and manage your sources
- **Monthly** - Clear unbookmarked articles if desired
- **As Needed** - Add/remove sources based on relevance

---

## 🚀 Getting Started

### Quick Start (5 minutes)

```bash
# 1. Extract the project
unzip datacenter-feed-nextjs-v7.2.zip
cd datacenter-feed-nextjs

# 2. Install dependencies
npm install

# 3. Configure Firebase (see FIREBASE-SETUP.md)
# Edit lib/firebase-config.js with your Firebase details

# 4. Run locally
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

### First Time Setup

**Read these docs in order:**
1. **FIREBASE-SETUP.md** - Configure Firebase (required)
2. **V7.0-QUICKSTART.md** - Understanding the system
3. **VERCEL-DEPLOY.md** - Deploy to production (optional)

---

## 📋 Recommended RSS Sources

### Data Centers
- Data Center Knowledge: `https://www.datacenterknowledge.com/rss.xml`
- Data Center POST: `https://datacenterpost.com/feed/`
- Search Data Center: `https://www.techtarget.com/searchdatacenter/rss`

### Tech News
- TechCrunch: `https://techcrunch.com/feed/`
- The Verge: `https://www.theverge.com/rss/index.xml`
- Ars Technica: `https://feeds.arstechnica.com/arstechnica/index`
- WIRED: `https://www.wired.com/feed/rss`

### Cloud Providers
- AWS Blog: `https://aws.amazon.com/blogs/aws/feed/`
- Google Cloud: `https://cloudblog.withgoogle.com/rss/`
- Azure Blog: `https://azure.microsoft.com/en-us/blog/feed/`

### Energy & Sustainability
- CleanTechnica: `https://cleantechnica.com/feed/`

### Community
- Hacker News: `https://hnrss.org/frontpage`
- Reddit r/datacenter: `https://www.reddit.com/r/datacenter/.rss`
- Reddit r/sysadmin: `https://www.reddit.com/r/sysadmin/.rss`

*See the full curated list in the app's documentation.*

---

## 🎨 Features Showcase

### Article Cards
Each article is displayed in a clean, informative card:
- **Category Badge** - Color-coded category tag
- **Timestamp** - Human-readable time ("3 hours ago")
- **Title** - Full article headline
- **Source Name** - Which feed it came from
- **Description** - Article excerpt (when available)
- **Bookmark Button** - One-click save for later
- **Read Link** - Opens article in new tab

### Settings Menu
Access powerful management tools:
- **Manage Sources** - Add, edit, delete, enable/disable sources
- **Manage Categories** - Create custom categories with colors
- **Clear All Articles** - Remove all articles when needed
- **Clear All Bookmarks** - Start fresh with bookmarks

### Views
Switch between different content views:
- **My Feed** - All articles from all sources
- **Bookmarks** - Your saved articles only
- **By Source** - Filter to specific RSS feeds

---

## 🔒 Privacy & Security

### What Gets Stored
- ✅ RSS feed URLs and names
- ✅ Article titles, links, and descriptions
- ✅ Your bookmark preferences
- ✅ Your custom categories
- ❌ **NOT** stored: Article full content, images, or tracking data

### Who Can Access
- ✅ **ONLY YOU** - Your email is whitelisted
- ❌ Other users cannot see your data
- ❌ No shared feeds or social features
- ❌ No analytics or tracking

### Data Location
- **Firestore Database** - Google Cloud (US or your chosen region)
- **Client Browser** - Temporary caching only
- **Vercel Hosting** - Edge network globally

---

## 🛠️ Version History

### v7.2 - Article Management (Current)
- ✅ Fixed: Refresh preserves bookmarked articles
- ✅ Fixed: Removed auto-cleanup on page close
- ✅ Fixed: Better deduplication (title + source)
- ✅ Added: "Clear All Articles" button
- ✅ Added: "Clear All Bookmarks" button

### v7.1 - Source Names
- ✅ Added: Source name display under article titles
- ✅ Improved: Visual hierarchy in article cards

### v7.0 - Firebase Integration
- ✅ Added: Google authentication
- ✅ Added: Firestore cloud database
- ✅ Added: Multi-device sync
- ✅ Added: Email whitelist security

### v6.x - Core Features
- RSS feed parsing
- Web scraping capability
- Category management
- Bookmark system
- localStorage persistence

*See individual changelog files for detailed version notes.*

---

## 📂 Project Structure

```
datacenter-feed-nextjs/
├── app/
│   ├── api/
│   │   ├── fetch-feed/
│   │   │   └── route.js          # RSS feed fetching API
│   │   └── scrape-site/
│   │       └── route.js          # Web scraping API
│   ├── globals.css               # Global styles
│   ├── layout.js                 # App layout wrapper
│   └── page.js                   # Main application (1500+ lines)
│
├── lib/
│   ├── firebase-config.js        # Firebase configuration
│   ├── firebase.js               # Firebase initialization
│   └── firestore.js              # Database helper functions
│
├── Documentation/
│   ├── README.md                 # This file
│   ├── FIREBASE-SETUP.md         # Firebase configuration guide
│   ├── V7.0-QUICKSTART.md        # Quick start guide
│   ├── V7.1-SOURCE-NAMES.md      # v7.1 changelog
│   ├── V7.2-ARTICLE-MANAGEMENT.md # v7.2 changelog
│   └── VERCEL-DEPLOY.md          # Deployment guide
│
├── Configuration/
│   ├── package.json              # Dependencies
│   ├── next.config.js            # Next.js config
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   └── .gitignore                # Git ignore rules
│
└── README.md                     # Project overview
```

---

## 🌐 Deployment Options

### Vercel (Recommended)
- ✅ Automatic deployments from GitHub
- ✅ Zero configuration
- ✅ Free tier available
- ✅ Custom domains supported
- ✅ Edge network globally

### Self-Hosted
- Run on your own server
- Requires Node.js 20+
- Use PM2 for process management
- Configure reverse proxy (nginx)

### Local Development
- Perfect for testing
- Hot reload enabled
- Full feature access
- No deployment needed

---

## 🆘 Support & Documentation

### Getting Help
1. **Check Documentation** - See the `/docs` folder
2. **Review Examples** - Look at `V7.x-*.md` files
3. **Test Locally** - Run `npm run dev` to debug

### Common Issues
- **Firebase errors** → Check `lib/firebase-config.js`
- **Auth fails** → Verify email in `ALLOWED_EMAIL`
- **No articles** → Check RSS feed URLs
- **Sync issues** → Check Firestore rules

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🎓 Learning Opportunities

This project is great for learning:
- Next.js App Router and API Routes
- Firebase Authentication & Firestore
- React Hooks and State Management
- Tailwind CSS responsive design
- RSS/XML parsing
- Web scraping basics
- Cloud deployment

---

## 📝 License

MIT License - Free for personal and commercial use

---

## 🚀 Future Roadmap

Potential features for future versions:
- [ ] Search functionality across all articles
- [ ] Export bookmarks to PDF/markdown
- [ ] Reading time estimates
- [ ] Article tagging system
- [ ] Email digest notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered summaries
- [ ] Share articles with teams
- [ ] Reading analytics/insights
- [ ] Dark/light theme toggle

---

## 🙏 Credits

**Built for data center and tech professionals who need a better way to stay informed.**

Technologies used:
- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Authentication & database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [RSS Parser](https://www.npmjs.com/package/rss-parser) - Feed parsing
- [Cheerio](https://cheerio.js.org/) - Web scraping

---

**Stay informed. Stay ahead. 📰**

*Data Center Feed - Your professional RSS reader.*

---

## 🚀 Quick Start - Local Development

### Prerequisites

You need to have **Node.js** installed on your computer. 

**Check if you have Node.js:**
```bash
node --version
```

**Don't have Node.js?** Download it here: https://nodejs.org/ (get the LTS version)

---

### Step 1: Open Project in VS Code

1. Open **VS Code**
2. Click **File → Open Folder**
3. Select the `datacenter-feed-nextjs` folder
4. Click **Open**

---

### Step 2: Open Terminal in VS Code

- **Windows/Linux:** Press `Ctrl + `` (backtick)
- **Mac:** Press `Cmd + `` (backtick)

Or go to **Terminal → New Terminal** in the menu

---

### Step 3: Install Dependencies

In the VS Code terminal, run:

```bash
npm install
```

This will take 1-2 minutes. It downloads all the libraries the app needs.

**What you'll see:**
- Lots of text scrolling by
- Progress bars
- Eventually: "added XXX packages"

---

### Step 4: Start the Development Server

Run this command:

```bash
npm run dev
```

**You should see:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

---

### Step 5: Open in Your Browser

1. **Automatically:** VS Code might show a popup saying "Open in Browser" - click it!
2. **Manually:** Open your browser and go to: **http://localhost:3000**

**You should see:** Your Data Center Feed app running!

---

### Step 6: Test It Out

1. Click **"Add Source"**
2. Click **"Wired Energy"** (or another quick-add button)
3. Click **"Add Source"** button
4. Watch articles load! 🎉

---

### Making Changes

The app has **hot reload** - any changes you make to the code will automatically show in the browser!

Try it:
1. Open `app/page.js`
2. Find the line: `<h1 className="text-2xl font-bold">Data Center Feed</h1>`
3. Change it to: `<h1 className="text-2xl font-bold">My Awesome Feed</h1>`
4. Save the file (`Ctrl+S` or `Cmd+S`)
5. Watch the browser update automatically!

---

### Stopping the Server

In the VS Code terminal:
- Press `Ctrl + C` (Windows/Linux/Mac)
- Type `Y` if asked to confirm

---

## 🌐 Deploy to the Cloud (Free!)

Let's put your app on the internet so you can access it from anywhere!

We'll use **Vercel** - it's free and made by the Next.js team.

---

### Option 1: Deploy with GitHub (Recommended)

#### Step 1: Create a GitHub Account
1. Go to https://github.com
2. Click **Sign Up**
3. Create your account

#### Step 2: Install Git (if you don't have it)

**Check if you have Git:**
```bash
git --version
```

**Don't have Git?** Download: https://git-scm.com/downloads

#### Step 3: Initialize Git in Your Project

In VS Code terminal:

```bash
git init
git add .
git commit -m "Initial commit"
```

#### Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Name: `datacenter-feed` (or whatever you like)
3. Make it **Public** or **Private** (your choice)
4. Click **Create repository**

#### Step 5: Push to GitHub

GitHub will show you commands. Run these in VS Code terminal:

```bash
git remote add origin https://github.com/YOUR-USERNAME/datacenter-feed.git
git branch -M main
git push -u origin main
```

*(Replace YOUR-USERNAME with your GitHub username)*

#### Step 6: Deploy to Vercel

1. Go to https://vercel.com
2. Click **Sign Up** → Choose **Continue with GitHub**
3. After signing in, click **Add New... → Project**
4. Find your `datacenter-feed` repository
5. Click **Import**
6. Leave all settings as default
7. Click **Deploy**

**Wait 1-2 minutes...**

✅ **Done!** You'll get a URL like: `https://datacenter-feed-xyz.vercel.app`

---

### Option 2: Deploy without GitHub

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to verify your email.

#### Step 3: Deploy

In your project folder:

```bash
vercel
```

Answer the questions:
- Set up and deploy? **Y**
- Which scope? **(select your account)**
- Link to existing project? **N**
- What's your project's name? **datacenter-feed**
- In which directory is your code located? **./  (just press Enter)**
- Want to override settings? **N**

**Wait 1-2 minutes...**

✅ You'll get your live URL!

---

### Updating Your Live Site

**If you used GitHub:**
1. Make changes to your code
2. Save files
3. Run:
   ```bash
   git add .
   git commit -m "Update XYZ feature"
   git push
   ```
4. Vercel automatically deploys! (takes ~1 minute)

**If you used Vercel CLI:**
1. Make changes
2. Run: `vercel --prod`
3. Done!

---

## 📱 Using Your App

### Adding RSS Feeds

**Popular RSS Feeds to Try:**

**Tech News:**
- Wired Energy: `https://www.wired.com/feed/tag/energy/latest/rss`
- The Verge: `https://www.theverge.com/rss/index.xml`
- Hacker News: `https://news.ycombinator.com/rss`
- TechCrunch: `https://techcrunch.com/feed/`
- Ars Technica: `http://feeds.arstechnica.com/arstechnica/index/`

**Data Center / Cloud:**
- Data Center Knowledge: `https://www.datacenterknowledge.com/feed`

**How to Find RSS Feeds:**
1. Most websites have RSS feeds - look for an RSS icon 🔶
2. Usually at: `website.com/feed`, `website.com/rss`, or `website.com/rss.xml`
3. Use a service like: https://rss.app to generate feeds from any website

---

## 🛠️ Troubleshooting

### "npm: command not found"
- You need to install Node.js: https://nodejs.org/

### Port 3000 already in use
- Another app is using port 3000
- Kill it or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Feed fails to load
- Check the RSS feed URL is correct
- Try the URL in your browser - it should show XML
- Some sites block automated requests

### Changes not showing
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache

---

## 📂 Project Structure

```
datacenter-feed-nextjs/
├── app/
│   ├── api/
│   │   └── fetch-feed/
│   │       └── route.js          # Server-side RSS fetching
│   ├── globals.css               # Global styles
│   ├── layout.js                 # App layout
│   └── page.js                   # Main app component
├── package.json                  # Dependencies
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
└── README.md                     # This file
```

---

## 🎨 Customization Ideas

Want to make it your own?

**Change the color scheme:**
- Open `app/page.js`
- Find `bg-amber-600` (amber/gold color)
- Replace with: `bg-blue-600`, `bg-green-600`, `bg-purple-600`, etc.

**Change the app name:**
- Edit the `<h1>` tag in `app/page.js`
- Update `title` in `app/layout.js`

**Add more categories:**
- Find `const categories = [...]` in `app/page.js`
- Add your own: `'SCIENCE'`, `'SPORTS'`, `'FINANCE'`, etc.

---

## 🆘 Need Help?

**Common Issues:**
1. **Can't install packages:** Make sure you have Node.js installed
2. **Vercel deploy failed:** Check that all files are committed to Git
3. **Feed not loading:** Try a different RSS feed URL

**Resources:**
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

## 📝 License

MIT - Feel free to use this for personal or commercial projects!

---

## 🚀 What's Next?

Want to add more features?

**Easy wins:**
- Add a search bar to filter articles by keyword
- Sort articles by date, source, or category
- Add dark/light mode toggle
- Export bookmarks to a file

**Advanced features:**
- User authentication (login/signup)
- Database storage (replace localStorage)
- Mobile app version
- Email digest of new articles
- AI-powered article summaries

---

**Happy reading! 📰**
