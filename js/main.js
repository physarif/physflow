import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, where, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// সময়কে 'এত সময় আগে' ফরম্যাটে দেখানোর ফাংশন
function timeAgo(timestamp) {
    if (!timestamp) return 'এইমাত্র';
    const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval.toLocaleString('bn-BD') + " বছর আগে";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval.toLocaleString('bn-BD') + " মাস আগে";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval.toLocaleString('bn-BD') + " দিন আগে";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval.toLocaleString('bn-BD') + " ঘণ্টা আগে";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval.toLocaleString('bn-BD') + " মিনিট আগে";
    return "এইমাত্র";
}

function loadQuestions() {
    const questionContainer = document.getElementById('question-container');
    const questionsRef = collection(db, "questions");
    
    // সর্বশেষ ১২টি অনুমোদিত প্রশ্ন লোড করার কুয়েরি
    const q = query(
        questionsRef, 
        where("status", "==", "approved"), 
        orderBy("createdAt", "desc"), 
        limit(12)
    );

    onSnapshot(q, (snapshot) => {
        let html = '';
        if (snapshot.empty) {
            questionContainer.innerHTML = '<p class="p-10 text-center text-gray-400 text-xs">কোনো প্রশ্ন পাওয়া যায়নি।</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const qId = doc.id;
            
            // তোমার নতুন ডিজাইনের কার্ড স্ট্রাকচার
            html += `
            <div class="bg-white dark:bg-[#1a1a1b] p-4 border border-gray-200 dark:border-gray-800 -mb-[1px] -mr-[1px]">
                <div class="flex justify-between mb-1.5 text-[11px] font-bold">
                    <div class="flex gap-3">
                        <span class="text-red-500">${(data.votes || 0).toLocaleString('bn-BD')} ভোট</span>
                        <span class="text-green-500">${(data.answerCount || 0).toLocaleString('bn-BD')} উত্তর</span>
                        <span class="text-blue-500 font-extrabold">${(data.views || 0).toLocaleString('bn-BD')} ভিউ</span>
                    </div>
                    <span class="text-gray-400 font-normal">${timeAgo(data.createdAt)}</span>
                </div>
                <h3 class="line-clamp-2 mb-0">
                    <a href="question.html?id=${qId}" class="question-title-link text-[#0a95ff] font-semibold hover:underline">
                        ${data.title}
                    </a>
                </h3>
                <p class="text-xs text-gray-500 line-clamp-2 mb-3 mt-1">
                    ${data.description?.replace(/<[^>]*>/g, '').substring(0, 150) || ''}...
                </p>
                <div class="flex flex-wrap items-center gap-y-2 gap-x-1 text-[10px]">
                    <span class="bg-[#e1f0ff] dark:bg-blue-900/30 text-[#0078d4] dark:text-blue-400 px-2 py-0.5 rounded border border-[#0a95ff]/20 font-bold mr-1">
                        ${data.category || 'সাধারণ'}
                    </span>
                    ${(data.tags || []).map(t => 
                        `<span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">#${t}</span>`
                    ).join('')}
                </div>
            </div>`;
        });
        questionContainer.innerHTML = html;
    });
}

// পেজ লোড হলে ফাংশনটি রান হবে
window.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
});
