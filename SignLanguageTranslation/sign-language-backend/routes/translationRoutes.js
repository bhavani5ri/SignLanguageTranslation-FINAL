// routes/translationRoutes.js
const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Translation = require("../models/Translation");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All translation routes require authentication
router.use(protect);

// ── Validation helper ─────────────────────────────────────────────────────────
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
// @route   POST /save-translation
// @desc    Save a new sign-language translation for the authenticated user
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  "/save-translation",
  [
    body("translatedText")
      .trim()
      .notEmpty().withMessage("Translated text is required")
      .isLength({ max: 5000 }).withMessage("Translated text cannot exceed 5000 characters"),

    body("sourceLanguage")
      .optional()
      .isIn(["ASL", "BSL", "ISL", "JSL", "OTHER"])
      .withMessage("sourceLanguage must be one of: ASL, BSL, ISL, JSL, OTHER"),

    body("confidence")
      .optional()
      .isFloat({ min: 0, max: 1 }).withMessage("Confidence must be a number between 0 and 1"),
  ],
  async (req, res, next) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    try {
      const { translatedText, sourceLanguage, confidence } = req.body;

      const translation = await Translation.create({
        userId: req.user._id,
        translatedText,
        sourceLanguage: sourceLanguage || "ASL",
        confidence: confidence ?? null,
      });

      res.status(201).json({
        success: true,
        message: "Translation saved successfully.",
        data: { translation },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /history
// @desc    Get paginated translation history for the authenticated user
// @access  Private
//
// Query params:
//   page    (default 1)
//   limit   (default 20, max 100)
//   lang    filter by sourceLanguage (optional)
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  "/history",
  [
    query("page")
      .optional()
      .isInt({ min: 1 }).withMessage("page must be a positive integer"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),

    query("lang")
      .optional()
      .isIn(["ASL", "BSL", "ISL", "JSL", "OTHER"])
      .withMessage("lang must be one of: ASL, BSL, ISL, JSL, OTHER"),
  ],
  async (req, res, next) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    try {
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip  = (page - 1) * limit;

      // Build filter
      const filter = { userId: req.user._id };
      if (req.query.lang) filter.sourceLanguage = req.query.lang;

      const [translations, total] = await Promise.all([
        Translation.find(filter)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .select("-__v"),
        Translation.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: {
          translations,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /history/:id
// @desc    Delete a specific translation (must belong to the user)
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/history/:id", async (req, res, next) => {
  try {
    const translation = await Translation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: "Translation not found or you do not have permission to delete it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Translation deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
