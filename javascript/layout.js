

## ১. `layout.js`

import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const renderLayout = () => {
    const header = document.getElementById('main-header');
    const sidebar = document.getElementById('main-sidebar');
    const footer = document.getElementById('main-footer');

    if (header) {
        header.innerHTML = `
        <header class="fixed top-0 w-full h-[56px] bg-white dark:bg-[#1a1a1b] border-t-4 border-[#f48024] border-b dark:border-gray-800 z-[100] shadow-sm">
            <div class="container mx-auto px-4 h-full flex items-center justify-between gap-4">
                <div class="flex items-center gap-2 shrink-0">
                    <button id="hamburger-btn" class="md:hidden text-gray-600 dark:text-gray-300 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                        <i class="fas fa-bars text-lg"></i>
                    </button>
                    <a href="index.html" class="flex items-center gap-0.5">
                        <span class="text-2xl font-black text-gray-800 dark:text-white tracking-tighter">phys</span>
                        <span class="text-2xl font-light text-gray-500 dark:text-gray-400 tracking-tighter">flow</span>
                    </a>
                </div>
                <div class="hidden sm:flex flex-1 max-w-2xl relative items-center group">
                    <i class="fas fa-search absolute left-3 text-gray-400 text-xs"></i>
                    <input type="text" placeholder="অনুসন্ধান করুন..." class="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#1a1a1b] border border-gray-300 dark:border-gray-700 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-400">
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button id="theme-toggle" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i id="theme-icon" class="fas fa-moon text-lg"></i>
                    </button>
                    <div id="user-actions" class="flex items-center gap-2">
                         <button id="login-btn" class="flex items-center gap-2 text-[#0074cc] dark:text-blue-400 px-3 py-1.5 rounded text-[13px] font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-gray-700">
                            <i class="fab fa-google"></i>
                            <span>লগ ইন</span>
                        </button>
                         <div id="user-menu" class="hidden"></div>
                    </div>
                </div>
            </div>
        </header>`;
    }

    if (sidebar) {
        sidebar.innerHTML = `
        <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-[140] hidden backdrop-blur-sm transition-opacity md:hidden"></div>
        <aside id="mobile-sidebar" class="fixed top-[56px] left-0 h-screen w-[240px] bg-white dark:bg-[#1a1a1b] border-r dark:border-gray-800 z-[150] -translate-x-full transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:z-0 shadow-2xl md:shadow-none">
            <nav class="flex flex-col py-4 text-[13px] font-medium text-gray-600 dark:text-gray-400">
                <div class="px-6 mt-6 mb-2 text-[11px] uppercase text-gray-400 font-bold">পাবলিক</div>
                <a href="questions.html" class="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i class="fas fa-globe w-4"></i> <span>প্রশ্নসমূহ</span>
                </a>
                <a href="tags.html" class="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i class="fas fa-tags w-4"></i> <span>ট্যাগসমূহ</span>
                </a>
                <a href="users.html" class="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i class="fas fa-users w-4"></i> <span>ইউজারসমূহ</span>
                </a>
                <div class="px-6 mt-6 mb-2 text-[11px] uppercase text-gray-400 font-bold">আরও</div>
                <a href="about.html" class="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i class="fas fa-info-circle w-4"></i> <span>আমাদের সম্পর্কে</span>
                </a>
                <a href="help.html" class="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i class="fas fa-question-circle w-4"></i> <span>সাহায্য</span>
                </a>
            </nav>
        </aside>`;
    }

    if (footer) {
        footer.innerHTML = `
        <footer class="bg-gray-50 dark:bg-[#0f0f0f] border-t dark:border-gray-800 py-8 mt-auto">
            <div class="container mx-auto px-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div>
                        <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-3">PhysFlow</h4>
                        <ul class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                            <li><a href="about.html" class="hover:text-[#f48024]">আমাদের সম্পর্কে</a></li>
                            <li><a href="contact.html" class="hover:text-[#f48024]">যোগাযোগ</a></li>
                            <li><a href="team.html" class="hover:text-[#f48024]">টিম</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-3">সাহায্য</h4>
                        <ul class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                            <li><a href="help.html" class="hover:text-[#f48024]">হেল্প সেন্টার</a></li>
                            <li><a href="guidelines.html" class="hover:text-[#f48024]">গাইডলাইন</a></li>
                            <li><a href="faq.html" class="hover:text-[#f48024]">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-3">আইনি</h4>
                        <ul class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                            <li><a href="privacy.html" class="hover:text-[#f48024]">প্রাইভেসি পলিসি</a></li>
                            <li><a href="terms.html" class="hover:text-[#f48024]">শর্তাবলী</a></li>
                            <li><a href="cookie.html" class="hover:text-[#f48024]">কুকি পলিসি</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-3">সোশ্যাল</h4>
                        <div class="flex gap-3">
                            <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-[#f48024]">
                                <i class="fab fa-facebook text-lg"></i>
                            </a>
                            <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-[#f48024]">
                                <i class="fab fa-twitter text-lg"></i>
                            </a>
                            <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-[#f48024]">
                                <i class="fab fa-github text-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="border-t dark:border-gray-800 pt-6 text-center">
                    <p class="text-xs text-gray-500">© 2024 PhysFlow. সর্বস্বত্ব সংরক্ষিত। বাংলাদেশী পদার্থবিজ্ঞানীদের জন্য তৈরি।</p>
                </div>
            </div>
        </footer>`;
    }
};

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

    if (user && userMenu) {
        loginBtn?.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userMenu.innerHTML = `
            <div class="relative group">
                <img src="${user.photoURL}" alt="Profile" class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer shadow-sm hover:border-[#f48024] transition-all" id="profile-btn">
                <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1b] border dark:border-gray-800 rounded shadow-xl py-2 z-[300]">
                    <div class="px-4 py-2 border-b dark:border-gray-800 mb-1">
                        <p class="text-xs font-bold text-gray-800 dark:text-white truncate">${user.displayName}</p>
                        <p class="text-[10px] text-gray-500 truncate">${user.email}</p>
                    </div>
                    <a href="profile.html" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">প্রোফাইল</a>
                    <a href="settings.html" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">সেটিংস</a>
                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800">লগআউট</button>
                </div>
            </div>
        `;

        // Profile dropdown toggle
        setTimeout(() => {
            const profileBtn = document.getElementById('profile-btn');
            const dropdown = document.getElementById('profile-dropdown');

            profileBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown?.classList.toggle('hidden');
            });

            // Logout handler
            document.getElementById('logout-btn')?.addEventListener('click', async () => {
                if (confirm("লগআউট করবেন?")) {
                    try {
                        await signOut(auth);
                        console.log('Logged out successfully');
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                }
            });
        }, 100);
    } else {
        // User logged out - reset UI
        loginBtn?.classList.remove('hidden');
        userMenu?.classList.add('hidden');
        userMenu.innerHTML = '';
    }
};

/**
 * Google Authentication সেটআপ
 */
export const setupAuth = () => {
    const loginBtn = document.getElementById('login-btn');

    // Login button click
    loginBtn?.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('Login successful:', result.user);
        } catch (error) {
            console.error('Login error:', error);
            alert('লগইন ব্যর্থ হয়েছে: ' + error.message);
        }
    });

    // Auth state observer
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User logged in:", user.displayName);
            updateHeaderUserMenu(user);
        } else {
            console.log("User logged out");
            updateHeaderUserMenu(null);
        }
    });
};

/**
 * Global click handler (ড্রপডাউন বন্ধের জন্য)
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
    renderLayout();
    initTheme();
    setupMobileMenu();
    setupAuth();
    setupGlobalClickHandler();
    
    // Theme toggle button
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
} else {
    initLayout();
}

export default {
    renderLayout,
    initTheme,
    toggleTheme,
    setupMobileMenu,
    updateHeaderUserMenu,
    setupAuth,
    initLayout
};