import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, BookmarkRecord, JournalEntry, UserProgress } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  bookmarks: string[];
  journalEntries: JournalEntry[];
  userProgress: UserProgress | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  toggleBookmark: (articleId: string, articleTitle?: string, category?: string) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteJournalEntry: (entryId: string) => Promise<void>;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => Promise<void>;
  saveQuizScore: (score: number) => Promise<void>;
  markArticleCompleted: (articleId: string) => Promise<void>;
  updateExperienceLevel: (level: 'Beginner' | 'Intermediate' | 'Advanced') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_BOOKMARKS_KEY = 'ludwe_m_bookmarks_guest';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : ['technical-analysis-guide', 'technical-vs-fundamental'];
    } catch {
      return ['technical-analysis-guide'];
    }
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync/Create User Profile in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const path = `users/${currentUser.uid}`;
        try {
          const userSnap = await getDoc(userRef);
          const now = new Date().toISOString();
          if (!userSnap.exists()) {
            const newProfile: UserProfile = {
              userId: currentUser.uid,
              displayName: currentUser.displayName || 'Trader',
              email: currentUser.email || undefined,
              photoURL: currentUser.photoURL || undefined,
              experienceLevel: 'Beginner',
              createdAt: now,
              updatedAt: now,
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          } else {
            setUserProfile(userSnap.data() as UserProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, path);
        }

        // Initialize progress doc if needed
        const progressRef = doc(db, 'users', currentUser.uid, 'progress', 'stats');
        const progressPath = `users/${currentUser.uid}/progress/stats`;
        try {
          const progSnap = await getDoc(progressRef);
          if (!progSnap.exists()) {
            const initialProg: UserProgress = {
              userId: currentUser.uid,
              completedArticles: [],
              quizHighestScore: 0,
              quizTotalAttempts: 0,
              lastActiveAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(progressRef, initialProg);
            setUserProgress(initialProg);
          } else {
            setUserProgress(progSnap.data() as UserProgress);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, progressPath);
        }
      } else {
        setUserProfile(null);
        setUserProgress(null);
        setJournalEntries([]);
        // Revert to localStorage bookmarks
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
          if (saved) setBookmarks(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore Bookmarks when logged in
  useEffect(() => {
    if (!user) return;
    const bookmarksColRef = collection(db, 'users', user.uid, 'bookmarks');
    const path = `users/${user.uid}/bookmarks`;

    const unsubscribe = onSnapshot(
      bookmarksColRef,
      (snapshot) => {
        const ids = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as BookmarkRecord;
          return data.articleId;
        });
        setBookmarks(ids);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Listen to Firestore Trade Journal when logged in
  useEffect(() => {
    if (!user) return;
    const journalColRef = collection(db, 'users', user.uid, 'journal');
    const path = `users/${user.uid}/journal`;

    const unsubscribe = onSnapshot(
      journalColRef,
      (snapshot) => {
        const entries: JournalEntry[] = [];
        snapshot.forEach((docSnap) => {
          entries.push(docSnap.data() as JournalEntry);
        });
        // Sort descending by createdAt
        entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setJournalEntries(entries);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const toggleBookmark = async (articleId: string, articleTitle?: string, category?: string) => {
    if (!user) {
      // Guest mode: update state and localStorage
      setBookmarks((prev) => {
        const next = prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId];
        localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(next));
        return next;
      });
      return;
    }

    const bookmarkDocRef = doc(db, 'users', user.uid, 'bookmarks', articleId);
    const path = `users/${user.uid}/bookmarks/${articleId}`;

    if (bookmarks.includes(articleId)) {
      try {
        await deleteDoc(bookmarkDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    } else {
      const newBookmark: BookmarkRecord = {
        id: articleId,
        userId: user.uid,
        articleId,
        articleTitle: articleTitle || articleId,
        category: category || 'Forex Education',
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(bookmarkDocRef, newBookmark);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const addJournalEntry = async (entryData: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      // Create local temporary entry for demo
      const id = 'local_' + Date.now();
      const now = new Date().toISOString();
      const localEntry: JournalEntry = {
        ...entryData,
        id,
        userId: 'guest',
        createdAt: now,
        updatedAt: now,
      };
      setJournalEntries((prev) => [localEntry, ...prev]);
      return;
    }

    const entryId = 'trade_' + Date.now();
    const entryRef = doc(db, 'users', user.uid, 'journal', entryId);
    const path = `users/${user.uid}/journal/${entryId}`;
    const now = new Date().toISOString();

    const newEntry: JournalEntry = {
      ...entryData,
      id: entryId,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(entryRef, newEntry);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteJournalEntry = async (entryId: string) => {
    if (!user) {
      setJournalEntries((prev) => prev.filter((e) => e.id !== entryId));
      return;
    }

    const entryRef = doc(db, 'users', user.uid, 'journal', entryId);
    const path = `users/${user.uid}/journal/${entryId}`;
    try {
      await deleteDoc(entryRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const updateJournalEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
    if (!user) {
      setJournalEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e))
      );
      return;
    }

    const entryRef = doc(db, 'users', user.uid, 'journal', entryId);
    const path = `users/${user.uid}/journal/${entryId}`;
    try {
      await updateDoc(entryRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const saveQuizScore = async (score: number) => {
    if (!user) return;
    const progressRef = doc(db, 'users', user.uid, 'progress', 'stats');
    const path = `users/${user.uid}/progress/stats`;
    const now = new Date().toISOString();

    try {
      const progSnap = await getDoc(progressRef);
      const prevData = progSnap.exists()
        ? (progSnap.data() as UserProgress)
        : {
            userId: user.uid,
            completedArticles: [],
            quizHighestScore: 0,
            quizTotalAttempts: 0,
            updatedAt: now,
          };

      const updatedProgress: UserProgress = {
        userId: user.uid,
        completedArticles: prevData.completedArticles || [],
        quizHighestScore: Math.max(prevData.quizHighestScore || 0, score),
        quizTotalAttempts: (prevData.quizTotalAttempts || 0) + 1,
        lastActiveAt: now,
        updatedAt: now,
      };

      await setDoc(progressRef, updatedProgress);
      setUserProgress(updatedProgress);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const markArticleCompleted = async (articleId: string) => {
    if (!user) return;
    const progressRef = doc(db, 'users', user.uid, 'progress', 'stats');
    const path = `users/${user.uid}/progress/stats`;
    const now = new Date().toISOString();

    try {
      const progSnap = await getDoc(progressRef);
      const prevData = progSnap.exists()
        ? (progSnap.data() as UserProgress)
        : {
            userId: user.uid,
            completedArticles: [],
            quizHighestScore: 0,
            quizTotalAttempts: 0,
            updatedAt: now,
          };

      const existingCompleted = prevData.completedArticles || [];
      if (!existingCompleted.includes(articleId)) {
        const updatedProgress: UserProgress = {
          ...prevData,
          completedArticles: [...existingCompleted, articleId],
          lastActiveAt: now,
          updatedAt: now,
        };
        await setDoc(progressRef, updatedProgress);
        setUserProgress(updatedProgress);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const updateExperienceLevel = async (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const path = `users/${user.uid}`;
    const now = new Date().toISOString();

    try {
      await updateDoc(userRef, {
        experienceLevel: level,
        updatedAt: now,
      });
      setUserProfile((prev) => (prev ? { ...prev, experienceLevel: level, updatedAt: now } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        bookmarks,
        journalEntries,
        userProgress,
        isAuthLoading,
        signInWithGoogle,
        signOutUser,
        toggleBookmark,
        addJournalEntry,
        deleteJournalEntry,
        updateJournalEntry,
        saveQuizScore,
        markArticleCompleted,
        updateExperienceLevel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
