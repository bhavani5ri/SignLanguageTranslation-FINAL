# Real-Time Sign Language Translation — Backend API

A production-ready Node.js/Express REST API backend for the Real-Time Sign Language Translation System. Handles user authentication, translation storage, and history retrieval with MongoDB.

---

## 📁 Project Structure

```
sign-language-backend/
├── config/
│   └── db.js                  # MongoDB connection
├── middleware/
│   ├── auth.js                # JWT protect middleware
│   └── errorHandler.js        # Global error + 404 handler
├── models/
│   ├── User.js                # User schema (bcrypt hashing)
│   └── Translation.js         # Translation schema
├── routes/
│   ├── userRoutes.js          # /register  /login  /me
│   └── translationRoutes.js   # /save-translation  /history
├── utils/
│   └── generateToken.js       # JWT signing helper
├── .env.example               # Environment variable template
├── .gitignore
├── package.json
└── server.js                  # Entry point
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Run the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:5000`.

---

## 🔑 Environment Variables

| Variable          | Description                                  | Example                        |
|-------------------|----------------------------------------------|--------------------------------|
| `PORT`            | Server port                                  | `5000`                         |
| `NODE_ENV`        | Environment                                  | `development` / `production`   |
| `MONGO_URI`       | MongoDB connection string                    | `mongodb+srv://...`            |
| `JWT_SECRET`      | Long random string for signing JWTs         | `s3cr3t_k3y_here`              |
| `JWT_EXPIRES_IN`  | Token expiry duration                        | `7d`                           |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:3000`        |

---

## 📡 API Reference

All endpoints support both flat paths (`/register`) and versioned paths (`/api/v1/register`).

### Health Check
```
GET /health
```
Returns server status and uptime info.

---

### User Routes

#### Register
```
POST /register
Content-Type: application/json

{
  "name":     "Jane Doe",
  "email":    "jane@example.com",
  "password": "secret123"
}
```
**Response 201:**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
  }
}
```

#### Login
```
POST /login
Content-Type: application/json

{
  "email":    "jane@example.com",
  "password": "secret123"
}
```
**Response 200:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": { "token": "<jwt>", "user": { ... } }
}
```

#### Get Current User Profile
```
GET /me
Authorization: Bearer <token>
```

---

### Translation Routes *(all require `Authorization: Bearer <token>`)*

#### Save Translation
```
POST /save-translation
Authorization: Bearer <token>
Content-Type: application/json

{
  "translatedText": "Hello, how are you?",
  "sourceLanguage": "ASL",      // optional: ASL | BSL | ISL | JSL | OTHER
  "confidence": 0.95            // optional: 0.0 – 1.0
}
```
**Response 201:**
```json
{
  "success": true,
  "message": "Translation saved successfully.",
  "data": { "translation": { "_id": "...", "translatedText": "...", "timestamp": "..." } }
}
```

#### Get History
```
GET /history?page=1&limit=20&lang=ASL
Authorization: Bearer <token>
```
**Query params:**
- `page` — page number (default: 1)
- `limit` — results per page (default: 20, max: 100)
- `lang` — filter by sign language (optional)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "translations": [ ... ],
    "pagination": {
      "total": 45, "page": 1, "limit": 20,
      "totalPages": 3, "hasNextPage": true, "hasPrevPage": false
    }
  }
}
```

#### Delete a Translation
```
DELETE /history/:id
Authorization: Bearer <token>
```

---

## 🔒 Security Features

- **bcryptjs** with salt factor 12 for password hashing
- **JWT** tokens (configurable expiry via `JWT_EXPIRES_IN`)
- **Rate limiting**: 200 req/15min globally; 20 req/15min on auth endpoints
- **Input validation** via `express-validator` on all endpoints
- **CORS** restricted to `ALLOWED_ORIGINS`
- Password field excluded from all DB query results by default
- Mongoose duplicate-key and validation errors handled gracefully

---

## ☁️ Free Deployment Options

### Render.com (Recommended)
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add environment variables in the Render dashboard
6. Use [MongoDB Atlas](https://mongodb.com/atlas) (free tier) for the database

### Railway
1. Connect your GitHub repo at [railway.app](https://railway.app)
2. Add a MongoDB plugin or use MongoDB Atlas
3. Set environment variables in the Railway dashboard

### Environment Variables for Production
```
NODE_ENV=production
MONGO_URI=<your_atlas_connection_string>
JWT_SECRET=<long_random_secret>
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## 🗄️ Database Collections

### users
| Field       | Type     | Notes                     |
|-------------|----------|---------------------------|
| `name`      | String   | 2–60 chars, required      |
| `email`     | String   | unique, lowercase         |
| `password`  | String   | bcrypt hashed, hidden     |
| `createdAt` | Date     | auto                      |
| `updatedAt` | Date     | auto                      |

### translations
| Field            | Type     | Notes                         |
|------------------|----------|-------------------------------|
| `userId`         | ObjectId | ref: User, indexed            |
| `translatedText` | String   | max 5000 chars                |
| `sourceLanguage` | String   | enum: ASL/BSL/ISL/JSL/OTHER   |
| `confidence`     | Number   | 0–1, optional                 |
| `timestamp`      | Date     | default: now, indexed         |

---

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Database**: MongoDB via Mongoose 8
- **Auth**: JWT + bcryptjs
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Logging**: morgan
