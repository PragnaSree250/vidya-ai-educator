<div align="center">
  
# 🎓 Vidya: The AI Educator
**An Adaptive, Personalized AI Learning Platform**

[![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_1.5_Flash-orange?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)

</div>

---

## 🚀 The Vision

Traditional e-learning platforms rely on static, one-size-fits-all pre-recorded videos. This leads to massive dropout rates because static content cannot adapt to a student's individual pacing, knowledge level, or time constraints.

**Vidya solves this.** Vidya acts as a 1-on-1 private tutor available 24/7. It uses the power of Google Gemini AI to dynamically generate structured, personalized lessons on the fly based on your exact learning objectives. 

---

## ✨ Key Features

### 📄 Intelligent Material Ingestion
Upload any textbook, slide deck (PPTX), or lecture notes (PDF/DOCX). Vidya extracts the core concepts and builds a curriculum tailored directly to your course material.

### 🧠 Dynamic Lesson Generation
No two lessons are the same. Vidya creates a step-by-step lesson plan customized to your specified time budget:
- **5 Minutes:** A rapid, concise crash course.
- **20 Minutes:** A standard, structured lesson.
- **60 Minutes:** A deep dive with extensive examples.

### 👩‍🏫 Personalized AI Teacher Avatars
Choose your teacher persona. Whether you want a teacher who uses the Socratic method (asking you questions), simple analogies, or strict exam preparation, Vidya adapts. Includes realistic video avatars for an immersive learning environment.

### 📝 Adaptive Assessments & Automatic Notes
At the end of a lesson, Vidya tests your understanding. It doesn't just grade multiple choice; it uses AI to analyze your free-text answers, detect specific misconceptions, and provide targeted feedback. Vidya also automatically extracts the core concepts you just learned and generates beautiful study notes and interactive flashcards.

### 🌍 Multi-Lingual Support
Learn in English, Hindi, or Spanish. The platform adapts the curriculum language instantly, breaking down language barriers in education.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express (Native HTTP)
- **Database:** SQLite (via `better-sqlite3`)
- **Artificial Intelligence:** Google Gemini 1.5 Flash API (`@google/genai`)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Deployment:** Render

---

## ⚙️ Setup & Testing

The fastest way to experience Vidya is via the [Live Demo](https://vidya-ai-educator.onrender.com/). 

If you are a judge or developer who wishes to deploy a private instance of this repository, it is incredibly simple. This project is optimized for deployment on **Render** as a Web Service.

### Deployment Instructions

1. **Fork/Clone** this GitHub repository.
2. Connect your repository to **Render** and create a new **Web Service**.
3. Set the **Build Command** to: `npm install; npm run build`
4. Set the **Start Command** to: `npm run start`
5. Navigate to the **Environment** tab in your Render dashboard and add your keys securely:
   - `GEMINI_API_KEY` = `(Your Google Gemini API Key)`
   - `JWT_SECRET` = `(Any random text for encryption)`
6. Click **Deploy**. Render will automatically inject the keys and spin up your private educational platform!

---

### 🌐 Access the Platform
- **Live Demo:** [https://vidya-ai-educator.onrender.com/](https://vidya-ai-educator.onrender.com/)

---

<div align="center">
  <i>Built for the future of education.</i>
</div>
