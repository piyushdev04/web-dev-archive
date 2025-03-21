const User = require("../models/user");

// GET all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// GET user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found"});
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// CREATE user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPDATE user by ID
exports.updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password },
            { new: true, runValidators: true}
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// DELETE user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};