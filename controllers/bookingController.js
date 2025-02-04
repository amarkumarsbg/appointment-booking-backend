import Joi from "joi";
import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

const bookSlotSchema = Joi.object({
  clientId: Joi.string().required(),
  expertId: Joi.string().required(),
  date: Joi.date().iso().required(),
  startTime: Joi.string()
    .pattern(/^[0-9]{2}:[0-9]{2}$/)
    .required(),

  slotDuration: Joi.number().integer().min(1).required(),
});

const cancelBookingSchema = Joi.object({
  id: Joi.string().required(),
});

const getRecommendationsSchema = Joi.object({
  expertId: Joi.string().required(),
});

const getClientBookingsSchema = Joi.object({
  id: Joi.string().required(),
});

export const bookSlot = async (req, res) => {
  const { error } = bookSlotSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { clientId, expertId, date, startTime, slotDuration } = req.body;

  try {
    // Check if a slot is available
    const slot = await Slot.findOne({
      expertId,
      date,
      startTime,
      slotDuration,
      isBooked: false,
    });

    if (!slot) {
      return res.status(404).json({ message: "Slot not available" });
    }

    // Mark the slot as booked
    slot.isBooked = true;
    await slot.save();

    // Create the booking
    const booking = new Booking({
      clientId,
      expertId,
      slotId: slot._id,
    });

    console.log(await booking.save());

    res.status(201).json({ message: "Slot booked successfully", booking });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to book slot", error: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  const { error } = cancelBookingSchema.validate(req.params);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const slot = await Slot.findById(booking.slotId);
    slot.isBooked = false;
    await slot.save();

    await Booking.findByIdAndDelete(id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(400).json({
      message: "Failed to cancel booking",
      error: err.message,
    });
  }
};

export const getRecommendations = async (req, res) => {
  const { error } = getRecommendationsSchema.validate(req.query);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { expertId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(expertId)) {
    return res.status(400).json({
      message: "Invalid expertId format. It must be a valid MongoDB ObjectId.",
    });
  }

  try {
    console.log("Fetching available slots for expertId:", expertId);

    // Fetch available slots for the expert
    const availableSlots = await Slot.find({
      expertId: new mongoose.Types.ObjectId(expertId),
      isBooked: false,
    });

    console.log("Available slots:", availableSlots);

    if (!availableSlots.length) {
      return res.status(404).json({ message: "No available slots found" });
    }

    // Return the available slots as recommendations
    res.json({ message: "Available slots", slots: availableSlots });
  } catch (err) {
    res.status(400).json({
      message: "Failed to fetch recommendations",
      error: err.message,
    });
  }
};

export const getClientBookings = async (req, res) => {
  const { error } = getClientBookingsSchema.validate(req.params);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    // Fetch bookings for the client
    const bookings = await Booking.find({ clientId: id })
      .populate("slotId")
      .populate("expertId");

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this client" });
    }

    // Return the bookings
    res.json(bookings);
  } catch (err) {
    res.status(400).json({
      message: "Failed to fetch client bookings",
      error: err.message,
    });
  }
};
