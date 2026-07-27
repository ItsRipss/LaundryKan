const AnalyticsStats = ({
                            totalOrders,
                            proses,
                            selesai,
                            totalKg,
                            successRate,
                            avgWeight,
                            expressRate,
                            todayOrders,
                        }) => {
    return (
        <>
            {/* ========================= */}
            {/* Statistik Utama */}
            {/* ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="bg-white rounded-3xl border shadow-sm p-6">

                    <p className="text-slate-500 text-sm">
                        Total Order
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {totalOrders}
                    </h2>

                </div>

                <div className="bg-white rounded-3xl border shadow-sm p-6">

                    <p className="text-slate-500 text-sm">
                        Sedang Diproses
                    </p>

                    <h2 className="text-4xl font-bold text-orange-500 mt-2">
                        {proses}
                    </h2>

                </div>

                <div className="bg-white rounded-3xl border shadow-sm p-6">

                    <p className="text-slate-500 text-sm">
                        Order Selesai
                    </p>

                    <h2 className="text-4xl font-bold text-green-600 mt-2">
                        {selesai}
                    </h2>

                </div>

                <div className="bg-white rounded-3xl border shadow-sm p-6">

                    <p className="text-slate-500 text-sm">
                        Total Berat
                    </p>

                    <h2 className="text-4xl font-bold text-blue-600 mt-2">
                        {totalKg} Kg
                    </h2>

                </div>

            </div>

            {/* ========================= */}
            {/* KPI */}
            {/* ========================= */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg">

                    <p className="text-green-100 text-sm">
                        Success Rate
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {successRate}%
                    </h2>

                    <p className="mt-2 text-green-100">
                        Order berhasil diselesaikan
                    </p>

                </div>

                <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-sky-600 p-6 text-white shadow-lg">

                    <p className="text-blue-100 text-sm">
                        Berat Rata-rata
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {avgWeight} Kg
                    </h2>

                    <p className="mt-2 text-blue-100">
                        Berat setiap order
                    </p>

                </div>

                <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 text-white shadow-lg">

                    <p className="text-violet-100 text-sm">
                        Express
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {expressRate}%
                    </h2>

                    <p className="mt-2 text-violet-100">
                        Order layanan Express
                    </p>

                </div>

                <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg">

                    <p className="text-orange-100 text-sm">
                        Hari Ini
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {todayOrders}
                    </h2>

                    <p className="mt-2 text-orange-100">
                        Order masuk hari ini
                    </p>

                </div>

            </div>
        </>
    );
};

export default AnalyticsStats;