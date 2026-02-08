// ১. থিম কন্ট্রোল (ডার্ক/লাইট মোড)
const themeToggle = () => {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // আইকন পরিবর্তন
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
};

// ২. মোবাইল সাইডবার কন্ট্রোল (Hamburger & Overlay)
const setupMobileMenu = () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleMenu = () => {
        // Tailwind এর translate ক্লাস টগল করা
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
};

// ৩. পেজ লোড হওয়ার পর থিম চেক এবং ইভেন্ট লিসেনার সেটআপ
document.addEventListener('DOMContentLoaded', () => {
    // আগের সেভ করা থিম অ্যাপ্লাই করা
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // বাটনগুলোতে লিসেনার অ্যাড করা
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', themeToggle);

    // সাইডবার সেটআপ
    setupMobileMenu();
});

// ৪. ইউজার প্রোফাইল মেনু (লগইন থাকলে)
export const updateHeaderUserMenu = (user) => {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');

    if (user) {
        loginBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userMenu.innerHTML = `
            <div class="relative group">
                <img src="${user.photoURL}" class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer" id="profile-btn">
                <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-44 bg-white dark:bg-[#1a1a1b] border dark:border-gray-800 rounded shadow-xl py-2 z-[200]">
                    <p class="px-4 py-2 text-[11px] text-gray-500 border-b dark:border-gray-800 mb-1">${user.displayName}</p>
                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800">লগআউট</button>
                </div>
            </div>
        `;

        document.getElementById('profile-btn').onclick = (e) => {
            e.stopPropagation();
            document.getElementById('profile-dropdown').classList.toggle('hidden');
        };
    } else {
        loginBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
};