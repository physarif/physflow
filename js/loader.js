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
    // হেডার, ফুটার এবং সাইডবার লোড হবে
    await Promise.all([
        loadComponent('main-header', 'components/header.html'),
        loadComponent('main-sidebar', 'components/sidebar.html'),
        loadComponent('main-footer', 'components/footer.html')
    ]);

    // সব লোড হওয়ার পর বাটনগুলো চালু করো
    initGlobalScripts();
});

function initGlobalScripts() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar');
    const themeToggle = document.getElementById('theme-toggle');

    // সাইডবার টগল (হ্যামবার্গার)
    if (navToggle && sidebar) {
        navToggle.onclick = () => {
            sidebar.classList.toggle('active');
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
}
