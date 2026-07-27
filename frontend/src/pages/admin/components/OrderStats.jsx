import {
    ShoppingBag,
    Clock3,
    Truck,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";

const OrderStats = ({ orders }) => {
    const total = orders.length;

    const processing = orders.filter(
        (order) => (order.manualStage ?? 0) < 5,
    ).length;

    const delivering = orders.filter(
        (order) => (order.manualStage ?? 0) === 4,
    ).length;

    const completed = orders.filter(
        (order) => (order.manualStage ?? 0) === 5,
    ).length;

    const completionRate =
        total === 0 ? 0 : Math.round((completed / total) * 100);

    const cards = [
        {
            title: "Total Order",
            value: total,
            description: "Seluruh order yang masuk",
            icon: ShoppingBag,
            color:
                "from-blue-500 to-indigo-600",
            bg:
                "bg-blue-50",
            text:
                "text-blue-700",
            progress: 100,
        },
        {
            title: "Sedang Diproses",
            value: processing,
            description: "Masih berada di proses laundry",
            icon: Clock3,
            color:
                "from-amber-500 to-orange-500",
            bg:
                "bg-amber-50",
            text:
                "text-amber-700",
            progress:
                total === 0
                    ? 0
                    : Math.round((processing / total) * 100),
        },
        {
            title: "Sedang Diantar",
            value: delivering,
            description: "Kurir sedang melakukan pengantaran",
            icon: Truck,
            color:
                "from-cyan-500 to-sky-600",
            bg:
                "bg-cyan-50",
            text:
                "text-cyan-700",
            progress:
                total === 0
                    ? 0
                    : Math.round((delivering / total) * 100),
        },
        {
            title: "Order Selesai",
            value: completed,
            description: `${completionRate}% order berhasil diselesaikan`,
            icon: CheckCircle2,
            color:
                "from-green-500 to-emerald-600",
            bg:
                "bg-green-50",
            text:
                "text-green-700",
            progress: completionRate,
        },
    ];

    return (
        <section className="mb-10">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    Ringkasan Operasional
                </h2>

                <p className="text-slate-500 mt-1">
                    Gambaran kondisi operasional laundry secara keseluruhan.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="
                group
                bg-white
                rounded-3xl
                border
                border-slate-200
                p-6
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        {card.title}
                                    </p>

                                    <h2 className="text-4xl font-bold text-slate-900 mt-3">
                                        {card.value}
                                    </h2>
                                </div>

                                <div
                                    className={`
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-br
                    ${card.color}
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    group-hover:scale-110
                    transition
                  `}
                                >
                                    <Icon size={28} />
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">
                    Progress
                  </span>

                                    <span className={`font-bold ${card.text}`}>
                    {card.progress}%
                  </span>
                                </div>

                                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${card.color} transition-all duration-700`}
                                        style={{
                                            width: `${card.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {card.description}
                                </p>

                                <TrendingUp
                                    size={18}
                                    className={card.text}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default OrderStats;