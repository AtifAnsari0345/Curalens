# CuraLens

CuraLens is an AI-powered Progressive Web App that digitizes medical prescriptions, extracts medicine details, and generates personalized safety insights using OCR and deep learning. The system helps users understand medicines, interactions, and usage precautions instantly.

---

## 🚀 Features
- Handwritten prescription digitization using OCR (Tesseract.js)
- Medicine extraction with deep learning–based text classification
- Personalized safety warnings and dosage insights
- Drug interaction checks
- Installable PWA with offline caching
- User profiles & saved prescriptions
- Secure backend with JWT authentication

---

## 🛠️ Tech Stack
**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js (Express)  
**Database:** MongoDB  
**AI / OCR:** Tesseract.js, Keras model  
**Other:** JWT Auth, REST APIs, PWA features

---

## ⚙️ Setup Instructions
```bash
git clone <repo-url>
cd curalens-frontend
npm install
npm start

cd curalens-backend
npm install
npm run dev
