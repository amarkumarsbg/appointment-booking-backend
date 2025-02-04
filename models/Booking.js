import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
  status: {
    type: String,
    enum: ["booked", "cancelled", "completed"],
    default: "booked",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
