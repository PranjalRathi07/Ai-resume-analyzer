/** @format */

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}

		const user = await User.create({ name, email, password });
		const token = signToken(user._id);

		res.status(201).json({
			message: "Account created successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ message: "Server error. Please try again." });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const token = signToken(user._id);

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error. Please try again." });
	}
};
