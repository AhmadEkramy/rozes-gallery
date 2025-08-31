import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAi_tzwX735_GkERsOLhvmK51RAkj922Ow",
  authDomain: "rozes-gallery.firebaseapp.com",
  projectId: "rozes-gallery",
  storageBucket: "rozes-gallery.firebasestorage.app",
  messagingSenderId: "724369777570",
  appId: "1:724369777570:web:1aa466a418bd6149ca48fb",
  measurementId: "G-M4J1QP9TLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
