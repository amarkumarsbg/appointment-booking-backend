import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, enum: [15, 30, 60], required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
