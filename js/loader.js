// ১. কেন্দ্রীয় ভার্সন নম্বর
const currentVersion = "v1.1.1"; 

// ২. ব্রাউজার ফোর্স রিফ্রেশ লজিক
const savedVersion = localStorage.getItem('physflow_version');
if (savedVersion !== currentVersion) {
    localStorage.setItem('physflow_version', currentVersion);
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
            // Tailwind CDN ব্যবহার করলে নতুন এলিমেন্ট স্ক্যান করার জন্য:
            if (window.tailwind) {
                // tailwind.upgrade(); // কিছু ভার্সনে প্রয়োজন হতে পারে
            }
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

    // সিগন্যাল পাঠানো
    window.dispatchEvent(new Event('componentsLoaded'));
});

function initInteractions() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar'); 
    const themeToggle = document.getElementById('theme-toggle');
    const overlay = document.getElementById('sidebar-overlay'); // ওভারলে যোগ করা হয়েছে

    // সাইডবার টগল ফাংশন
    const toggleSidebar = (show) => {
        if (show) {
            sidebar.style.left = '0';
            if(overlay) overlay.classList.remove('hidden');
        } else {
            sidebar.style.left = '-260px';
            if(overlay) overlay.classList.add('hidden');
        }
        
        const icon = navToggle?.querySelector('i');
        if (icon) {
            icon.className = show ? 'fas fa-times' : 'fas fa-bars';
        }
    };

    if (navToggle && sidebar) {
        navToggle.onclick = (e) => {
            e.stopPropagation();
            const isOpen = sidebar.style.left === '0px';
            toggleSidebar(!isOpen);
        };
    }

    if (themeToggle) {
        // শুরুতে থিম চেক
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark'); // Tailwind dark mode এর জন্য
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-moon';
        }

        themeToggle.onclick = () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        };
    }

    // সাইডবারের বাইরে বা ওভারলেতে ক্লিক করলে বন্ধ হবে
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.style.left === '0px') {
            if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                toggleSidebar(false);
            }
        }
    });
}
