import { db } from './firebase-config.js';
import { collection, query, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addEventListener('componentsLoaded', () => {
    console.log("Header and Footer are ready. Loading home data...");
    loadLatestQuestions();
});

function loadLatestQuestions() {
    const feed = document.getElementById('question-feed');
    // ফায়ারবেস থেকে ডাটা আনার লজিক এখানে হবে
    // আপাতত একটি স্যাম্পল আউটপুট:
    feed.innerHTML = '<div class="q-item">নতুন প্রশ্নগুলো শীঘ্রই আসছে...</div>';
}
