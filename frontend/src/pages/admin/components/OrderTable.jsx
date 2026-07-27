import classNames from "classnames";

const WL_STAGES = [
  { label: "Diterima", icon: "📝" },
  { label: "Jemput", icon: "🚚" },
  { label: "Cuci", icon: "🌊" },
  { label: "Kering", icon: "☀️" },
  { label: "Antar", icon: "📦" },
  { label: "Selesai", icon: "✅" },
];

const OrderTable = ({ orders, onUpdateStage, onSelectOrder }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Pesanan</th>

              <th className="px-6 py-4">Pelanggan</th>

              <th className="px-6 py-4">Lokasi / Jadwal</th>

              <th className="px-6 py-4">Catatan</th>

              <th className="px-6 py-4">Status</th>

              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  Tidak ada order yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const stage = order.manualStage ?? 0;
                const currentStage =
                  WL_STAGES[
                    stage >= WL_STAGES.length ? WL_STAGES.length - 1 : stage
                  ];

                return (
                  <tr
                    key={order.code}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    {/* ORDER */}
                    <td className="px-6 py-4">
                      <div className="font-bold">{order.code}</div>
                      <div className="text-xs text-slate-500">
                        {order.layanan}
                        {" • "}
                        {order.berat} Kg
                      </div>
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-6 py-4">
                      <div className="font-semibold">{order.nama}</div>
                      <div className="text-xs text-slate-500">{order.hp}</div>
                    </td>

                    {/* ADDRESS */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="truncate" title={order.alamat}>
                        {order.alamat}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {order.tanggal?.split("T")[0]}

                        <br />

                        {order.jam}
                      </div>
                    </td>

                    {/* NOTE */}

                    <td className="px-6 py-4 max-w-xs">
                      <div className="truncate" title={order.catatan}>
                        {order.catatan || "-"}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100">
                        <span>{currentStage.icon}</span>

                        <span className="text-sm font-medium">
                          {currentStage.label}
                        </span>
                      </div>
                    </td>

                    {/* ACTION */}

                    {/* ACTION */}

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className="
            px-4
            py-2
            rounded-lg
            bg-slate-900
            text-white
            text-sm
            hover:bg-slate-800
            transition
        "
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
