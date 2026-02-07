async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("ফাইল পাওয়া যায়নি");
        const content = await response.text();
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = content;
            return true;
        }
    } catch (error) {
        console.error("Error:", error);
    }
    return false;
}

// এটি সব পেজের জন্য কাজ করবে
window.addEventListener('DOMContentLoaded', async () => {
    // হেডার, ফুটার এবং সাইডবার লোড হওয়া পর্যন্ত অপেক্ষা করবে
    const h = await loadComponent('main-header', 'components/header.html');
    const f = await loadComponent('main-footer', 'components/footer.html');
    const s = await loadComponent('main-sidebar', 'components/sidebar.html');

    // লোড হওয়ার পর বাটনগুলো চালু করো
    if (h || s) {
        initializeInteractions();
        checkSavedTheme();
    }
});

function initializeInteractions() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar');
    const themeToggle = document.getElementById('theme-toggle');

    // সাইডবার টগল
    if (navToggle && sidebar) {
        navToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    // নাইট মোড টগল
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        });
    }
}

function checkSavedTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#theme-toggle i');
        if (icon) icon.className = 'fas fa-moon';
    }
}
