// server.js  —  Entry point for Sign Language Translation Backend
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const morgan   = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB              = require("./config/db");
const userRoutes             = require("./routes/userRoutes");
const translationRoutes      = require("./routes/translationRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin '${origin}' not allowed.`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter limit for auth endpoints
  message: { success: false, message: "Too many authentication attempts. Please try again in 15 minutes." },
});

app.use(globalLimiter);

// ── Body parsing & logging ────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    service: "Sign Language Translation API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});
// ✅ Public root route (ADD THIS)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", authLimiter, userRoutes);         // /api/v1/register  /api/v1/login
app.use("/api/v1", translationRoutes);               // /api/v1/save-translation  /api/v1/history

// Backwards-compatible flat routes (as specified in requirements)
app.use("/",       authLimiter, userRoutes);         // /register  /login
app.use("/",       translationRoutes);               // /save-translation  /history

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀  Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`🩺  Health check: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

module.exports = app; // for testing
