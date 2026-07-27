import CourierUploadProof from "./CourierUploadProof";

const WL_STAGES = [
    { label: "Diterima", icon: "📝" },
    { label: "Jemput", icon: "🚚" },
    { label: "Cuci", icon: "🫧" },
    { label: "Kering", icon: "☀️" },
    { label: "Antar", icon: "📦" },
    { label: "Selesai", icon: "✅" },
];

const CourierOrderCards = ({
                               orders,
                               onSelectOrder,
                               onUpdateStage,
                               token,
                               refreshOrders,
                           }) => {
    return (
        <div className="grid gap-5">
            {orders.length === 0 && (
                <div className="bg-white rounded-3xl p-10 text-center border">
                    <p className="text-slate-500">
                        Tidak ada order yang ditugaskan.
                    </p>
                </div>
            )}

            {orders.map((order) => {
                const stage = WL_STAGES[order.manualStage ?? 0];
                const currentStage = order.manualStage ?? 0;
                const nextStage = currentStage + 1;

                const nextStageData =
                    nextStage < WL_STAGES.length
                        ? WL_STAGES[nextStage]
                        : null;

                const progress = Math.round(
                    ((currentStage + 1) / WL_STAGES.length) * 100
                );

                return (
                    <div
                        key={order.code}
                        className="bg-white rounded-3xl border shadow-sm p-6 hover:shadow-lg transition cursor-pointer"
                        onClick={() => onSelectOrder(order)}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-xl">
                                    {order.code}
                                </h2>

                                <p className="text-slate-500 mt-1">
                                    {order.nama}
                                </p>

                                <p className="text-xs text-slate-400 mt-2">
                                    📞 {order.hp}
                                </p>
                            </div>

                            <div className="px-4 py-2 rounded-xl bg-primary-100 text-primary-700 font-semibold">
                                {stage.icon} {stage.label}
                            </div>
                        </div>

                        {/* Informasi Order */}
                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Layanan
                                </p>

                                <p className="font-semibold">
                                    {order.layanan}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Berat
                                </p>

                                <p className="font-semibold">
                                    {order.berat} Kg
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">
                                    Alamat
                                </p>

                                <p className="font-semibold">
                                    {order.alamat}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Jadwal
                                </p>

                                <p className="font-semibold">
                                    {order.tanggal?.split("T")[0]}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Jam
                                </p>

                                <p className="font-semibold">
                                    {order.jam}
                                </p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-slate-700">
                                    Progress Order
                                </span>

                                <span className="font-bold text-primary-600">
                                    {progress}%
                                </span>
                            </div>

                            <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                    className="h-full bg-primary-600 transition-all"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Tombol */}
                        <div className="mt-6 space-y-3">
                            {nextStageData && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUpdateStage(order.code, nextStage);
                                    }}
                                    className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white py-3 font-semibold transition"
                                >
                                    {nextStageData.icon} Ubah ke{" "}
                                    {nextStageData.label}
                                </button>
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();

                                    window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            order.alamat
                                        )}`,
                                        "_blank"
                                    );
                                }}
                                className="w-full rounded-xl border border-slate-300 hover:bg-slate-100 py-3 transition"
                            >
                                📍 Buka Google Maps
                            </button>

                            {currentStage === 4 && (
                                <CourierUploadProof
                                    order={order}
                                    token={token}
                                    refreshOrders={refreshOrders}
                                />
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectOrder(order);
                                }}
                                className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 text-white py-3 transition"
                            >
                                Lihat Detail Order
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CourierOrderCards;