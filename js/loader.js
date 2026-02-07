async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) return false;
        const content = await response.text();
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = content;
            return true;
        }
    } catch (e) { console.error(e); }
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
    // header.html এর ভেতরকার আইডিগুলো ঠিকমতো ধরছে কি না চেক
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar'); // নিশ্চিত করো sidebar.html এর মেইন ট্যাগ আইডি এটি
    const themeToggle = document.getElementById('theme-toggle');

    // সাইডবার টগল লজিক
    if (navToggle && sidebar) {
        navToggle.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            
            // আইকন বদলানো (Bars থেকে Times)
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        };
    }

    // নাইট মোড টগল
    if (themeToggle) {
        themeToggle.onclick = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        };
    }

    // সাইডবারের বাইরে ক্লিক করলে বন্ধ হবে
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                navToggle.querySelector('i').className = 'fas fa-bars';
            }
        }
    });
}

    