import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.mjs';

const SECRET_KEY = process.env.JWT_SECRET;
const ACTIVE_SECRET_KEY = SECRET_KEY || "WANGI_RAHASIA_2026_INSECURE_FALLBACK";

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role, nama_lengkap: user.nama_lengkap },
                    ACTIVE_SECRET_KEY,
                    { expiresIn: '1d' }
                );
                res.json({ success: true, token, role: user.role, nama_lengkap: user.nama_lengkap });
            } else {
                res.status(401).json({ success: false, message: 'Password salah' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Username tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
