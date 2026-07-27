/**
 * Konfigurasi URL API terpusat.
 * Gunakan file ini untuk semua referensi API agar mudah diganti saat deployment.
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const API_URL_ROOT = import.meta.env.VITE_API_URL_ROOT || "http://localhost:3000";
