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
    } catch (e) { console.error(e); }
    return false;
}

// মাস্টার ইনিশিয়ালাইজার
window.addEventListener('DOMContentLoaded', async () => {
    // ১. কম্পোনেন্ট লোড হওয়া পর্যন্ত অপেক্ষা করো
    await loadComponent('main-header', 'components/header.html');
    await loadComponent('main-sidebar', 'components/sidebar.html');
    await loadComponent('main-footer', 'components/footer.html');

    // ২. এবার সব বাটন ফাংশন চালু করো
    initGlobalScripts();
});

function initGlobalScripts() {
    const navToggle = document.getElementById('nav-toggle');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // ১. থিম চেক (সেভ করা থিম লোড)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-moon';
    }

    // ২. সাইডবার টগল
    if (navToggle && mobileSidebar) {
        navToggle.addEventListener('click', () => {
            mobileSidebar.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // ৩. থিম টগল
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    // ৪. বাইরে ক্লিক করলে সাইডবার বন্ধ
    document.addEventListener('click', (e) => {
        if (mobileSidebar?.classList.contains('active')) {
            if (!mobileSidebar.contains(e.target) && !navToggle.contains(e.target)) {
                mobileSidebar.classList.remove('active');
                navToggle.querySelector('i').className = 'fas fa-bars';
            }
        }
    });
}
