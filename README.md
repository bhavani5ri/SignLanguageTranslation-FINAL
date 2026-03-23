✋ SignBridge – Real-Time Sign Language Translation System
Full Stack Web Development Project
A complete, production-ready Sign Language Translation System built with Node.js + Express + MongoDB backend and a AI-powered HTML/CSS/JS frontend using Google MediaPipe for real-time hand gesture detection.

✨ Features
FeatureDetails🎥 Live Camera DetectionReal-time hand gesture recognition via webcam🤖 AI Hand TrackingGoogle MediaPipe detects 21 hand landmark points🔤 Gesture to TextConverts hand signs to readable text instantly🔊 Text to SpeechReads translated text aloud using Web Speech API💾 Translation HistorySave, view and delete past translations🔐 Secure AuthJWT-based login/register with encrypted passwords🌍 Multi-LanguageSupports ASL, BSL, ISL, JSL sign languages📱 Responsive DesignWorks on desktop and mobile browsers

🛠️ Tech Stack
LayerTechnologyBackendNode.js, Express.jsDatabaseMongoDB Atlas (via Mongoose)AuthJWT + bcryptjsFrontendVanilla HTML, CSS, JavaScriptAI/MLGoogle MediaPipe HandsDesignDark theme, teal accents, CSS animations

📁 Project Structure
SignLanguageTranslation/
├── sign-language-backend/
│   ├── server.js              # Express server & API routes
│   ├── package.json
│   ├── .env                   # Environment variables
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Translation.js     # Translation schema
│   ├── routes/
│   │   ├── userRoutes.js      # Auth routes
│   │   └── translationRoutes.js # Translation routes
│   └── utils/
│       └── generateToken.js   # JWT token helper
│
└── sign-language-frontend/
    └── index.html             # Full app (HTML + CSS + JS + Camera)

⚡ Quick Start
1. Prerequisites

Node.js (v18+)
MongoDB Atlas account (free tier)
Webcam (for gesture detection)

2. Install Dependencies
bashcd sign-language-backend
npm install
3. Configure Environment
Edit .env file:
envPORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/signlang_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://127.0.0.1:5500
4. Start the Server
bash# Development (auto-reload)
npm run dev

# Production
npm start
```

### 5. Open Frontend
- Open `sign-language-frontend/index.html` with **VS Code Live Server**
- Browser opens at `http://127.0.0.1:5500/index.html`

### 6. Create Your First Account
- Click **"Get Started"** on the homepage
- Register with name, email, password
- Start translating! ✋

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

## 🎥 How Camera Works
```
Webcam → MediaPipe AI → 21 Hand Landmarks → 
Gesture Recognition → Text Output → Saved to MongoDB
Supported Gestures
GestureDetected As✋ Open handHello✊ FistYes👍 Thumbs upGood✌️ Peace signPeace👆 One fingerI want👌 OK signOK🤙 Call meCall me🤟 ILY signI Love You

🌐 URLs When Running
URLDescriptionhttp://127.0.0.1:5500/index.htmlFrontend websitehttp://localhost:5000/healthBackend health checkhttp://localhost:5000/registerRegister APIhttp://localhost:5000/historyHistory API

👤 Author
SignBridge — Real-Time Sign Language Translation System
Built as a real-world full stack project demonstrating:

Real-time AI/ML gesture recognition
RESTful API design
JWT authentication
MongoDB data modeling
Premium frontend design without frameworks

