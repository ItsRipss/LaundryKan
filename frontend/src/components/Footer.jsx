import { Link } from "react-router-dom";
import { Droplets, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Droplets size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                LaundryKan
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sistem manajemen laundry modern. Bikin urusan cucian jadi ringan,
              transparan, dan dapat dipantau dari mana saja.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-3 shrink-0">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/layanan"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Layanan & Harga
                </Link>
              </li>
              <li>
                <Link
                  to="/tentang"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Layanan
            </h4>
            <ul className="space-y-3 shrink-0">
              <li>
                <Link
                  to="/order"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Order Antar Jemput
                </Link>
              </li>
              <li>
                <Link
                  to="/tracking"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Lacak Status Cucian
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-4 shrink-0">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={18} className="shrink-0 text-slate-500" />
                <span>
                  Jl. Melong Kidul no.45,
                  <br />
                  Bandung, Jawa Barat
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={18} className="shrink-0 text-slate-500" />
                <span>0877-1449-1490</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={18} className="shrink-0 text-slate-500" />
                <span>naufalarif199@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; 2025 LaundryKan. All Right Reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">Internal Portal:</span>
            <Link
              to="/admin"
              className="text-slate-400 hover:text-white underline transition-colors"
            >
              Dashboard Pegawai
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
