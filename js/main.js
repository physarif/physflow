import { db } from './firebase-config.js';
import { collection, query, where, orderBy, onSnapshot, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// সময় দেখানোর ফাংশন
function timeAgo(date) {
    if(!date) return "এইমাত্র";
    const seconds = Math.floor((new Date() - date.toDate()) / 1000);
    if (seconds < 60) return "এইমাত্র";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes.toLocaleString('bn-BD') + " মিনিট আগে";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours.toLocaleString('bn-BD') + " ঘণ্টা আগে";
    return date.toDate().toLocaleDateString('bn-BD');
}

function loadFeed() {
    const container = document.getElementById('question-container');
    const q = query(collection(db, "questions"), where("status", "==", "approved"), orderBy("createdAt", "desc"), limit(20));

    onSnapshot(q, (snapshot) => {
        container.innerHTML = '';
        if (snapshot.empty) {
            container.innerHTML = '<p class="loading-text">কোনো প্রশ্ন পাওয়া যায়নি।</p>';
            return;
        }

        snapshot.forEach(doc => {
            const d = doc.data();
            container.innerHTML += `
                <div class="q-card">
                    <div class="flex justify-between text-[11px] mb-2">
                        <div class="flex gap-2">
                            <span class="text-red-500">${(d.votes || 0).toLocaleString('bn-BD')} ভোট</span>
                            <span class="text-green-600">${(d.answerCount || 0).toLocaleString('bn-BD')} উত্তর</span>
                        </div>
                        <span class="text-gray-400">${timeAgo(d.createdAt)}</span>
                    </div>
                    <h3><a href="question.html?id=${doc.id}" class="q-card-title">${d.title}</a></h3>
                    <div class="mt-3 flex flex-wrap gap-1">
                        ${d.tags.map(t => `<span class="tag-style">#${t}</span>`).join('')}
                    </div>
                </div>`;
        });
    });
}

window.addEventListener('DOMContentLoaded', loadFeed);
