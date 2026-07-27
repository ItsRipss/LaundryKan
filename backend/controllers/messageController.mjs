import db from '../db.mjs';

const generateMessageId = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digit acak
    return `MSG-${Date.now()}${randomSuffix}`;
};
const MAX_RETRY = 5;

export const createMessage = async (req, res) => {
    const { nama, email, pesan } = req.body;

    const io = req.app.get("io");

    let lastError = null;

    for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
        const id = generateMessageId();

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

            io.emit("notification:new", {
                title: "Pesan Baru",
                message: `${nama} mengirim pesan.`,
                type: "message",
            });

            return res.status(201).json({ success: true, id });
        } catch (error) {
            if (error.code !== "ER_DUP_ENTRY") {
                return res.status(500).json({ error: error.message });
            }

            lastError = error;
            // lanjut ke iterasi berikutnya dengan id baru (collision retry)
        }
    }

    console.error("❌ CREATE MESSAGE ERROR: gagal generate ID unik setelah beberapa percobaan");
    console.error(lastError);

    return res.status(500).json({
        error: "Gagal membuat pesan, silakan coba lagi.",
    });
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