import { useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import Orders from "./admin/Orders";
import Messages from "./admin/Messages";
import Analytics from "./admin/Analytics";
import { UserCircle, ArrowLeft } from "lucide-react";

import { API_URL } from "../config";

// ==========================================
// MAIN DASHBOARD COMPONENT (AUTH + ROUTING)
// ==========================================
const DashboardAdmin = () => {
    const navigate = useNavigate();

    // Auth State
    const [token, setToken] = useState(sessionStorage.getItem("wl_jwt"));
    const [userRole, setUserRole] = useState(sessionStorage.getItem("wl_role"));
    const [userName, setUserName] = useState(sessionStorage.getItem("wl_name"));

    // Login Form State
    const [username, setUsernameInput] = useState("");
    const [password, setPasswordInput] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const doLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError("");

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                sessionStorage.setItem("wl_jwt", data.token);
                sessionStorage.setItem("wl_role", data.role);
                sessionStorage.setItem("wl_name", data.nama_lengkap);
                setToken(data.token);
                setUserRole(data.role);
                setUserName(data.nama_lengkap);
            } else {
                setLoginError(data.message || "Login gagal.");
            }
        } catch (err) {
            setLoginError("Koneksi server gagal.");
        } finally {
            setIsLoading(false);
        }
    };

    const doLogout = () => {
        sessionStorage.clear();
        setToken(null);
        setUserRole(null);
        setUserName(null);
    };

    // ==========================================
    // TAMPILAN LOGIN SCREEN (Bila Tidak Ada Token)
    // ==========================================
    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center w-12 hover:w-36 h-12 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white shadow-sm overflow-hidden transition-all duration-300"
                    >
                        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium pr-5">
              Kembali
            </span>
                    </button>

                    {/* Header */}
                    <div className="text-center mt-4">
                        <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <UserCircle size={42} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Restricted Area
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm">
                            Masuk menggunakan kredensial pegawai
                            <br />
                            (Admin • Owner • Kurir)
                        </p>
                    </div>
                    {loginError && (
                        <div className="mt-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {loginError}
                        </div>
                    )}
                    <form onSubmit={doLogin} className="space-y-5 mt-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
                        >
                            {isLoading ? "Memverifikasi..." : "Masuk Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ==========================================
    // TAMPILAN DASHBOARD (Di Dalam Layout)
    // ==========================================
    return (
        <Routes>
            <Route
                element={
                    <DashboardLayout
                        userRole={userRole}
                        userName={userName}
                        onLogout={doLogout}
                    />
                }
            >
                <Route path="/" element={<Orders />} />

                <Route path="/messages" element={<Messages token={token} />} />
                <Route
                    path="/analytics"
                    element={
                        userRole === "owner" ? (
                            <Analytics token={token} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Route>
        </Routes>
    );
};

export default DashboardAdmin;
