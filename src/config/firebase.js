import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZ_aRixaUHKuqBpl-OTt-kKWAr1c6bLHA",
  authDomain: "fir-course-ec443.firebaseapp.com",
  projectId: "fir-course-ec443",
  storageBucket: "fir-course-ec443.firebasestorage.app",
  messagingSenderId: "689561955309",
  appId: "1:689561955309:web:40e10a9c523e7e95ca55e4",
  measurementId: "G-ZMWNHBKE0L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
