import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ১. পেজের কম্পোনেন্টগুলো (Header/Footer) লোড হওয়ার পর বাটন সেটআপ হবে
window.addEventListener('componentsLoaded', () => {
    const loginBtn = document.getElementById('google-login');
    const userProfile = document.getElementById('user-profile');
    const userImg = document.getElementById('user-img');
    const askBtn = document.getElementById('ask-btn'); // আইডি দিয়ে সিলেক্ট করা হলো

    // লগইন বাটন ক্লিক হ্যান্ডলার
    if (loginBtn) {
        loginBtn.onclick = async () => {
            try {
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error("Login Error:", error.message);
                alert("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            }
        };
    }

    // ২. লগইন স্ট্যাটাস চেক করা (Tailwind 'hidden' ক্লাস ব্যবহার করে)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ইউজার লগইন থাকলে
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            if (askBtn) askBtn.classList.remove('hidden'); 
            
            if (userImg) {
                userImg.src = user.photoURL || 'assets/default-user.png';
                userImg.title = user.displayName;
            }
        } else {
            // ইউজার লগআউট থাকলে
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.add('hidden');
            if (askBtn) askBtn.classList.add('hidden');
        }
    });

    // ৩. প্রোফাইল ছবিতে ক্লিক করলে লগআউট অপশন
    if (userImg) {
        userImg.onclick = () => {
            if (confirm("আপনি কি লগআউট করতে চান?")) {
                signOut(auth).then(() => {
                    // পেজ রিলোড করার দরকার নেই, onAuthStateChanged অটো আপডেট করবে
                }).catch((error) => {
                    console.error("Logout Error:", error);
                });
            }
        };
    }
});
