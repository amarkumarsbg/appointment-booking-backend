import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// Admin Analytics: Booking and No-show Statistics with optional date filtering
export const getUsageAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};

    // Optional date range filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.createdAt = { $gte: start, $lte: end };
    }

    // Calculate total bookings (filtered by date range if provided)
    const totalBookings = await Booking.countDocuments(query);

    // Calculate completed bookings
    const completedBookings = await Booking.countDocuments({
      ...query,
      status: "completed",
    });

    // Calculate no-shows (booked status and not completed)
    const noShowBookings = await Booking.countDocuments({
      ...query,
      status: "booked",
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // More than 1 day ago and still not completed
    });

    res.json({
      totalBookings,
      completedBookings,
      noShowBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};
