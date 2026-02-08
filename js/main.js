import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();
const feed = document.getElementById('question-feed');

// Real-time listener for questions
const q = query(collection(db, "questions"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    let html = "";
    
    snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Tags generation logic
        let tagsHtml = `<span class="category-badge">${data.category || 'General'}</span>`;
        if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach(tag => {
                tagsHtml += `<span class="hash-badge">#${tag}</span>`;
            });
        }

        html += `
            <div class="question-card">
                <div class="card-meta">
                    <div class="metrics">
                        <span class="vote-count">০ ভোট</span>
                        <span class="ans-count">০ উত্তর</span>
                        <span class="view-count">০ দেখা</span>
                    </div>
                    <span class="time-ago">১৫ ঘণ্টা আগে</span>
                </div>
                <a href="post.html?id=${doc.id}" class="q-link">${data.title}</a>
                <p class="q-excerpt">${data.description ? data.description.substring(0, 120) : ''}...</p>
                <div class="tag-list">
                    ${tagsHtml}
                </div>
            </div>
        `;
    });

    feed.innerHTML = html;
    document.getElementById('total-q').innerText = snapshot.size;
});
