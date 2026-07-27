import { useEffect, useState } from "react";
import {
    MapPinned,
    User,
    Phone,
    Calendar,
    Clock3,
    Package,
    Weight,
    Sparkles,
    Truck,
    CircleUserRound,
    BadgeCheck,
} from "lucide-react";
import ActivityTimeline from "./OrderDetail/ActivityTimeline";
import OrderHeader from "./OrderDetail/OrderHeader";
import CustomerCard from "./OrderDetail/CustomerCard";
import CourierAssignment from "./OrderDetail/CourierAssignment";
import OrderStatus from "./OrderDetail/OrderStatus";

const WL_STAGES = [
    { label: "Diterima", icon: "📝" },
    { label: "Jemput", icon: "🚚" },
    { label: "Cuci", icon: "🌊" },
    { label: "Kering", icon: "☀️" },
    { label: "Antar", icon: "📦" },
    { label: "Selesai", icon: "✅" },
];

const STAGE_COLORS = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-yellow-100 text-yellow-700",
    "bg-orange-100 text-orange-700",
    "bg-cyan-100 text-cyan-700",
    "bg-green-100 text-green-700",
];

import { API_URL, API_URL_ROOT } from "../../../config";

const OrderDetailModal = ({
                              order,
                              onClose,
                              onUpdateStage,
                              token,
                              userRole,
                              refreshOrders,
                          }) => {
    const [currentStage, setCurrentStage] = useState(order?.manualStage ?? 0);
    const [activities, setActivities] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [selectedCourier, setSelectedCourier] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);
    const [assignedCourier, setAssignedCourier] = useState(null);
    const [deliveryPhoto, setDeliveryPhoto] = useState(null);
    const [uploadingProof, setUploadingProof] = useState(false);
    const [deliveryProof, setDeliveryProof] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(order?.payment_status ?? "Belum Lunas");
    const [updatingPayment, setUpdatingPayment] = useState(false);

    useEffect(() => {
        if (!order) return;

        setCurrentStage(order.manualStage ?? 0);
        setPaymentStatus(order.payment_status ?? "Belum Lunas");
        setSelectedCourier("");
        setAssignedCourier(null);
        setDeliveryPhoto(null);

        fetchActivity();

        if (userRole === "owner" || userRole === "admin") {
            fetchCouriers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    // Early return sekarang aman dilakukan SETELAH semua hooks terpanggil.
    if (!order) return null;

    const fetchActivity = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/${order.code}/activity`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) return;
            const data = await res.json();
            setActivities(data.activities || []);
            setDeliveryProof(data.deliveryProof || null);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCouriers = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/couriers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) return;
            const data = await res.json();
            setCouriers(data);
            if (order.courier_id) {
                setSelectedCourier(order.courier_id);
                const courier = data.find((c) => c.id === Number(order.courier_id));
                if (courier) {
                    setAssignedCourier(courier);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const assignCourier = async () => {
        if (!selectedCourier) return;

        try {
            setAssignLoading(true);

            const res = await fetch(`${API_URL}/orders/${order.code}/assign`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courier_id: selectedCourier,
                }),
            });

            if (!res.ok) {
                alert("Gagal assign kurir");
                return;
            }
            const courier = couriers.find((c) => c.id === Number(selectedCourier));
            setAssignedCourier(courier);
            refreshOrders();
            alert("Kurir berhasil di-assign");
        } catch (err) {
            console.error(err);
        } finally {
            setAssignLoading(false);
        }
    };

    const previousStage = async () => {
        if (currentStage === 0) return;
        const newStage = currentStage - 1;
        setCurrentStage(newStage);
        const success = await onUpdateStage(order.code, newStage);
        if (success) {
            await fetchActivity();
        }
    };

    const nextStage = async () => {
        if (currentStage >= WL_STAGES.length - 1) return;
        const newStage = currentStage + 1;
        setCurrentStage(newStage);
        const success = await onUpdateStage(order.code, newStage);
        if (success) {
            await fetchActivity();
        }
    };

    const courierAction = () => {
        switch (currentStage) {
            case 0:
                return {
                    label: "🚚 Mulai Penjemputan",
                    nextStage: 1,
                };

            case 3:
                return {
                    label: "📦 Mulai Pengantaran",
                    nextStage: 4,
                };

            case 4:
                // FIX BUG: sebelumnya kurir tidak punya tombol apapun di
                // stage 4 ("Antar"), jadi tidak ada cara menyelesaikan
                // order setelah upload bukti foto. Sekarang tombol
                // "Tandai Selesai" muncul begitu deliveryProof sudah ada
                // (foto berhasil diupload) - selaras dengan backend yang
                // mewajibkan delivery_proofs ada sebelum mengizinkan
                // transisi manualStage 4 -> 5 untuk role courier.
                if (deliveryProof) {
                    return {
                        label: "✅ Tandai Selesai",
                        nextStage: 5,
                    };
                }
                return null;

            default:
                return null;
        }
    };

    const doCourierAction = async () => {
        const action = courierAction();

        if (!action) return;

        setCurrentStage(action.nextStage);

        await onUpdateStage(order.code, action.nextStage);

        fetchActivity();
    };

    const updatePaymentStatus = async (newStatus) => {
        try {
            setUpdatingPayment(true);
            const res = await fetch(`${API_URL}/orders/${order.code}/payment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ payment_status: newStatus }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                alert(errData.message || "Gagal mengupdate status pembayaran.");
                return;
            }

            setPaymentStatus(newStatus);
            refreshOrders();
            await fetchActivity();
        } catch (err) {
            console.error(err);
            alert("Kesalahan server saat update pembayaran.");
        } finally {
            setUpdatingPayment(false);
        }
    };

    const uploadProof = async () => {
        if (!deliveryPhoto) {
            alert("Pilih foto terlebih dahulu.");
            return;
        }

        try {
            setUploadingProof(true);

            const formData = new FormData();

            formData.append("photo", deliveryPhoto);

            const res = await fetch(`${API_URL}/orders/${order.code}/upload-proof`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const text = await res.text();

            const data = JSON.parse(text);

            if (!res.ok) {
                alert(data.message || data.error || "Upload gagal");
                return;
            }

            alert("Bukti pengantaran berhasil diupload.");
            setDeliveryPhoto(null);
            refreshOrders();
            await fetchActivity();
        } catch (err) {
            console.error("UPLOAD ERROR");

            console.error(err);

            console.error(err.message);

            alert(err.message);
        } finally {
            setUploadingProof(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                {/* HEADER */}
                <OrderHeader order={order} onClose={onClose} />

                {/* BODY */}

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div
                        className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-7
    "
                    >
                        <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm text-slate-500">Pelanggan</p>

                                    <h2 className="text-2xl font-bold mt-1">{order.nama}</h2>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-xs uppercase text-slate-400">Nomor HP</p>

                                        <p className="font-semibold mt-1">{order.hp}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase text-slate-400">Jadwal</p>

                                        <p className="font-semibold mt-1">
                                            {order.tanggal?.split("T")[0]}
                                            {" • "}
                                            {order.jam}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="
                w-full
                lg:w-72
                rounded-2xl
                bg-slate-50
                border
                border-slate-200
                p-5
            "
                            >
                                <p className="text-sm text-slate-500">Status Saat Ini</p>

                                <div
                                    className={`
                    mt-4
                    rounded-xl
                    px-5
                    py-4
                    text-center
                    font-bold
                    text-lg
                    ${STAGE_COLORS[currentStage]}
                `}
                                >
                                    {WL_STAGES[currentStage].icon}

                                    <div className="mt-2">{WL_STAGES[currentStage].label}</div>
                                </div>

                                <div className="mt-5">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>

                                        <span className="font-bold">
                      {Math.round(
                          ((currentStage + 1) / WL_STAGES.length) * 100,
                      )}
                                            %
                    </span>
                                    </div>

                                    <div className="mt-2 h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-600 transition-all"
                                            style={{
                                                width: `${
                                                    ((currentStage + 1) / WL_STAGES.length) * 100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STATUS */}

                    <OrderStatus
                        stages={WL_STAGES}
                        currentStage={currentStage}
                        setCurrentStage={setCurrentStage}
                        userRole={userRole}
                        orderCode={order.code}
                        onUpdateStage={onUpdateStage}
                        fetchActivity={fetchActivity}
                    />

                    {/* DATA PELANGGAN */}

                    <section className="space-y-6">
                        {/* CUSTOMER + DETAIL */}

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* CUSTOMER */}

                            <CustomerCard order={order} />

                            {/* DETAIL LAUNDRY */}

                            <div
                                className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
                overflow-hidden
            "
                            >
                                <div className="px-6 py-5 border-b bg-slate-50">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <Sparkles size={20} />
                                        Detail Laundry
                                    </h3>
                                </div>

                                <div className="p-6 grid grid-cols-2 gap-6">
                                    <div>
                                        <Package className="text-primary-600 mb-2" size={18} />

                                        <p className="text-xs uppercase text-slate-400">Layanan</p>

                                        <p className="font-semibold">{order.layanan}</p>
                                    </div>

                                    <div>
                                        <Weight className="text-primary-600 mb-2" size={18} />

                                        <p className="text-xs uppercase text-slate-400">Berat</p>

                                        <p className="font-semibold">{order.berat} Kg</p>
                                    </div>

                                    <div>
                                        <Calendar className="text-primary-600 mb-2" size={18} />

                                        <p className="text-xs uppercase text-slate-400">Tanggal</p>

                                        <p className="font-semibold">
                                            {order.tanggal?.split("T")[0]}
                                        </p>
                                    </div>

                                    <div>
                                        <Clock3 className="text-primary-600 mb-2" size={18} />

                                        <p className="text-xs uppercase text-slate-400">Jam</p>

                                        <p className="font-semibold">{order.jam}</p>
                                    </div>

                                    <div className="col-span-2">
                                        <p className="text-xs uppercase text-slate-400 mb-2">
                                            Status Saat Ini
                                        </p>

                                        <div
                                            className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            font-semibold
                            ${STAGE_COLORS[currentStage]}
                        `}
                                        >
                                            {WL_STAGES[currentStage].icon}

                                            {WL_STAGES[currentStage].label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ASSIGN KURIR */}

                        {(userRole === "owner" || userRole === "admin") && (
                            <CourierAssignment
                                userRole={userRole}
                                assignedCourier={assignedCourier}
                                couriers={couriers}
                                selectedCourier={selectedCourier}
                                setSelectedCourier={setSelectedCourier}
                                assignCourier={assignCourier}
                                assignLoading={assignLoading}
                            />
                        )}
                    </section>

                    {/* STATUS PEMBAYARAN */}

                    {(userRole === "owner" || userRole === "admin") && (
                        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b bg-slate-50">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    💳 Status Pembayaran
                                </h3>
                            </div>
                            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase text-slate-400 mb-1">Tagihan</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        Rp {order.total_harga
                                        ? Number(order.total_harga).toLocaleString("id-ID")
                                        : "—"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {order.layanan} · {order.berat} Kg/Item
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                  <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          paymentStatus === "Lunas"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                      }`}
                  >
                    {paymentStatus === "Lunas" ? "✅ Lunas" : "⏳ Belum Lunas"}
                  </span>
                                    {paymentStatus === "Belum Lunas" && (
                                        <button
                                            onClick={() => updatePaymentStatus("Lunas")}
                                            disabled={updatingPayment}
                                            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
                                        >
                                            {updatingPayment ? "Memproses..." : "✔ Tandai Lunas"}
                                        </button>
                                    )}
                                    {paymentStatus === "Lunas" && (
                                        <button
                                            onClick={() => updatePaymentStatus("Belum Lunas")}
                                            disabled={updatingPayment}
                                            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition disabled:opacity-50"
                                        >
                                            {updatingPayment ? "Memproses..." : "↩ Batalkan Lunas"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    <ActivityTimeline activities={activities} stages={WL_STAGES} />

                    {userRole === "courier" && currentStage === 4 && (
                        <section>
                            <h3 className="font-bold text-lg mb-5">Bukti Pengantaran</h3>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setDeliveryPhoto(e.target.files[0])}
                                />

                                {deliveryPhoto && (
                                    <div className="mt-5">
                                        <img
                                            src={URL.createObjectURL(deliveryPhoto)}
                                            alt=""
                                            className="rounded-xl max-h-72 object-cover"
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={uploadProof}
                                    disabled={!deliveryPhoto || uploadingProof}
                                    className="
            mt-5
            bg-primary-600
            hover:bg-primary-700
            text-white
            px-6
            py-3
            rounded-xl
            disabled:opacity-50
        "
                                >
                                    {uploadingProof
                                        ? "Mengupload..."
                                        : "Upload Bukti Pengantaran"}
                                </button>

                                {/*
                                    FIX BUG: hint untuk kurir - menjelaskan
                                    kenapa tombol "Tandai Selesai" belum
                                    muncul di footer sebelum bukti foto ada.
                                */}
                                {!deliveryProof && (
                                    <p className="text-xs text-slate-500 mt-3">
                                        Upload bukti foto terlebih dahulu untuk
                                        memunculkan tombol "Tandai Selesai".
                                    </p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* BUKTI PENGANTARAN */}

                    <section>
                        <h3 className="font-bold text-lg mb-5">Bukti Pengantaran</h3>

                        {deliveryProof ? (
                            <div className="rounded-2xl border bg-slate-50 p-5">
                                <img
                                    src={`${API_URL_ROOT}${deliveryProof.photo_path}`}
                                    alt="Bukti Pengantaran"
                                    className="
                    rounded-xl
                    w-full
                    max-h-[420px]
                    object-cover
                "
                                />

                                <div className="mt-5 space-y-2 text-sm">
                                    <p>
                                        <span className="font-semibold">Diupload:</span>{" "}
                                        {new Date(deliveryProof.createdAt).toLocaleString("id-ID")}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Status:</span>{" "}
                                        <span className="text-green-600 font-semibold">
                      ✔ Bukti berhasil diupload
                    </span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="
                rounded-2xl
                border
                border-dashed
                border-slate-300
                p-10
                text-center
                text-slate-500
            "
                            >
                                Belum ada bukti pengantaran.
                            </div>
                        )}
                    </section>

                    {/* CATATAN */}

                    <section>
                        <h3 className="font-bold text-lg mb-5">Catatan Pelanggan</h3>

                        <div className="rounded-2xl bg-slate-50 p-5 whitespace-pre-wrap">
                            {order.catatan || "Tidak ada catatan."}
                        </div>
                    </section>
                </div>

                {/* FOOTER */}

                <div className="border-t bg-white p-6">
                    {userRole === "courier" ? (
                        <div className="flex justify-between">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300"
                            >
                                Tutup
                            </button>

                            {courierAction() && (
                                <button
                                    onClick={doCourierAction}
                                    className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition"
                                >
                                    {courierAction().label}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-between">
                            <button
                                onClick={previousStage}
                                disabled={currentStage === 0}
                                className=" px-6 py-3 rounded-xl border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition "
                            >
                                ← Status Sebelumnya
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300"
                                >
                                    Tutup
                                </button>

                                <button
                                    onClick={nextStage}
                                    disabled={currentStage === WL_STAGES.length - 1}
                                    className=" px-8 py-3 rounded-xl bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-700 transition "
                                >
                                    {currentStage === WL_STAGES.length - 2
                                        ? "✅ Tandai Selesai"
                                        : "➡ Lanjut Status"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;