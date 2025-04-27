import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVSuYvebu_25tX7blG2yM150Doid8RbBY",
  authDomain: "rit-links-in.firebaseapp.com",
  projectId: "rit-links-in",
  storageBucket: "rit-links-in.appspot.com", // Fixed typo here (should be .appspot.com)
  messagingSenderId: "458734309635",
  appId: "1:458734309635:web:c5e6e55324b61bf5181936",
  measurementId: "G-WGDHNVY21Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
