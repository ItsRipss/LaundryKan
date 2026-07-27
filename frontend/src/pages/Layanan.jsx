import { Link } from "react-router-dom";
import {
  Shirt,
  Zap,
  CheckCircle2,
  Package,
  Sparkles,
  Wind,
} from "lucide-react";
import classNames from "classnames";

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  price,
  unit,
  features,
  isPopular,
}) => (
  <div
    className={classNames(
      "bg-white rounded-2xl border p-6 flex flex-col h-full relative",
      isPopular ? "border-primary-500 shadow-md" : "border-slate-200 shadow-sm",
    )}
  >
    {isPopular && (
      <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        Paling Diminati
      </div>
    )}
    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-800">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm mb-6 grow">{description}</p>

    <div className="mb-6 flex items-baseline gap-1">
      <span className="text-3xl font-extrabold text-slate-900">{price}</span>
      <span className="text-slate-500 font-medium">/{unit}</span>
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
          <CheckCircle2
            size={18}
            className="text-primary-500 shrink-0 mt-0.5"
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <Link
      to="/order"
      className={classNames(
        "w-full py-3 px-4 rounded-xl font-medium text-center transition-colors",
        isPopular
          ? "bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
          : "bg-slate-100 hover:bg-slate-200 text-slate-900",
      )}
    >
      Pesan Layanan
    </Link>
  </div>
);

const FaqItem = ({ question, answer }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900 mb-3">{question}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
  </div>
);

const Layanan = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <header className="pt-20 pb-16 text-center max-w-3xl mx-auto px-4">
        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
          Layanan & Harga
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Pilih layanan yang pas untuk cucianmu
        </h1>
        <p className="text-lg text-slate-600">
          Dari pakaian harian hingga perawatan jas berharga, kami menyediakan
          solusi pencucian profesional dengan transparansi harga.
        </p>
      </header>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={Shirt}
            title="Cuci Kiloan Reguler"
            description="Solusi praktis untuk pakaian sehari-harimu. Cuci, kering, dan lipat rapi."
            price="Rp7.000"
            unit="kg"
            features={[
              "Minimal berat 3 kg",
              "Deterjen dengan wangi tahan lama",
              "Dilipat rapi & dikemas plastik",
              "Estimasi selesai 2 hari kerja",
            ]}
            isPopular={true}
          />
          <ServiceCard
            icon={Zap}
            title="Cuci Kiloan Express"
            description="Layanan prioritas untuk kamu yang sedang terburu-buru."
            price="Rp12.000"
            unit="kg"
            features={[
              "Minimal berat 2 kg",
              "Prioritas antrian mesin cuci",
              "Estimasi selesai 6 jam",
              "Notifikasi instan via dashboard",
            ]}
          />
          <ServiceCard
            icon={Sparkles}
            title="Dry Clean"
            description="Perawatan khusus menggunakan pelarut non-air untuk bahan kain sensitif."
            price="Rp25.000"
            unit="item"
            features={[
              "Tanpa minimal pesanan",
              "Penanganan khusus per jenis bahan",
              "Disetrika uap & digantung",
              "Estimasi selesai 2-3 hari kerja",
            ]}
          />
          <ServiceCard
            icon={Shirt} // Ganti icon dari sepatu ke shirt aja dulu
            title="Cuci Sepatu Spesialis"
            description="Pembersihan mendalam untuk sol dan upper sepatu sneakers kesayanganmu."
            price="Rp20.000"
            unit="pasang"
            features={[
              "Proses sikat manual yang teliti",
              "Aplikasi deodorizer anti-bau",
              "Tanpa mesin putar kasar",
              "Estimasi selesai 1-2 hari kerja",
            ]}
          />
          <ServiceCard
            icon={Package}
            title="Bed Cover & Selimut"
            description="Pencucian kain berukuran ekstra besar menggunakan mesin kapasitas 20kg."
            price="Rp30.000"
            unit="item"
            features={[
              "Dicuci secara terpisah",
              "Jaminan kebersihan hingga sela kain",
              "Dikemas kedap udara (vakum)",
              "Estimasi selesai 2 hari kerja",
            ]}
          />
          <ServiceCard
            icon={Wind}
            title="Setrika Saja"
            description="Layanan press & setrika untuk pakaian yang sudah bersih dicuci di rumah."
            price="Rp5.000"
            unit="kg"
            features={[
              "Minimal pengerjaan 3 kg",
              "Disetrika uap kecepatan tinggi",
              "Pilihan lipat atau gantung",
              "Estimasi selesai 1 hari kerja",
            ]}
          />
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Pertanyaan Seputar Layanan
            </h2>
            <p className="text-slate-600">
              Pelajari lebih lanjut tentang bagaimana kami memproses pakaianmu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FaqItem
              question="Apakah ada minimal berat cucian?"
              answer="Untuk kategori Cuci Kiloan (Reguler & Express), kami menerapkan standar minimal 2–3 kg. Sedangkan untuk layanan satuan seperti Dry Clean dan Sepatu, tidak ada batas minimal."
            />
            <FaqItem
              question="Bagaimana sistem pembayaran dilakukan?"
              answer="Pembayaran baru akan dilakukan setelah cucian selesai dan diantarkan kembali ke lokasimu. Kami menerima uang tunai langsung atau transfer bank via kurir kami."
            />
            <FaqItem
              question="Bisa request deterjen khusus atau dipisah?"
              answer="Tentu saja. Saat mengisi form order, silakan tulis pada kolom 'Catatan' jika kamu membutuhkan pewangi khusus atau ingin pakaian putih dipisahkan dari pakaian berwarna."
            />
            <FaqItem
              question="Bagaimana jika barang di dalam kantong tertinggal?"
              answer="Standar operasional kami mengharuskan tim memeriksa teliti isi saku sebelum dicuci. Benda berharga yang ditemukan akan disimpan dengan aman dan dikembalikan bersama pakaian."
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Layanan;
