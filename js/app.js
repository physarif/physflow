// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const mobileSidebar = document.getElementById('mobile-sidebar');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 1. Mobile Sidebar Toggle
if (navToggle && mobileSidebar) {
    navToggle.addEventListener('click', () => {
        mobileSidebar.classList.toggle('active');
        
        // আইকন পরিবর্তন (Bars থেকে Times/Close)
        const icon = navToggle.querySelector('i');
        if (mobileSidebar.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
}

// 2. Theme Toggle (Light/Dark Mode)
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // আইকন পরিবর্তন
        const themeIcon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });
}

// 3. Load Saved Theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        const themeIcon = themeToggle.querySelector('i');
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

// 4. Close Sidebar when clicking outside (Mobile)
document.addEventListener('click', (e) => {
    if (mobileSidebar && mobileSidebar.classList.contains('active')) {
        if (!mobileSidebar.contains(e.target) && !navToggle.contains(e.target)) {
            mobileSidebar.classList.remove('active');
            navToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    }
});
