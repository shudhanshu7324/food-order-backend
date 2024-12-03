import mongoose from "mongoose";

// Schema for representing deals
const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
  },
  discount: {
    type: String,
    required: true, // Discount details must be provided
  },
  image: {
    type: String,
    required: true, // Image URL is required
  },
});

// Model creation for the Deal schema
const DealModel = mongoose.model("Deal", dealSchema);

export default DealModel;
