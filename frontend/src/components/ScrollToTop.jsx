import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // gunakan "auto" jika tidak ingin animasi
    });
  }); // [pathname] ini berfungsi untuk menahan useEffect jika URL tidak berubah, misalnya ketika kita berada di landing page, lalu kita klik judul website/beranda, useEffect tidak akan berjalan (scroll tidak kembali ke 0px)

  return null;
}
