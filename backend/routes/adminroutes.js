const express = require("express");
const User = require("../models/user");
const { protect, admin } = require("../middleware/authMiddleware"); // ✅ Fixed import case
const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/admin/users
// @desc Add a new user (admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" }); // ✅ Used HTTP 409 Conflict
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/users/:id
// @desc Update user info (name, email, role)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;

    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
