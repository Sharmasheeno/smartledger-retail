import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "studio-6050482324-ba394",
  appId: "1:62255288115:web:3deec0000d8eec6525f846",
  storageBucket: "studio-6050482324-ba394.appspot.com",
  apiKey: "AIzaSyB0i7D7swvZi7nt5m19Ew1Jyecejlmnd1Y",
  authDomain: "studio-6050482324-ba394.firebaseapp.com",
  messagingSenderId: "62255288115",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db };
