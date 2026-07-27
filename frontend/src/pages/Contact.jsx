import { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import classNames from "classnames";
import { API_URL } from "../config";

const Contact = () => {
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        pesan: "",
    });

    const [errors, setErrors] = useState({});
    const [alertInfo, setAlertInfo] = useState({
        show: false,
        type: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        if (errors[id]) {
            setErrors({ ...errors, [id]: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;
        const newErrors = {};

        if (formData.nama.trim() === "") {
            newErrors.nama = true;
            valid = false;
        }
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
        if (!emailOk) {
            newErrors.email = true;
            valid = false;
        }
        if (formData.pesan.trim() === "") {
            newErrors.pesan = true;
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) {
            setAlertInfo({
                show: true,
                type: "error",
                message: "Harap lengkapi semua isian dengan benar.",
            });
            return;
        }

        setIsSubmitting(true);
        setAlertInfo({ show: false, type: "", message: "" });

        try {
            // FIX BUG #13: `id` dihapus total dari body request - ID pesan
            // sekarang digenerate di server (messageController.mjs), bukan
            // di client (`MSG-${Date.now()}` sebelumnya rawan collision
            // kalau 2 submit masuk di milidetik yang sama).
            const response = await fetch(`${API_URL}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setAlertInfo({
                    show: true,
                    type: "success",
                    message: "Pesan terkirim! Tim kami akan membalas ke email Anda.",
                });
                setFormData({ nama: "", email: "", pesan: "" });
            } else {
                throw new Error("Gagal mengirim pesan");
            }
        } catch (error) {
            console.error("Error:", error);
            setAlertInfo({
                show: true,
                type: "error",
                message: "Terjadi kesalahan server. Coba lagi nanti.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            {/* HERO */}
            <header className="pt-20 pb-16 text-center max-w-2xl mx-auto px-4">
        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
          Hubungi Kami
        </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                    Ada pertanyaan?
                </h1>
                <p className="text-lg text-slate-600">
                    Kirim pesan melalui form di bawah ini atau kunjungi langsung fasilitas
                    pencucian kami.
                </p>
            </header>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* FORM SECTION */}
                    <div className="p-8 lg:p-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">
                            Kirim Pesan
                        </h2>

                        {alertInfo.show && (
                            <div
                                className={classNames(
                                    "mb-8 p-4 rounded-xl flex items-start gap-3",
                                    alertInfo.type === "success"
                                        ? "bg-green-50 text-green-800 border border-green-200"
                                        : "bg-red-50 text-red-800 border border-red-200",
                                )}
                            >
                                {alertInfo.type === "success" ? (
                                    <CheckCircle2
                                        className="shrink-0 mt-0.5 text-green-600"
                                        size={20}
                                    />
                                ) : (
                                    <AlertCircle
                                        className="shrink-0 mt-0.5 text-red-600"
                                        size={20}
                                    />
                                )}
                                <span className="font-medium text-sm leading-relaxed">
                  {alertInfo.message}
                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                                    placeholder="Masukkan nama Anda"
                                    className={classNames(
                                        "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900",
                                        errors.nama
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                    )}
                                />
                                {errors.nama && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">
                                        Nama wajib diisi.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Masukkan email Anda"
                                    className={classNames(
                                        "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900",
                                        errors.email
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                    )}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">
                                        Format email tidak valid.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="pesan"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Isi Pesan
                                </label>
                                <textarea
                                    id="pesan"
                                    rows="4"
                                    value={formData.pesan}
                                    onChange={handleChange}
                                    placeholder="Tulis detail pertanyaan atau masukan..."
                                    className={classNames(
                                        "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-slate-900 resize-none",
                                        errors.pesan
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
                                    )}
                                ></textarea>
                                {errors.pesan && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">
                                        Pesan wajib diisi.
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    "Mengirim..."
                                ) : (
                                    <>
                                        <Send size={18} /> Kirim Pesan
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="bg-slate-50 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-200">
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6">
                                    Informasi Kontak
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-primary-600 shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-base mb-1">
                                                Alamat Outlet Utama
                                            </h4>
                                            <p className="text-slate-600 outline-none leading-relaxed text-sm">
                                                Jl. Melong Kidul no.45
                                                <br />
                                                Kota Bandung, Jawa Barat
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-primary-600 shrink-0">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-base mb-1">
                                                Telepon & WhatsApp
                                            </h4>
                                            <p className="text-slate-600 text-sm">0877-1449-1490</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-primary-600 shrink-0">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-base mb-1">
                                                Email Dukungan
                                            </h4>
                                            <p className="text-slate-600 text-sm">
                                                naufalarif199@gmail.com
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-primary-600 shrink-0">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-base mb-1">
                                                Jam Operasional
                                            </h4>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                Senin–Sabtu: 07.00 – 20.00
                                                <br />
                                                Minggu & Libur Nasional tetap buka ( setengah hari )
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">
                                    [Peta Google Maps Terintegrasi]
                                </div>
                                <iframe
                                    className="relative z-10 w-full h-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps?q=Bandung&output=embed"
                                    title="Lokasi LaundryKan di peta"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;