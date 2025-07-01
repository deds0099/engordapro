import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHljGGlXWdlkFhFbcB8Ja9AycvwIO9Ruo",
  authDomain: "engordapro.firebaseapp.com",
  projectId: "engordapro",
  storageBucket: "engordapro.firebasestorage.app",
  messagingSenderId: "280264421838",
  appId: "1:280264421838:web:a9d6aa67f561fb03507b9f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);