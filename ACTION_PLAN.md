# LAPORAN DEEP QA TRACING & PROJECT BLUEPRINT (ACTION PLAN v2.0)

Sebagai Senior QA Automation Engineer dan Product Manager, berikut adalah instruksi tingkat tinggi dan mutlak untuk dieksekusi di fase 'Act Mode'. Semua perubahan rancangan harus mengutamakan performa aplikasi (`race condition prevention`), skalabilitas *state*, dan fitur *business level*.

## FASE 1 & 2: TEMUAN BUG DEEP TRACE & SOLUSI EDGE-CASE

### 1. [BUG: TRANSAKSI NEGATIF & RACE CONDITION SUBMIT] - `frontend/src/pages/Order.jsx` - Baris 126 & backend validator
  - **Deskripsi Bug**: Di sisi front-end (`Order.jsx`), tidak ada pencegahan `double submit` karena `isSubmitting` direst-back menjadi `false` di dalam blok `finally` Fetch API dengan jeda minim. Ini menyebabkan *Race Condition* di backend bila jaringan pengguna lemot, di mana user yang tak bersabar akan menge-tap 2-3 kali tombol "Pesan Sekarang" dan menghasilkan Redundan Order di database. Selain itu, berat barang dikirim ke backend bisa bernilai negatif jika form di-*bypass* via inspect element karena `orderController.mjs` di `createOrder` tidak mengecek *validasi minimum 1*.
  - **Solusi Logis (Frontend - `Order.jsx`)**: 
    1. Pastikan logika pada `handleSubmit`: saat fetch berhasil berjalan (`response.ok`), **tidak perlu merubah `isSubmitting` kembali menjadi `false`**. Cukup kembalikan ke *false* jika memang lemparan API menghasilkan status `!res.ok` atau masuk ke blok `catch`.
  - **Solusi Logis (Backend - `orderController.mjs`)**:
    1. Pada baris awal fungsi `createOrder`, validasi ketat `Number(berat)`. Jika gagal parsing, NaN, atau `< 1`, berikan response return `400 Bad Request`.

### 2. [BUG: TOTAL HARGA & STATUS PEMBAYARAN] - `backend/console.sql` & `orderController.mjs`
  - **Deskripsi Bug**: Fitur harga saya sadari belum dikonfigurasi status pembayarannya. Kolom `total_harga` telah kita tambahkan dengan *logic* perkalian (Task 2 lalu), tetapi aplikasi profesional butuh track status pelunasan (Misal: `"Belum Lunas" / "Lunas"`). Saat kurir mengantar / Selesai (status 5), mereka tak tahu pelanggan sudah bayar atau belum.
  - **Solusi Logis**:
    1. **Tolong gunakan `update_db` atau tool SQL CLI untuk DDL ini nantinya**. Kita perlu menambah kolom baru di tabel `orders`, yaitu `payment_status ENUM('Belum Lunas', 'Lunas') DEFAULT 'Belum Lunas'`.  
    2. Pada fungsi `createOrder`, field `payment_status` defaultnya "Belum Lunas" saat order diciptakan.
    3. Di file `frontend/src/pages/admin/components/OrderDetailModal.jsx`, tambahkan blok UI *Status Pembayaran* beserta tombol untuk toggle pembayaran menjadi *Lunas* (khusus user role Admin/Owner/Kasir) via fetch API Endpoint yang benar. Ini mencegah *invoice ambiguity*.

## FASE 3: STANDARISASI WEB LAUNDRY PROFESIONAL (FITUR BARU)

Setelah mengevaluasi arsitektur sistem, saya menolak menyarankan *Pos Cetak Thermal* untuk saat ini, karena itu melibatkan library eksternal (USB / Bluetooth Printing) yang bergantung pada platform env. Sebagai gantinya, 2 Fitur High-Impact yang kita ciptakan adalah:

### [FITUR BARU 1: Role Kasir & Payment Gateway View (Manual API)]
  - **File Terdampak**: `backend/console.sql` (Update Enum Role), `backend/routes/orderRoutes.mjs`, `frontend/src/pages/admin/components/OrderDetailModal.jsx`. 
  - **Deskripsi Implementasi**:
    1. Sistem ini butuh modul agar kasir bisa mencatat penerimaan uang kas. Mengingat peran *admin* biasanya di luar area outlet (atau backoffice), kita akan gunakan peran `admin` saat ini sebagai *Kasir + Backoffice*. 
    2. Pastikan di `orderRoutes.mjs` ada route baru: `PUT /:code/payment` (Update payment status). Route ini dicegat oleh `authorizeRole(["owner", "admin"])`.
    3. Di front-end `OrderDetailModal.jsx`, render tombol "Tandai Lunas" hanya bila `order.payment_status === "Belum Lunas"` & `userRole === 'admin' || 'owner'`.
    4. Buat fungsi fetch `updatePaymentStatus()` di frontend yang memanggil Endpoints PUT tersebut, lalu melakukan `refreshOrders()`. Ini menyempurnakan deep logic bug nomor 2.

### [FITUR BARU 2: WhatsApp Notification (Server-Side Auto Blast via Admin UI)]
  - **File Terdampak**: `backend/controllers/orderController.mjs`, `backend/routes/orderRoutes.mjs`, `frontend/src/pages/admin/components/OrderDetail/CustomerCard.jsx`
  - **Deskripsi Implementasi**: Sebelumnya di Act Mode saya minta menyematkan *Anchor Href* WA di Front-end (Client side). Sekarang mari rancang untuk kebutuhan Blast Otomatis atau Template yang lebih canggih (semi-otomatis via frontend clicker yang sudah ada, namun *logic tracking resi otomatis* yang lebih pintar).
    1. Di `frontend/src/pages/admin/components/OrderDetail/CustomerCard.jsx`, update parameter pesan pada "Chat via WhatsApp". Selain ID pesanan, masukkan tautan *Tracking URL Web* `https://[Domain]/tracking?code=...` (untuk localhost biarkan `http://localhost:5173/tracking?code=${order.code}`).
    2. Modifikasi text-nya menjadi:
       `"Halo kak ${order.nama} dari Laundry Wangi. Berikut resi pesanan Anda: ${order.code}. Lacak cucian real-time di sini: ${window.location.origin}/tracking?code=${order.code} 😊"`

---
**Instruksi Akhir Untuk Claude (Agent):**
Jalankan blueprint v2.0 ini melalui Act Mode. Cek per baris dengan teliti agar fitur yang diciptakan tidak merusak tatanan socket, state tabel, maupun komponen UI React yang eksisting di sana. Utamakan penggunaan *replace_in_file* tool yang presisi.