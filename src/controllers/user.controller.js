const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const login = async (req, res, next) => {
  try {
    console.log("Login data:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Hardcoded user
    const validUser = {
      email: "muralidharmishralawfirm@gmail.com",
      password: "password1234",
      id: "1",
    };

    if (email === validUser.email && password === validUser.password) {
      // Generate JWT token with expiration
      const token = jwt.sign(
        { email: validUser.email, id: validUser.id },
        process.env.JWT_SECRET,
       
      );

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
      });
    } else {
      console.log(`Failed login attempt: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

module.exports = {
  login,
};
