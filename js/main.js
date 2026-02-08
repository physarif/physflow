import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function fetchQuestions() {
    const qListContainer = document.getElementById('question-list');
    
    try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        qListContainer.innerHTML = ''; // লোডিং টেক্সট সরিয়ে ফেলা

        if (querySnapshot.empty) {
            qListContainer.innerHTML = '<p style="padding:20px;">কোনো প্রশ্ন পাওয়া যায়নি।</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const qId = doc.id;
            const date = data.createdAt?.toDate().toLocaleDateString('bn-BD') || 'অজানা সময়';

            const questionHTML = `
                <div class="question-summary">
                    <div class="q-stats">
                        <div>0 ভোট</div>
                        <div style="border: 1px solid var(--orange); padding: 2px; color: var(--orange);">0 উত্তর</div>
                        <div>12 ভিউ</div>
                    </div>
                    <div class="q-summary-content">
                        <h3><a href="question.html?id=${qId}">${data.title}</a></h3>
                        <div class="q-tags">
                            ${data.tags.map(tag => `<a href="#" class="tag">${tag}</a>`).join('')}
                        </div>
                        <div style="font-size:12px; color:var(--text-light); margin-top:10px; text-align:right;">
                            — ${data.authorName} এ ${date} জিজ্ঞাসা করেছেন
                        </div>
                    </div>
                </div>
            `;
            qListContainer.innerHTML += questionHTML;
        });
    } catch (error) {
        console.error("Error fetching questions: ", error);
        qListContainer.innerHTML = '<p>প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>';
    }
}

// পেজ লোড হলে প্রশ্ন নিয়ে আসবে
window.addEventListener('DOMContentLoaded', fetchQuestions);
