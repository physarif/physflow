import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, where, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
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

// Global Variables
let unsubscribeQuestions = null;
let currentFilter = 'trending';

/**
 * HTML Escape Function (XSS Protection)
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * সময় নির্ধারণের ফাংশন (বাংলায়)
 */
function timeAgo(timestamp) {
    if (!timestamp) return 'এইমাত্র';
    
    try {
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
    } catch (error) {
        console.error('Time conversion error:', error);
        return 'এইমাত্র';
    }
}

/**
 * Clean Description (Remove Code Blocks)
 */
function getCleanDescription(description) {
    if (!description) return '';
    
    try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = description;
        const codes = tempDiv.querySelectorAll("pre, code");
        codes.forEach(code => code.remove());
        return (tempDiv.innerText || tempDiv.textContent).trim();
    } catch (error) {
        console.error('Description cleaning error:', error);
        return '';
    }
}

/**
 * Update Active Filter Button
 */
function updateActiveButton(activeId) {
    const buttons = ['btn-latest', 'btn-featured', 'btn-trending'];
    
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        
        if (id === activeId) {
            btn.classList.add('bg-[#fef7f0]', 'dark:bg-[#4d2c00]', 'text-brandOrange', 'font-bold');
            btn.classList.remove('hover:bg-gray-50', 'dark:hover:bg-gray-700');
        } else {
            btn.classList.remove('bg-[#fef7f0]', 'dark:bg-[#4d2c00]', 'text-brandOrange', 'font-bold');
            btn.classList.add('hover:bg-gray-50', 'dark:hover:bg-gray-700');
        }
    });
}

/**
 * মূল প্রশ্ন লোড করার ফাংশন (উন্নত)
 */
function loadQuestions(filterType = 'trending') {
    const questionContainer = document.getElementById('question-container');
    if (!questionContainer) return;
    
    // Show Loading State
    questionContainer.innerHTML = `
        <div class="py-24 text-center text-gray-400 text-xs italic">
            <i class="fas fa-spinner fa-spin text-xl mb-3 block"></i>
            ফিজিক্সের তথ্যসমূহ লোড হচ্ছে...
        </div>
    `;
    
    // Unsubscribe previous listener (Memory Leak Prevention)
    if (unsubscribeQuestions) {
        unsubscribeQuestions();
    }
    
    const questionsRef = collection(db, "questions");
    let q;
    
    // Build Query Based on Filter Type
    try {
        if (filterType === 'latest') {
            q = query(
                questionsRef, 
                where("status", "==", "approved"), 
                orderBy("createdAt", "desc"),
                limit(12)
            );
        } else if (filterType === 'featured') {
            q = query(
                questionsRef, 
                where("status", "==", "approved"),
                where("featured", "==", true),
                orderBy("createdAt", "desc"),
                limit(12)
            );
        } else { // trending (default)
            q = query(
                questionsRef, 
                where("status", "==", "approved"), 
                orderBy("views", "desc"),
                limit(12)
            );
        }
    } catch (error) {
        console.error('Query building error:', error);
        questionContainer.innerHTML = `
            <div class="p-10 text-center text-red-500 text-sm">
                <i class="fas fa-exclamation-triangle mb-2 text-xl block"></i>
                <p>ডাটাবেস কুয়েরি তৈরিতে সমস্যা হয়েছে।</p>
            </div>
        `;
        return;
    }

    // Subscribe to Realtime Updates
    unsubscribeQuestions = onSnapshot(q, (snapshot) => {
        try {
            if (snapshot.empty) { 
                questionContainer.innerHTML = `
                    <div class="p-10 text-center text-gray-400 text-xs">
                        <i class="fas fa-inbox text-3xl mb-3 block opacity-50"></i>
                        <p>কোনো প্রশ্ন পাওয়া যায়নি।</p>
                    </div>
                `; 
                return; 
            }

            let html = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const cleanDescription = getCleanDescription(data.description);
                
                // Render Grid Item (with XSS Protection)
                html += `
                <div class="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1b] flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <div class="flex items-center justify-between text-[11px] font-medium">
                        <div class="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                            <span class="text-red-500">
                                <i class="fas fa-arrow-up text-[9px]"></i> 
                                ${(data.votes || 0).toLocaleString('bn-BD')} ভোট
                            </span>
                            <span class="px-1.5 py-0.5 border ${data.answerCount > 0 ? 'border-green-600 text-green-600' : 'border-gray-400 text-gray-400'} rounded-sm font-bold">
                                ${(data.answerCount || 0).toLocaleString('bn-BD')} উত্তর
                            </span>
                            <span class="text-[#0a95ff] font-extrabold">
                                <i class="fas fa-eye text-[9px]"></i> 
                                ${(data.views || 0).toLocaleString('bn-BD')}
                            </span>
                        </div>
                        <span class="text-gray-400 font-normal">${timeAgo(data.createdAt)}</span>
                    </div>

                    <h3 class="text-[17px] leading-snug">
                        <a href="question.html?id=${doc.id}" class="text-[#0a95ff] font-normal hover:underline hover:text-[#005999] transition-all">
                            ${escapeHtml(data.title || 'শিরোনাম নেই')}
                        </a>
                    </h3>

                    <p class="text-[13px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        ${escapeHtml(cleanDescription || 'বিবরণ নেই')}
                    </p>

                    <div class="mt-auto pt-3 flex flex-wrap items-center gap-2">
                        ${data.category ? `
                        <a href="categories.html?id=${encodeURIComponent(data.category)}" 
                           class="bg-[#e1f0ff] dark:bg-blue-900/30 text-[#0078d4] dark:text-blue-400 px-2.5 py-1 rounded-sm text-[10px] border border-[#0a95ff]/20 font-bold uppercase tracking-wide hover:bg-[#d0e7ff] transition-colors">
                            ${escapeHtml(data.category)}
                        </a>
                        ` : ''}
                        
                        <div class="flex gap-1.5">
                            ${(data.tags || []).slice(0, 3).map(tag => `
                                <span class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-sm text-[10px] border border-gray-200 dark:border-gray-700">
                                    ${escapeHtml(tag)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
            });
            
            questionContainer.innerHTML = html;
            
        } catch (error) {
            console.error('Error rendering questions:', error);
            questionContainer.innerHTML = `
                <div class="p-10 text-center text-red-500 text-sm">
                    <i class="fas fa-exclamation-triangle mb-2 text-xl block"></i>
                    <p>প্রশ্ন প্রদর্শনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।</p>
                </div>
            `;
        }
    }, (error) => {
        console.error('Snapshot error:', error);
        questionContainer.innerHTML = `
            <div class="p-10 text-center text-red-500 text-sm">
                <i class="fas fa-exclamation-triangle mb-2 text-xl block"></i>
                <p>ডাটাবেস সংযোগে সমস্যা হয়েছে। ইন্টারনেট চেক করুন।</p>
            </div>
        `;
    });
}

/**
 * ফিচারড লিস্ট লোড করা (Optional - যদি এই container থাকে)
 */
function loadFeaturedList() {
    const popularContainer = document.getElementById('popular-questions-container');
    if (!popularContainer) return; // Element না থাকলে skip করো
    
    const qFeat = query(
        collection(db, "questions"), 
        where("featured", "==", true), 
        orderBy("createdAt", "desc"), 
        limit(8)
    );

    onSnapshot(qFeat, (snapshot) => {
        try {
            let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                html += `
                <div class="flex items-start gap-2 group">
                    <span class="text-gray-400 text-lg leading-none mt-1">•</span>
                    <a href="question.html?id=${doc.id}" class="text-sm text-gray-700 dark:text-gray-300 hover:text-[#0a95ff] hover:underline transition-all">
                        ${escapeHtml(data.title || 'শিরোনাম নেই')}
                    </a>
                </div>`;
            });
            
            popularContainer.innerHTML = html + '</div>';
        } catch (error) {
            console.error('Featured list error:', error);
        }
    }, (error) => {
        console.error('Featured snapshot error:', error);
    });
}

/**
 * স্ট্যাটাস আপডেট (টোটাল প্রশ্ন ও উত্তর)
 */
function updateStats() {
    // Total Questions Count
    const totalQuestionsEl = document.getElementById('total-questions');
    if (totalQuestionsEl) {
        onSnapshot(
            query(collection(db, "questions"), where("status", "==", "approved")), 
            (snap) => { 
                totalQuestionsEl.innerText = snap.size.toLocaleString('bn-BD'); 
            },
            (error) => {
                console.error('Questions count error:', error);
                totalQuestionsEl.innerText = '০';
            }
        );
    }
    
    // Total Answers Count
    const totalAnswersEl = document.getElementById('total-answers');
    if (totalAnswersEl) {
        onSnapshot(
            collection(db, "answers"), 
            (snap) => { 
                totalAnswersEl.innerText = snap.size.toLocaleString('bn-BD'); 
            },
            (error) => {
                console.error('Answers count error:', error);
                totalAnswersEl.innerText = '০';
            }
        );
    }
}

/**
 * ফিল্টার বাটন হ্যান্ডলিং
 */
function setupFilterButtons() {
    const btnLatest = document.getElementById('btn-latest');
    const btnFeatured = document.getElementById('btn-featured');
    const btnTrending = document.getElementById('btn-trending');
    
    if (btnLatest) {
        btnLatest.onclick = () => {
            currentFilter = 'latest';
            loadQuestions('latest');
            updateActiveButton('btn-latest');
        };
    }
    
    if (btnFeatured) {
        btnFeatured.onclick = () => {
            currentFilter = 'featured';
            loadQuestions('featured');
            updateActiveButton('btn-featured');
        };
    }
    
    if (btnTrending) {
        btnTrending.onclick = () => {
            currentFilter = 'trending';
            loadQuestions('trending');
            updateActiveButton('btn-trending');
        };
    }
}

/**
 * Initialize Everything
 */
function init() {
    try {
        updateStats();
        loadQuestions(currentFilter);
        loadFeaturedList(); // Optional
        setupFilterButtons();
        updateActiveButton('btn-trending'); // Set initial active button
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Run on page load
init();

/**
 * Cleanup on page unload (Optional but good practice)
 */
window.addEventListener('beforeunload', () => {
    if (unsubscribeQuestions) {
        unsubscribeQuestions();
    }
});
