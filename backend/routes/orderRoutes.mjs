import express from "express";
import upload from "../middlewares/uploadDeliveryPhoto.mjs";

import {
    createOrder,
    getOrderTracking,
    getAllOrders,
    updateOrderStage,
    deleteOrder,
    assignCourier,
    getOrderActivity,
    getActivityFeed,
    getAnalytics,
    getCouriers,
    uploadDeliveryPhoto,
    updatePaymentStatus,
} from "../controllers/orderController.mjs";

import {
    authenticateToken,
    authorizeRole
} from "../middlewares/auth.mjs";

const router = express.Router();

import db from "../db.mjs";

// ===============================
// Public
// ===============================

router.get("/debug-db", async (req, res) => {
    try {
        const [rows] = await db.execute("SHOW COLUMNS FROM orders LIKE 'payment_status'");
        res.json({ success: true, columns: rows });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

router.post("/", createOrder);

const checkTrackingAccess = (req, res, next) => {
    if (req.query.phoneLast4) {
        return next();
    }

    authenticateToken(req, res, next);
};

router.get(
    "/analytics/summary",
    authenticateToken,
    authorizeRole(["owner"]),
    getAnalytics
);

router.get(
    "/activity-feed",
    authenticateToken,
    authorizeRole(["owner", "admin"]),
    getActivityFeed
);

router.get(
    "/couriers",
    authenticateToken,
    authorizeRole(["owner", "admin"]),
    getCouriers
);

router.get(
    "/",
    authenticateToken,
    getAllOrders
);

router.get(
    "/:code/activity",
    authenticateToken,
    getOrderActivity
);

router.get(
    "/:code",
    checkTrackingAccess,
    getOrderTracking
);

router.put(
    "/:code/stage",
    authenticateToken,
    updateOrderStage
);

router.put(
    "/:code/assign",
    authenticateToken,
    authorizeRole(["owner", "admin"]),
    assignCourier
);

// Update status pembayaran (Belum Lunas / Lunas) — khusus owner dan admin
router.put(
    "/:code/payment",
    authenticateToken,
    authorizeRole(["owner", "admin"]),
    updatePaymentStatus
);

router.delete(
    "/:code",
    authenticateToken,
    authorizeRole(["owner", "admin"]),
    deleteOrder
);

router.post(
    "/:code/upload-proof",
    authenticateToken,
    authorizeRole(["courier"]),
    upload.single("photo"),
    uploadDeliveryPhoto
);

export default router;