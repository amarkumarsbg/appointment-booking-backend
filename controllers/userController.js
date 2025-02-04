import Joi from "joi";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("client", "expert").required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation failed", error: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
