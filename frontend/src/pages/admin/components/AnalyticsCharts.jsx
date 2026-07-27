import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from "recharts";

const COLORS = [
    "#2563eb",
    "#22c55e",
    "#f97316",
    "#e11d48",
    "#8b5cf6",
    "#06b6d4",
];

// LAPORAN OMZET: label tampilan untuk tiap opsi periode.
const OMZET_PERIOD_LABELS = {
    harian: "Hari Ini",
    mingguan: "7 Hari Terakhir",
    bulanan: "30 Hari Terakhir",
};

// LAPORAN OMZET: format angka rupiah ringkas untuk sumbu chart
// (misal 1.500.000 -> "1.5jt", 25000 -> "25rb") supaya label sumbu
// tidak kepanjangan dan bertabrakan.
const formatRupiahShort = (value) => {
    const num = Number(value) || 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
    if (num >= 1000) return `${Math.round(num / 1000)}rb`;
    return `${num}`;
};

const formatRupiahFull = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const AnalyticsCharts = ({
                             chartData,
                             layananChart,
                             statusChart,

                             // LAPORAN OMZET: props baru untuk fitur Laporan Omzet.
                             // Diberi default value supaya file ini bisa di-test
                             // sendiri sebelum Analytics.jsx disambungkan (tahap
                             // berikutnya) - tanpa default, render akan error saat
                             // props ini belum dikirim (undefined).
                             omzetPeriod = "harian",
                             setOmzetPeriod = () => {},
                             totalOmzet = 0,
                             piutang = 0,
                             omzetChartData = [],
                             omzetLayananChart = [],
                         }) => {
    return (
        <div className="grid xl:grid-cols-3 gap-6">

            {/* ========================= */}
            {/* Order per Hari */}
            {/* ========================= */}

            <div className="xl:col-span-2 bg-white rounded-3xl border shadow-sm p-6">

                <h2 className="font-bold text-lg mb-6">
                    Order per Hari
                </h2>

                <div className="h-80">

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart data={chartData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="tanggal" />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#2563eb"
                                strokeWidth={3}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* ========================= */}
            {/* Jenis Layanan */}
            {/* ========================= */}

            <div className="bg-white rounded-3xl border shadow-sm p-6">

                <h2 className="font-bold text-lg mb-6">
                    Jenis Layanan
                </h2>

                <div className="h-80">

                    <ResponsiveContainer width="100%" height="100%">

                        <PieChart>

                            <Pie
                                data={layananChart}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >

                                {layananChart.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />

                                ))}

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* ========================= */}
            {/* LAPORAN OMZET */}
            {/* Menggantikan "Distribusi Status Laundry" - disepakati */}
            {/* kurang berguna karena redundan dengan OperationalSummary */}
            {/* di halaman Orders. */}
            {/* ========================= */}

            <div className="xl:col-span-3 bg-white rounded-3xl border shadow-sm p-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="font-bold text-lg">
                        Laporan Omzet
                    </h2>

                    <select
                        value={omzetPeriod}
                        onChange={(e) => setOmzetPeriod(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="harian">Harian</option>
                        <option value="mingguan">Mingguan</option>
                        <option value="bulanan">Bulanan</option>
                    </select>
                </div>

                {/* Ringkasan Angka */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                        <p className="text-sm text-slate-500">
                            Total Omzet ({OMZET_PERIOD_LABELS[omzetPeriod]})
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {formatRupiahFull(totalOmzet)}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
                        <p className="text-sm text-red-600">
                            Piutang / Belum Tertagih (Semua Waktu)
                        </p>
                        <p className="text-3xl font-bold text-red-700 mt-2">
                            {formatRupiahFull(piutang)}
                        </p>
                    </div>
                </div>

                {/* Grafik */}
                <div className="grid xl:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-4">
                            Omzet per Hari
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={omzetChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="tanggal" />
                                    <YAxis tickFormatter={formatRupiahShort} width={50} />
                                    <Tooltip
                                        formatter={(value) => [formatRupiahFull(value), "Omzet"]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#22c55e"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-700 mb-4">
                            Omzet per Jenis Layanan
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={omzetLayananChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11 }}
                                        interval={0}
                                        angle={-15}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis tickFormatter={formatRupiahShort} width={50} />
                                    <Tooltip
                                        formatter={(value) => [formatRupiahFull(value), "Omzet"]}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#2563eb"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AnalyticsCharts;