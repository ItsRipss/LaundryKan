// ===============================
// REDESIGN: Sebelumnya komponen ini 1 box vertikal panjang yang
// dipaksa sejajar dengan grid statistik (rasio kolom 4:1). Karena
// tinggi kontennya jarang pas sama dengan kolom sebelahnya, selalu
// muncul celah kosong di salah satu sisi - sudah dicoba beberapa kali
// diperbaiki lewat CSS (items-start, flex justify-between) tapi tetap
// rapuh karena akar masalahnya ada di struktur layout, bukan di CSS.
//
// Sekarang diubah jadi 3 kartu sejajar horizontal (grid 3 kolom),
// full width - dipakai di BAWAH AnalyticsStats, bukan di sampingnya.
// Dengan begini tidak ada lagi 2 blok dengan proporsi tidak seimbang
// yang dipaksa sama tinggi.
// ===============================
const InsightPanel = ({ successRate, avgWeight, expressRate }) => {
    const insights = [
        {
            icon: "✅",
            iconBg: "bg-green-100",
            title: "Success Rate",
            description: (
                <>
                    <span className="font-semibold">{successRate}%</span> order
                    telah berhasil diselesaikan.
                </>
            ),
        },
        {
            icon: "📦",
            iconBg: "bg-blue-100",
            title: "Berat Rata-rata",
            description: (
                <>
                    Setiap order memiliki rata-rata berat{" "}
                    <span className="font-semibold">{avgWeight} Kg</span>.
                </>
            ),
        },
        {
            icon: "⚡",
            iconBg: "bg-purple-100",
            title: "Order Express",
            description: (
                <>
                    Sebanyak{" "}
                    <span className="font-semibold">{expressRate}%</span>{" "}
                    pelanggan memilih layanan Express.
                </>
            ),
        },
    ];

    return (
        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
                Insight Operasional
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white rounded-3xl border shadow-sm p-6 flex items-start gap-4"
                    >
                        <div
                            className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center text-xl shrink-0`}
                        >
                            {item.icon}
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800">
                                {item.title}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InsightPanel;
