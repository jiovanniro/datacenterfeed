'use client';

import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { ALLOWED_EMAIL } from '../lib/firebase-config';
import {
  saveSources,
  loadSources,
  saveBookmarks,
  loadBookmarks,
  saveCategories,
  loadCategories,
  saveBookmarkedArticles,
  loadBookmarkedArticles
} from '../lib/firestore';

export default function DataCenterFeed() {
  // Firebase auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Existing state
  const [sources, setSources] = useState([]);
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeView, setActiveView] = useState('feed');
  const [showAddSource, setShowAddSource] = useState(false);
  const [showManageSources, setShowManageSources] = useState(false);
  const [showEditSource, setShowEditSource] = useState(false);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [showGearDropdown, setShowGearDropdown] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showSourcesDropdown, setShowSourcesDropdown] = useState(false);
  const [selectedSource, setSelectedSource] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    category: 'AI',
    keywords: '',
    sourceType: 'rss', // 'rss' or 'scrape'
    maxArticles: 50 // article limit for scrapers
  });

  const defaultCategories = [
    { name: 'AI', color: 'purple' },
    { name: 'Data Centers', color: 'blue' },
    { name: 'Cloud', color: 'indigo' },
    { name: 'Hybrid', color: 'violet' },
    { name: 'Energy', color: 'green' },
    { name: 'Technology', color: 'amber' }
  ];

  const [categories, setCategories] = useState(defaultCategories);

  // Deduplicate articles by title + source (same title from different sources is OK)
  const deduplicateArticles = (articleList) => {
    const seen = new Set();
    return articleList.filter(article => {
      const normalizedTitle = article.title.toLowerCase().trim();
      const sourceUrl = article.sourceUrl || '';
      const uniqueKey = `${normalizedTitle}|||${sourceUrl}`; // Combined key
      
      if (seen.has(uniqueKey)) {
        return false;
      }
      seen.add(uniqueKey);
      return true;
    });
  };

  // Firebase Authentication Check & Data Loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthLoading(true);
      
      if (currentUser) {
        // Check if user's email is allowed
        if (currentUser.email === ALLOWED_EMAIL) {
          setUser(currentUser);
          setAccessDenied(false);
          
          // Load data from Firestore
          try {
            const [loadedSources, loadedBookmarks, loadedCategories, loadedArticles] = await Promise.all([
              loadSources(currentUser.uid),
              loadBookmarks(currentUser.uid),
              loadCategories(currentUser.uid),
              loadBookmarkedArticles(currentUser.uid)
            ]);
            
            if (loadedSources && loadedSources.length > 0) {
              setSources(loadedSources);
            }
            if (loadedBookmarks && loadedBookmarks.length > 0) {
              setBookmarks(loadedBookmarks);
            }
            if (loadedCategories) {
              setCategories(loadedCategories);
            }
            if (loadedArticles && loadedArticles.length > 0) {
              const deduplicatedArticles = deduplicateArticles(loadedArticles);
              setArticles(deduplicatedArticles);
            }
            
            console.log('✅ Data loaded from Firestore');
          } catch (error) {
            console.error('Error loading data from Firestore:', error);
          }
        } else {
          // Email not allowed
          setAccessDenied(true);
          await signOut(auth);
        }
      } else {
        setUser(null);
      }
      
      setAuthLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSources([]);
      setArticles([]);
      setBookmarks([]);
      setCategories(defaultCategories);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const parseFeed = async (feedUrl, keywords = '', sourceType = 'rss', maxArticles = 50) => {
    try {
      if (sourceType === 'scrape') {
        // Use web scraper
        console.log('Scraping:', feedUrl);
        const response = await fetch('/api/scrape-site', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: feedUrl, keywords, maxArticles }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle 404 specially - no articles found
          if (response.status === 404) {
            throw new Error(data.message || 'No articles found on this page. Try the homepage URL or use RSS feed instead.');
          }
          throw new Error(data.message || data.error || `Scraper failed with status ${response.status}`);
        }

        console.log('Scraped articles:', data.articles?.length || 0);
        
        if (!data.articles || data.articles.length === 0) {
          throw new Error('No articles found. Try using the homepage URL or check if the site has an RSS feed.');
        }
        
        return data.articles;
      } else {
        // Use RSS parser
        console.log('Fetching RSS:', feedUrl);
        const response = await fetch('/api/fetch-feed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: feedUrl, keywords }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || `RSS fetch failed with status ${response.status}`);
        }

        console.log('RSS articles:', data.articles?.length || 0);
        return data.articles || [];
      }
    } catch (err) {
      console.error('Feed parsing error:', err);
      throw new Error(`Unable to fetch articles: ${err.message}`);
    }
  };

  const addSource = async () => {
    if (!newSource.name.trim() || !newSource.url.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const fetchedArticles = await parseFeed(newSource.url, newSource.keywords, newSource.sourceType, newSource.maxArticles);
      
      const source = {
        id: Date.now().toString(),
        name: newSource.name,
        url: newSource.url,
        category: newSource.category,
        keywords: newSource.keywords,
        sourceType: newSource.sourceType,
        maxArticles: newSource.maxArticles,
        enabled: true
      };

      const articlesWithSource = fetchedArticles.map(a => ({ 
        ...a, 
        sourceName: source.name, 
        sourceCategory: source.category,
        sourceUrl: newSource.url
      }));

      const updatedSources = [...sources, source];
      const combinedArticles = [...articles, ...articlesWithSource];
      const updatedArticles = deduplicateArticles(combinedArticles);

      setSources(updatedSources);
      setArticles(updatedArticles);
      
      // Save to Firestore
      if (user) {
        try {
          await saveSources(user.uid, updatedSources);
          await saveBookmarkedArticles(user.uid, updatedArticles);
          console.log('✅ Source added and saved to Firestore');
        } catch (error) {
          console.error('Error saving to Firestore:', error);
        }
      }

      setNewSource({ name: '', url: '', category: 'AI', keywords: '', sourceType: 'rss', maxArticles: 50 });
      setShowAddSource(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to add source. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = async (sourceId) => {
    const source = sources.find(s => s.id === sourceId);
    if (!source) return;
    
    const updatedSources = sources.filter(s => s.id !== sourceId);
    const updatedArticles = articles.filter(a => a.sourceUrl !== source.url);
    
    setSources(updatedSources);
    setArticles(updatedArticles);
    
    // Save to Firestore
    if (user) {
      try {
        await saveSources(user.uid, updatedSources);
        await saveBookmarkedArticles(user.uid, updatedArticles);
        console.log('✅ Source deleted and saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
    
    if (selectedSource === source.url) {
      setSelectedSource('all');
    }
  };

  const openEditSource = (source) => {
    setEditingSource({
      id: source.id,
      name: source.name,
      url: source.url,
      category: source.category,
      keywords: source.keywords || '',
      sourceType: source.sourceType || 'rss',
      maxArticles: source.maxArticles || 50
    });
    setShowEditSource(true);
  };

  const saveEditSource = async () => {
    if (!editingSource.name.trim() || !editingSource.url.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Fetch new articles with updated keywords
      const fetchedArticles = await parseFeed(editingSource.url, editingSource.keywords, editingSource.sourceType || 'rss', editingSource.maxArticles || 50);
      
      // Update the source
      const updatedSources = sources.map(s => 
        s.id === editingSource.id 
          ? { ...s, name: editingSource.name, url: editingSource.url, category: editingSource.category, keywords: editingSource.keywords, sourceType: editingSource.sourceType || 'rss', maxArticles: editingSource.maxArticles || 50 }
          : s
      );
      
      // Remove old articles from this source and add new ones
      const oldSource = sources.find(s => s.id === editingSource.id);
      const updatedArticles = articles.filter(a => a.sourceUrl !== oldSource.url);
      const articlesWithSource = fetchedArticles.map(a => ({ 
        ...a, 
        sourceName: editingSource.name, 
        sourceCategory: editingSource.category,
        sourceUrl: editingSource.url
      }));
      const newArticles = [...updatedArticles, ...articlesWithSource];

      setSources(updatedSources);
      setArticles(newArticles);
      
      // Save to Firestore
      if (user) {
        try {
          await saveSources(user.uid, updatedSources);
          await saveBookmarkedArticles(user.uid, newArticles);
          console.log('✅ Source updated and saved to Firestore');
        } catch (error) {
          console.error('Error saving to Firestore:', error);
        }
      }

      setShowEditSource(false);
      setEditingSource(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update source. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSourceEnabled = async (sourceId) => {
    const updatedSources = sources.map(s => 
      s.id === sourceId ? { ...s, enabled: !s.enabled } : s
    );
    setSources(updatedSources);
    
    // Save to Firestore
    if (user) {
      try {
        await saveSources(user.uid, updatedSources);
        console.log('✅ Source toggle saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
  };

  const refreshFeeds = async () => {
    setLoading(true);
    const allArticles = [];

    for (const source of sources) {
      if (!source.enabled) continue;
      try {
        const fetchedArticles = await parseFeed(source.url, source.keywords || '', source.sourceType || 'rss', source.maxArticles || 50);
        const articlesWithSource = fetchedArticles.map(a => ({ 
          ...a, 
          sourceName: source.name, 
          sourceCategory: source.category,
          sourceUrl: source.url
        }));
        allArticles.push(...articlesWithSource);
      } catch (err) {
        console.error(`Error refreshing ${source.name}:`, err);
      }
    }

    // PRESERVE bookmarked articles from existing state
    const bookmarkedArticles = articles.filter(a => bookmarks.includes(a.id));
    
    // Combine fresh articles with existing bookmarked articles
    const combinedArticles = [...allArticles, ...bookmarkedArticles];
    const deduplicatedArticles = deduplicateArticles(combinedArticles);
    
    setArticles(deduplicatedArticles);
    
    // Save to Firestore
    if (user) {
      try {
        await saveBookmarkedArticles(user.uid, deduplicatedArticles);
        console.log('✅ Refreshed articles saved to Firestore (bookmarks preserved)');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
    
    setLoading(false);
  };

  const toggleBookmark = async (articleId) => {
    const isBookmarked = bookmarks.includes(articleId);
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter(id => id !== articleId)
      : [...bookmarks, articleId];
    
    setBookmarks(updatedBookmarks);
    
    // Save to Firestore
    if (user) {
      try {
        await saveBookmarks(user.uid, updatedBookmarks);
        console.log('✅ Bookmarks saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
  };

  // Clear all articles (manual cleanup)
  const clearAllArticles = async () => {
    setArticles([]);
    
    if (user) {
      try {
        await saveBookmarkedArticles(user.uid, []);
        console.log('✅ All articles cleared from Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
  };

  // Clear all bookmarks (unbookmark everything)
  const clearAllBookmarks = async () => {
    setBookmarks([]);
    
    if (user) {
      try {
        await saveBookmarks(user.uid, []);
        console.log('✅ All bookmarks cleared from Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
  };

  const selectSourceFromDropdown = (sourceUrl) => {
    setSelectedSource(sourceUrl);
    setShowSourcesDropdown(false);
    setActiveView('feed');
  };

  const filteredArticles = activeView === 'bookmarks'
    ? articles.filter(a => bookmarks.includes(a.id))
    : selectedSource === 'all'
    ? articles
    : articles.filter(a => a.sourceUrl === selectedSource);

  const sortedArticles = [...filteredArticles].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const diffMs = new Date() - date;
      const diffHours = Math.floor(diffMs / 3600000);
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const quickAddFeed = (name, url, category, keywords = '', sourceType = 'rss', maxArticles = 50) => {
    setNewSource({ name, url, category, keywords, sourceType, maxArticles });
  };

  const colorOptions = [
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 
    'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
  ];

  const addCategory = async () => {
    if (!editingCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    if (categories.some(c => c.name === editingCategory.name)) {
      setError('Category already exists');
      return;
    }

    const updatedCategories = [...categories, { name: editingCategory.name, color: editingCategory.color }];
    setCategories(updatedCategories);
    
    // Save to Firestore
    if (user) {
      try {
        await saveCategories(user.uid, updatedCategories);
        console.log('✅ Category added and saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
    
    setEditingCategory(null);
    setError('');
  };

  const openEditCategory = (category) => {
    setEditingCategory({ ...category, originalName: category.name });
  };

  const saveEditCategory = async () => {
    if (!editingCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    // If name changed, check for duplicates
    if (editingCategory.name !== editingCategory.originalName) {
      if (categories.some(c => c.name === editingCategory.name)) {
        setError('Category already exists');
        return;
      }

      // Update all sources using the old category name
      const updatedSources = sources.map(s => 
        s.category === editingCategory.originalName 
          ? { ...s, category: editingCategory.name }
          : s
      );
      setSources(updatedSources);

      // Update all articles using the old category
      const updatedArticles = articles.map(a =>
        a.sourceCategory === editingCategory.originalName
          ? { ...a, sourceCategory: editingCategory.name }
          : a
      );
      setArticles(updatedArticles);
      
      // Save sources and articles to Firestore
      if (user) {
        try {
          await saveSources(user.uid, updatedSources);
          await saveBookmarkedArticles(user.uid, updatedArticles);
        } catch (error) {
          console.error('Error saving to Firestore:', error);
        }
      }
    }

    const updatedCategories = categories.map(c => 
      c.name === editingCategory.originalName 
        ? { name: editingCategory.name, color: editingCategory.color }
        : c
    );
    setCategories(updatedCategories);
    
    // Save categories to Firestore
    if (user) {
      try {
        await saveCategories(user.uid, updatedCategories);
        console.log('✅ Category updated and saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
    
    setEditingCategory(null);
    setError('');
  };

  const deleteCategory = async (categoryName) => {
    // Check if any sources use this category
    const sourcesUsingCategory = sources.filter(s => s.category === categoryName);
    if (sourcesUsingCategory.length > 0) {
      setError(`Cannot delete category "${categoryName}" - it's used by ${sourcesUsingCategory.length} source(s)`);
      return;
    }

    const updatedCategories = categories.filter(c => c.name !== categoryName);
    setCategories(updatedCategories);
    
    // Save to Firestore
    if (user) {
      try {
        await saveCategories(user.uid, updatedCategories);
        console.log('✅ Category deleted and saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
  };

  const updateCategoryColor = async (categoryName, newColor) => {
    const updatedCategories = categories.map(c => 
      c.name === categoryName ? { ...c, color: newColor } : c
    );
    setCategories(updatedCategories);
    
    // Save to Firestore
    if (user) {
      try {
        await saveCategories(user.uid, updatedCategories);
        console.log('✅ Category color updated and saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.color : 'purple';
  };

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-neutral-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Access denied screen
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-7xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-neutral-400 mb-8 text-lg">
            This RSS reader is private. Only the owner can access it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="mb-8">
            <div className="w-20 h-20 bg-amber-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-3">Data Center Feed</h1>
            <p className="text-neutral-400 text-lg">Your private RSS reader</p>
          </div>
          
          <button
            onClick={handleSignIn}
            className="w-full px-6 py-4 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-100 flex items-center justify-center gap-3 transition-colors text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          
          <p className="text-xs text-neutral-500 mt-8">
            This is a private RSS reader. Only authorized users can access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <header className="border-b border-neutral-800 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Data Center Feed</h1>
              <p className="text-sm text-neutral-400">{articles.length} articles from your sources</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* User info */}
            <div className="flex items-center gap-3 text-sm border-r border-neutral-700 pr-4">
              <span className="text-neutral-400">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
            
            {/* Refresh and Add Source buttons */}
            <button
              onClick={refreshFeeds}
              disabled={loading}
              className="px-4 py-2 text-neutral-300 hover:text-white flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => setShowAddSource(true)}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Source
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-neutral-800 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          <button
            onClick={() => { setActiveView('feed'); setSelectedSource('all'); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeView === 'feed' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            My Feed
          </button>
          <button
            onClick={() => setActiveView('bookmarks')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeView === 'bookmarks' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Bookmarks
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowSourcesDropdown(!showSourcesDropdown)}
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-neutral-400 hover:text-white"
            >
              Sources
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showSourcesDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowSourcesDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase border-b border-neutral-700">
                    Filter by Source
                  </div>
                  <button
                    onClick={() => selectSourceFromDropdown('all')}
                    className={`w-full px-4 py-2 text-left hover:bg-neutral-700 flex items-center justify-between ${
                      selectedSource === 'all' ? 'text-amber-500' : 'text-white'
                    }`}
                  >
                    <span>All Sources</span>
                    {selectedSource === 'all' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  
                  {sources.length === 0 ? (
                    <div className="px-4 py-6 text-center text-neutral-500 text-sm">
                      No sources yet
                    </div>
                  ) : (
                    sources.map(source => (
                      <button
                        key={source.id}
                        onClick={() => selectSourceFromDropdown(source.url)}
                        className={`w-full px-4 py-2 text-left hover:bg-neutral-700 flex items-center justify-between ${
                          selectedSource === source.url ? 'text-amber-500' : 'text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="truncate">{source.name}</span>
                          <span className={`px-2 py-0.5 bg-${getCategoryColor(source.category)}-600 text-${getCategoryColor(source.category)}-100 rounded text-xs flex-shrink-0`}>
                            {source.category}
                          </span>
                        </div>
                        {selectedSource === source.url && (
                          <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowGearDropdown(!showGearDropdown)}
              className="ml-auto px-4 py-2 text-neutral-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {showGearDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowGearDropdown(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 py-2">
                  <button
                    onClick={() => { setShowGearDropdown(false); setShowManageSources(true); }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-700 text-white flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Manage Sources
                  </button>
                  <button
                    onClick={() => { setShowGearDropdown(false); setShowManageCategories(true); }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-700 text-white flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Manage Categories
                  </button>
                  <div className="border-t border-neutral-700 my-2"></div>
                  <button
                    onClick={() => {
                      if (confirm('Clear all articles? This will remove all articles from your feed. Bookmarks will also be cleared since articles will be gone.')) {
                        clearAllArticles();
                        setBookmarks([]); // Clear bookmarks too since articles are gone
                      }
                      setShowGearDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-700 text-red-400 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All Articles
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Remove all bookmarks? Articles will remain in your feed, but all bookmark flags will be cleared.')) {
                        clearAllBookmarks();
                      }
                      setShowGearDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-700 text-orange-400 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Clear All Bookmarks
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {sortedArticles.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-neutral-400 mb-2">
              {activeView === 'bookmarks' ? 'No bookmarks yet' : selectedSource !== 'all' ? 'No articles from this source' : 'No articles yet'}
            </h3>
            <p className="text-neutral-500 mb-6">
              {activeView === 'bookmarks' 
                ? 'Bookmark articles to save them for later'
                : selectedSource !== 'all'
                ? 'This source has no articles yet. Try refreshing.'
                : 'Add your first news source to get started'}
            </p>
            {activeView === 'feed' && selectedSource === 'all' && (
              <button
                onClick={() => setShowAddSource(true)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium"
              >
                Add Your First Source
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedArticles.map((article) => (
              <article
                key={article.id}
                className="bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 bg-${getCategoryColor(article.sourceCategory)}-600 text-${getCategoryColor(article.sourceCategory)}-100 rounded text-xs font-medium`}>
                        {article.sourceCategory || 'News'}
                      </span>
                      <span className="text-sm text-neutral-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(article.pubDate)}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      className="text-neutral-400 hover:text-amber-500"
                    >
                      <svg className={`w-6 h-6 ${bookmarks.includes(article.id) ? 'fill-amber-500 text-amber-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                  
                  {article.sourceName && (
                    <p className="text-sm text-neutral-500 mb-3">{article.sourceName}</p>
                  )}
                  
                  {article.description && article.description.trim() && (
                    <p className="text-neutral-400 mb-4 text-sm overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {article.description}
                    </p>
                  )}
                  
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400 text-sm font-medium flex items-center gap-1"
                  >
                    Read article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {showAddSource && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg max-w-lg w-full p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Add News Source</h3>
              <button onClick={() => { setShowAddSource(false); setError(''); }} className="text-neutral-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-neutral-400 mb-6">Enter the URL of an RSS feed to track.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Name</label>
                <input
                  type="text"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  placeholder="e.g. Wired Energy"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Source Type</label>
                <select
                  value={newSource.sourceType}
                  onChange={(e) => setNewSource({ ...newSource, sourceType: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-600"
                >
                  <option value="rss">RSS Feed</option>
                  <option value="scrape">Web Scraper</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  {newSource.sourceType === 'scrape' 
                    ? 'Scrapes webpage directly - gets more articles than RSS' 
                    : 'Traditional RSS feed - limited to ~20 articles'}
                </p>
              </div>

              {newSource.sourceType === 'scrape' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Max Articles</label>
                  <select
                    value={newSource.maxArticles}
                    onChange={(e) => setNewSource({ ...newSource, maxArticles: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-600"
                  >
                    <option value={25}>25 articles</option>
                    <option value={50}>50 articles (recommended)</option>
                    <option value={75}>75 articles</option>
                    <option value={100}>100 articles</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">More articles = slower loading</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {newSource.sourceType === 'scrape' ? 'Page URL' : 'Feed URL'}
                </label>
                <input
                  type="text"
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  placeholder={newSource.sourceType === 'scrape' 
                    ? 'https://www.wired.com/tag/energy/' 
                    : 'https://www.wired.com/feed/category/science/latest/rss'}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filter Keywords (Optional)</label>
                <input
                  type="text"
                  value={newSource.keywords}
                  onChange={(e) => setNewSource({ ...newSource, keywords: e.target.value })}
                  placeholder="e.g. energy, climate, renewable (comma-separated)"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600"
                />
                <p className="text-xs text-neutral-500 mt-1">Only show articles containing these keywords</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newSource.category}
                  onChange={(e) => setNewSource({ ...newSource, category: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-600"
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddSource(false); setError(''); }}
                className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addSource}
                disabled={loading || !newSource.name.trim() || !newSource.url.trim()}
                className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add Source'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showManageSources && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowManageSources(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-neutral-800 border-l border-neutral-700 z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Manage Sources</h3>
              <button onClick={() => setShowManageSources(false)} className="text-neutral-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-neutral-400 mb-6">{sources.length} sources configured</p>
            
            {sources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500 mb-4">No sources yet</p>
                <button
                  onClick={() => { setShowManageSources(false); setShowAddSource(true); }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium"
                >
                  Add Your First Source
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sources.map((source) => (
                  <div key={source.id} className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{source.name}</h4>
                          {source.sourceType === 'scrape' && (
                            <span className="px-2 py-0.5 bg-amber-800 text-amber-100 rounded text-xs">
                              Scraper
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 bg-${getCategoryColor(source.category)}-600 text-${getCategoryColor(source.category)}-100 rounded text-xs font-medium`}>
                          {source.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditSource(source)}
                          className="text-neutral-400 hover:text-amber-500"
                          title="Edit source"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleSourceEnabled(source.id)}
                          className={`${source.enabled ? 'text-green-500' : 'text-red-500'} hover:text-white`}
                          title={source.enabled ? 'Disable source' : 'Enable source'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteSource(source.id)}
                          className="text-neutral-400 hover:text-red-500"
                          title="Delete source"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 truncate">{source.url}</p>
                    {source.keywords && (
                      <p className="text-xs text-amber-400 mt-1">
                        🔍 Filtering: {source.keywords}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {sources.length > 0 && (
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <button
                  onClick={() => { refreshFeeds(); setShowManageSources(false); }}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Refreshing...' : 'Refresh All Sources'}
                </button>
                <p className="text-xs text-neutral-400 text-center mt-2">
                  Fetches fresh articles from all enabled sources
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {showEditSource && editingSource && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg max-w-lg w-full p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Edit Source</h3>
              <button onClick={() => { setShowEditSource(false); setEditingSource(null); setError(''); }} className="text-neutral-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-neutral-400 mb-6">Update your RSS feed source.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Name</label>
                <input
                  type="text"
                  value={editingSource.name}
                  onChange={(e) => setEditingSource({ ...editingSource, name: e.target.value })}
                  placeholder="e.g. Wired Energy"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Source Type</label>
                <select
                  value={editingSource.sourceType || 'rss'}
                  onChange={(e) => setEditingSource({ ...editingSource, sourceType: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-600"
                >
                  <option value="rss">RSS Feed</option>
                  <option value="scrape">Web Scraper</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  {(editingSource.sourceType || 'rss') === 'scrape' 
                    ? 'Scrapes webpage directly - gets more articles than RSS' 
                    : 'Traditional RSS feed - limited to ~20 articles'}
                </p>
              </div>

              {(editingSource.sourceType || 'rss') === 'scrape' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Max Articles</label>
                  <select
                    value={editingSource.maxArticles || 50}
                    onChange={(e) => setEditingSource({ ...editingSource, maxArticles: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-600"
                  >
                    <option value={25}>25 articles</option>
                    <option value={50}>50 articles (recommended)</option>
                    <option value={75}>75 articles</option>
                    <option value={100}>100 articles</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">More articles = slower loading</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {(editingSource.sourceType || 'rss') === 'scrape' ? 'Page URL' : 'Feed URL'}
                </label>
                <input
                  type="text"
                  value={editingSource.url}
                  onChange={(e) => setEditingSource({ ...editingSource, url: e.target.value })}
                  placeholder={(editingSource.sourceType || 'rss') === 'scrape'
                    ? 'https://www.wired.com/tag/energy/'
                    : 'https://www.wired.com/feed/category/science/latest/rss'}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filter Keywords (Optional)</label>
                <input
                  type="text"
                  value={editingSource.keywords}
                  onChange={(e) => setEditingSource({ ...editingSource, keywords: e.target.value })}
                  placeholder="e.g. energy, climate, renewable (comma-separated)"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600"
                />
                <p className="text-xs text-neutral-500 mt-1">Only show articles containing these keywords</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={editingSource.category}
                  onChange={(e) => setEditingSource({ ...editingSource, category: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-600"
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowEditSource(false); setEditingSource(null); setError(''); }}
                className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveEditSource}
                disabled={loading || !editingSource.name.trim() || !editingSource.url.trim()}
                className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showManageCategories && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowManageCategories(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-neutral-800 border-l border-neutral-700 z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Manage Categories</h3>
              <button onClick={() => setShowManageCategories(false)} className="text-neutral-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-neutral-400 mb-6">{categories.length} categories configured</p>
            
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500 mb-4">No categories yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => {
                  const sourcesUsingCategory = sources.filter(s => s.category === category.name).length;
                  return (
                    <div key={category.name} className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 bg-${category.color}-600 text-${category.color}-100 rounded text-sm font-medium`}>
                              {category.name}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400">
                            {sourcesUsingCategory} source{sourcesUsingCategory !== 1 ? 's' : ''} using this category
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditCategory(category)}
                            className="text-neutral-400 hover:text-amber-500"
                            title="Edit category"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteCategory(category.name)}
                            className="text-neutral-400 hover:text-red-500"
                            title="Delete category"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-neutral-700">
              <button
                onClick={() => { setShowManageCategories(false); setEditingCategory({ name: '', color: 'purple', originalName: null }); }}
                className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium"
              >
                Add New Category
              </button>
            </div>
          </div>
        </>
      )}

      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg max-w-lg w-full p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{editingCategory.originalName ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => { setEditingCategory(null); setError(''); }} className="text-neutral-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => {
                    // Convert to Title Case: "data centers" -> "Data Centers"
                    const titleCase = e.target.value
                      .toLowerCase()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    setEditingCategory({ ...editingCategory, name: titleCase });
                  }}
                  placeholder="Category Name"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600"
                />
                <p className="text-xs text-neutral-500 mt-1">e.g., Data Centers, Machine Learning, Cloud Computing</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <select
                  value={editingCategory.color}
                  onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-600"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 bg-neutral-900 rounded-lg">
                <span className="text-sm text-neutral-400">Preview:</span>
                <span className={`px-3 py-1 bg-${editingCategory.color}-600 text-${editingCategory.color}-100 rounded text-sm font-medium`}>
                  {editingCategory.name || 'Category'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setEditingCategory(null); setError(''); }}
                className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingCategory.originalName) {
                    saveEditCategory();
                  } else {
                    addCategory();
                    if (!error) setEditingCategory(null);
                  }
                }}
                disabled={!editingCategory.name.trim()}
                className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingCategory.originalName ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
