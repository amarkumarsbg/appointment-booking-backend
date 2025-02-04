import express from "express";
import { getUsageAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// Admin Analytics Routes
router.get("/analytics/usage", getUsageAnalytics);

export default router;
