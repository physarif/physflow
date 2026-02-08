# PhysFlow - পদার্থবিজ্ঞানের প্রশ্নোত্তর কেন্দ্র

একটি সম্পূর্ণ বাংলা Q&A প্ল্যাটফর্ম যা StackOverflow-এর মতো তৈরি করা হয়েছে পদার্থবিজ্ঞানের শিক্ষার্থীদের জন্য।

## ✨ Features

- 🔐 Google Authentication
- 📝 প্রশ্ন করা এবং উত্তর দেওয়া
- 🏷️ ট্যাগ-ভিত্তিক সংগঠন
- 👍 আপভোট/ডাউনভোট সিস্টেম
- 🌙 ডার্ক মোড সাপোর্ট
- 📱 সম্পূর্ণ রেস্পন্সিভ ডিজাইন
- 🔍 সার্চ ফিচার
- 📊 রিয়েল-টাইম ডেটা

## 🛠️ Tech Stack

- **Frontend**: HTML, TailwindCSS, Vanilla JavaScript (ES6 Modules)
- **Backend**: Firebase (Firestore, Authentication, Analytics)
- **Icons**: Font Awesome 6
- **Language**: বাংলা

## 📁 File Structure

```
physflow/
├── index.html              # প্রশ্ন তালিকা পেজ
├── ask.html                # নতুন প্রশ্ন করার পেজ
├── layout.html             # রিইউজেবল লেআউট (ভবিষ্যতে ব্যবহারের জন্য)
├── question-detail.html    # (আসছে)
├── tags.html               # (আসছে)
├── users.html              # (আসছে)
└── javascript/
    ├── firebase-config.js  # Firebase সেটআপ
    ├── layout.js           # Header, Footer, Auth
    ├── main.js             # প্রশ্ন লোড এবং ফিল্টার
    └── ask.js              # প্রশ্ন সাবমিট করা
```

## 🚀 Setup Instructions

### 1. Firebase Setup

1. Firebase Console এ যান: https://console.firebase.google.com
2. নতুন প্রজেক্ট তৈরি করুন (ইতিমধ্যে আছে: `physflow-qna`)
3. Authentication সেটআপ করুন:
   - Authentication > Sign-in method
   - Google Provider enable করুন

4. Firestore Database তৈরি করুন:
   - Firestore Database > Create Database
   - Start in **test mode** (পরে production rules যোগ করবেন)

### 2. Firestore Collections

আপনার Firestore-এ নিচের collections তৈরি করুন:

#### **questions** Collection:
```javascript
{
  title: String,           // প্রশ্নের শিরোনাম
  body: String,            // প্রশ্নের বিস্তারিত
  tags: Array<String>,     // ট্যাগ তালিকা
  author: {
    uid: String,
    name: String,
    email: String,
    photoURL: String
  },
  votes: Number,           // ভোট সংখ্যা
  answers: Number,         // উত্তর সংখ্যা
  views: Number,           // দেখা হয়েছে
  isAnswered: Boolean,     // উত্তর পাওয়া গেছে কিনা
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### **answers** Collection (ভবিষ্যতে):
```javascript
{
  questionId: String,
  body: String,
  author: Object,
  votes: Number,
  isAccepted: Boolean,
  createdAt: Timestamp
}
```

#### **users** Collection (ভবিষ্যতে):
```javascript
{
  uid: String,
  name: String,
  email: String,
  photoURL: String,
  reputation: Number,
  questionsAsked: Number,
  answersGiven: Number,
  joinedAt: Timestamp
}
```

### 3. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Questions collection
    match /questions/{questionId} {
      allow read: if true;  // সবাই পড়তে পারবে
      allow create: if request.auth != null;  // শুধু logged-in users
      allow update, delete: if request.auth != null && 
                              request.auth.uid == resource.data.author.uid;
    }
    
    // Answers collection
    match /answers/{answerId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              request.auth.uid == resource.data.author.uid;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Local Development

1. ফাইলগুলো একটি ফোল্ডারে রাখুন
2. Live Server দিয়ে চালান (VS Code Extension) অথবা:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```
3. Browser এ খুলুন: `http://localhost:8000`

### 5. Deployment (Optional)

#### Firebase Hosting:
```bash
# Firebase CLI install
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

## 🎨 Customization

### থিম পরিবর্তন:
`tailwind.config` সেকশনে colors পরিবর্তন করুন:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brandOrange: '#f48225',  // আপনার পছন্দের রঙ
        brandBlue: '#0a95ff'
      }
    }
  }
}
```

### বাংলা ফন্ট যোগ করতে:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  body { font-family: 'Noto Sans Bengali', sans-serif; }
</style>
```

## 📊 Database Structure Example

### Sample Question Document:
```javascript
{
  id: "abc123",
  title: "নিউটনের দ্বিতীয় সূত্র কীভাবে প্রয়োগ করব?",
  body: "আমি একটি সমস্যায় আটকে আছি যেখানে...",
  tags: ["নিউটনীয়-বলবিদ্যা", "গতিবিদ্যা"],
  author: {
    uid: "user123",
    name: "রহিম উদ্দিন",
    email: "rahim@example.com",
    photoURL: "https://..."
  },
  votes: 5,
  answers: 3,
  views: 127,
  isAnswered: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🐛 Common Issues

### CORS Error:
- নিশ্চিত করুন আপনি live server ব্যবহার করছেন (file:// protocol নয়)

### Firebase Auth Error:
- Firebase Console-এ authorized domains যোগ করুন
- localhost এবং আপনার deployment domain

### Module Import Error:
- নিশ্চিত করুন সব `<script>` ট্যাগে `type="module"` আছে

## 📝 TODO

- [ ] Question Detail Page
- [ ] Answer submission
- [ ] Voting system
- [ ] Comment functionality
- [ ] User profile page
- [ ] Tags page
- [ ] Search functionality
- [ ] Notification system
- [ ] Reputation system
- [ ] Badge system

## 🤝 Contributing

আপনার যদি কোন সাজেশন থাকে বা bug খুঁজে পান, অনুগ্রহ করে জানান!

## 📄 License

MIT License - আপনি স্বাধীনভাবে ব্যবহার করতে পারবেন।

## 👨‍💻 Author

তৈরি করেছেন বাংলাদেশী পদার্থবিজ্ঞানীদের জন্য ❤️

---

**সাফল্য কামনা করছি! 🚀**
