import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Configuration (Demo purposes - replace with your actual config)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "youtube-clone-demo.firebaseapp.com",
  projectId: "youtube-clone-demo",
  storageBucket: "youtube-clone-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;