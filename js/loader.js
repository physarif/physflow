// ১. কেন্দ্রীয় ভার্সন নম্বর (শুধু এখানে পরিবর্তন করবে)
const currentVersion = "v1.0.8"; 

// ২. ব্রাউজার ফোর্স রিফ্রেশ লজিক
const savedVersion = localStorage.getItem('physflow_version');
if (savedVersion !== currentVersion) {
    localStorage.setItem('physflow_version', currentVersion);
    // ক্যাশ ক্লিয়ার করে পেজ রিলোড করবে যাতে আপডেট দ্রুত দেখা যায়
    window.location.reload(true); 
}

async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch('./' + filePath); 
        if (!response.ok) return false;
        const content = await response.text();
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = content;
            return true;
        }
    } catch (e) { console.error("Error loading " + filePath, e); }
    return false;
}

window.addEventListener('DOMContentLoaded', async () => {
    // সব কম্পোনেন্ট লোড না হওয়া পর্যন্ত অপেক্ষা
    await Promise.all([
        loadComponent('main-header', 'components/header.html'),
        loadComponent('main-sidebar', 'components/sidebar.html'),
        loadComponent('main-footer', 'components/footer.html')
    ]);

    // UI ইন্টারঅ্যাকশন সেটআপ
    initInteractions();

    // ভার্সন নম্বর UI-তে প্রদর্শন
    const versionDisplay = document.getElementById('app-version');
    if (versionDisplay) {
        versionDisplay.innerText = currentVersion;
    }

    // বাটন লোড শেষ হওয়ার সিগন্যাল পাঠানো (যাতে auth.js কাজ করতে পারে)
    window.dispatchEvent(new Event('componentsLoaded'));
});

function initInteractions() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar'); 
    const themeToggle = document.getElementById('theme-toggle');

    if (navToggle && sidebar) {
        navToggle.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        };
    }

    if (themeToggle) {
        // শুরুতে থিম চেক
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-moon';
        }

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
                if(navToggle.querySelector('i')) navToggle.querySelector('i').className = 'fas fa-bars';
            }
        }
    });
}
