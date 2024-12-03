import express from "express";
import dotenv from "dotenv";
import UserModel from "../../schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const authRouter = express.Router();

// User registration endpoint
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if all fields are provided
    if (!email || !password || !phone || !name) {
      return res.status(400).json({ message: "All fields are mandatory." });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new UserModel({ name, email, phone, password: hashedPassword });
    await newUser.save();

    // Generate a token for the user
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: "User created successfully", token, id: newUser._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

// User login endpoint
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user or password" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a token for the user
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: "Login successful", token, id: user._id, name: user.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

// Middleware for token authentication
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user; // Attach user info to the request
    next(); // Continue to the next middleware or route
  });
};

// Update user details endpoint
authRouter.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { id } = req.user; // Get the user ID from the token

    // Validate that there are fields to update
    if (!name && !email && !phone) {
      return res.status(400).json({ message: "Please provide at least one field to update." });
    }

    // Prepare data for update
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;

    // Update the user in the database
    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

// Fetch user profile endpoint
authRouter.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    const userProfile = await UserModel.findById(userId).select("-password"); // Exclude password from the result

    if (!userProfile) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});

export default authRouter;
