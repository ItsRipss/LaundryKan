import { Link } from "react-router-dom";
import { Target, Leaf, Heart, ArrowRight } from "lucide-react";

const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
    <div className="text-3xl font-extrabold text-slate-900 mb-1">{value}</div>
    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
      {label}
    </div>
  </div>
);

const TeamMember = ({ initials, name, role, isLeader }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
    <div
      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-4 ${isLeader ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-700"}`}
    >
      {initials}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-1">{name}</h3>
    <p className="text-sm text-slate-500">{role}</p>
  </div>
);

const Tentang = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <header className="pt-20 pb-16 text-center max-w-4xl mx-auto px-4">
        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
          Cerita Kami
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Dari mesin cuci di garasi,
          <br />
          hingga melayani ribuan keluarga.
        </h1>
        <p className="text-lg text-slate-600">
          LaundryKan berawal dari satu mesin cuci dan niat sederhana untuk
          membuat urusan harian tetangga terasa lebih ringan.
        </p>
      </header>

      {/* STORY & STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Berawal dari keluhan sederhana
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                Tahun 2025, di tengah kesibukan kerja dari rumah, kami sering
                mendengar keluhan yang sama dari tetangga: "cucian menumpuk,
                tapi tidak ada waktu untuk mencuci." Dari situ, sebuah mesin
                cuci rumahan di garasi berubah menjadi layanan antar-jemput
                kecil-kecilan.
              </p>
              <p>
                Berkat dukungan komunitas, operasional kami berkembang pesat.
                Kini, LaundryKan memproses ribuan kilogram pakaian setiap
                bulannya dengan mesin-mesin industri modern. Namun, semangat
                kami tidak pernah berubah: mengembalikan pakaian bersih, wangi,
                beserta senyuman.
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <StatCard value="2025" label="Tahun Berdiri" />
              <StatCard value="800+" label="Kg / Bulan" />
              <StatCard value="70+" label="Pelanggan Aktif" />
              <StatCard value="4.8" label="Rating Rata-rata" />
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Nilai yang Kami Pegang
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Prinsip ini memandu setiap keputusan operasional kami setiap
              harinya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={Target}
              title="Kepercayaan & Presisi"
              description="Setiap pakaian dihitung ulang dan diberi barcode tag. Nol persen toleransi untuk pakaian tertukar atau hilang berkat sistem digitalisasi terpusat."
            />
            <ValueCard
              icon={Leaf}
              title="Komitmen Lingkungan"
              description="Kami bermigrasi menggunakan deterjen yang 100% biodegradable dan mesin cuci bertenaga efisien (mengurangi penggunaan air bersih hingga 30%)."
            />
            <ValueCard
              icon={Heart}
              title="Interaksi Hangat"
              description="Kami melatih seluruh armada kurir dan layanan pelanggan kami tidak hanya untuk menjadi cepat, tapi untuk selalu peduli dan ramah."
            />
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Tim Kami
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Kami tidak menggunakan sistem sewa dari pihak ketiga. Semua
            ditangani oleh tim dedikasi kami sendiri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TeamMember
            initials="SR"
            name="Slamet R."
            role="Owner LaundryKan"
            isLeader={true}
          />
          <TeamMember
            initials="PT"
            name="Putri T."
            role="Admin LaundryKan"
          />
          <TeamMember
            initials="TP"
            name="Tim Produksi"
            role="Karyawan LaundryKan"
          />
          <TeamMember
            initials="KR"
            name="Tim Kurir Eksklusif"
            role="Spesialis Antar-Jemput"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Jadilah bagian dari keluarga kami
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Coba layanan kami sekali, dan hilangkan beban mencuci dari akhir
            pekanmu untuk selamanya.
          </p>
          <Link
            to="/order"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-slate-900 bg-white hover:bg-slate-100 shadow-sm transition-all"
          >
            Pesan Antar Jemput <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Tentang;
