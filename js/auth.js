import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.addEventListener('componentsLoaded', () => {
    const loginBtn = document.getElementById('google-login');
    const userProfile = document.getElementById('user-profile');
    const userImg = document.getElementById('user-img');
    const askBtn = document.getElementById('ask-btn');

    // লগইন চেক লজিকটি এখানে নিয়ে আসা হয়েছে
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User detected:", user.displayName);
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            if (askBtn) askBtn.classList.remove('hidden');
            if (userImg) userImg.src = user.photoURL;
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.add('hidden');
            if (askBtn) askBtn.classList.add('hidden');
        }
    });

    // লগইন বাটন ক্লিক ইভেন্ট
    if (loginBtn) {
        loginBtn.onclick = () => signInWithPopup(auth, provider);
    }
    
    // লগআউট ইভেন্ট
    if (userImg) {
        userImg.onclick = () => {
            if(confirm("লগআউট করবেন?")) signOut(auth);
        }
    }
});
