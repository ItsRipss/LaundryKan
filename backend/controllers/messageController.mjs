import db from '../db.mjs';

export const createMessage = async (req, res) => {
    const { id, nama, email, pesan } = req.body;
    try {
        await db.execute('INSERT INTO messages (id, nama, email, pesan) VALUES (?, ?, ?, ?)',
            [id, nama, email, pesan]);
        await db.execute( `INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)`,
            [
                "Pesan Baru",
                `${nama} mengirim pesan.`,
                "message",
            ]
        );
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM messages ORDER BY createdAt DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markMessageRead = async (req, res) => {
    try {
        await db.execute('UPDATE messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        await db.execute('DELETE FROM messages WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
