// javascript/question-detail.js
import { db, auth } from './firebase-config.js';
import { 
    doc, 
    getDoc, 
    collection, 
    query, 
    orderBy, 
    getDocs, 
    addDoc, 
    updateDoc,
    increment,
    serverTimestamp,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;
let currentQuestionId = null;
let currentQuestionData = null;

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
 * URL থেকে Question ID বের করা
 */
const getQuestionIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

/**
 * প্রশ্ন লোড করা
 */
const loadQuestion = async (questionId) => {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const questionContent = document.getElementById('question-content');

    try {
        const questionRef = doc(db, 'questions', questionId);
        const questionSnap = await getDoc(questionRef);

        if (!questionSnap.exists()) {
            loadingState.classList.add('hidden');
            errorState.classList.remove('hidden');
            return;
        }

        currentQuestionData = { id: questionSnap.id, ...questionSnap.data() };
        
        // Update views count
        await updateDoc(questionRef, {
            views: increment(1)
        });
        
        currentQuestionData.views = (currentQuestionData.views || 0) + 1;

        renderQuestion(currentQuestionData);
        
        loadingState.classList.add('hidden');
        questionContent.classList.remove('hidden');

        // Load answers
        loadAnswers(questionId);
        
        // Load related questions
        loadRelatedQuestions(currentQuestionData.tags);

    } catch (error) {
        console.error('Error loading question:', error);
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
    }
};

/**
 * প্রশ্ন রেন্ডার করা
 */
const renderQuestion = (question) => {
    const { title, body, tags, votes, views, author, createdAt } = question;

    // Title
    document.getElementById('question-title').textContent = title;
    document.title = title + ' - PhysFlow';

    // Metadata
    document.getElementById('question-created').textContent = getTimeAgo(createdAt);
    document.getElementById('question-views').textContent = toBengaliNumber(views || 0) + ' বার';

    // Body
    document.getElementById('question-body').innerHTML = body.replace(/\n/g, '<br>');

    // Tags
    const tagsContainer = document.getElementById('question-tags');
    tagsContainer.innerHTML = tags.map(tag => `
        <a href="tags.html?tag=${tag}" class="bg-[#e1ecf4] dark:bg-[#3b4045] text-[#39739d] dark:text-[#8ab4f8] px-2.5 py-1 rounded text-[11px] hover:bg-[#d0e3f1] dark:hover:bg-[#4c5459] transition">
            ${tag}
        </a>
    `).join('');

    // Vote count
    document.getElementById('vote-count').textContent = toBengaliNumber(votes || 0);

    // Author info
    document.getElementById('author-photo').src = author?.photoURL || 'https://via.placeholder.com/32';
    document.getElementById('author-name').textContent = author?.name || 'অজানা';
    document.getElementById('asked-time').textContent = getTimeAgo(createdAt);

    // Stats sidebar
    document.getElementById('stats-created').textContent = getTimeAgo(createdAt);
    document.getElementById('stats-views').textContent = toBengaliNumber(views || 0);
    document.getElementById('stats-votes').textContent = toBengaliNumber(votes || 0);
};

/**
 * উত্তর লোড করা
 */
const loadAnswers = async (questionId) => {
    const answersList = document.getElementById('answers-list');
    const noAnswers = document.getElementById('no-answers');
    const answerCount = document.getElementById('answer-count');

    try {
        const answersRef = collection(db, 'questions', questionId, 'answers');
        const q = query(answersRef, orderBy('votes', 'desc'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const answers = [];
        querySnapshot.forEach((doc) => {
            answers.push({ id: doc.id, ...doc.data() });
        });

        answerCount.textContent = toBengaliNumber(answers.length);

        if (answers.length === 0) {
            answersList.innerHTML = '';
            noAnswers.classList.remove('hidden');
        } else {
            noAnswers.classList.add('hidden');
            answersList.innerHTML = answers.map(answer => renderAnswer(answer)).join('');
        }

    } catch (error) {
        console.error('Error loading answers:', error);
    }
};

/**
 * উত্তর রেন্ডার করা
 */
const renderAnswer = (answer) => {
    const { id, body, author, votes, isAccepted, createdAt } = answer;
    
    return `
        <div class="flex gap-4 border-b dark:border-gray-800 pb-6 ${isAccepted ? 'bg-green-50/30 dark:bg-green-900/10 -mx-6 px-6 py-4' : ''}">
            <!-- Vote Column -->
            <div class="flex flex-col items-center gap-2 min-w-[40px]">
                <button class="answer-upvote w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:border-brandOrange hover:bg-orange-50 dark:hover:bg-orange-900/20 transition" data-answer-id="${id}">
                    <i class="fas fa-chevron-up text-xs text-gray-400"></i>
                </button>
                
                <div class="text-lg font-bold text-gray-700 dark:text-gray-300">${toBengaliNumber(votes || 0)}</div>
                
                <button class="answer-downvote w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition" data-answer-id="${id}">
                    <i class="fas fa-chevron-down text-xs text-gray-400"></i>
                </button>

                ${isAccepted ? `
                    <i class="fas fa-check-circle text-2xl text-green-600 dark:text-green-400 mt-2" title="গৃহীত উত্তর"></i>
                ` : ''}
            </div>

            <!-- Content Column -->
            <div class="flex-1 min-w-0">
                <div class="prose dark:prose-invert max-w-none text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    ${body.replace(/\n/g, '<br>')}
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex gap-3 text-[11px] text-gray-500">
                        <button class="hover:text-brandBlue">শেয়ার করুন</button>
                        <button class="hover:text-brandBlue">এডিট করুন</button>
                    </div>

                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 text-right">
                        <div class="text-[9px] text-gray-500 mb-1">উত্তর দিয়েছেন ${getTimeAgo(createdAt)}</div>
                        <div class="flex items-center gap-2 justify-end">
                            <div class="text-right">
                                <div class="text-xs font-medium text-brandBlue">${author?.name || 'অজানা'}</div>
                            </div>
                            <img src="${author?.photoURL || 'https://via.placeholder.com/24'}" alt="${author?.name}" class="w-6 h-6 rounded-full">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * সম্পর্কিত প্রশ্ন লোড করা
 */
const loadRelatedQuestions = async (tags) => {
    const relatedContainer = document.getElementById('related-questions');
    
    if (!tags || tags.length === 0) {
        relatedContainer.innerHTML = '<div class="text-xs text-gray-400 text-center py-4">কোন সম্পর্কিত প্রশ্ন নেই</div>';
        return;
    }

    try {
        const questionsRef = collection(db, 'questions');
        const q = query(
            questionsRef,
            where('tags', 'array-contains-any', tags.slice(0, 3)),
            orderBy('votes', 'desc'),
            limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const questions = [];
        
        querySnapshot.forEach((doc) => {
            if (doc.id !== currentQuestionId) {
                questions.push({ id: doc.id, ...doc.data() });
            }
        });

        if (questions.length === 0) {
            relatedContainer.innerHTML = '<div class="text-xs text-gray-400 text-center py-4">কোন সম্পর্কিত প্রশ্ন নেই</div>';
        } else {
            relatedContainer.innerHTML = questions.map(q => `
                <a href="question-detail.html?id=${q.id}" class="block p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition border dark:border-gray-800">
                    <div class="text-xs text-brandBlue dark:text-blue-400 line-clamp-2 mb-2">${q.title}</div>
                    <div class="flex gap-2 text-[10px] text-gray-500">
                        <span>${toBengaliNumber(q.votes || 0)} ভোট</span>
                        <span>${toBengaliNumber(q.answers || 0)} উত্তর</span>
                    </div>
                </a>
            `).join('');
        }

    } catch (error) {
        console.error('Error loading related questions:', error);
        relatedContainer.innerHTML = '<div class="text-xs text-red-400 text-center py-4">লোড করতে সমস্যা</div>';
    }
};

/**
 * ভোট সিস্টেম
 */
const setupVoting = () => {
    const upvoteBtn = document.getElementById('upvote-btn');
    const downvoteBtn = document.getElementById('downvote-btn');

    upvoteBtn?.addEventListener('click', async () => {
        if (!currentUser) {
            alert('ভোট দিতে লগইন করুন');
            return;
        }

        try {
            const questionRef = doc(db, 'questions', currentQuestionId);
            await updateDoc(questionRef, {
                votes: increment(1)
            });
            
            // Update UI
            const currentVotes = parseInt(document.getElementById('vote-count').textContent) || 0;
            document.getElementById('vote-count').textContent = toBengaliNumber(currentVotes + 1);
            
        } catch (error) {
            console.error('Error upvoting:', error);
            alert('ভোট দিতে সমস্যা হয়েছে');
        }
    });

    downvoteBtn?.addEventListener('click', async () => {
        if (!currentUser) {
            alert('ভোট দিতে লগইন করুন');
            return;
        }

        try {
            const questionRef = doc(db, 'questions', currentQuestionId);
            await updateDoc(questionRef, {
                votes: increment(-1)
            });
            
            // Update UI
            const currentVotes = parseInt(document.getElementById('vote-count').textContent) || 0;
            document.getElementById('vote-count').textContent = toBengaliNumber(currentVotes - 1);
            
        } catch (error) {
            console.error('Error downvoting:', error);
            alert('ভোট দিতে সমস্যা হয়েছে');
        }
    });
};

/**
 * উত্তর ফর্ম সেটআপ
 */
const setupAnswerForm = () => {
    const answerForm = document.getElementById('answer-form');
    const loginRequired = document.getElementById('answer-login-required');
    const loginBtn = document.getElementById('answer-login-btn');
    const submitBtn = document.getElementById('submit-answer-btn');

    // Auth check
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        
        if (user) {
            answerForm?.classList.remove('hidden');
            loginRequired?.classList.add('hidden');
        } else {
            answerForm?.classList.add('hidden');
            loginRequired?.classList.remove('hidden');
        }
    });

    // Login button
    loginBtn?.addEventListener('click', () => {
        document.getElementById('login-btn')?.click();
    });

    // Form submission
    answerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('উত্তর দিতে লগইন করুন');
            return;
        }

        const body = document.getElementById('answer-body').value.trim();

        if (!body || body.length < 30) {
            alert('উত্তর কমপক্ষে ৩০ অক্ষরের হতে হবে');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> পোস্ট হচ্ছে...';

        try {
            const answerData = {
                body,
                author: {
                    uid: currentUser.uid,
                    name: currentUser.displayName || 'অজানা',
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || ''
                },
                votes: 0,
                isAccepted: false,
                createdAt: serverTimestamp()
            };

            // Add answer to subcollection
            await addDoc(collection(db, 'questions', currentQuestionId, 'answers'), answerData);

            // Update question's answer count
            const questionRef = doc(db, 'questions', currentQuestionId);
            await updateDoc(questionRef, {
                answers: increment(1),
                updatedAt: serverTimestamp()
            });

            // Clear form
            document.getElementById('answer-body').value = '';
            
            // Reload answers
            loadAnswers(currentQuestionId);

            alert('উত্তর সফলভাবে পোস্ট হয়েছে!');

        } catch (error) {
            console.error('Error posting answer:', error);
            alert('উত্তর পোস্ট করতে সমস্যা হয়েছে: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'উত্তর পোস্ট করুন';
        }
    });
};

/**
 * Initialize
 */
const init = () => {
    currentQuestionId = getQuestionIdFromURL();

    if (!currentQuestionId) {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
        return;
    }

    loadQuestion(currentQuestionId);
    setupVoting();
    setupAnswerForm();

    console.log('Question detail page initialized!');
};

// DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
