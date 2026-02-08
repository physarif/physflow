// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// সার্ভিসগুলো এক্সপোর্ট করা হচ্ছে
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // গুগল লগইনের জন্য এটি প্রয়োজন

export default app;
