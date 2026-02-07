// ইভেন্ট ডিসপ্যাচ করার জন্য একটি কাস্টম ফাংশন
function triggerComponentsLoaded() {
    const event = new Event('componentsLoaded');
    window.dispatchEvent(event);
}

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
    await Promise.all([
        loadComponent('main-header', 'components/header.html'),
        loadComponent('main-sidebar', 'components/sidebar.html'),
        loadComponent('main-footer', 'components/footer.html')
    ]);

    // বাটনগুলো সেটআপ করা
    setupGlobalUI();
    
    // লগইন স্ক্রিপ্টকে জানানো যে হেডার তৈরি
    triggerComponentsLoaded(); 
});

function setupGlobalUI() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar'); // নিশ্চিত করো sidebar.html-এ এই আইডি আছে

    if (navToggle && sidebar) {
        navToggle.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        };
    }
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
