
import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Helper function to calculate time ago in Bengali
function getTimeAgo(timestamp) {
    if (!timestamp) return 'অজানা সময়';
    
    const now = new Date();
    const createdDate = timestamp.toDate();
    const diffInSeconds = Math.floor((now - createdDate) / 1000);
    
    if (diffInSeconds < 60) return 'এইমাত্র';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} মিনিট আগে`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ঘন্টা আগে`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} দিন আগে`;
    return createdDate.toLocaleDateString('bn-BD');
}

// Question card creation function
function createQuestionCard(question, docId) {
    const timeAgo = getTimeAgo(question.createdAt);
    const tags = question.tags || [];
    
    return `
        <div class="border border-lightBorder dark:border-darkBorder -mb-px bg-white dark:bg-darkCard p-4 flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
            
            <!-- Title -->
            <a href="question-details.html?id=${docId}" 
               class="text-brandBlue hover:text-brandBlueHover hover:underline text-lg font-semibold leading-tight inline-block">
                ${question.title}
            </a>
            
            <!-- Description -->
            <p class="text-sm text-textDark dark:text-gray-300 leading-relaxed line-clamp-2">
                ${question.description || 'কোনো বিবরণ নেই'}
            </p>
            
            <!-- Stats, Category, Tags, Time -->
            <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
                
                <!-- Left: Stats -->
                <div class="flex items-center gap-4">
                    <span class="text-xs font-medium text-textGray dark:text-gray-400">
                        <i class="fas fa-arrow-up"></i> ${question.upvotes || 0}
                    </span>
                    <span class="text-xs font-medium text-answerGreen border border-answerGreen px-1.5 py-0.5 rounded">
                        ${question.answers || 0} উত্তর
                    </span>
                    <span class="text-xs font-medium text-textGray dark:text-gray-400">
                        <i class="fas fa-eye"></i> ${question.views || 0}
                    </span>
                </div>
                
                <!-- Right: Category, Tags, Time -->
                <div class="flex items-center gap-2 flex-wrap">
                    <!-- Category -->
                    <span class="bg-brandBlue text-white px-2.5 py-1 rounded text-[11px] font-bold uppercase">
                        ${question.category || 'পদার্থবিজ্ঞান'}
                    </span>
                    
                    <!-- Tags -->
                    ${tags.map(tag => `
                        <span class="bg-tagBg dark:bg-[#2d2d2d] text-tagText dark:text-gray-300 px-2 py-1 rounded text-[11px] border border-transparent dark:border-darkBorder">
                            ${tag}
                        </span>
                    `).join('')}
                    
                    <!-- Time & Author -->
                    <span class="text-xs text-timeGray dark:text-gray-500">
                        ${timeAgo} • <span class="text-brandBlue dark:text-blue-400">${question.authorName || 'ইউজার'}</span>
                    </span>
                </div>
                
            </div>
        </div>
    `;
}

// ১. মেইন ফিড লোড করা
async function loadQuestions() {
    const questionFeed = document.getElementById('question-feed');
    const qStatus = document.getElementById('q-count-status');

    try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        questionFeed.innerHTML = ""; // লোডার সরিয়ে ফেলা
        qStatus.innerText = `${querySnapshot.size} টি নতুন প্রশ্ন পাওয়া গেছে`;

        if (querySnapshot.empty) {
            questionFeed.innerHTML = `
                <div class="p-10 text-center text-gray-400 dark:text-gray-600">
                    <i class="fas fa-inbox text-3xl mb-3 opacity-50"></i>
                    <p>কোনো প্রশ্ন পাওয়া যায়নি।</p>
                </div>
            `;
            return;
        }

        querySnapshot.forEach((doc) => {
            questionFeed.innerHTML += createQuestionCard(doc.data(), doc.id);
        });

    } catch (error) {
        console.error("Error loading questions: ", error);
        questionFeed.innerHTML = `
            <div class="p-10 text-center text-red-500 dark:text-red-400">
                <i class="fas fa-exclamation-triangle text-2xl mb-3"></i>
                <p>ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>
            </div>
        `;
    }
}

// ২. ফিচারড প্রশ্ন লোড করা (বাম কলামের জন্য)
async function loadFeaturedQuestions() {
    const featuredList = document.getElementById('featured-list');
    if (!featuredList) return; // Element না থাকলে return
    
    try {
        const q = query(collection(db, "questions"), limit(5)); 
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            featuredList.innerHTML = ""; // ডামি কন্টেন্ট ক্লিয়ার করা
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                featuredList.innerHTML += `
                    <div class="group border-b border-gray-100 dark:border-darkBorder pb-3 last:border-0 pt-2">
                        <a href="question-details.html?id=${doc.id}" 
                           class="text-[13px] text-gray-700 dark:text-gray-300 hover:text-brandOrange dark:hover:text-brandOrange leading-snug line-clamp-2 block transition-colors">
                            ${data.title}
                        </a>
                        <div class="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
                            <span><i class="fas fa-arrow-up text-[10px]"></i> ${data.upvotes || 0}</span>
                            <span><i class="fas fa-comment text-[10px]"></i> ${data.answers || 0}</span>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.log("Featured load error:", error);
    }
}

// ৩. পরিসংখ্যান আপডেট করা
async function loadStats() {
    try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const totalQElement = document.getElementById('total-q');
        const activeUsersElement = document.getElementById('active-users');
        
        if (totalQElement) totalQElement.innerText = querySnapshot.size;
        if (activeUsersElement) activeUsersElement.innerText = "১২"; // ডামি ইউজার সংখ্যা
    } catch (e) { 
        console.log("Stats load error:", e); 
    }
}

// পেজ লোড হলে সব কল হবে
window.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    loadFeaturedQuestions();
    loadStats();
});
