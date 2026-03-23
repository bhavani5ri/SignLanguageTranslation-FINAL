# ✋ SignBridge – Real-Time Sign Language Translation System
**Future Interns | Full Stack Web Development – Task 2**

A complete, production-ready Sign Language Translation System built with **Node.js + Express + MongoDB** backend and a beautiful **dark-mode HTML/CSS/JS** frontend powered by **Google MediaPipe AI** for real-time hand gesture detection.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎥 Live Camera Detection | Real-time hand gesture recognition via webcam |
| 🤖 AI Hand Tracking | Google MediaPipe detects 21 hand landmark points |
| 🔤 Gesture to Text | Converts hand signs to readable text instantly |
| 🔊 Text to Speech | Reads translated text aloud using Web Speech API |
| 💾 Translation History | Save, view and delete past translations |
| 🔐 Secure Admin Auth | JWT-based login/register, protected API routes |
| 🌍 Multi-Language Support | Supports ASL, BSL, ISL, JSL sign languages |
| 📱 Responsive Design | Works on desktop and mobile browsers |

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (via Mongoose)
- **Auth**: JWT + bcryptjs
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **AI/ML**: Google MediaPipe Hands
- **Design**: Dark theme, teal accents, CSS animations

---

## 📁 Project Structure
```
SignLanguageTranslation/
├── sign-language-backend/
│   ├── server.js                  # Express server & all API routes
│   ├── package.json
│   ├── .env                       # Environment variables
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                # JWT auth middleware
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Translation.js         # Translation schema
│   ├── routes/
│   │   ├── userRoutes.js          # Auth routes
│   │   └── translationRoutes.js   # Translation routes
│   └── utils/
│       └── generateToken.js       # JWT token helper
│
└── sign-language-frontend/
    └── index.html                 # Full app (HTML + CSS + JS + Camera)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free tier)
- Webcam (for gesture detection)

### 2. Install Dependencies
```bash
cd sign-language-backend
npm install
```

### 3. Configure Environment
Edit `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/signlang_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://127.0.0.1:5500
```

### 4. Start the Server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

### 5. Open in Browser

| URL | Description |
|-----|-------------|
| `http://127.0.0.1:5500/index.html` | Frontend website |
| `http://localhost:5000/health` | Backend health check |

### 6. Create Your First Account
- Click **"Get Started"** on the homepage
- Register with name, email, password
- Click **▶ Start Camera** → allow access
- Show your hand → gestures detected! ✋

---

## 🎥 How Camera Works
```
Webcam → MediaPipe AI → 21 Hand Landmarks →
Gesture Recognition → Text Output → Saved to MongoDB
```

### Supported Gestures

| Gesture | Detected As |
|---------|------------|
| ✋ Open hand | Hello |
| ✊ Fist | Yes |
| 👍 Thumbs up | Good |
| ✌️ Peace sign | Peace |
| 👆 One finger | I want |
| 👌 OK sign | OK |
| 🤙 Call me | Call me |
| 🤟 ILY sign | I Love You |

---

## 🔌 API Reference

All translation endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Create account |
| POST | `/login` | ❌ | Login, get JWT token |
| GET | `/me` | ✅ | Get current user profile |
| POST | `/save-translation` | ✅ | Save a translation |
| GET | `/history` | ✅ | Get translation history |
| DELETE | `/history/:id` | ✅ | Delete a translation |

---

## 📸 Screenshots

**Home Page**
- Animated hero section with live hand detection demo
- Stats: Sign Languages, Real-Time Processing, AI Engine

**Translation Console**
- Live webcam feed with hand landmark overlay
- Gesture reference guide
- Auto-fill text output

**History Page**
- All saved translations with timestamps
- Filter by language
- Delete individual translations

---

## 👤 Author
**Future Interns – Full Stack Web Development Task 2**

Built as a real-world Sign Language Translation System demonstrating:
- Real-time AI/ML gesture recognition
- RESTful API design
- JWT authentication
- MongoDB data modeling
- Premium frontend design without frameworks

---

## 🌍 Impact
> Bridging the communication gap for **70 million deaf people worldwide** using just a laptop and webcam — no special hardware required.
