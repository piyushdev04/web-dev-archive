const express = require("express");
const connectDB = require("./connection");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const app = express();
connectDB();

app.use(express.static("public"));

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});