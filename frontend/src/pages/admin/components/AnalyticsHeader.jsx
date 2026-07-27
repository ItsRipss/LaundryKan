const AnalyticsHeader = ({
                             period,
                             setPeriod,
                             lastUpdate,
                         }) => {
    return (
        <div className="bg-white rounded-3xl border p-8 shadow-sm">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        Statistik Laundry
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Analisis performa operasional LaundryKan.
                    </p>

                    <p className="text-sm text-slate-400 mt-2">
                        Update terakhir :
                        {" "}
                        {lastUpdate.toLocaleTimeString("id-ID")}
                    </p>

                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={() => setPeriod("today")}
                        className={`px-5 py-2 rounded-xl transition ${
                            period === "today"
                                ? "bg-primary-600 text-white"
                                : "bg-white border hover:bg-slate-50"
                        }`}
                    >
                        Hari Ini
                    </button>

                    <button
                        onClick={() => setPeriod("7days")}
                        className={`px-5 py-2 rounded-xl transition ${
                            period === "7days"
                                ? "bg-primary-600 text-white"
                                : "bg-white border hover:bg-slate-50"
                        }`}
                    >
                        7 Hari
                    </button>

                    <button
                        onClick={() => setPeriod("30days")}
                        className={`px-5 py-2 rounded-xl transition ${
                            period === "30days"
                                ? "bg-primary-600 text-white"
                                : "bg-white border hover:bg-slate-50"
                        }`}
                    >
                        30 Hari
                    </button>

                    <button
                        onClick={() => setPeriod("all")}
                        className={`px-5 py-2 rounded-xl transition ${
                            period === "all"
                                ? "bg-primary-600 text-white"
                                : "bg-white border hover:bg-slate-50"
                        }`}
                    >
                        Semua
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AnalyticsHeader;