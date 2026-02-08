// Sample questions data for rendering
const questions = [
    {
        title: "How to integrate Firebase with a custom loader in JS?",
        excerpt: "I am trying to load my header and footer using a loader.js file while also initializing Firebase...",
        votes: 5,
        answers: 2,
        views: 100,
        tags: ["javascript", "firebase", "html"]
    },
    {
        title: "Center a div using Flexbox in Stack Overflow style",
        excerpt: "I want my main container to be centered like the original site layout...",
        votes: 12,
        answers: 4,
        views: 450,
        tags: ["css", "flexbox", "layout"]
    }
];

function renderQuestions() {
    const questionsList = document.getElementById('questions-list');
    
    questionsList.innerHTML = questions.map(q => `
        <div class="question-summary">
            <div class="stats">
                <div class="stats-item votes">${q.votes} votes</div>
                <div class="stats-item answers">${q.answers} answers</div>
                <div class="stats-item">${q.views} views</div>
            </div>
            <div class="question-content">
                <h3>${q.title}</h3>
                <div class="question-excerpt">${q.excerpt}</div>
                <div class="tags">
                    ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
});
