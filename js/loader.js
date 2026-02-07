async function loadComponent(elementId, filePath) {
    const response = await fetch(filePath);
    const content = await response.text();
    document.getElementById(elementId).innerHTML = content;
}

// পেজ লোড হলে সব কম্পোনেন্ট বসিয়ে দেবে
window.addEventListener('DOMContentLoaded', () => {
    loadComponent('main-header', 'components/header.html');
    loadComponent('main-footer', 'components/footer.html');
    // সাইডবার থাকলে সেটিও লোড করতে পারো
});
