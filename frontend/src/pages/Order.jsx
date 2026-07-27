import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight, Check } from "lucide-react";
import classNames from "classnames";
import { API_URL } from "../config";

// SINKRONISASI HARGA: id, nama, dan harga di sini disamakan dengan
// HARGA_LAYANAN di orderController.mjs & judul di Layanan.jsx.
// Sebelumnya id "Cuci Express" dan "Cuci Sepatu" beda nama dari
// yang dijanjikan di halaman Layanan.jsx, dan 2 layanan (Bed Cover &
// Selimut, Setrika Saja) tidak bisa dipesan sama sekali karena
// belum ada di daftar ini. Field `harga` & `satuan` ditambahkan
// supaya harga bisa ditampilkan langsung di kartu pilihan.
const LAYANAN_OPTIONS = [
    {
        id: "Cuci Kiloan Reguler",
        label: "Cuci Kiloan Reguler",
        desc: "Selesai dalam 2 hari",
        harga: 7000,
        satuan: "kg",
    },
    {
        id: "Cuci Kiloan Express",
        label: "Cuci Kiloan Express",
        desc: "Prioritas hari sama",
        harga: 12000,
        satuan: "kg",
    },
    {
        id: "Dry Clean",
        label: "Dry Clean",
        desc: "Berbasis satuan item",
        harga: 25000,
        satuan: "item",
    },
    {
        id: "Cuci Sepatu Spesialis",
        label: "Cuci Sepatu Spesialis",
        desc: "Sneakers & kulit",
        harga: 20000,
        satuan: "pasang",
    },
    {
        id: "Bed Cover & Selimut",
        label: "Bed Cover & Selimut",
        desc: "Kain ukuran ekstra besar",
        harga: 30000,
        satuan: "item",
    },
    {
        id: "Setrika Saja",
        label: "Setrika Saja",
        desc: "Sudah dicuci di rumah",
        harga: 5000,
        satuan: "kg",
    },
];

const JAM_OPTIONS = [
    "08.00 – 10.00",
    "10.00 – 12.00",
    "13.00 – 15.00",
    "15.00 – 17.00",
    "17.00 – 19.00",
];

const Order = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        layanan: "Cuci Kiloan Reguler",
        berat: "",
        tanggal: "",
        jam: "",
        nama: "",
        hp: "",
        alamat: "",
        catatan: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [trackingCode, setTrackingCode] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const handleChange = (e) => {
        const { id, name, type, value } = e.target;
        const fieldName = type === "radio" ? name : id;

        setFormData((prev) => ({ ...prev, [fieldName]: value }));

        if (errors[fieldName]) {
            setErrors((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const nextStep = () => {
        // Validation Step 1
        let valid = true;
        const currentErrors = {};

        if (!formData.layanan) {
            currentErrors.layanan = true;
            valid = false;
        }
        if (!formData.berat || Number(formData.berat) < 1) {
            currentErrors.berat = true;
            valid = false;
        }
        if (!formData.tanggal) {
            currentErrors.tanggal = true;
            valid = false;
        }
        if (!formData.jam) {
            currentErrors.jam = true;
            valid = false;
        }

        if (!valid) {
            setErrors(currentErrors);
            return;
        }

        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const prevStep = () => {
        setStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation Step 2
        let valid = true;
        const currentErrors = {};

        if (formData.nama.trim() === "") {
            currentErrors.nama = true;
            valid = false;
        }
        if (formData.hp.replace(/\D/g, "").length < 9) {
            currentErrors.hp = true;
            valid = false;
        }
        if (formData.alamat.trim() === "") {
            currentErrors.alamat = true;
            valid = false;
        }

        if (!valid) {
            setErrors(currentErrors);
            return;
        }

        setIsSubmitting(true);

        // FIX BUG #13: kode order TIDAK LAGI di-generate di sini.
        // Sebelumnya `LK-${6 digit acak}` dibuat di frontend tanpa
        // retry kalau collision - sekarang backend yang generate,
        // validasi keunikan (retry otomatis), dan mengembalikan kode
        // finalnya lewat response. Body request juga tidak lagi
        // mengirim `code` sama sekali.
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                // Sukses: biarkan isSubmitting = true supaya tombol tetap disabled.
                // Komponen akan beralih ke success view, tidak perlu reset state ini.
                setTrackingCode(data.code);
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                // Gagal dari server: parse error message jika ada, lalu biarkan user coba lagi.
                alert(data.message || "Gagal membuat pesanan. Silakan coba lagi.");
                setIsSubmitting(false);
            }
        } catch (error) {
            // Error jaringan / timeout: biarkan user coba lagi.
            console.error(error);
            alert("Kesalahan server. Pesanan belum dibuat.");
            setIsSubmitting(false);
        }
    };

    // Render Success View
    if (isSuccess) {
        return (
            <main className="min-h-[80vh] flex items-center justify-center bg-slate-50 border-t border-slate-200">
                <div className="max-w-xl w-full mx-4 p-8 md:p-12 bg-white rounded-3xl border border-slate-200 relative overflow-hidden shadow-sm text-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="stroke-[3]" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                        Pemesanan Sukses!
                    </h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Kurir kami akan segera meluncur ke lokasimu sesuai jadwal pilihan.
                        Simpan kode ini untuk memudahkan pelacakan status cucian di
                        dashboard.
                    </p>

                    <div className="bg-slate-50 w-full py-5 rounded-2xl border border-slate-200 mb-10 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
              Kode Resi Lacak
            </span>
                        <span className="text-4xl font-black text-slate-900 tracking-wider">
              {trackingCode}
            </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to={`/tracking?code=${trackingCode}`}
                            className="bg-slate-900 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-slate-800 transition shadow-sm w-full sm:w-auto"
                        >
                            Lacak Pesanan
                        </Link>
                        <Link
                            to="/"
                            className="bg-white text-slate-700 border border-slate-200 font-medium px-8 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm w-full sm:w-auto"
                        >
                            Ke Beranda
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <header className="pt-20 pb-12 text-center max-w-2xl mx-auto px-4">
        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
          Order Layanan
        </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                    Jadwalkan Penjemputan
                </h1>

                {/* Stepper Dots */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className={classNames(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                                step >= 1
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-200 text-slate-500",
                            )}
                        >
                            1
                        </div>
                        <span
                            className={classNames(
                                "text-xs font-semibold uppercase",
                                step >= 1 ? "text-slate-900" : "text-slate-400",
                            )}
                        >
              Detail Item
            </span>
                    </div>
                    <div className="w-12 h-px bg-slate-300 -mt-6"></div>
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className={classNames(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                                step >= 2
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-200 text-slate-500",
                            )}
                        >
                            2
                        </div>
                        <span
                            className={classNames(
                                "text-xs font-semibold uppercase",
                                step >= 2 ? "text-slate-900" : "text-slate-400",
                            )}
                        >
              Info Pemesan
            </span>
                    </div>
                </div>
            </header>

            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* STEP 1: Layanan & Waktu */}
                    <div
                        className={classNames("p-8 md:p-12", {
                            block: step === 1,
                            hidden: step !== 1,
                        })}
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
                            1. Detail Pencucian & Waktu
                        </h2>

                        <div className="space-y-8">
                            {/* Jenis Layanan Radio Grid */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Pilih Jenis Layanan
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {LAYANAN_OPTIONS.map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={classNames(
                                                "relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all",
                                                formData.layanan === opt.id
                                                    ? "border-primary-600 bg-primary-50/30 shadow-sm"
                                                    : "border-slate-200 hover:border-slate-300 bg-white",
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="layanan"
                                                value={opt.id}
                                                checked={formData.layanan === opt.id}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between mb-1">
                        <span
                            className={classNames(
                                "font-bold",
                                formData.layanan === opt.id
                                    ? "text-slate-900"
                                    : "text-slate-700",
                            )}
                        >
                          {opt.label}
                        </span>
                                                <div
                                                    className={classNames(
                                                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                                                        formData.layanan === opt.id
                                                            ? "border-primary-600 bg-primary-600"
                                                            : "border-slate-300",
                                                    )}
                                                >
                                                    {formData.layanan === opt.id && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm text-slate-500">{opt.desc}</span>
                                            {/* SINKRONISASI HARGA: tampilkan harga per satuan supaya
                          customer tahu nominal sebelum submit order. */}
                                            <span className="text-sm font-semibold text-primary-600 mt-2">
                        Rp{opt.harga.toLocaleString("id-ID")}/{opt.satuan}
                      </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Berat */}
                            <div>
                                <label
                                    htmlFor="berat"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Estimasi Berat atau Jumlah Item
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="berat"
                                        min="1"
                                        value={formData.berat}
                                        onChange={handleChange}
                                        placeholder="Contoh: 5"
                                        className={classNames(
                                            "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900",
                                            errors.berat
                                                ? "border-red-300 focus:ring-red-500"
                                                : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                        )}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                    Kg / Item
                  </span>
                                </div>
                                {errors.berat && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">
                                        Tentukan berat / jumlah item!!
                                    </p>
                                )}
                            </div>

                            {/* Tanggal & Jam Dropdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="tanggal"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Tanggal Penjemputan
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal"
                                        min={today}
                                        value={formData.tanggal}
                                        onChange={handleChange}
                                        className={classNames(
                                            "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900",
                                            errors.tanggal
                                                ? "border-red-300 focus:ring-red-500"
                                                : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                        )}
                                    />
                                    {errors.tanggal && (
                                        <p className="mt-2 text-sm text-red-500 font-medium">
                                            Tentukan tanggal penjemputan!!
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="jam"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Pilih Jam
                                    </label>
                                    <select
                                        id="jam"
                                        value={formData.jam}
                                        onChange={handleChange}
                                        className={classNames(
                                            "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900 appearance-none",
                                            errors.jam
                                                ? "border-red-300 focus:ring-red-500"
                                                : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                        )}
                                    >
                                        <option value="" disabled>
                                            Pilih rentang waktu
                                        </option>
                                        {JAM_OPTIONS.map((jam) => (
                                            <option key={jam} value={jam}>
                                                {jam}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.jam && (
                                        <p className="mt-2 text-sm text-red-500 font-medium">
                                            Tentukan jam penjemputan!!
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors mt-8"
                            >
                                Lanjutkan ke Detail Alamat <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* STEP 2: Data Pemesan */}
                    <div
                        className={classNames("p-8 md:p-12", {
                            block: step === 2,
                            hidden: step !== 2,
                        })}
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
                            2. Informasi Pemesan
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="nama"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        value={formData.nama}
                                        onChange={handleChange}
                                        placeholder="Nama Pelanggan"
                                        className={classNames(
                                            "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900",
                                            errors.nama
                                                ? "border-red-300 focus:ring-red-500"
                                                : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                        )}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="hp"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Nomor HP / WhatsApp Aktif
                                    </label>
                                    <input
                                        type="tel"
                                        id="hp"
                                        value={formData.hp}
                                        onChange={handleChange}
                                        placeholder="08xxxxxxxxxx"
                                        className={classNames(
                                            "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900",
                                            errors.hp
                                                ? "border-red-300 focus:ring-red-500"
                                                : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                        )}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Digunakan untuk melacak cucian.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="alamat"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Alamat Lengkap & Patokan Rumah
                                </label>
                                <textarea
                                    id="alamat"
                                    rows="3"
                                    value={formData.alamat}
                                    onChange={handleChange}
                                    placeholder="Jalan, RT/RW, nomor rumah, warna rumah..."
                                    className={classNames(
                                        "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900 resize-none",
                                        errors.alamat
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                    )}
                                ></textarea>
                            </div>

                            <div>
                                <label
                                    htmlFor="catatan"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Catatan Ekstra (Opsional)
                                </label>
                                <textarea
                                    id="catatan"
                                    rows="3"
                                    value={formData.catatan}
                                    onChange={handleChange}
                                    placeholder="Pemisahan pakaian putih, noda bandel di kemeja..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition text-slate-900 resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex flex-col-reverse md:flex-row gap-4 justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-full md:w-auto px-6 py-3 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Kembali Edit
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-8 py-3.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition shadow-sm disabled:opacity-75"
                                >
                                    {isSubmitting ? "Memproses..." : "Kirim Pesanan Sekarang"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Order;