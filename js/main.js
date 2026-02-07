// js/main.js
import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const questionFeed = document.getElementById('question-feed');

// Firestore থেকে প্রশ্নগুলো লোড করার ফাংশন
async function loadQuestions() {
    if (!questionFeed) return;

    try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        // হেডার অংশ
        let html = `
            <div class="d-flex justify-between align-center mb-16">
                <h2>শীর্ষ প্রশ্নসমূহ</h2>
                <a href="ask.html" class="s-btn s-btn__primary">Ask Question</a>
            </div>
            <hr>
        `;
        
        if (querySnapshot.empty) {
            html += `<p style="padding: 20px 0; color: var(--text-light); text-align: center;">এখনো কোনো প্রশ্ন করা হয়নি। প্রথম প্রশ্নটি তুমিই করো!</p>`;
            questionFeed.innerHTML = html;
            return;
        }

        // কার্ডগুলো তৈরি করা
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt?.toDate().toLocaleDateString('bn-BD') || "অজানা সময়";

            html += `
                <div class="q-card">
                    <div class="q-stats">
                        <div class="stat-item"><span>0</span> votes</div>
                        <div class="stat-item"><span>0</span> answers</div>
                    </div>
                    <div class="q-content">
                        <h3><a href="question-details.html?id=${doc.id}">${data.title}</a></h3>
                        <p class="q-excerpt">${data.description ? data.description.substring(0, 150) + '...' : ''}</p>
                        <div class="q-footer">
                            <div class="q-tags">
                                ${data.tags ? data.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                            </div>
                            <div class="q-user-info">
                               Asked on ${date}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        questionFeed.innerHTML = html;
    } catch (error) {
        console.error("Error loading questions: ", error);
        questionFeed.innerHTML = "<p>প্রশ্নগুলো লোড করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করো।</p>";
    }
}

// পেজ লোড হলে ফাংশনটি রান করবে
document.addEventListener('DOMContentLoaded', loadQuestions);
