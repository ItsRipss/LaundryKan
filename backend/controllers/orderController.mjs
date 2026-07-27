import db from "../db.mjs";

const STAGES = ["Diterima", "Jemput", "Cuci", "Kering", "Antar", "Selesai"];
const HARGA_LAYANAN = {
    "Cuci Kiloan Reguler": 7000,
    "Cuci Kiloan Express": 12000,
    "Dry Clean": 25000,
    "Cuci Sepatu Spesialis": 20000,
    "Bed Cover & Selimut": 30000,
    "Setrika Saja": 5000,
};

/**
 * Menghitung total harga berdasarkan layanan dan berat/jumlah item.
 * @param {string} layanan - Nama layanan
 * @param {number} berat - Berat (kg) atau jumlah item
 * @returns {number} - Total harga dalam Rupiah
 */
const hitungHarga = (layanan, berat) => {
    const hargaSatuan = HARGA_LAYANAN[layanan] ?? 8000;
    const jumlah = Number(berat) || 0;
    return hargaSatuan * jumlah;
};
const createNotification = async (title, message, type = "system") => {
    await db.execute(
        `
            INSERT INTO notifications
            (
                title,
                message,
                type
            )
            VALUES (?, ?, ?)
        `,
        [title, message, type],
    );
};

const createActivity = async ({
                                  order_code,
                                  old_stage = null,
                                  new_stage = null,
                                  changed_by = null,
                                  changed_role = null,
                                  activity_type = "status",
                                  description = null,
                              }) => {
    await db.execute(
        `
            INSERT INTO order_activity
            (
                order_code,
                old_stage,
                new_stage,
                changed_by,
                changed_role,
                activity_type,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            order_code,
            old_stage,
            new_stage,
            changed_by,
            changed_role,
            activity_type,
            description,
        ],
    );
};

export const createOrder = async (req, res) => {
    console.log("📦 createOrder dipanggil");
    console.log(req.body);

    const { code, nama, hp, alamat, layanan, berat, tanggal, jam, catatan } =
        req.body;

    const io = req.app.get("io");

    // ===============================
    // VALIDASI INPUT AWAL (Server-side guard)
    // ===============================
    const beratNum = Number(berat);
    if (!berat || isNaN(beratNum) || beratNum < 1) {
        return res.status(400).json({
            success: false,
            message: "Berat/jumlah item tidak valid. Minimal 1 kg / 1 item.",
        });
    }
    if (!nama || String(nama).trim() === "") {
        return res.status(400).json({ success: false, message: "Nama wajib diisi." });
    }
    if (!hp || String(hp).replace(/\D/g, "").length < 9) {
        return res.status(400).json({ success: false, message: "Nomor HP tidak valid." });
    }
    if (!alamat || String(alamat).trim() === "") {
        return res.status(400).json({ success: false, message: "Alamat wajib diisi." });
    }
    if (!layanan || !HARGA_LAYANAN[layanan]) {
        return res.status(400).json({ success: false, message: "Jenis layanan tidak valid." });
    }
    if (!code || !tanggal || !jam) {
        return res.status(400).json({ success: false, message: "Data order tidak lengkap." });
    }

    try {
        // Hitung total harga berdasarkan layanan dan berat/jumlah item
        const total_harga = hitungHarga(layanan, beratNum);

        // Simpan order beserta total_harga
        await db.execute(
            `INSERT INTO orders (code, nama, hp, alamat, layanan, berat, tanggal, jam, catatan, total_harga)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, nama, hp, alamat, layanan, berat, tanggal, jam, catatan || "", total_harga],
        );

        await createNotification(
            "Order Baru",
            `Order ${code} dibuat oleh ${nama}`,
            "order",
        );

        await createActivity({
            order_code: code,
            old_stage: null,
            new_stage: 0,
            changed_by: req.user?.id ?? null,
            changed_role: req.user?.role ?? "customer",
            activity_type: "status",
            description: "Order berhasil dibuat",
        });

        io.emit("orders:refresh");

        io.emit("notification:new", {
            title: "Order Baru",
            message: `Order ${code} dibuat oleh ${nama}`,
            type: "order",
        });

        // Kirim realtime ke dashboard
        res.status(201).json({ success: true, message: "Order berhasil dibuat" });
    } catch (error) {
        console.error("❌ CREATE ORDER ERROR");
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const getOrderTracking = async (req, res) => {
    const { code } = req.params;
    const { phoneLast4 } = req.query;

    try {
        // ============================
        // ORDER
        // ============================

        const [rows] = await db.execute(
            `
                SELECT *
                FROM orders
                WHERE code = ?
            `,
            [code],
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Order tidak ditemukan",
            });
        }

        const order = rows[0];

        // ============================
        // Anti IDOR
        // ============================

        if (phoneLast4) {
            const cleanHp = (order.hp || "").replace(/\D/g, "");
            const trueLast4 = cleanHp.slice(-4);

            if (phoneLast4 !== trueLast4) {
                return res.status(403).json({
                    message: "Verifikasi Nomor HP gagal. 4 digit terakhir tidak sesuai.",
                });
            }
        } else {
            if (!req.user) {
                return res.status(401).json({
                    message: "Harap masukkan 4 digit terakhir nomor HP.",
                });
            }
        }

        // ============================
        // KURIR
        // ============================

        let courier = null;

        if (order.courier_id) {
            const [courierRows] = await db.execute(
                `
                    SELECT
                        id,
                        username,
                        nama_lengkap
                    FROM users
                    WHERE id = ?
                `,
                [order.courier_id],
            );

            if (courierRows.length) {
                courier = courierRows[0];
            }
        }

        // ============================
        // AKTIVITAS
        // ============================

        const [activities] = await db.execute(
            `
                SELECT
                    *
                FROM order_activity
                WHERE order_code = ?
                ORDER BY createdAt ASC
            `,
            [code],
        );

        // ============================
        // FOTO PENGANTARAN
        // ============================

        const [proofRows] = await db.execute(
            `
                SELECT
                    id,
                    photo_path,
                    status,
                    createdAt
                FROM delivery_proofs
                WHERE order_code = ?
                ORDER BY id DESC
                    LIMIT 1
            `,
            [code],
        );

        const deliveryProof = proofRows.length > 0 ? proofRows[0] : null;

        // ============================
        // ESTIMASI
        // ============================

        let estimatedFinish = null;

        if (order.tanggal) {
            const date = new Date(order.tanggal);

            if (order.layanan && order.layanan.toLowerCase().includes("express")) {
                date.setDate(date.getDate() + 1);
            } else {
                date.setDate(date.getDate() + 3);
            }

            estimatedFinish = date;
        }

        // ============================
        // RESPONSE
        // ============================

        return res.json({
            ...order,

            courier,

            activities,

            deliveryProof,

            estimatedFinish,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: error.message,
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        let query = `
            SELECT
                o.*,
                u.nama_lengkap AS courier_name
            FROM orders o
                     LEFT JOIN users u
                               ON o.courier_id = u.id
        `;

        let params = [];

        // Kurir hanya melihat order miliknya
        if (req.user && req.user.role === "courier") {
            query += `
        WHERE o.courier_id = ?
      `;
            params.push(req.user.id);
        }

        query += `
      ORDER BY o.createdAt DESC
    `;

        const [rows] = await db.execute(query, params);

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message,
        });
    }
};

export const updateOrderStage = async (req, res) => {
    const { manualStage } = req.body;

    try {
        // ===============================
        // Ambil data order
        // ===============================

        const [[order]] = await db.execute(
            `
                SELECT
                    manualStage
                FROM orders
                WHERE code = ?
            `,
            [req.params.code],
        );

        if (!order) {
            return res.status(404).json({
                message: "Order tidak ditemukan",
            });
        }

        const oldStage = order.manualStage;

        // ===============================
        // VALIDASI ROLE KURIR
        // ===============================

        if (req.user.role === "courier") {
            // FIX BUG: sebelumnya kurir tidak punya jalur valid untuk
            // menyelesaikan order (4 -> 5) setelah upload bukti foto
            // pengantaran, karena aturan ini cuma mengizinkan 0->1 dan
            // 3->4. Ditambahkan (oldStage === 4 && manualStage === 5)
            // supaya kurir bisa menandai order "Selesai" - lihat juga
            // pengecekan tambahan di bawah (butuh delivery_proofs
            // sudah ada) supaya kurir tidak bisa skip upload bukti.
            const validMove =
                (oldStage === 0 && manualStage === 1) ||
                (oldStage === 3 && manualStage === 4) ||
                (oldStage === 4 && manualStage === 5);

            if (!validMove) {
                return res.status(403).json({
                    success: false,
                    message: "Kurir tidak memiliki izin mengubah status tersebut.",
                });
            }

            // FIX BUG: transisi 4 -> 5 wajib sudah ada bukti foto
            // pengantaran tersimpan di delivery_proofs, supaya kurir
            // tidak bisa menandai "Selesai" tanpa upload bukti dulu
            // (mencegah bypass lewat request manual ke API).
            if (oldStage === 4 && manualStage === 5) {
                const [[proof]] = await db.execute(
                    `
                        SELECT id
                        FROM delivery_proofs
                        WHERE order_code = ?
                        LIMIT 1
                    `,
                    [req.params.code],
                );

                if (!proof) {
                    return res.status(400).json({
                        success: false,
                        message: "Upload bukti pengantaran terlebih dahulu sebelum menandai selesai.",
                    });
                }
            }
        }

        // ===============================
        // Update Status
        // ===============================

        await db.execute(
            `
                UPDATE orders
                SET manualStage = ?
                WHERE code = ?
            `,
            [manualStage, req.params.code],
        );

        // ===============================
        // Simpan Aktivitas
        // ===============================

        await createActivity({
            order_code: req.params.code,
            old_stage: oldStage,
            new_stage: manualStage,
            changed_by: req.user?.id ?? null,
            changed_role: req.user?.role ?? null,
            activity_type: "status",
            description: `Status berubah menjadi "${STAGES[manualStage]}"`,
        });

        // ===============================
        // Simpan Notifikasi
        // ===============================

        await createNotification(
            "Status Laundry",
            `Order ${req.params.code} berubah menjadi "${STAGES[manualStage]}"`,
            "status",
        );

        // ===============================
        // Socket
        // ===============================

        const io = req.app.get("io");

        io.emit("orders:refresh");

        io.emit("notification:new", {
            title: "Status Laundry",
            message: `Order ${req.params.code} berubah menjadi "${STAGES[manualStage]}"`,
            type: "status",
        });

        return res.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: error.message,
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        await db.execute("DELETE FROM orders WHERE code = ?", [req.params.code]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Menambahkan assign kurir jika admin/owner
export const assignCourier = async (req, res) => {
    const { courier_id } = req.body;

    try {
        // Ambil data kurir
        const [[courier]] = await db.execute(
            `
                SELECT id, nama_lengkap
                FROM users
                WHERE id = ?
            `,
            [courier_id],
        );

        if (!courier) {
            return res.status(404).json({
                message: "Kurir tidak ditemukan",
            });
        }

        // Update order
        await db.execute(
            `
                UPDATE orders
                SET courier_id = ?
                WHERE code = ?
            `,
            [courier_id, req.params.code],
        );

        // Simpan histori
        await createActivity({
            order_code: req.params.code,
            old_stage: null,
            new_stage: null,
            changed_by: req.user?.id ?? null,
            changed_role: req.user?.role ?? null,
            activity_type: "assign",
            description: `Kurir "${courier.nama_lengkap}" ditugaskan ke order.`,
        });

        // Simpan notifikasi
        await createNotification(
            "Kurir Ditugaskan",
            `Order ${req.params.code} berhasil ditugaskan kepada kurir.`,
            "system",
        );

        // Realtime
        const io = req.app.get("io");

        io.emit("orders:refresh");

        io.emit("notification:new", {
            title: "Kurir Ditugaskan",
            message: `${courier.nama_lengkap} ditugaskan ke order ${req.params.code}`,
            type: "courier",
        });

        res.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message,
        });
    }
};

export const getCouriers = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id, username, nama_lengkap FROM users WHERE role = 'courier' ORDER BY nama_lengkap ASC`,
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

export const getOrderActivity = async (req, res) => {
    try {
        const { code } = req.params;

        // Riwayat aktivitas
        const [activities] = await db.execute(
            `
                SELECT *
                FROM order_activity
                WHERE order_code = ?
                ORDER BY createdAt DESC
            `,
            [code],
        );

        // Bukti pengantaran
        const [proof] = await db.execute(
            `
                SELECT *
                FROM delivery_proofs
                WHERE order_code = ?
                ORDER BY createdAt DESC
                    LIMIT 1
            `,
            [code],
        );

        res.json({
            activities,
            deliveryProof: proof[0] || null,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message,
        });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const [[totalOrders]] = await db.execute(
            "SELECT COUNT(*) total FROM orders",
        );
        const [[completedOrders]] = await db.execute(
            `SELECT COUNT(*) total FROM orders WHERE manualStage = 5`,
        );
        const [[processingOrders]] = await db.execute(
            `SELECT COUNT(*) total FROM orders WHERE manualStage < 5`,
        );
        const [services] = await db.execute(
            `SELECT layanan, COUNT(*) total FROM orders GROUP BY layanan ORDER BY total DESC`,
        );
        const [stageStats] = await db.execute(
            `SELECT manualStage, COUNT(*) total FROM orders GROUP BY manualStage`,
        );

        res.json({
            totalOrders: totalOrders.total,
            completedOrders: completedOrders.total,
            processingOrders: processingOrders.total,
            services,
            stageStats,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

export const uploadDeliveryPhoto = async (req, res) => {
    try {
        const { code } = req.params;

        // memastikan file berhasil diupload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Foto pengantaran belum dipilih.",
            });
        }
        const photoPath = `/uploads/deliveries/${req.file.filename}`;

        // cek order
        const [[order]] = await db.execute(
            `
                SELECT code
                FROM orders
                WHERE code = ?
            `,
            [code],
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order tidak ditemukan.",
            });
        }

        // simpan bukti foto
        await db.execute(
            `
                INSERT INTO delivery_proofs
                (
                    order_code,
                    photo_path,
                    uploaded_by,
                    uploaded_role
                )
                VALUES (?, ?, ?, ?)
            `,
            [code, photoPath, req.user?.id ?? null, req.user?.role ?? null],
        );

        // simpan aktivitas
        await createActivity({
            order_code: code,
            changed_by: req.user?.id ?? null,
            changed_role: req.user?.role ?? null,
            activity_type: "delivery_photo",
            description: "Kurir mengunggah bukti foto pengantaran.",
        });

        // simpan notifikasi
        await createNotification(
            "Bukti Pengantaran",
            `Kurir telah mengunggah bukti pengantaran untuk order ${code}.`,
            "status",
        );

        // realtime
        const io = req.app.get("io");

        io.emit("orders:refresh");

        io.emit("notification:new", {
            title: "Bukti Pengantaran",
            message: `Foto pengantaran order ${code} berhasil diunggah.`,
            type: "delivery",
        });

        return res.json({
            success: true,
            message: "Foto bukti pengantaran berhasil diupload.",
            photo: req.file.filename,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { code } = req.params;
    const { payment_status } = req.body;

    // Validasi nilai yang diperbolehkan
    const validStatuses = ["Belum Lunas", "Lunas"];
    if (!payment_status || !validStatuses.includes(payment_status)) {
        return res.status(400).json({
            success: false,
            message: "Status pembayaran tidak valid. Gunakan 'Belum Lunas' atau 'Lunas'.",
        });
    }

    try {
        // Cek apakah order ada
        const [[order]] = await db.execute(
            `SELECT code, payment_status FROM orders WHERE code = ?`,
            [code],
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order tidak ditemukan.",
            });
        }

        // Update payment_status
        await db.execute(
            `UPDATE orders SET payment_status = ? WHERE code = ?`,
            [payment_status, code],
        );

        // Simpan aktivitas
        await createActivity({
            order_code: code,
            changed_by: req.user?.id ?? null,
            changed_role: req.user?.role ?? null,
            activity_type: "payment",
            description: `Status pembayaran diubah menjadi "${payment_status}".`,
        });

        // Notifikasi internal
        await createNotification(
            "Status Pembayaran",
            `Order ${code} — pembayaran: ${payment_status}.`,
            "system",
        );

        // Realtime
        const io = req.app.get("io");
        io.emit("orders:refresh");

        return res.json({
            success: true,
            payment_status,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const getActivityFeed = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `
                SELECT
                    oa.id,
                    oa.order_code,
                    oa.activity_type,
                    oa.description,
                    oa.createdAt,
                    oa.changed_role,
                    u.nama_lengkap
                FROM order_activity oa
                         LEFT JOIN users u
                                   ON oa.changed_by = u.id
                ORDER BY oa.createdAt DESC
                    LIMIT 30
            `,
        );

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message,
        });
    }
};