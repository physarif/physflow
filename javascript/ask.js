// javascript/ask.js
import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;

/**
 * ইউজার অথেন্টিকেশন চেক
 */
const checkAuth = () => {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        const form = document.getElementById('question-form');
        const loginRequired = document.getElementById('login-required');
        
        if (user) {
            form?.classList.remove('hidden');
            loginRequired?.classList.add('hidden');
        } else {
            form?.classList.add('hidden');
            loginRequired?.classList.remove('hidden');
        }
    });
};

/**
 * ট্যাগ সাজেশন ক্লিক হ্যান্ডলার
 */
const setupTagSuggestions = () => {
    const tagInput = document.getElementById('tags');
    const suggestions = document.querySelectorAll('.tag-suggestion');
    
    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.textContent.trim();
            const currentTags = tagInput.value.trim();
            
            if (currentTags) {
                const tagsArray = currentTags.split(',').map(t => t.trim());
                if (!tagsArray.includes(tag)) {
                    tagInput.value = currentTags + ', ' + tag;
                }
            } else {
                tagInput.value = tag;
            }
        });
    });
};

/**
 * ইনলাইন লগইন বাটন
 */
const setupInlineLogin = () => {
    const inlineLoginBtn = document.getElementById('login-btn-inline');
    const headerLoginBtn = document.getElementById('login-btn');
    
    inlineLoginBtn?.addEventListener('click', () => {
        headerLoginBtn?.click();
    });
};

/**
 * ফর্ম সাবমিশন
 */
const setupFormSubmit = () => {
    const form = document.getElementById('question-form');
    const submitBtn = document.getElementById('submit-btn');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            alert('প্রশ্ন পোস্ট করতে লগইন করুন');
            return;
        }
        
        const title = document.getElementById('title').value.trim();
        const body = document.getElementById('body').value.trim();
        const tagsInput = document.getElementById('tags').value.trim();
        
        // Validation
        if (!title || !body || !tagsInput) {
            alert('সব ক্ষেত্র পূরণ করুন');
            return;
        }
        
        if (title.length < 10) {
            alert('শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে');
            return;
        }
        
        if (body.length < 30) {
            alert('বর্ণনা কমপক্ষে ৩০ অক্ষরের হতে হবে');
            return;
        }
        
        // Process tags
        const tags = tagsInput
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0)
            .slice(0, 5); // Max 5 tags
        
        if (tags.length === 0) {
            alert('কমপক্ষে একটি ট্যাগ যোগ করুন');
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> পোস্ট হচ্ছে...';
        
        try {
            // Create question object
            const questionData = {
                title,
                body,
                tags,
                author: {
                    uid: currentUser.uid,
                    name: currentUser.displayName || 'অজানা',
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || ''
                },
                votes: 0,
                answers: 0,
                views: 0,
                isAnswered: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            
            // Add to Firestore
            const docRef = await addDoc(collection(db, 'questions'), questionData);
            
            console.log('Question posted with ID:', docRef.id);
            
            // Redirect to question detail page
            window.location.href = `question-detail.html?id=${docRef.id}`;
            
        } catch (error) {
            console.error('Error posting question:', error);
            alert('প্রশ্ন পোস্ট করতে সমস্যা হয়েছে: ' + error.message);
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'প্রশ্ন পোস্ট করুন';
        }
    });
};

/**
 * Initialize
 */
const init = () => {
    checkAuth();
    setupTagSuggestions();
    setupInlineLogin();
    setupFormSubmit();
    
    console.log('Ask page initialized!');
};

// DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
