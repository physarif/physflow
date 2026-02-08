// ১. HTML কম্পোনেন্ট রেন্ডার করার ফাংশন
const renderLayout = () => {
    const header = document.getElementById('main-header');
    const sidebar = document.getElementById('main-sidebar');
    const footer = document.getElementById('main-footer');

    if (header) {
        header.innerHTML = `
        <nav class="fixed top-0 w-full bg-white dark:bg-darkCard border-b dark:border-darkBorder z-[100] h-[60px] flex items-center px-4 md:px-8 justify-between">
            <div class="flex items-center gap-4">
                <button id="hamburger-btn" class="md:hidden text-gray-600 dark:text-gray-300">
                    <i class="fas fa-bars text-xl"></i>
                </button>
                <a href="/" class="text-2xl font-black tracking-tighter text-brandOrange">PhysFlow</a>
            </div>
            
            <div class="flex items-center gap-4">
                <button id="theme-toggle" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <i id="theme-icon" class="fas fa-moon text-lg"></i>
                </button>
                <div id="user-menu" class="hidden"></div>
                <a href="/login" id="login-btn" class="bg-[#0a95ff] hover:bg-[#0074cc] text-white px-4 py-1.5 rounded text-sm font-medium transition">লগইন</a>
            </div>
        </nav>`;
    }

    if (sidebar) {
        sidebar.innerHTML = `
        <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-[150] hidden"></div>
        <aside id="mobile-sidebar" class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-darkCard z-[200] transform -translate-x-full transition-transform duration-300 border-r dark:border-darkBorder p-6">
            <div class="flex justify-between items-center mb-8">
                <span class="font-bold text-xl text-brandOrange">PhysFlow</span>
                <button id="close-sidebar" class="md:hidden text-gray-500"><i class="fas fa-times"></i></button>
            </div>
            <nav class="space-y-4">
                <a href="#" class="block text-gray-700 dark:text-gray-300 hover:text-brandOrange font-medium">হোম</a>
                <a href="#" class="block text-gray-700 dark:text-gray-300 hover:text-brandOrange font-medium">প্রশ্নসমূহ</a>
                <a href="#" class="block text-gray-700 dark:text-gray-300 hover:text-brandOrange font-medium">ট্যাগ</a>
            </nav>
        </aside>`;
    }

    if (footer) {
        footer.innerHTML = `
        <footer class="bg-white dark:bg-darkCard border-t dark:border-darkBorder py-8 mt-auto">
            <div class="container mx-auto px-8 text-center text-gray-500 text-xs">
                <p>&copy; 2026 PhysFlow - ফিজিক্স হোক সহজ।</p>
            </div>
        </footer>`;
    }
};

// ২. থিম কন্ট্রোল
const themeToggle = () => {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (themeIcon) {
        if (isDark) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
};

// ৩. মোবাইল সাইডবার কন্ট্রোল
const setupMobileMenu = () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleMenu = () => {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
};

// ৪. পেজ লোড সেটআপ
document.addEventListener('DOMContentLoaded', () => {
    // আগে লেআউট রেন্ডার করো
    renderLayout();

    // থিম চেক
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // বাটন ইভেন্ট
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', themeToggle);

    setupMobileMenu();
});

// ৫. ইউজার প্রোফাইল মেনু
export const updateHeaderUserMenu = (user) => {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');

    if (user && userMenu) {
        loginBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userMenu.innerHTML = `
            <div class="relative group">
                <img src="${user.photoURL}" class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer" id="profile-btn">
                <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-44 bg-white dark:bg-darkCard border dark:border-darkBorder rounded shadow-xl py-2 z-[300]">
                    <p class="px-4 py-2 text-[11px] text-gray-500 border-b dark:border-darkBorder mb-1">${user.displayName}</p>
                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">লগআউট</button>
                </div>
            </div>
        `;

        document.getElementById('profile-btn').onclick = (e) => {
            e.stopPropagation();
            document.getElementById('profile-dropdown').classList.toggle('hidden');
        };
        
        window.onclick = () => {
            document.getElementById('profile-dropdown')?.classList.add('hidden');
        };
    }
};
