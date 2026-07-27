import { Link, useLocation } from "react-router-dom";
import { Menu, X, Droplets } from "lucide-react";
import { useState } from "react";
import classNames from "classnames";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { path: "/", label: "Beranda" },
    { path: "/layanan", label: "Layanan" },
    { path: "/tentang", label: "Tentang" },
    { path: "/kontak", label: "Kontak" },
    { path: "/tracking", label: "Lacak Cucian" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2 group"
            >
              <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition">
                <Droplets size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-primary-600 transition">
                LaundryKan
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={classNames(
                  "text-sm font-medium transition-colors hover:text-primary-600",
                  location.pathname === link.path
                    ? "text-primary-600"
                    : "text-slate-600",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center">
            <Link
              to="/order"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              Order Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Expansion */}
      <div
        className={classNames("md:hidden", { block: isOpen, hidden: !isOpen })}
      >
        <div className="pt-2 pb-3 space-y-1 bg-white border-b border-slate-200 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={classNames(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                location.pathname === link.path
                  ? "bg-primary-50 border-primary-500 text-primary-700"
                  : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 pb-2 px-4 border-t border-slate-200">
            <Link
              to="/order"
              onClick={closeMenu}
              className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800"
            >
              Order Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
