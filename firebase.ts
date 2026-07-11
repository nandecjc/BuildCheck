import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Default config with placeholders
const firebaseConfig = {
  apiKey: process.env.ANALYSIS_ENGINE_KEY || "placeholder",
  authDomain: "placeholder",
  projectId: "placeholder",
  storageBucket: "placeholder",
  messagingSenderId: "placeholder",
  appId: "placeholder"
};

// In a real app, we would load from firebase-applet-config.json
// But for the build step, we'll use this safe initialization
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
