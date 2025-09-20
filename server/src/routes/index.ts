import { Router } from "express";
import authRoutes from "./auth.route";
import sweetRoutes from "./sweet.route";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0"
  };
  
  // Log if it's a cron job call
  if (req.headers['x-cron-job']) {
    console.log(`[HEALTH] Cron job health check - Status: ${healthStatus.status}`);
  }
  
  res.status(200).json(healthStatus);
});

router.use("/auth", authRoutes);
router.use("/sweets", sweetRoutes);

export default router;
