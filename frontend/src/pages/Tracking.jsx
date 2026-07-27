import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import classNames from "classnames";
import { API_URL, API_URL_ROOT } from "../config";

const WL_STAGES = [
  { label: "Pesanan Diterima", icon: "📝" },
  { label: "Menunggu Kurir", icon: "🚚" },
  { label: "Proses Pencucian", icon: "🌊" },
  { label: "Pengeringan & Setrika", icon: "☀️" },
  { label: "Dalam Pengiriman", icon: "🎁" },
  { label: "Selesai", icon: "✅" },
];

const Tracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const [inputCode, setInputCode] = useState(codeFromUrl || "");
  const [inputPhoneLast4, setInputPhoneLast4] = useState(""); // Fitur Anti-IDOR

  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLookup = async (e) => {
    if (e) e.preventDefault();

    if (!inputCode.trim() || !inputPhoneLast4.trim()) {
      setErrorMsg("Harap masukkan Kode Resi dan 4 Digit Terakhir No. HP");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setOrderData(null);

    try {
      // Tambahkan query param phoneLast4
      const url = `${API_URL}/orders/${inputCode.trim().toUpperCase()}?phoneLast4=${inputPhoneLast4.trim()}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Verifikasi No. HP gagal. Pastikan 4 digit terakhir sesuai dengan data order.",
          );
        }
        throw new Error("Order tidak ditemukan. Pastikan kode resi benar.");
      }

      const data = await response.json();
      setOrderData(data);

      // Set url agar bisa di copy paste (tanpa memunculkan hp di URL untuk keamanan)
      setSearchParams({ code: inputCode.trim().toUpperCase() });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (orderData && orderData.code) {
      handleLookup();
    }
  };

  let stageIndex = 0;
  let progressPercent = 0;

  if (orderData) {
    stageIndex =
      orderData.manualStage !== undefined && orderData.manualStage !== null
        ? Number(orderData.manualStage)
        : 0;

    if (stageIndex >= WL_STAGES.length) stageIndex = WL_STAGES.length - 1;
    progressPercent = Math.round((stageIndex / (WL_STAGES.length - 1)) * 100);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="pt-20 pb-12 text-center max-w-2xl mx-auto px-4">
        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
          Lacak Cucian
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Pantau Status Pesananmu
        </h1>
        <p className="text-lg text-slate-600">
          Masukkan Kode Resi beserta verifikasi 4-digit terakhir Nomor HP untuk
          melindungi privasi data cucianmu.
        </p>
      </header>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 mb-8">
          <form
            onSubmit={handleLookup}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Kode Resi (LK-XXXXXX)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition text-slate-900 bg-white"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
            </div>
            <div className="w-full md:w-48 relative">
              <input
                type="text"
                maxLength="4"
                placeholder="4 digit No. HP"
                value={inputPhoneLast4}
                onChange={(e) =>
                  setInputPhoneLast4(e.target.value.replace(/\D/g, ""))
                }
                className="w-full px-4 py-4 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition text-slate-900 bg-white text-center tracking-widest font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition shadow-sm disabled:opacity-75 shrink-0"
            >
              {isLoading ? "Mencari..." : "Lacak"}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}
        </div>

          {orderData && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">

                  {/* HEADER */}

                  <div className="flex flex-col lg:flex-row justify-between gap-6 border-b border-slate-100 pb-8">

                      <div>
                          <h2 className="text-2xl font-bold text-slate-900 break-all">
                              {orderData.code}
                          </h2>

                          <p className="mt-2 text-slate-500">
                              Pemesan
                              {" "}
                              <span className="font-semibold text-slate-800">
            {orderData.nama}
          </span>
                          </p>
                      </div>

                      <div className="text-left lg:text-right">

                          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
                              Status Saat Ini
                          </p>

                          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-5 py-2 font-semibold text-primary-700">
          <span className="text-xl">
            {WL_STAGES[stageIndex].icon}
          </span>

                              {WL_STAGES[stageIndex].label}
                          </div>

                      </div>

                  </div>

                  {/* INFO CARDS */}

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 my-8">

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                              🚚 Kurir
                          </p>

                          <h3 className="mt-3 font-bold text-slate-900">

                              {orderData.courier
                                  ? orderData.courier.nama_lengkap
                                  : "Belum Ditugaskan"}

                          </h3>

                          {orderData.courier && (

                              <p className="text-sm text-slate-500 mt-1">
                                  @{orderData.courier.username}
                              </p>

                          )}

                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                              📅 Estimasi
                          </p>

                          <h3 className="mt-3 font-bold text-slate-900">

                              {orderData.estimatedFinish
                                  ? new Date(orderData.estimatedFinish).toLocaleDateString(
                                      "id-ID",
                                      {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      },
                                  )
                                  : "-"}

                          </h3>

                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                              ⚖ Berat
                          </p>

                          <h3 className="mt-3 font-bold text-slate-900">
                              {orderData.berat} Kg
                          </h3>

                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                              🧺 Layanan
                          </p>

                          <h3 className="mt-3 font-bold text-slate-900">
                              {orderData.layanan}
                          </h3>

                      </div>

                  </div>

            {/* Progress Bar Linear Baru (Pengganti porthole/bubble air lama) */}
            <div className="mb-12">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">
                  Progres Keseluruhan
                </span>
                <span className="text-sm font-bold text-primary-600">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-primary-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Vertical Timeline Modern */}
            <div className="space-y-6">
              {WL_STAGES.map((stage, i) => {
                const isDone = i < stageIndex;
                const isCurrent = i === stageIndex;
                const isPending = i > stageIndex;

                return (
                  <div key={i} className="flex gap-4 relative">
                    {/* Setup Line connecting steps */}
                    {i !== WL_STAGES.length - 1 && (
                      <div
                        className={classNames(
                          "absolute left-5 top-10 bottom-0 w-0.5 -ml-px h-full min-h-[40px]",
                          isDone ? "bg-primary-500" : "bg-slate-200",
                        )}
                      ></div>
                    )}

                    {/* Setup Dot */}
                    <div
                      className={classNames(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2",
                        isDone
                          ? "bg-primary-500 border-primary-500 text-white"
                          : isCurrent
                            ? "bg-white border-primary-500 text-primary-600"
                            : "bg-slate-50 border-slate-300 text-slate-400",
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <span className="text-lg opacity-70">{stage.icon}</span>
                      )}
                    </div>

                    <div className="pb-6 pt-2">
                      <h4
                        className={classNames(
                          "font-bold text-base mb-1",
                          isDone || isCurrent
                            ? "text-slate-900"
                            : "text-slate-500",
                        )}
                      >
                        {stage.label}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium tracking-wide">
                        {isDone
                          ? "Telah diselesaikan"
                          : isCurrent
                            ? "Sedang berlangsung"
                            : "Menunggu antrean"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

                  {/* ===========================
    RIWAYAT AKTIVITAS
=========================== */}

                  <div className="mt-10 border-t border-slate-200 pt-8">

                      <div className="flex items-center justify-between mb-6">

                          <div>
                              <h3 className="text-xl font-bold text-slate-900">
                                  Riwayat Aktivitas
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                  Seluruh proses laundry akan muncul di sini secara otomatis.
                              </p>
                          </div>

                          <button
                              onClick={handleRefresh}
                              disabled={isLoading}
                              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                          >
                              <RefreshCw
                                  size={18}
                                  className={classNames({
                                      "animate-spin": isLoading,
                                  })}
                              />

                              {isLoading ? "Menyinkronkan..." : "Refresh"}
                          </button>

                      </div>

                      {orderData.activities?.length ? (

                          <div className="space-y-5">

                              {orderData.activities.map((activity, index) => (

                                  <div
                                      key={activity.id}
                                      className="flex gap-4"
                                  >

                                      {/* Timeline */}

                                      <div className="flex flex-col items-center">

                                          <div
                                              className="
                w-11
                h-11
                rounded-full
                bg-primary-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                shadow
              "
                                          >
                                              {index + 1}
                                          </div>

                                          {index !== orderData.activities.length - 1 && (

                                              <div
                                                  className="
                  w-1
                  flex-1
                  bg-primary-100
                  my-2
                "
                                              />

                                          )}

                                      </div>

                                      {/* Content */}

                                      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                                          <div className="flex flex-wrap justify-between gap-3">

                                              <div>

                                                  <h4 className="font-bold text-slate-900">

                                                      {activity.description ||
                                                          "Perubahan Status"}

                                                  </h4>

                                                  <p className="text-sm text-slate-500 mt-1">

                                                      {activity.changed_role
                                                          ? activity.changed_role.toUpperCase()
                                                          : "SYSTEM"}

                                                  </p>

                                              </div>

                                              <div className="text-right">

                                                  <p className="text-sm font-semibold text-slate-700">

                                                      {new Date(
                                                          activity.createdAt,
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                          {
                                                              day: "numeric",
                                                              month: "long",
                                                              year: "numeric",
                                                          },
                                                      )}

                                                  </p>

                                                  <p className="text-xs text-slate-500 mt-1">

                                                      {new Date(
                                                          activity.createdAt,
                                                      ).toLocaleTimeString(
                                                          "id-ID",
                                                          {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          },
                                                      )}

                                                  </p>

                                              </div>

                                          </div>

                                      </div>

                                  </div>

                              ))}

                          </div>

                      ) : (

                          <div
                              className="
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50
        py-10
        text-center
        text-slate-500
      "
                          >
                              Belum ada aktivitas pada order ini.
                          </div>

                      )}

                  </div>
                  {/* ===========================
    BUKTI PENGANTARAN
=========================== */}

                  <div className="mt-10 border-t border-slate-200 pt-8">

                      <div className="mb-6">

                          <h3 className="text-xl font-bold text-slate-900">
                              Bukti Pengantaran
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                              Foto ini diunggah oleh kurir setelah pesanan berhasil
                              diantarkan.
                          </p>

                      </div>

                      {orderData.deliveryProof ? (

                          <div className="rounded-3xl border border-slate-200 overflow-hidden bg-slate-50">

                              <img
                                   src={`${API_URL_ROOT}${orderData.deliveryProof.photo_path}`}
                                  alt="Bukti Pengantaran"
                                  className="
                    w-full
                    max-h-[500px]
                    object-cover
                    cursor-pointer
                    hover:opacity-95
                    transition
                "
                                   onClick={() =>
                                       window.open(
                                           `${API_URL_ROOT}${orderData.deliveryProof.photo_path}`,
                                           "_blank"
                                       )
                                   }
                              />

                              <div className="p-6">

                                  <div className="grid md:grid-cols-2 gap-6">

                                      <div>

                                          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                                              Tanggal Upload
                                          </p>

                                          <h4 className="mt-2 font-semibold text-slate-900">

                                              {new Date(
                                                  orderData.deliveryProof.createdAt
                                              ).toLocaleString("id-ID", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })}

                                          </h4>

                                      </div>

                                      <div>

                                          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                                              Status
                                          </p>

                                          <span
                                              className="
                                inline-flex
                                mt-2
                                rounded-full
                                bg-green-100
                                px-4
                                py-2
                                text-green-700
                                font-semibold
                            "
                                          >
                            ✅ Sudah Diantar
                        </span>

                                      </div>

                                  </div>

                              </div>

                          </div>

                      ) : (

                          <div
                              className="
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-slate-50
                py-12
                text-center
            "
                          >

                              <div className="text-5xl mb-4">
                                  📷
                              </div>

                              <h4 className="font-bold text-slate-700">
                                  Belum Ada Bukti Pengantaran
                              </h4>

                              <p className="text-slate-500 mt-2">
                                  Bukti foto akan muncul setelah kurir menyelesaikan
                                  proses pengantaran.
                              </p>

                          </div>

                      )}

                  </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Tracking;
