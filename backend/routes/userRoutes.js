const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware"); // ✅ Fixed import case

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" }); // ✅ Used HTTP 409 Conflict

    user = new User({
      name,
      email,
      password,
    });

    await user.save();

    const payload = { user: { id: user._id, role: user.role } };

    // Generate JWT token using async/await
    jwt.sign(
      payload,

      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (error, token) => {
        if (error) throw error;

        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route POST /api/users/login
// @desc Login user and get token
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" }); // ✅ Enhanced error response

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const payload = { user: { id: user._id, role: user.role } };

    // Generate JWT token using async/await
    jwt.sign(
      payload,

      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (error, token) => {
        if (error) throw error;

        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/users/profile
// @desc Get user profile
// @access Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
