import mongoose from "mongoose";

// Define the Address schema
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links to the User model
    required: true, // Indicates a user ID is mandatory
  },
  fullAddress: {
    type: String,
    required: true, // Marks full address as compulsory
  },
  state: {
    type: String,
    required: true, // State must be provided
  },
  city: {
    type: String,
    required: true, // City is a required field
  },
  pincode: {
    type: String,
    required: true, // Pincode is necessary
  },
  phone: {
    type: String,
    required: true, // Phone number must be provided
  },
  isDefault: {
    type: Boolean,
    default: false, // Defaults to false if not specified
  },
});

// Create a model for the Address schema
const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel;
