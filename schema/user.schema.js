import mongoose from "mongoose";

// Schema to define user details
const userDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // User name is mandatory
  },
  email: {
    type: String,
    required: true, // Email address is compulsory
  },
  phone: {
    type: String,
    required: true, // Phone number is required
  },
  password: {
    type: String,
    required: true, // Password must be provided
  },
  gender: {
    type: String,
    default: "Male", // Default gender is 'Male'
  },
  country: {
    type: String,
    default: "India", // Default country is 'India'
  },
});

// Generate a model for user data
const UserModel = mongoose.model("User", userDetailsSchema);

export default UserModel;
