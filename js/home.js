import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- ১. এলিমেন্ট সিলেক্টর ---
const questionFeed = document.getElementById('question-feed');
const totalQElement = document.getElementById('total-q');

// --- ২. প্রশ্নগুলো লোড করার মেইন ফাংশন ---
async function fetchQuestions() {
    try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        
        // লোডার পরিষ্কার করা
        questionFeed.innerHTML = '';
        
        if (querySnapshot.empty) {
            questionFeed.innerHTML = `<p class="text-center py-10 text-gray-500">এখনো কোনো প্রশ্ন করা হয়নি।</p>`;
            return;
        }

        // পরিসংখ্যান আপডেট (মোট কয়টি প্রশ্ন আসলো)
        totalQElement.innerText = querySnapshot.size;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const qId = doc.id;
            renderQuestionCard(qId, data);
        });

    } catch (error) {
        console.error("Error fetching questions: ", error);
        questionFeed.innerHTML = `<p class="text-center py-10 text-red-500">ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>`;
    }
}

// --- ৩. প্রশ্নের কার্ড রেন্ডার করা (StackOverflow Style) ---
function renderQuestionCard(id, data) {
    const { title, content, tags, authorName, createdAt, votes = 0, answersCount = 0, views = 0 } = data;
    
    // সময় ফরম্যাট করা
    const date = createdAt?.toDate ? createdAt.toDate().toLocaleDateString('bn-BD') : "কিছুক্ষণ আগে";

    const cardHTML = `
        <div class="bg-white dark:bg-darkCard border-b border-gray-200 dark:border-[#444444] p-4 flex flex-col md:flex-row gap-4 hover:bg-gray-50 dark:hover:bg-[#2D2D3A] transition-all">
            
            <div class="flex flex-row md:flex-col items-center gap-3 md:gap-1 md:w-[80px] shrink-0 text-sm">
                <div class="flex flex-col items-center px-2 py-1 rounded">
                    <span class="font-bold text-gray-800 dark:text-[#E0E0E0]">${votes}</span>
                    <span class="text-[10px] text-gray-500 uppercase">ভোট</span>
                </div>
                <div class="flex flex-col items-center px-2 py-1 rounded border ${answersCount > 0 ? 'border-green-600 text-green-600' : 'text-gray-500'}">
                    <span class="font-bold">${answersCount}</span>
                    <span class="text-[10px] uppercase">উত্তর</span>
                </div>
                <div class="hidden md:flex flex-col items-center text-gray-400">
                    <span class="text-[11px]">${views} বার দেখা</span>
                </div>
            </div>

            <div class="flex-grow">
                <h3 class="text-lg font-medium text-[#0074cc] dark:text-[#58a6ff] hover:text-[#0a95ff] mb-1 leading-snug">
                    <a href="question-detail.html?id=${id}">${title}</a>
                </h3>
                
                <p class="text-sm text-gray-600 dark:text-[#B0B0B0] line-clamp-2 mb-3">
                    ${content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </p>

                <div class="flex flex-wrap justify-between items-center gap-3">
                    <div class="flex flex-wrap gap-1">
                        ${tags.map(tag => `
                            <a href="tags.html?tag=${tag}" class="px-2 py-1 bg-blue-50 dark:bg-[#2D2D3A] text-[#39739d] dark:text-[#58a6ff] text-[11px] rounded hover:bg-blue-100 transition-colors">
                                ${tag}
                            </a>
                        `).join('')}
                    </div>

                    <div class="flex items-center gap-2 text-[12px] text-gray-500 dark:text-[#888888]">
                        <span class="font-medium text-[#0074cc] dark:text-[#58a6ff]">${authorName}</span>
                        <span>প্রশ্ন করেছেন ${date}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    questionFeed.insertAdjacentHTML('beforeend', cardHTML);
}

// পেজ লোড হলে ফাংশনটি কল করা
window.addEventListener('DOMContentLoaded', fetchQuestions);
