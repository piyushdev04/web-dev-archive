const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = "your_secret_key";

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Save user with plain text password
        const user = new User({ name, email, password });
        await user.save();

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Direct password comparison
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id}, SECRET_KEY, { expiresIn: "1h"});

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};