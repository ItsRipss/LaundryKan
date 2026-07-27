import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const ACTIVE_SECRET_KEY = SECRET_KEY || "WANGI_RAHASIA_2026_INSECURE_FALLBACK";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Token tidak tersedia' });

    jwt.verify(token, ACTIVE_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Token tidak valid' });
        req.user = user;
        next();
    });
};

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }
        next();
    };
};
