# ✋ SignBridge — How To Run

## Before You Start — Install These (one time only)

| Software | Download Link | What it does |
|----------|--------------|--------------|
| Node.js (LTS) | https://nodejs.org | Runs the backend server |
| VS Code | https://code.visualstudio.com | Code editor |

---

## Quick Start (3 Steps)

### Step 1 — Run SETUP.bat
Double-click `SETUP.bat`
- Checks Node.js is installed
- Installs VS Code extensions (Live Server, etc.)
- Installs all backend packages

### Step 2 — Set Your MongoDB URI
1. Go to https://mongodb.com/atlas → sign up free
2. Create a free cluster → click Connect → copy the URI
3. Open `sign-language-backend\.env`
4. Replace the MONGO_URI line with your actual URI:
```
MONGO_URI=mongodb+srv://yourname:yourpass@cluster0.xxxxx.mongodb.net/signlang_db
```

### Step 3 — Start the App
Double-click `START-ALL.bat`
- Opens backend server in a terminal window
- Opens frontend in your browser

---

## Folder Structure
```
SignLanguageTranslation/
│
├── SETUP.bat            ← Run this FIRST (installs everything)
├── START-ALL.bat        ← Run this to launch the whole app
├── START-BACKEND.bat    ← Starts only the backend server
├── START-FRONTEND.bat   ← Opens only the frontend
│
├── sign-language-backend/
│   ├── .env             ← PUT YOUR MONGO_URI HERE
│   ├── server.js
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
└── sign-language-frontend/
    ├── index.html       ← The website
    ├── css/style.css
    └── js/
        ├── api.js       ← Backend connection (API_BASE url)
        └── app.js
```

---

## URLs When Running
- Website:      Open sign-language-frontend/index.html
- Backend API:  http://localhost:5000
- Health Check: http://localhost:5000/health

---

## Troubleshooting

**"node is not recognized"** → Install Node.js from https://nodejs.org then restart VS Code

**"Cannot connect to MongoDB"** → Check your MONGO_URI in .env — make sure username/password are correct

**Website shows blank / CORS error** → Make sure backend is running first (START-BACKEND.bat), then open frontend
