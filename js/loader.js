// ১. কেন্দ্রীয় ভার্সন নম্বর (ক্যাশ সমস্যার সমাধানের জন্য)
const currentVersion = "v1.1.8"; 

// ২. ব্রাউজার ফোর্স রিফ্রেশ লজিক
// যদি লোকাল ভার্সন কারেন্ট ভার্সনের চেয়ে আলাদা হয়, তবে পেজ রিলোড করবে
const savedVersion = localStorage.getItem('physflow_version');
if (savedVersion !== currentVersion) {
    localStorage.setItem('physflow_version', currentVersion);
    window.location.reload(true); 
}

/**
 * কম্পোনেন্ট লোড করার ফাংশন
 * @param {string} elementId - যে ডিভ-এ কন্টেন্ট বসবে
 * @param {string} filePath - HTML ফাইলের পাথ
 */
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch('./' + filePath); 
        if (!response.ok) {
            console.error(`Failed to load ${filePath}: ${response.statusText}`);
            return false;
        }
        const content = await response.text();
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = content;
            return true;
        }
    } catch (e) { 
        console.error("Error loading " + filePath, e); 
    }
    return false;
}

// ৩. পেজ লোড হওয়ার পর কম্পোনেন্টগুলো ইনজেক্ট করা
window.addEventListener('DOMContentLoaded', async () => {
    // হেডার, সাইডবার এবং ফুটার লোড না হওয়া পর্যন্ত অপেক্ষা করবে
    await Promise.all([
        loadComponent('main-header', 'components/header.html'),
        loadComponent('main-sidebar', 'components/sidebar.html'),
        loadComponent('main-footer', 'components/footer.html')
    ]);

    // UI ইন্টারঅ্যাকশন (যেমন: মোবাইল মেনু, থিম টগল) সেটআপ
    initInteractions();

    // ভার্সন নম্বর UI-তে প্রদর্শন (যদি লোগোর নিচে স্প্যান থাকে)
    const versionDisplay = document.getElementById('app-version');
    if (versionDisplay) {
        versionDisplay.innerText = currentVersion;
    }

    // ৪. গুরুত্বপূর্ণ: সব কম্পোনেন্ট লোড শেষ হওয়ার সিগন্যাল পাঠানো
    // এটি ছাড়া auth.js হেডার থেকে লগইন বাটন খুঁজে পাবে না
    window.dispatchEvent(new Event('componentsLoaded'));
    
    console.log("All components loaded and event dispatched.");
});

/**
 * বাটন ক্লিক এবং থিম পরিবর্তন হ্যান্ডেল করার ফাংশন
 */
function initInteractions() {
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('mobile-sidebar'); 
    const themeToggle = document.getElementById('theme-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    // সাইডবার টগল লজিক (Tailwind এর জন্য)
    const toggleSidebar = (show) => {
        if (!sidebar) return;
        
        if (show) {
            sidebar.style.left = '0';
            if(overlay) overlay.classList.remove('hidden');
        } else {
            sidebar.style.left = '-260px';
            if(overlay) overlay.classList.add('hidden');
        }
        
        // আইকন পরিবর্তন (Bar থেকে Cross)
        const icon = navToggle?.querySelector('i');
        if (icon) {
            icon.className = show ? 'fas fa-times' : 'fas fa-bars';
        }
    };

    // মোবাইল মেনু বাটন ক্লিক
    if (navToggle && sidebar) {
        navToggle.onclick = (e) => {
            e.stopPropagation();
            const isOpen = sidebar.style.left === '0px';
            toggleSidebar(!isOpen);
        };
    }

    // ডার্ক মোড / লাইট মোড টগল
    if (themeToggle) {
        // শুরুতে আগের থিম চেক করা
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
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

    // সাইডবারের বাইরে অথবা ওভারলেতে ক্লিক করলে বন্ধ হবে
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.style.left === '0px') {
            if (!sidebar.contains(e.target) && !navToggle?.contains(e.target)) {
                toggleSidebar(false);
            }
        }
    });
}
