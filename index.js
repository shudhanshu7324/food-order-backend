import express from "express";
import dotenv from "dotenv";
import initializeDatabaseConnection from "./db.js"; // Renamed for uniqueness
import userRoutes from "./routes/authentication/user.js";
import dealRoutes from "./routes/authentication/deals.js";
import addressRoutes from "./routes/address/address.js";
import bodyParser from "body-parser";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Renamed for uniqueness

// CORS configuration
const corsSettings = {
  origin: "*", // Frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Permitted headers
};

// Connect to the database
initializeDatabaseConnection()

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsSettings));

// Route handlers
app.use("/api/user", userRoutes);
app.use("/api/deals", dealRoutes);
app.use("/", addressRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
