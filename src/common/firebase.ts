import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface Comment {
  id: string;
  author: string;
  text: string;
  noteId: string;
  createdAt: any;
  dateStr?: string;
}

/**
 * Subscribes to comment updates in Firestore for a specific note.
 * Sorts comments in-memory to avoid the need for a Firebase composite index.
 * Fallbacks to localStorage if it fails or if offline.
 */
export function subscribeComments(noteId: string, callback: (comments: Comment[]) => void) {
  try {
    // Query without orderBy to prevent missing composite index errors
    const q = query(
      collection(db, "comments"),
      where("noteId", "==", noteId)
    );

    return onSnapshot(q, (snapshot) => {
      const comments: Comment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        let dateStr = "Just now";
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          dateStr = date.toLocaleDateString(undefined, { 
            month: "short", 
            day: "numeric", 
            year: "numeric" 
          });
        }
        comments.push({
          id: doc.id,
          author: data.author,
          text: data.text,
          noteId: data.noteId,
          createdAt: data.createdAt,
          dateStr
        });
      });

      // Sort comments in-memory: newest first
      comments.sort((a, b) => {
        const timeA = a.createdAt?.seconds || a.createdAt?.getTime?.() || 0;
        const timeB = b.createdAt?.seconds || b.createdAt?.getTime?.() || 0;
        return timeB - timeA;
      });

      callback(comments);
    }, (error) => {
      console.warn("Firestore subscription failed, falling back to localStorage:", error);
      callback(getLocalComments(noteId));
    });
  } catch (e) {
    console.error("Firebase subscription initialization error, falling back:", e);
    callback(getLocalComments(noteId));
    return () => {};
  }
}

/**
 * Adds a comment to Firestore with automatic server timestamp.
 * Fallbacks to localStorage if Firestore write fails.
 */
export async function addComment(noteId: string, author: string, text: string) {
  try {
    await addDoc(collection(db, "comments"), {
      noteId,
      author: author.trim(),
      text: text.trim(),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("Firestore write failed, saving to localStorage:", error);
    saveLocalComment(noteId, author, text);
  }
}

// LOCAL STORAGE FALLBACK HELPERS
function getLocalComments(noteId: string): Comment[] {
  const saved = localStorage.getItem(`local-comments-${noteId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

function saveLocalComment(noteId: string, author: string, text: string) {
  const current = getLocalComments(noteId);
  const newComment: Comment = {
    id: `local-${Date.now()}`,
    author: author.trim(),
    text: text.trim(),
    noteId,
    createdAt: new Date(),
    dateStr: new Date().toLocaleDateString(undefined, { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    })
  };
  const updated = [newComment, ...current];
  localStorage.setItem(`local-comments-${noteId}`, JSON.stringify(updated));
  // Dispatch custom event to notify listeners
  window.dispatchEvent(new CustomEvent("local-comments-updated", { detail: { noteId, comments: updated } }));
}

export function clearLocalComments(noteId: string) {
  localStorage.removeItem(`local-comments-${noteId}`);
  window.dispatchEvent(new CustomEvent("local-comments-updated", { detail: { noteId, comments: [] } }));
}
