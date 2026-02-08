import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, where, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// তোমার কনফিগ (Firebase Config)
const firebaseConfig = {
    apiKey: "AIzaSyCyGf_NQLsckjUQH1FwbUP1DKZvzpbrYHo",
    authDomain: "phyflow-devs.firebaseapp.com",
    projectId: "phyflow-devs",
    storageBucket: "phyflow-devs.firebasestorage.app",
    messagingSenderId: "34351515593",
    appId: "1:34351515593:web:ca06f69f07ace936b7ca18",
    measurementId: "G-E00E61978Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// সময় নির্ধারণের ফাংশন (বাংলায়)
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

// মূল প্রশ্ন লোড করার ফাংশন
function loadQuestions() {
    const questionContainer = document.getElementById('question-container');
    const questionsRef = collection(db, "questions");
    
    // ট্রেন্ডিং কুয়েরি: অনুমোদিত পোস্ট এবং ভিউ অনুযায়ী সর্ট
    const q = query(
        questionsRef, 
        where("status", "==", "approved"), 
        orderBy("createdAt", "desc"),
        limit(12)
    );

    onSnapshot(q, (snapshot) => {
        let html = '';
        if (snapshot.empty) { 
            questionContainer.innerHTML = '<p class="col-span-full p-10 text-center text-gray-400 text-xs">কোনো প্রশ্ন পাওয়া যায়নি।</p>'; 
            return; 
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // ডেসক্রিপশন থেকে কোড বাদ দিয়ে শুধু টেক্সট বের করা
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data.description || "";
            const codes = tempDiv.querySelectorAll("pre, code");
            codes.forEach(code => code.remove());
            const cleanText = tempDiv.innerText || tempDiv.textContent;

            // গ্রিড আইটেম রেন্ডারিং (Tailwind Only)
            html += `
            <div class="p-5 border-r border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1b] flex flex-col gap-2">
                <div class="flex items-center justify-between text-[11px] font-medium">
                    <div class="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <span class="text-red-500">${(data.votes || 0).toLocaleString('bn-BD')} ভোট</span>
                        <span class="px-1.5 py-0.5 border border-green-600 text-green-600 rounded-sm font-bold">${(data.answerCount || 0).toLocaleString('bn-BD')} উত্তর</span>
                        <span class="text-[#0a95ff] font-extrabold">${(data.views || 0).toLocaleString('bn-BD')} ভিউ</span>
                    </div>
                    <span class="text-gray-400 font-normal">${timeAgo(data.createdAt)}</span>
                </div>

                <h3 class="text-[17px] leading-snug w-fit">
                    <a href="question.html?id=${doc.id}" class="text-[#0a95ff] font-normal hover:underline hover:text-[#005999] transition-all">
                        ${data.title}
                    </a>
                </h3>

                <p class="text-[13px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    ${cleanText}
                </p>

                <div class="mt-auto pt-3 flex flex-wrap items-center gap-2">
                    <a href="categories.html?id=${encodeURIComponent(data.category || 'general')}" 
                       class="bg-[#e1f0ff] dark:bg-blue-900/30 text-[#0078d4] dark:text-blue-400 px-2.5 py-1 rounded-sm text-[10px] border border-[#0a95ff]/20 font-bold uppercase tracking-wide">
                        ${data.category || 'সাধারণ'}
                    </a>
                    <div class="flex gap-1.5">
                        ${(data.tags || []).slice(0, 3).map(tag => `
                            <span class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-sm text-[10px] border border-gray-200 dark:border-gray-700">
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>`;
        });
        questionContainer.innerHTML = html;
    });
}

// ফিচারড লিস্ট লোড করা
function loadFeaturedList() {
    const popularContainer = document.getElementById('popular-questions-container');
    const qFeat = query(collection(db, "questions"), where("featured", "==", true), orderBy("createdAt", "desc"), limit(8));

    onSnapshot(qFeat, (snapshot) => {
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `
            <div class="flex items-start gap-2 group">
                <span class="text-gray-400 text-lg leading-none mt-1">•</span>
                <a href="question.html?id=${doc.id}" class="text-sm text-gray-700 dark:text-gray-300 hover:text-[#0a95ff] hover:underline transition-all">
                    ${data.title}
                </a>
            </div>`;
        });
        popularContainer.innerHTML = html + '</div>';
    });
}

// স্ট্যাটাস আপডেট (টোটাল প্রশ্ন ও উত্তর)
async function updateStats() {
    onSnapshot(query(collection(db, "questions"), where("status", "==", "approved")), (snap) => { 
        document.getElementById('total-questions').innerText = snap.size.toLocaleString('bn-BD'); 
    });
    onSnapshot(collection(db, "answers"), (snap) => { 
        document.getElementById('total-answers').innerText = snap.size.toLocaleString('bn-BD'); 
    });
}

// সব ফাংশন কল করা
updateStats();
loadQuestions();
loadFeaturedList();

// ফিল্টার বাটন হ্যান্ডলিং
document.getElementById('btn-latest').onclick = () => { /* তোমার লজিক */ };
document.getElementById('btn-featured').onclick = () => { /* তোমার লজিক */ };