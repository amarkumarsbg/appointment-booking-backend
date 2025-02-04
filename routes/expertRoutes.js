// expertRoutes.js
import express from "express";
import {
  addSlot,
  deleteSlot,
  getSlots,
} from "../controllers/expertController.js";

const router = express.Router();

// Add a new slot for an expert
router.post("/slots", addSlot);

// Delete a slot or mark it unavailable
router.delete("/slots", deleteSlot);

// Get all slots of a specific expert
router.get("/:id/slots", getSlots);

export default router;
