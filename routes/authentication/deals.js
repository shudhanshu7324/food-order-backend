import express from "express";
import DealModel from "../../schema/deals.schema.js";

const dealRouter = express.Router();

// Get all available deals
dealRouter.get("/", async (req, res) => {
  try {
    const availableDeals = await DealModel.find();
    res.json(availableDeals);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
});

// Create a new deal
dealRouter.post("/", async (req, res) => {
  try {
    const { name, discount, image } = req.body;
    const newDealEntry = new DealModel(req.body);
    const savedDealEntry = await newDealEntry.save();
    res.json(savedDealEntry);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
});

export default dealRouter;
