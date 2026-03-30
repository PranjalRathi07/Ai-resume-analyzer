/** @format */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: { message: "Too many requests from this IP, please try again later." }
});

app.use(cors());
app.use(express.json());
app.use("/api", limiter);

// Serve uploaded files as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/content", contentRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// MongoDB connection
mongoose
	.connect(process.env.MONGO_URI || "mongodb://localhost:27017/resume_db")
	.then(() => console.log("✅ MongoDB Connected"))
	.catch((err) => console.error("❌ MongoDB Error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
