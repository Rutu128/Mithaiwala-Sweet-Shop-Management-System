import { Router } from "express";
import * as sweetsController from "../controllers/sweets.controller";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware";

const   router = Router();


router.post("/", isAuthenticated, isAdmin, sweetsController.createSweet);
router.get("/", isAuthenticated, sweetsController.getAllSweets);
router.get("/:id", isAuthenticated, sweetsController.getSweetById);
router.put("/:id", isAuthenticated, isAdmin, sweetsController.updateSweet);
router.delete("/:id", isAuthenticated, isAdmin, sweetsController.deleteSweet);


export default router;