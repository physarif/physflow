import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function fetchQuestions() {
    const qList = document.getElementById('question-list');
    try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        qList.innerHTML = '';

        snapshot.forEach((doc) => {
            const d = doc.data();
            qList.innerHTML += `
                <div class="question-summary">
                    <div class="q-stats">
                        <div>0 ভোট</div>
                        <div style="color:var(--orange)">0 উত্তর</div>
                    </div>
                    <div class="q-summary-content">
                        <h3><a href="question.html?id=${doc.id}">${d.title}</a></h3>
                        <div class="q-tags">
                            ${d.tags.map(t => `<a href="#" class="tag">${t}</a>`).join('')}
                        </div>
                        <p style="font-size:12px; margin-top:8px; text-align:right">
                            ${d.authorName} - ${d.createdAt?.toDate().toLocaleDateString('bn-BD')}
                        </p>
                    </div>
                </div>`;
        });
    } catch (e) { qList.innerHTML = "লোড করতে ব্যর্থ!"; }
}
window.addEventListener('DOMContentLoaded', fetchQuestions);
