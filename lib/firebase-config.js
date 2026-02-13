// lib/firebase-config.js
// Uses environment variables for better security
// Create a .env.local file with your Firebase values

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// IMPORTANT: Add your email in .env.local
export const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_EMAIL;


// export const firebaseConfig = {
//   apiKey: "AIzaSyCnm9jrYNDhzk7RjwBgy4wG75Hh_HmyBuo",
//   authDomain: "data-center-feed.firebaseapp.com",
//   projectId: "data-center-feed",
//   storageBucket: "data-center-feed.firebasestorage.app",
//   messagingSenderId: "423133394650",
//   appId: "1:423133394650:web:343826c32a44bc549657e3"
// };