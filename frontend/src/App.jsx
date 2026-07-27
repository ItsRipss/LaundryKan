import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Tracking from "./pages/Tracking";
import Contact from "./pages/Contact.jsx";
import Layanan from "./pages/Layanan";
import Tentang from "./pages/Tentang";
import Admin from "./pages/Admin";
import ScrollToTop from "./components/ScrollToTop";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {/* Jangan render Navbar & Footer Web Publik jika sedang di Dashboard Admin */}
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/kontak" element={<Contact />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
