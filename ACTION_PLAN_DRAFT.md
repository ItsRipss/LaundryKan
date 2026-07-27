# Action Plan: Laundry Wangi

## Fase 1: Pemetaan Proyek (Selesai)
- **Teknologi**: Backend Express/Node.js, Frontend React+Vite, Database MySQL.
- **Fitur Kunci**: Manajemen laundry (Order, Lacak, Dashboard Admin, Manajemen Kurir). Terdapat multi-role: Owner, Admin, Courier, Customer.

## Fase 2: Deteksi Bug Komprehensif (Prioritas Tinggi)
1.  **Bug Logika - Harga Belum Terhitung (Order)**: 
    -   *Deskripsi*: Di tabel `orders` ada kolom `total_harga`, tapi saat pembuatan pesanan di `frontend/src/pages/Order.jsx` (maupun `backend/controllers/orderController.mjs` di `createOrder`), **harga belum terhitung**. Hal ini membuat tagihan tidak ada.
    -   *Solusi Logis*: Perlu adanya logika perhitungan harga. Mungkin tambah mapping harga per layanan (misal: Cuci Kiloan Rp 8000/kg, dsb) di frontend/backend lalu dimasukkan ke dalam payload `createOrder`/Query Insert di Controller.
2.  **Bug Keamanan / Konfigurasi URL API Hardcode**:
    -   *Deskripsi*: Banyak file frontend (hooks, komponen, halaman) menggunakan `http://localhost:3000/api` secara eksplisit, *bukan* env variables (`import.meta.env.VITE_API_URL`). Ini merusak *scalability* atau bila app dideploy di produksi.
    -   *Solusi Logis*: Buat file konfigurasi `.env` di frontend, tulis variabel environment `VITE_API_URL`, dan buat sebuah `api.js` atau re-factor referensi hardcode agar menunjuk ke URL dinamis.
3.  **UI/UX - State Tidak Reset Saat Order Sukses (atau Form Step 1 error)**:
    -   *Deskripsi*: Di `Order.jsx`, kode hardcoded `http://localhost:3000/api/orders`. Selain itu, saat sukses Order, ada State TrackingCode, tapi mungkin idealnya kita simpan localStorage/SessionStorage jika tab tertutup tidak sengaja.
    -   *Solusi Logis*: (Bisa menjadi task kecil, namun URL API adalah fixing utamanya).
4. **Bug Logika/Security Anti-IDOR pada Lacak Pesanan (Tracking.jsx)**:
   - *Deskripsi*: Endpoint `/api/orders/:code` menggunakan query parameter `phoneLast4` untuk verifikasi anti-IDOR. Jika user dapat menebak 4 digit (yang mana range-nya hanya 0000-9999), data pribadi dapat terekspos.
   - *Solusi Logis*: Mungkin bisa diperbaiki dengan verifikasi nomor yang lebih kompleks di masa depan (e.g., OTP), tapi setidaknya rate-limiting harus diterapkan (Opsional, di luar scope tanpa install dependensi). Untuk sekarang logic di `getOrderTracking` Controller cukup memenuhi minimum. Bug yang fixable adalah memastikan filter `.slice(-4)` berlaku universal terhadap semua format nomor, baik di frontend request maupun di backend parsing, mencegah exception karena payload `null`.
    *Perbaikan aktual:* Pada file Frontend `Tracking.jsx`, request FETCH tidak menyertakan API root yang benar `http://localhost:3000/api` pada baris:
    `const url = \`http://localhost:3000/api/orders/${inputCode.trim().toUpperCase()}?phoneLast4=${inputPhoneLast4.trim()}\`;` (Meskipun ini bisa disesuaikan dengan Base API ENV).

## Fase 3: Ideasi Fitur (Non-Destruktif)
1.  **Fitur WhatsApp Blast/Notifikasi (Simulasi Eksternal Link)**
    -   *Ide*: Tambahkan tombol "Hubungi Pelanggan" via WhatsApp (`https://wa.me/...`) langsung di Dashboard/Modal Detail Admin.
    -   *Impact*: Mempermudah kurir dan admin untuk langsung menagih atau menginformasikan status pesanan.
    -   *Aman?*: Sangat aman, tidak ubah database, cuma menambah anchor href link berbasis kolom HP.
2.  **Fitur Filter Canggih pada Dashboard Admin**
    -   *Ide*: Pada halaman Admin, tambahkan *dropdown* filter atau tab *Sort By* (Terlama, Terbaru, atau filter Layanan).
    -   *Impact*: Mempermudah admin melakukan *triasing* pencucian.
    -   *Aman?*: Aman, karena modifikasi state lokal di frontend array map filtering saja.

---

*(Ini adalah output draf yang sedang dibangun, belum format final `ACTION_PLAN.md`)*