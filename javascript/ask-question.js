import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const askForm = document.getElementById('ask-question-form');
let currentUser = null;

// লগইন চেক করা
onAuthStateChanged(auth, (user) => {
    currentUser = user;
});

if (askForm) {
    askForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("প্রশ্ন করতে হলে আগে লগইন করুন!");
            return;
        }

        const title = document.getElementById('q-title').value;
        const desc = document.getElementById('q-desc').value;
        const tagsInput = document.getElementById('q-tags').value;
        const tags = tagsInput.split(',').map(tag => tag.trim());

        try {
            await addDoc(collection(db, "questions"), {
                title: title,
                description: desc,
                tags: tags,
                uid: currentUser.uid,
                author: currentUser.displayName,
                createdAt: serverTimestamp()
            });

            alert("প্রশ্নটি সফলভাবে পোস্ট করা হয়েছে!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        }
    });
}
