// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut  } from "firebase/auth";    // Add this import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKsQguS3fDhUjwjXg5u83nKCMOi6GhzzA",
  authDomain: "team-collaboration-platf-5eca8.firebaseapp.com",
  projectId: "team-collaboration-platf-5eca8",
  storageBucket: "team-collaboration-platf-5eca8.firebasestorage.app",
  messagingSenderId: "1070357094011",
  appId: "1:1070357094011:web:19839d3f2c48edfc97ccde",
  measurementId: "G-YBCE3Z6844"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
// Export db for Firestore database
const db = getFirestore(app);


// Helper functions for authentication:
export const login = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);




export { auth, app, analytics, db };  // Export auth so it can be imported elsewhere