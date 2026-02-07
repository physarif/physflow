// firebase-config.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ডাটাবেস ব্যবহারের জন্য
import { getAuth } from "firebase/auth";           // লগইন/সাইনআপের জন্য

const firebaseConfig = {
  apiKey: "AIzaSyD1ucDBk5BRDQzJx1D-VvB0rz5e_K0zQqw",
  authDomain: "physflow-qna.firebaseapp.com",
  projectId: "physflow-qna",
  storageBucket: "physflow-qna.firebasestorage.app",
  messagingSenderId: "726731457595",
  appId: "1:726731457595:web:3982c11792c401f780481e",
  measurementId: "G-60XLNJPFDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// সার্ভিসগুলো এক্সপোর্ট করা হচ্ছে যাতে অন্য ফাইলে ব্যবহার করা যায়
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
