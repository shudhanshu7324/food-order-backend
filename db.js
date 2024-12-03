import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const databaseUri = process.env.MONGO_URI; // Renamed for uniqueness

// Function to establish a database connection
const initializeDatabaseConnection = async () => {
  try {
    await mongoose.connect(databaseUri, {
      useNewUrlParser: true, // Option for a stable connection (optional)
      useUnifiedTopology: true, // Option for modern connection handling (optional)
    });
    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message); // Used `console.error` for errors
    process.exit(1); // Exit the process with a failure code
  }
};

export default initializeDatabaseConnection;
