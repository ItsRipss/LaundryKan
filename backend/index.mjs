import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.mjs";
import db from "./db.mjs"; // Auto-migration DB Check

// MIGRATION / HOTFIX
db.execute("ALTER TABLE orders ADD COLUMN payment_status ENUM('Belum Lunas', 'Lunas') NOT NULL DEFAULT 'Belum Lunas'")
  .then(() => console.log("✅ Auto Migration: Added 'payment_status' column successful."))
  .catch(err => {
      if(err.code !== "ER_DUP_FIELDNAME") {
        console.error("Kesalahan migrasi:", err);
      }
  });

import orderRoutes from "./routes/orderRoutes.mjs";
import messageRoutes from "./routes/messageRoutes.mjs";
import notificationRoutes from "./routes/notificationRoutes.mjs";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// Log endpoint middleware
app.use((req, res, next) => {
  console.log(
    `[RADAR] Request masuk -> Method: ${req.method} | URL: ${req.url}`,
  );
  next();
});

// Fronted static mapping
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.send("Selamat Datang di LaundryKan");
});

// ==========================================
// API ROUTES
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error bawaan Multer, misal file > 5MB (LIMIT_FILE_SIZE)
    let message = "Gagal mengupload file.";

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Ukuran file terlalu besar. Maksimal 5 MB.";
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (err && err.message && err.message.includes("gambar")) {
    // Error custom dari fileFilter di uploadDeliveryPhoto.mjs
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Error lain yang tidak tertangani di controller manapun
  console.error("❌ UNHANDLED ERROR");
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server.",
  });
});

// Jalankan Server
server.listen(PORT, () => {
  console.log(`🚀 Server LaundryKan berjalan di http://localhost:${PORT}`);
});
