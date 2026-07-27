const OperationalSummary = ({
                                newOrders,
                                pickupOrders,
                                washingOrders,
                                deliveryOrders,
                                completedToday,
                                setStatus,
                            }) => {
    return (
        <div className="grid md:grid-cols-5 gap-5 mb-8">

            <button
                onClick={() => setStatus("Diterima")}
                className="bg-white rounded-3xl border p-5 text-left hover:shadow-lg transition"
            >
                <p className="text-sm text-slate-500">
                    Order Baru
                </p>

                <h2 className="text-3xl font-bold mt-3 text-blue-600">
                    {newOrders}
                </h2>
            </button>

            <button
                onClick={() => setStatus("Jemput")}
                className="bg-white rounded-3xl border p-5 text-left hover:shadow-lg transition"
            >
                <p className="text-sm text-slate-500">
                    Perlu Dijemput
                </p>

                <h2 className="text-3xl font-bold mt-3 text-purple-600">
                    {pickupOrders}
                </h2>
            </button>

            <button
                onClick={() => setStatus("Cuci")}
                className="bg-white rounded-3xl border p-5 text-left hover:shadow-lg transition"
            >
                <p className="text-sm text-slate-500">
                    Sedang Dicuci
                </p>

                <h2 className="text-3xl font-bold mt-3 text-amber-600">
                    {washingOrders}
                </h2>
            </button>

            <button
                onClick={() => setStatus("Antar")}
                className="bg-white rounded-3xl border p-5 text-left hover:shadow-lg transition"
            >
                <p className="text-sm text-slate-500">
                    Sedang Diantar
                </p>

                <h2 className="text-3xl font-bold mt-3 text-cyan-600">
                    {deliveryOrders}
                </h2>
            </button>

            <button
                onClick={() => setStatus("Selesai")}
                className="bg-white rounded-3xl border p-5 text-left hover:shadow-lg transition"
            >
                <p className="text-sm text-slate-500">
                    Selesai Hari Ini
                </p>

                <h2 className="text-3xl font-bold mt-3 text-green-600">
                    {completedToday}
                </h2>
            </button>

        </div>
    );
};

export default OperationalSummary;