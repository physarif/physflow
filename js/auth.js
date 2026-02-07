// Firebase Auth references
// মনে রাখবে, firebase-config.js ফাইলে auth এবং provider আগে থেকেই ডিফাইন করা থাকতে হবে।
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, provider } from "./firebase-config.js";

const loginBtn = document.getElementById('google-login');
const userProfile = document.getElementById('user-profile');
const userImg = document.getElementById('user-img');

// 1. Google Login Function
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Logged in as:", result.user.displayName);
            }).catch((error) => {
                console.error("Login Error:", error.message);
            });
    });
}

// 2. Auth State Observer (লগইন আছে কি নেই তা চেক করবে)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ইউজার লগইন থাকলে প্রোফাইল পিকচার দেখাবে এবং লগইন বাটন লুকাবে
        loginBtn.classList.add('d-none');
        userProfile.classList.remove('d-none');
        userImg.src = user.photoURL;
        userImg.title = user.displayName;
    } else {
        // লগআউট থাকলে উল্টোটা হবে
        loginBtn.classList.remove('d-none');
        userProfile.classList.add('d-none');
    }
});

// 3. Logout Function (প্রয়োজন হলে প্রোফাইল ইমেজে ক্লিক করলে লগআউট হবে এমন লজিক রাখতে পারো)
userImg.addEventListener('click', () => {
    if (confirm("আপনি কি লগআউট করতে চান?")) {
        signOut(auth).then(() => {
            console.log("Logged out successfully");
        });
    }
});
