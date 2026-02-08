// javascript/layout.js
import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * থিম কন্ট্রোল
 */
export const initTheme = () => {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        html.classList.add('dark');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
};

export const toggleTheme = () => {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const isDark = html.classList.toggle('dark');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeIcon) {
        isDark ? themeIcon.classList.replace('fa-moon', 'fa-sun') : themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
};

/**
 * মোবাইল সাইডবার
 */
export const setupMobileMenu = () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggle = () => {
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    };

    hamburgerBtn?.addEventListener('click', toggle);
    overlay?.addEventListener('click', toggle);
};

/**
 * ইউজার প্রোফাইল UI আপডেট
 */
export const updateHeaderUserMenu = (user) => {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');

    if (!userMenu) return;

    if (user) {
        loginBtn?.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userMenu.innerHTML = `
            <div class="relative">
                <img src="${user.photoURL || 'https://via.placeholder.com/32'}" alt="Profile" class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer shadow-sm hover:border-[#f48024] transition-all" id="profile-btn">
                <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1b] border dark:border-gray-800 rounded shadow-xl py-2 z-[300]">
                    <div class="px-4 py-2 border-b dark:border-gray-800 mb-1">
                        <p class="text-xs font-bold text-gray-800 dark:text-white truncate">${user.displayName || 'ব্যবহারকারী'}</p>
                        <p class="text-[10px] text-gray-500 truncate">${user.email}</p>
                    </div>
                    <a href="profile.html" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">প্রোফাইল</a>
                    <a href="settings.html" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">সেটিংস</a>
                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800">লগআউট</button>
                </div>
            </div>
        `;

        // ইভেন্ট লিসেনার যুক্ত করা
        setTimeout(() => {
            const profileBtn = document.getElementById('profile-btn');
            const dropdown = document.getElementById('profile-dropdown');
            const logoutBtn = document.getElementById('logout-btn');

            profileBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown?.classList.toggle('hidden');
            });

            logoutBtn?.addEventListener('click', async () => {
                if (confirm("লগআউট করবেন?")) {
                    try {
                        await signOut(auth);
                        window.location.reload();
                    } catch (error) {
                        console.error('Logout error:', error);
                        alert('লগআউট করতে সমস্যা হয়েছে');
                    }
                }
            });
        }, 100);
    } else {
        loginBtn?.classList.remove('hidden');
        userMenu.classList.add('hidden');
        userMenu.innerHTML = '';
    }
};

/**
 * Google Authentication সেটআপ
 */
export const setupAuth = () => {
    const loginBtn = document.getElementById('login-btn');

    loginBtn?.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('User logged in:', result.user);
        } catch (error) {
            console.error('Login error:', error);
            alert('লগইন ব্যর্থ হয়েছে: ' + error.message);
        }
    });

    onAuthStateChanged(auth, (user) => {
        updateHeaderUserMenu(user);
        console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
    });
};

/**
 * ড্রপডাউন বন্ধের জন্য গ্লোবাল ক্লিক হ্যান্ডলার
 */
const setupGlobalClickHandler = () => {
    window.addEventListener('click', () => {
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
        }
    });
};

/**
 * Initialize Everything
 */
export const initLayout = () => {
    initTheme();
    setupMobileMenu();
    setupAuth();
    setupGlobalClickHandler();
    
    // থিম টগল বাটন হ্যান্ডলার
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    
    console.log('Layout initialized successfully!');
};

// DOM ready চেক
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
} else {
    initLayout();
}

export default {
    initLayout,
    toggleTheme,
    setupAuth
};