async function loadComponent(elementId, filePath) {
    try {
        // সাব-ফোল্ডারের ঝামেলা এড়াতে './' যোগ করা নিরাপদ
        const response = await fetch('./' + filePath); 
        if (!response.ok) return false;
        const content = await response.text();
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = content;
            return true;
        }
    } catch (e) { console.error("Error loading " + filePath, e); }
    return false;
}

window.addEventListener('DOMContentLoaded', async () => {
    // সব কম্পোনেন্ট লোড না হওয়া পর্যন্ত অপেক্ষা
    await Promise.all([
        loadComponent('main-header', 'components/header.html'),
        loadComponent('main-sidebar', 'components/sidebar.html'),
        loadComponent('main-footer', 'components/footer.html')
    ]);

    // লোড হওয়ার পর বাটন সেটআপ
    initInteractions();
});

function initInteractions() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar'); 
    const themeToggle = document.getElementById('theme-toggle');

    if (navToggle && sidebar) {
        navToggle.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        };
    }

    if (themeToggle) {
        themeToggle.onclick = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        };
    }

    import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ১. পেজের কম্পোনেন্টগুলো (Header/Footer) লোড হওয়ার পর বাটন সেটআপ হবে
window.addEventListener('componentsLoaded', () => {
    const loginBtn = document.getElementById('google-login');
    const userProfile = document.getElementById('user-profile');
    const userImg = document.getElementById('user-img');

    // লগইন বাটন ক্লিক হ্যান্ডলার
    if (loginBtn) {
        loginBtn.onclick = async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                console.log("Logged in:", result.user.displayName);
                // লগইন সফল হলে প্রোফাইল আপডেট অটোমেটিক হবে onAuthStateChanged এর মাধ্যমে
            } catch (error) {
                console.error("Login Error:", error.message);
                alert("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            }
        };
    }

    // ২. লগইন স্ট্যাটাস চেক করা (প্রোফাইল ফটো দেখানো বা লুকানো)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ইউজার লগইন থাকলে
            if (loginBtn) loginBtn.classList.add('d-none');
            if (userProfile) {
                userProfile.classList.remove('d-none');
                userImg.src = user.photoURL || 'assets/default-user.png';
                userImg.title = user.displayName;
            }
        } else {
            // ইউজার লগআউট থাকলে
            if (loginBtn) loginBtn.classList.remove('d-none');
            if (userProfile) userProfile.classList.add('d-none');
        }
    });

    // ৩. প্রোফাইল ছবিতে ক্লিক করলে লগআউট অপশন (ঐচ্ছিক)
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
