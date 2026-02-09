# Data Center Feed - RSS Reader

A modern, dark-themed RSS feed aggregator built with Next.js. Track your favorite tech news sources in one beautiful interface.

## Features

- ✅ Server-side RSS parsing (no CORS issues!)
- ✅ Beautiful dark theme with amber accents
- ✅ Add/manage multiple RSS feeds
- ✅ Filter by source
- ✅ Bookmark articles
- ✅ Category tags
- ✅ Persistent storage with localStorage

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
