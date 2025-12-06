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

## 📷 Screenshots
<img width="1915" height="909" alt="Screenshot 2025-11-01 112442" src="https://github.com/user-attachments/assets/a60a5e02-e2c6-44d7-bb24-10a194b91754" />
<img width="1657" height="909" alt="Screenshot 2025-12-01 182047" src="https://github.com/user-attachments/assets/2992e4b0-bba0-4efb-ad98-c19e1e9502bf" />
<img width="1896" height="913" alt="Screenshot 2025-12-01 182138" src="https://github.com/user-attachments/assets/cdf7117b-633b-4fd7-b1cc-5c90a5fe1599" />
<img width="1900" height="913" alt="Screenshot 2025-12-01 182924" src="https://github.com/user-attachments/assets/68468319-f9e9-454b-8b3e-5735d48f8d28" />
<img width="1904" height="902" alt="Screenshot 2025-12-01 183008" src="https://github.com/user-attachments/assets/4a3ea59f-c3e4-431e-84bb-4176c97fb836" />

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
