// কম্পোনেন্ট লোড করার ফাংশন
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const content = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
            return true;
        }
    } catch (error) {
        console.error("Error loading component:", error);
    }
    return false;
}

// পেজ লোড হলে সব কাজ শুরু হবে
window.addEventListener('DOMContentLoaded', async () => {
    // ১. কম্পোনেন্টগুলো লোড করো
    const headerLoaded = await loadComponent('main-header', 'components/header.html');
    const footerLoaded = await loadComponent('main-footer', 'components/footer.html');
    const sidebarLoaded = await loadComponent('main-sidebar', 'components/sidebar.html');

    // ২. লোড হওয়া শেষ হলে ফিচারগুলো চালু করো
    if (headerLoaded) {
        initThemeToggle();
        initSidebarToggle();
    }
});

// নাইট মোড লজিক
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // আগে থেকে সেভ করা থিম চেক
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    });
}

// সাইডবার লজিক
function initSidebarToggle() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar');

    if (navToggle && sidebar) {
        navToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // বাইরে ক্লিক করলে বন্ধ হবে
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}
