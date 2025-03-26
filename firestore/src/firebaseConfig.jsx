import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhnJDjMg01J5Zzdwk4Zv4-C2_DgZU1PX0",
  authDomain: "lab10-ce6e2.firebaseapp.com",
  projectId: "lab10-ce6e2",
  storageBucket: "lab10-ce6e2.firebasestorage.app",
  messagingSenderId: "971033052112",
  appId: "1:971033052112:web:a143302f73c3ec9689efd5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);