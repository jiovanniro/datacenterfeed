import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// Save sources to Firestore
export async function saveSources(userId, sources) {
  try {
    await setDoc(doc(db, 'users', userId, 'data', 'sources'), {
      sources: sources,
      updatedAt: new Date().toISOString()
    });
    console.log('Sources saved to Firestore');
  } catch (error) {
    console.error('Error saving sources:', error);
    throw error;
  }
}

// Load sources from Firestore
export async function loadSources(userId) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'sources');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().sources || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading sources:', error);
    return [];
  }
}

// Save bookmarks to Firestore
export async function saveBookmarks(userId, bookmarks) {
  try {
    await setDoc(doc(db, 'users', userId, 'data', 'bookmarks'), {
      bookmarks: bookmarks,
      updatedAt: new Date().toISOString()
    });
    console.log('Bookmarks saved to Firestore');
  } catch (error) {
    console.error('Error saving bookmarks:', error);
    throw error;
  }
}

// Load bookmarks from Firestore
export async function loadBookmarks(userId) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'bookmarks');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().bookmarks || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
}

// Save categories to Firestore
export async function saveCategories(userId, categories) {
  try {
    await setDoc(doc(db, 'users', userId, 'data', 'categories'), {
      categories: categories,
      updatedAt: new Date().toISOString()
    });
    console.log('Categories saved to Firestore');
  } catch (error) {
    console.error('Error saving categories:', error);
    throw error;
  }
}

// Load categories from Firestore
export async function loadCategories(userId) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'categories');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().categories || null;
    }
    return null;
  } catch (error) {
    console.error('Error loading categories:', error);
    return null;
  }
}

// Save bookmarked articles to Firestore
export async function saveBookmarkedArticles(userId, articles) {
  try {
    await setDoc(doc(db, 'users', userId, 'data', 'articles'), {
      articles: articles,
      updatedAt: new Date().toISOString()
    });
    console.log('Articles saved to Firestore');
  } catch (error) {
    console.error('Error saving articles:', error);
    throw error;
  }
}

// Load bookmarked articles from Firestore  
export async function loadBookmarkedArticles(userId) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'articles');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().articles || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}
