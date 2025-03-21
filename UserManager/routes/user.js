const express = require("express");
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/user");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// GET all users
router.get("/", authMiddleware, getUsers);

// GET user by ID
router.get("/:id", authMiddleware, getUserById);

// POST (Create user)
router.post("/", authMiddleware, createUser);

// PUT (Update user by ID)
router.put("/:id", authMiddleware, updateUser);

// DELETE (Delete user by ID)
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;