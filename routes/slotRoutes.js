import express from "express";
import Slot from "../models/Slot.js";

const router = express.Router();

// Get available slots for an expert
router.get("/", async (req, res) => {
  const { expertId } = req.query;

  if (!expertId) {
    return res.status(400).json({ message: "expertId is required" });
  }

  try {
    const slots = await Slot.find({ expertId, isBooked: false });
    res.json({ message: "Available slots", slots });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching slots", error: err.message });
  }
});

// Add a new slot for an expert
router.post("/add", async (req, res) => {
  const { expertId, date, startTime, endTime, slotDuration } = req.body;

  if (!expertId || !date || !startTime || !endTime || !slotDuration) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for overlapping slots
    const existingSlot = await Slot.findOne({
      expertId,
      date,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (existingSlot) {
      return res
        .status(400)
        .json({ message: "Slot overlaps with an existing one" });
    }

    // Create new slot
    const newSlot = new Slot({
      expertId,
      date,
      startTime,
      endTime,
      slotDuration,
    });

    await newSlot.save();

    res.status(201).json({ message: "Slot added successfully", slot: newSlot });
  } catch (err) {
    res.status(400).json({ message: "Failed to add slot", error: err.message });
  }
});

// Delete a slot by ID
router.delete("/delete", async (req, res) => {
  const { slotId } = req.body;

  try {
    const deletedSlot = await Slot.findByIdAndDelete(slotId);

    if (!deletedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to delete slot", error: err.message });
  }
});

export default router;
