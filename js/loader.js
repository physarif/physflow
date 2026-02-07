// কম্পোনেন্ট লোড করার মেইন ফাংশন
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`${filePath} পাওয়া যায়নি`);
        const content = await response.text();
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = content;
            return true;
        }
    } catch (e) {
        console.warn("Component loading failed:", e);
    }
    return false;
}

// পেজ লোড হলে রান হবে
window.addEventListener('DOMContentLoaded', async () => {
    // ১. সব কম্পোনেন্ট লোড করো
    await loadComponent('main-header', 'components/header.html');
    await loadComponent('main-sidebar', 'components/sidebar.html');
    await loadComponent('main-footer', 'components/footer.html');

    // ২. লোড হওয়ার পর বাটনগুলো সচল করো
    initializeGlobalFeatures();
});

function initializeGlobalFeatures() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar'); // header-এ থাকা আইডি
    const themeToggle = document.getElementById('theme-toggle');

    // ডার্ক মোড চেক (রিফ্রেশ করলেও থিম থাকবে)
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-moon';
    }

    // সাইডবার টগল (মোবাইল ভার্সন)
    if (navToggle && sidebar) {
        navToggle.onclick = () => {
            sidebar.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        };
    }

    // নাইট মোড টগল
    if (themeToggle) {
        themeToggle.onclick = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        };
    }
}
