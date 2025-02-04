import express from "express";
import {
  bookSlot,
  cancelBooking,
  getClientBookings,
  getRecommendations,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", bookSlot);
router.delete("/cancel/:id", cancelBooking);
router.get("/client/:id", getClientBookings);
router.get("/recommendations", getRecommendations);

export default router;
