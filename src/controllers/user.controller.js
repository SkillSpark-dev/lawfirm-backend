const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });

// Signup Controller
// Signup Controller
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ✅ Only allow one specific email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Signup disabled for this email" });
    }

    // ✅ Prevent multiple users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // ✅ Validate password length
    if (password.length < 8) {
      return res.status(400).json({ message: "Password too short" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

// Login Controller
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
           
        );

        return res.status(200).json({
            message: "User logged in successfully",
            token,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
};
