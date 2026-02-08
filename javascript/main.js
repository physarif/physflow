// javascript/main.js
import { db, auth } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentFilter = 'latest';

/**
 * বাংলা সংখ্যায় রূপান্তর
 */
const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

/**
 * সময়ের ব্যবধান দেখানো (বাংলায়)
 */
const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'এইমাত্র';
    
    const now = new Date();
    const then = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) return 'এইমাত্র';
    if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${toBengaliNumber(mins)} মিনিট আগে`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${toBengaliNumber(hours)} ঘণ্টা আগে`;
    }
    if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${toBengaliNumber(days)} দিন আগে`;
    }
    const months = Math.floor(diffInSeconds / 2592000);
    return `${toBengaliNumber(months)} মাস আগে`;
};

/**
 * প্রশ্ন কার্ড রেন্ডার করা
 */
const renderQuestionCard = (question) => {
    const { id, title, body, tags, votes, answers, views, author, createdAt, isAnswered } = question;
    
    return `
        <div class="flex gap-4 px-6 py-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
            <!-- Stats Column -->
            <div class="hidden sm:flex flex-col gap-2 items-end text-[12px] min-w-[90px]">
                <div class="flex items-center gap-1.5 ${votes > 0 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500'}">
                    <i class="fas fa-arrow-up text-[10px]"></i>
                    <span class="font-medium">${toBengaliNumber(votes || 0)}</span>
                    <span class="text-gray-400">ভোট</span>
                </div>
                <div class="flex items-center gap-1.5 ${isAnswered ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded' : 'text-gray-500'}">
                    <i class="fas fa-check text-[10px]"></i>
                    <span class="font-medium">${toBengaliNumber(answers || 0)}</span>
                    <span class="text-gray-400">উত্তর</span>
                </div>
                <div class="flex items-center gap-1.5 text-gray-500">
                    <i class="fas fa-eye text-[10px]"></i>
                    <span>${toBengaliNumber(views || 0)}</span>
                </div>
            </div>

            <!-- Content Column -->
            <div class="flex-1 min-w-0">
                <a href="question-detail.html?id=${id}" class="block group">
                    <h3 class="text-[15px] font-normal text-brandBlue dark:text-blue-400 mb-2 group-hover:underline line-clamp-2">
                        ${title}
                    </h3>
                </a>
                
                <p class="text-[13px] text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    ${body ? body.substring(0, 150) + '...' : ''}
                </p>

                <div class="flex flex-wrap items-center gap-2 mb-2">
                    ${tags ? tags.map(tag => `
                        <a href="tags.html?tag=${tag}" class="bg-[#e1ecf4] dark:bg-[#3b4045] text-[#39739d] dark:text-[#8ab4f8] px-2 py-0.5 rounded text-[11px] hover:bg-[#d0e3f1] dark:hover:bg-[#4c5459] transition">
                            ${tag}
                        </a>
                    `).join('') : ''}
                </div>

                <div class="flex items-center justify-between text-[11px] text-gray-500">
                    <div class="flex items-center gap-2">
                        <img src="${author?.photoURL || 'https://via.placeholder.com/24'}" alt="${author?.name || 'ব্যবহারকারী'}" class="w-5 h-5 rounded-full">
                        <span class="font-medium">${author?.name || 'অজানা'}</span>
                    </div>
                    <span>${getTimeAgo(createdAt)}</span>
                </div>

                <!-- Mobile Stats -->
                <div class="flex sm:hidden gap-4 mt-3 text-[11px] text-gray-500">
                    <span><i class="fas fa-arrow-up"></i> ${toBengaliNumber(votes || 0)}</span>
                    <span><i class="fas fa-check"></i> ${toBengaliNumber(answers || 0)}</span>
                    <span><i class="fas fa-eye"></i> ${toBengaliNumber(views || 0)}</span>
                </div>
            </div>
        </div>
    `;
};

/**
 * প্রশ্ন লোড করা
 */
const loadQuestions = async (filter = 'latest') => {
    const container = document.getElementById('question-container');
    const totalQuestionsEl = document.getElementById('total-questions');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="py-24 text-center text-gray-400 text-xs italic">
            <i class="fas fa-spinner fa-spin text-xl mb-3 block"></i>
            প্রশ্ন লোড হচ্ছে...
        </div>
    `;

    try {
        let q;
        const questionsRef = collection(db, 'questions');

        switch(filter) {
            case 'featured':
                q = query(questionsRef, orderBy('votes', 'desc'), limit(20));
                break;
            case 'trending':
                // Last 7 days, sorted by views
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.setDate() - 7);
                q = query(
                    questionsRef, 
                    where('createdAt', '>=', Timestamp.fromDate(weekAgo)),
                    orderBy('createdAt', 'desc'),
                    orderBy('views', 'desc'),
                    limit(20)
                );
                break;
            default: // latest
                q = query(questionsRef, orderBy('createdAt', 'desc'), limit(20));
        }

        const querySnapshot = await getDocs(q);
        const questions = [];
        
        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });

        if (questions.length === 0) {
            container.innerHTML = `
                <div class="py-24 text-center">
                    <i class="fas fa-inbox text-4xl text-gray-300 dark:text-gray-700 mb-4"></i>
                    <p class="text-gray-500 text-sm">এখনো কোন প্রশ্ন নেই</p>
                    <a href="ask.html" class="inline-block mt-4 bg-brandBlue text-white px-4 py-2 rounded text-sm hover:bg-[#0074cc]">
                        প্রথম প্রশ্ন করুন
                    </a>
                </div>
            `;
        } else {
            container.innerHTML = questions.map(q => renderQuestionCard(q)).join('');
        }

        if (totalQuestionsEl) {
            totalQuestionsEl.textContent = toBengaliNumber(questions.length);
        }

    } catch (error) {
        console.error('Error loading questions:', error);
        container.innerHTML = `
            <div class="py-24 text-center text-red-500 text-sm">
                <i class="fas fa-exclamation-triangle text-2xl mb-3 block"></i>
                প্রশ্ন লোড করতে সমস্যা হয়েছে
                <br><br>
                <button onclick="location.reload()" class="bg-brandBlue text-white px-4 py-2 rounded text-xs hover:bg-[#0074cc]">
                    আবার চেষ্টা করুন
                </button>
            </div>
        `;
    }
};

/**
 * ফিল্টার বাটন সেটআপ
 */
const setupFilterButtons = () => {
    const buttons = {
        'btn-latest': 'latest',
        'btn-featured': 'featured',
        'btn-trending': 'trending'
    };

    Object.keys(buttons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        btn.addEventListener('click', () => {
            currentFilter = buttons[btnId];
            
            // Active state update
            Object.keys(buttons).forEach(id => {
                const b = document.getElementById(id);
                if (b) {
                    b.classList.remove('bg-[#fef7f0]', 'dark:bg-[#4d2c00]', 'text-brandOrange', 'font-bold');
                }
            });
            
            btn.classList.add('bg-[#fef7f0]', 'dark:bg-[#4d2c00]', 'text-brandOrange', 'font-bold');
            
            loadQuestions(currentFilter);
        });
    });
};

/**
 * স্ট্যাটিস্টিক্স লোড করা
 */
const loadStats = async () => {
    try {
        const questionsSnapshot = await getDocs(collection(db, 'questions'));
        const usersSnapshot = await getDocs(collection(db, 'users'));
        
        let totalAnswers = 0;
        questionsSnapshot.forEach(doc => {
            totalAnswers += doc.data().answers || 0;
        });

        const totalAnswersEl = document.getElementById('total-answers');
        const totalUsersEl = document.getElementById('total-users');
        
        if (totalAnswersEl) totalAnswersEl.textContent = toBengaliNumber(totalAnswers);
        if (totalUsersEl) totalUsersEl.textContent = toBengaliNumber(usersSnapshot.size);
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
};

/**
 * Initialize
 */
const init = () => {
    setupFilterButtons();
    loadQuestions(currentFilter);
    loadStats();
    
    console.log('Questions page initialized!');
};

// DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
