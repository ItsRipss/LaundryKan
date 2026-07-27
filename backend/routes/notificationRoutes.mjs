import express from "express";
import {getNotifications, markNotificationRead, markAllRead} from "../controllers/notificationController.mjs";
import {authenticateToken,} from "../middlewares/auth.mjs";

const router = express.Router();

router.get("/", authenticateToken, getNotifications);
router.put("/:id/read", authenticateToken, markNotificationRead);
router.put("/read-all", authenticateToken, markAllRead);

export default router;