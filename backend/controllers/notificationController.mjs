import db from "../db.mjs";

export const getNotifications = async (req, res) => {

    try {
        const [rows] = await db.execute( `SELECT * FROM notifications ORDER BY createdAt DESC LIMIT 30`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({error: err.message,});
    }
};

export const markNotificationRead = async (req, res) => {
    try {await db.execute( `UPDATE notifications SET is_read = TRUE WHERE id = ?`, [req.params.id]);
        res.json({success: true,});
        const io = req.app.get("io");
        io.emit("notification:read", {
            id: req.params.id,
        });
    } catch (err) {
        res.status(500).json({error: err.message,});
    }
};

export const markAllRead = async (req, res) => {
    try {
        await db.execute( `UPDATE notifications SET is_read = TRUE`);
        res.json({success: true,});
        const io = req.app.get("io");
        io.emit("notification:read-all");
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};