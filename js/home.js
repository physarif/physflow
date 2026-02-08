import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ১. মেইন ফিড লোড করা
async function loadQuestions() {
    const questionFeed = document.getElementById('question-feed');
    const qStatus = document.getElementById('q-count-status');

    try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        questionFeed.innerHTML = ""; // লোডার সরিয়ে ফেলা
        qStatus.innerText = `${querySnapshot.size} টি নতুন প্রশ্ন পাওয়া গেছে`;

        if (querySnapshot.empty) {
            questionFeed.innerHTML = `<div class="p-10 text-center text-gray-400">কোনো প্রশ্ন পাওয়া যায়নি।</div>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt?.toDate().toLocaleDateString('bn-BD') || "অজানা সময়";

            questionFeed.innerHTML += `
                <div class="p-4 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-all border-b dark:border-darkBorder">
                    <div class="flex gap-4">
                        <div class="hidden sm:flex flex-col items-end text-xs text-gray-500 gap-2 w-16">
                            <span>০ ভোট</span>
                            <span class="border border-green-600 text-green-600 px-1 rounded">১ উত্তর</span>
                            <span>১২ ভিউ</span>
                        </div>
                        <div class="flex-grow">
                            <h3 class="text-blue-600 dark:text-[#58a6ff] text-lg font-medium hover:text-blue-800 transition-colors">
                                <a href="question-details.html?id=${doc.id}">${data.title}</a>
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">${data.description}</p>
                            <div class="flex justify-between items-center mt-3">
                                <div class="flex gap-2">
                                    <span class="bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-xs">${data.category || 'পদার্থবিজ্ঞান'}</span>
                                </div>
                                <div class="text-[11px] text-gray-500">
                                    ${date} • <span class="text-blue-500">${data.authorName || 'ইউজার'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading questions: ", error);
        questionFeed.innerHTML = `<div class="p-10 text-center text-red-500">ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</div>`;
    }
}

// ২. ফিচারড প্রশ্ন লোড করা (বাম কলামের জন্য)
async function loadFeaturedQuestions() {
    const featuredList = document.getElementById('featured-list');
    try {
        // এখানে আমরা বেশি ভিউ পাওয়া ৩টি প্রশ্ন লোড করছি
        const q = query(collection(db, "questions"), limit(3)); 
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            featuredList.innerHTML = ""; // ডামি কন্টেন্ট ক্লিয়ার করা
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                featuredList.innerHTML += `
                    <div class="group border-b border-gray-50 dark:border-darkBorder pb-3 last:border-0 pt-2">
                        <a href="question-details.html?id=${doc.id}" class="text-[13px] text-gray-700 dark:text-[#E0E0E0] hover:text-brandOrange leading-snug line-clamp-2 block transition-colors">
                            ${data.title}
                        </a>
                    </div>`;
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
        document.getElementById('total-q').innerText = querySnapshot.size;
        document.getElementById('active-users').innerText = "১২"; // ডামি ইউজার সংখ্যা
    } catch (e) { console.log(e); }
}

// পেজ লোড হলে সব কল হবে
window.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    loadFeaturedQuestions();
    loadStats();
});
