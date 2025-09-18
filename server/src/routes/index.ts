import { Router } from "express";
import authRoutes from "./auth.route";
import sweetRoutes from "./sweet.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sweets", sweetRoutes);

export default router;
