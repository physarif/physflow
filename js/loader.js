async function loadComponent(elementId, filePath) {
    try {
        // GitHub সাব-ফোল্ডারের জন্য পাথ ঠিক করা
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
    // পাথগুলো বর্তমান ফোল্ডার থেকে রিলেটিভ রাখা হয়েছে
    await loadComponent('main-header', 'components/header.html');
    await loadComponent('main-sidebar', 'components/sidebar.html');
    await loadComponent('main-footer', 'components/footer.html');

    // সব লোড হওয়ার পর ইন্টারঅ্যাকশন শুরু করো
    initializeGlobalLogic();
});

function initializeGlobalLogic() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar');
    const themeToggle = document.getElementById('theme-toggle');

    // ১. থিম চেক
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-moon';
    }

    // ২. সাইডবার টগল
    if (navToggle && sidebar) {
        navToggle.onclick = () => { // addEventListener এর বদলে সরাসরি onclick ব্যবহার (নিশ্চিত কাজ করবে)
            sidebar.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        };
    }

    // ৩. থিম টগল
    if (themeToggle) {
        themeToggle.onclick = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        };
    }
}
