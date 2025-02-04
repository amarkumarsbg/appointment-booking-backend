import Joi from "joi";
import Slot from "../models/Slot.js";

const addSlotSchema = Joi.object({
  expertId: Joi.string().required(), // Assuming expertId is a string (ObjectId)
  date: Joi.date().iso().required(),
  startTime: Joi.string()
    .pattern(/^[0-9]{2}:[0-9]{2}$/)
    .required(), // HH:MM format
  endTime: Joi.string()
    .pattern(/^[0-9]{2}:[0-9]{2}$/)
    .required(), // HH:MM format
  slotDuration: Joi.number().integer().min(1).required(),
});

const deleteSlotSchema = Joi.object({
  slotId: Joi.string().required(),
});

const getSlotsSchema = Joi.object({
  id: Joi.string().required(),
});

export const addSlot = async (req, res) => {
  const { error } = addSlotSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { expertId, date, startTime, endTime, slotDuration } = req.body;

  if (!expertId || !date || !startTime || !endTime || !slotDuration) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
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
};

export const deleteSlot = async (req, res) => {
  const { error } = deleteSlotSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

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
};

export const getSlots = async (req, res) => {
  const { error } = getSlotsSchema.validate(req.params);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    const slots = await Slot.find({ expertId: id });

    if (!slots || slots.length === 0) {
      return res
        .status(404)
        .json({ message: "No slots found for this expert" });
    }

    res.json(slots);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch slots", error: err.message });
  }
};
