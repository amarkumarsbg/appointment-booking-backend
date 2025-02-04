import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import expertRoutes from "./routes/expertRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/slots", slotRoutes);

app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
