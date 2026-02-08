import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ১. পেজের কম্পোনেন্টগুলো লোড হওয়ার পর বাটন সেটআপ হবে
window.addEventListener('componentsLoaded', () => {
    const loginBtn = document.getElementById('google-login');
    const userProfile = document.getElementById('user-profile');
    const userImg = document.getElementById('user-img');
    // Ask বাটনটি সিলেক্ট করা হলো
    const askBtn = document.querySelector('.s-btn__ask'); 

    // লগইন বাটন ক্লিক হ্যান্ডলার
    if (loginBtn) {
        loginBtn.onclick = async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                console.log("Logged in:", result.user.displayName);
            } catch (error) {
                console.error("Login Error:", error.message);
                alert("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            }
        };
    }

    // ২. লগইন স্ট্যাটাস চেক করা (পরিবর্তন এখানে)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ইউজার লগইন থাকলে
            if (loginBtn) loginBtn.classList.add('d-none');
            if (askBtn) askBtn.classList.remove('d-none'); // Ask বাটন দেখাবে
            if (userProfile) {
                userProfile.classList.remove('d-none');
                userImg.src = user.photoURL || 'assets/default-user.png';
                userImg.title = user.displayName;
            }
        } else {
            // ইউজার লগআউট থাকলে
            if (loginBtn) loginBtn.classList.remove('d-none');
            if (askBtn) askBtn.classList.add('d-none'); // Ask বাটন লুকিয়ে রাখবে
            if (userProfile) userProfile.classList.add('d-none');
        }
    });

    // ৩. প্রোফাইল ছবিতে ক্লিক করলে লগআউট অপশন
    if (userImg) {
        userImg.onclick = () => {
            if (confirm("আপনি কি লগআউট করতে চান?")) {
                signOut(auth).then(() => {
                    location.reload();
                });
            }
        };
    }
});
