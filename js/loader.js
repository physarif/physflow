async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) return;
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
    } catch (e) { console.error(e); }
}

window.addEventListener('DOMContentLoaded', async () => {
    // ফাইল লোড
    await loadComponent('main-header', 'components/header.html');
    await loadComponent('main-sidebar', 'components/sidebar.html');
    await loadComponent('main-footer', 'components/footer.html');

    // বাটন লজিক চালু
    initApp();
});

function initApp() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar');
    const themeToggle = document.getElementById('theme-toggle');

    // ডার্ক মোড চেক
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-moon';
    }

    // সাইডবার টগল
    if (navToggle && sidebar) {
        navToggle.onclick = () => {
            sidebar.classList.toggle('active');
            navToggle.querySelector('i').className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        };
    }

    // থিম টগল
    if (themeToggle) {
        themeToggle.onclick = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        };
    }
}
