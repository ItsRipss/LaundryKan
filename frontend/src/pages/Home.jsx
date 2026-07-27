import { Link } from "react-router-dom";
import {
  Truck,
  Clock,
  ShieldCheck,
  CreditCard,
  Star,
  ArrowRight,
} from "lucide-react";

const Card = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="relative p-6 bg-white rounded-2xl border border-slate-200 shadow-sm z-10">
    <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-50">
      {number}
    </div>
    <h4 className="text-lg font-semibold text-slate-900 mt-2 mb-2">{title}</h4>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

const Testimonial = ({ name, role, review }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
    <div className="flex text-yellow-400 mb-4">
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
      <Star size={16} fill="currentColor" />
    </div>
    <p className="text-slate-700 italic mb-6 grow">"{review}"</p>
    <div>
      <div className="font-semibold text-slate-900">{name}</div>
      <div className="text-sm text-slate-500">{role}</div>
    </div>
  </div>
);

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Laundry Favorit Satu Kompleks
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Cucian Kinclong
              <br />
              <span className="text-5xl md:text-6xl font-extrabold text-blue-900 tracking-tight leading-tight mb-6">
                Liburan Tenang
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Jangan biarkan cucian kotor mengganggu waktu luangmu. Kami jemput,
              cuci dengan deterjen premium, dan antar kembali.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/order"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Order Sekarang <ArrowRight size={18} />
              </Link>
              <Link
                to="/tracking"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Lacak Cucian
              </Link>
            </div>
          </div>
        </div>

        {/* Simplified Background Elements */}
        <div className="absolute top-1/2 justify-center w-full flex opacity-[0.03] pointer-events-none -translate-y-1/2 z-0">
          <div className="w-[800px] h-[800px] rounded-full border-4 border-slate-900"></div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-slate-900 mb-1">100+</div>
              <div className="text-sm text-slate-500 font-medium">
                Orderan /bulan
              </div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-slate-900 mb-1">4.8</div>
              <div className="text-sm text-slate-500 font-medium">
                Rating Customer
              </div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                24<span className="text-xl">j</span>
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Standar Selesai
              </div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
              <div className="text-sm text-slate-500 font-medium">
                Garansi Tepat Waktu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Kenapa Memilih LaundryKan?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Kami merancang layanan laundry terbaik agar kamu tidak perlu lagi
            memikirkan urusan mencuci pakaian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={Clock}
            title="Express 6 Jam"
            description="Butuh cepat? Pilih layanan express prioritas, pakaianmu siap dalam hitungan jam."
          />
          <Card
            icon={Truck}
            title="Antar Jemput Gratis"
            description="Bebas biaya antar-jemput untuk radius 5 km dari fasilitas operasi kami."
          />
          <Card
            icon={ShieldCheck}
            title="Deterjen Premium"
            description="Formulasi cairan pembersih yang aman untuk kulit bayi dan kain sutra sekalipun."
          />
          <Card
            icon={CreditCard}
            title="Transparan & Mudah"
            description="Pantau harga aktual tanpa biaya tersembunyi. Tersedia beragam metode pembayaran."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              4 Langkah, Cucian Beres
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Alur kerja kami didesain mulus untuk meminimalkan usahamu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            {/* Connecting Line placeholder for desktop */}
            <div className="hidden lg:block absolute top-[60%] left-0 w-full h-[1px] bg-slate-700/50 -z-10"></div>

            <StepCard
              number="1"
              title="Atur Order"
              description="Pilih jadwal jemput dan tentukan preferensi layanan pencucianmu."
            />
            <StepCard
              number="2"
              title="Kurir Menjemput"
              description="Kurir internal kami akan mendatangi lokasi sesuai waktu yang dijadwalkan."
            />
            <StepCard
              number="3"
              title="Lacak Progres"
              description="Pantau status operasional secara live melalui panel pelanggan kami."
            />
            <StepCard
              number="4"
              title="Tiba Kembali"
              description="Pakaian bersih, wangi, dan terlipat rapi langsung di depan pintumu."
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Kata Mereka
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Kami bersyukur atas kepercayaan lebih dari ratusan keluarga
            setempat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial
            name="Amara R."
            role="Ibu Rumah Tangga"
            review="Sangat membantu banget saat musim hujan! Wanginya enak dan lipatannya selalu rapi masuk lemari."
          />
          <Testimonial
            name="Evelyn P."
            role="Karyawan Swasta"
            review="Dashboard pelacakannya bener-bener kepake. Jadi tau kapan harus standby buka gerbang untuk terima pakaian bersih."
          />
          <Testimonial
            name="Ahmad W."
            role="Mahasiswa"
            review="Harganya masuk kantong mahasiswa tapi servicenya sekelas laundry hotel. Sering banget cuci sepatu putih di sini juga."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Siap beristirahat dari tumpukan cucian?
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Jadwalkan penjemputanmu hari ini dan rasakan bedanya.
          </p>
          <Link
            to="/order"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
          >
            Buat Pesanan Sekarang
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
