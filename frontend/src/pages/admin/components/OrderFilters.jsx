import { Search, RotateCcw } from "lucide-react";

const WL_STAGES = [
  "Semua Status",
  "Diterima",
  "Jemput",
  "Cuci",
  "Kering",
  "Antar",
  "Selesai",
];

const OrderFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  layanan,
  setLayanan,
  layananOptions,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 mb-8 shadow-sm">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari kode / nama / HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          {WL_STAGES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        {/* Layanan */}

        <select
          value={layanan}
          onChange={(e) => setLayanan(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          <option>Semua Layanan</option>

          {layananOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        {/* Reset */}

        <button
          onClick={() => {
            setSearch("");
            setStatus("Semua Status");
            setLayanan("Semua Layanan");
          }}
          className="flex justify-center items-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          <RotateCcw size={18} />
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
