/**
 * Firebase initialization and configuration
 * Handles authentication, Firestore database, and real-time updates
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || '',
};

/**
 * Initialize Firebase app
 */
const app = initializeApp(firebaseConfig);

/**
 * Initialize Firebase Authentication with local persistence
 */
export const auth: Auth = getAuth(app);

// Set authentication persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

/**
 * Initialize Firestore with offline persistence
 */
export const db: Firestore = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err: any) => {
  if (err.code === 'failed-precondition') {
    console.warn(
      'Firestore persistence failed - IndexedDB not available (possibly multiple tabs open)'
    );
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence failed - browser does not support IndexedDB');
  }
});

/**
 * Convert Firebase User to our User type
 * @param firebaseUser - Firebase Auth user
 * @returns Converted user object or null
 */
export const convertFirebaseUser = (firebaseUser: FirebaseUser | null) => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || 'User',
    photoURL: firebaseUser.photoURL || undefined,
  };
};

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export const isUserAuthenticated = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

export default app;
