import express from "express";
import AddressModel from "../../schema/address.schema.js";
import verifyAuthentication from "../../middleware/index.js";

const addressRouter = express.Router();

// Fetch all addresses for an authenticated user
addressRouter.get("/api/addresses", verifyAuthentication, async (req, res) => {
  try {
    const userId = req.user.id; // User ID from authentication middleware
    const userAddresses = await AddressModel.find({ userId });
    res.status(200).json(userAddresses);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving addresses" });
  }
});

// Create a new address for the authenticated user
addressRouter.post("/api/addresses", verifyAuthentication, async (req, res) => {
  try {
    const userId = req.user.id;
    const newAddressData = { ...req.body, userId };
    const createdAddress = await AddressModel.create(newAddressData);

    if (req.body.isDefault) {
      await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });
      createdAddress.isDefault = true;
      await createdAddress.save();
    }

    res.status(201).json(createdAddress);
  } catch (err) {
    res.status(500).json({ message: "Error creating address" });
    console.error(err);
  }
});

// Update an existing address
addressRouter.put("/api/addresses/:id", verifyAuthentication, async (req, res) => {
  try {
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (req.body.isDefault) {
      await AddressModel.updateMany({ userId: req.user.id }, { $set: { isDefault: false } });
      updatedAddress.isDefault = true;
      await updatedAddress.save();
    }

    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: "Error updating address" });
  }
});

// Delete an address
addressRouter.delete("/api/addresses/:id", verifyAuthentication, async (req, res) => {
  try {
    await AddressModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting address" });
  }
});

export default addressRouter;
