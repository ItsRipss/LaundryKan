import multer from "multer";
import path from "path";
import fs from "fs";

// Folder penyimpanan foto bukti pengantaran
const uploadPath = "uploads/deliveries";

// Buat folder jika belum ada
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        const ext = path.extname(file.originalname);

        // Contoh:
        // LK-123456-1753439876321.jpg
        cb(null, `${req.params.code}-${Date.now()}${ext}`);
    },
});

// Filter file
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File harus berupa gambar (JPG, PNG, WEBP)."), false);
    }
};

// Middleware upload
const uploadDeliveryPhoto = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Maksimal 5 MB
    },
});

export default uploadDeliveryPhoto;