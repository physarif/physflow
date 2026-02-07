// কম্পোনেন্ট লোড করার মেইন ফাংশন
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const content = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
        }
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

// পেজ লোড হলে সব কাজ শুরু হবে
window.addEventListener('DOMContentLoaded', async () => {
    // ১. সব কম্পোনেন্ট লোড হওয়ার জন্য অপেক্ষা করো
    await loadComponent('main-header', 'components/header.html');
    await loadComponent('main-sidebar', 'components/sidebar.html');
    await loadComponent('main-footer', 'components/footer.html');

    // ২. কম্পোনেন্ট লোড শেষ, এবার ইভেন্ট লিসেনার চালু করো
    initAppFeatures();
    
    // ৩. থিম চেক করো (ডার্ক মোড)
    applySavedTheme();
});

// Sidebar এবং Theme Toggle লজিক
function initAppFeatures() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar');
    const themeToggle = document.getElementById('theme-toggle');

    // মোবাইল সাইডবার টগল
    if (navToggle && sidebar) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // বুদবুদ হওয়া রোধ করতে
            sidebar.classList.toggle('active');
        });

        // সাইডবারের বাইরে ক্লিক করলে বন্ধ হবে
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // নাইট মোড টগল
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }
}

function updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
}
