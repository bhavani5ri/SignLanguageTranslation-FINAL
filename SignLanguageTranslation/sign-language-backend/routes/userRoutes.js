// routes/userRoutes.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Validation rule sets ──────────────────────────────────────────────────────
const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 60 }).withMessage("Name must be between 2 and 60 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// ── Helper: extract express-validator errors ──────────────────────────────────
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /register
// @desc    Register a new user
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.post("/register", registerValidation, async (req, res, next) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { name, email, password } = req.body;

    // Check if email already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with that email already exists.",
      });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /login
// @desc    Authenticate user and return JWT
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", loginValidation, async (req, res, next) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { email, password } = req.body;

    // Explicitly select password (excluded by default in schema)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /me
// @desc    Get current authenticated user's profile
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me", protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
