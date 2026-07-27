import { useEffect, useState } from "react";

import AnalyticsHeader from "./components/AnalyticsHeader";
import AnalyticsStats from "./components/AnalyticsStats";
import InsightPanel from "./components/InsightPanel";
import AnalyticsCharts from "./components/AnalyticsCharts";
import useAnalytics from "../../hooks/useAnalytics";
import useAnalyticsStatistics from "../../hooks/useAnalyticsStatistics";

const API_URL = "http://localhost:3000/api";

const Analytics = () => {

    const {
        orders,

        period,
        setPeriod,

        lastUpdate,
    } = useAnalytics();

    // ==========================
    // Filter
    // ==========================

    const filteredOrders = orders.filter((order) => {
        if (period === "all") return true;

        if (!order.createdAt) return false;

        const created = new Date(order.createdAt);
        const now = new Date();

        if (period === "today") {
            return created.toDateString() === now.toDateString();
        }

        if (period === "7days") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return created >= sevenDaysAgo;
        }

        if (period === "30days") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            return created >= thirtyDaysAgo;
        }

        return true;
    });

    // ==========================
    // Order per Hari
    // ==========================

    const orderPerDay = {};

    filteredOrders.forEach((order) => {
        const date = order.createdAt ? order.createdAt.slice(0, 10) : "-";

        orderPerDay[date] = (orderPerDay[date] || 0) + 1;
    });

    const chartData = Object.entries(orderPerDay)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, total]) => ({
            tanggal: new Date(date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
            }),
            total,
        }));

    // ==========================
    // Distribusi Layanan
    // ==========================

    const layananMap = {};

    filteredOrders.forEach((order) => {
        layananMap[order.layanan] = (layananMap[order.layanan] || 0) + 1;
    });

    const layananChart = Object.keys(layananMap).map((item) => ({
        name: item,
        value: layananMap[item],
    }));

    // ==========================
    // LAPORAN OMZET
    // Menggantikan "Distribusi Status Laundry" (statusChart) yang
    // sebelumnya dihitung di sini - sudah dihapus karena redundan
    // dengan OperationalSummary di halaman Orders (disepakati
    // sebelumnya) dan sudah tidak dirender oleh AnalyticsCharts.
    //
    // omzetPeriod SENGAJA state terpisah dari `period` di atas: filter
    // "period" (all/today/7days/30days) mengatur seluruh statistik &
    // chart order lain di halaman ini, sedangkan omzetPeriod cuma
    // mengatur section Laporan Omzet (dropdown Harian/Mingguan/
    // Bulanan), sesuai keputusan bersama user.
    // ==========================

    const [omzetPeriod, setOmzetPeriod] = useState("harian");

    const omzetFilteredOrders = orders.filter((order) => {
        if (!order.createdAt) return false;

        const created = new Date(order.createdAt);
        const now = new Date();

        if (omzetPeriod === "harian") {
            return created.toDateString() === now.toDateString();
        }

        if (omzetPeriod === "mingguan") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return created >= sevenDaysAgo;
        }

        if (omzetPeriod === "bulanan") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            return created >= thirtyDaysAgo;
        }

        return false;
    });

    // FIX (keputusan user): Total Omzet SEKARANG hanya menjumlahkan
    // order dengan payment_status "Lunas" - merepresentasikan uang
    // yang benar-benar sudah diterima, bukan seluruh nilai transaksi
    // (Lunas + Belum Lunas seperti sebelumnya). Order Belum Lunas
    // tetap terlihat lewat kartu Piutang di bawah, jadi tidak ada
    // data yang hilang, cuma dipisah biar tidak disalahartikan
    // sebagai "uang sudah masuk".
    const totalOmzet = omzetFilteredOrders
        .filter((order) => order.payment_status === "Lunas")
        .reduce((sum, order) => sum + (Number(order.total_harga) || 0), 0);

    // Piutang: SEMUA order Belum Lunas, tanpa terikat periode
    // (keputusan user: piutang dihitung dari semua waktu).
    const piutang = orders
        .filter((order) => order.payment_status === "Belum Lunas")
        .reduce((sum, order) => sum + (Number(order.total_harga) || 0), 0);

    // FIX: Omzet per Hari mengikuti definisi baru Total Omzet -
    // hanya order Lunas yang dihitung, supaya grafik konsisten
    // dengan angka ringkasan di atasnya.
    const omzetPerDay = {};

    omzetFilteredOrders
        .filter((order) => order.payment_status === "Lunas")
        .forEach((order) => {
            const date = order.createdAt ? order.createdAt.slice(0, 10) : "-";
            const harga = Number(order.total_harga) || 0;

            omzetPerDay[date] = (omzetPerDay[date] || 0) + harga;
        });

    const omzetChartData = Object.entries(omzetPerDay)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, total]) => ({
            tanggal: new Date(date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
            }),
            total,
        }));

    // FIX: Omzet per Jenis Layanan mengikuti definisi baru juga -
    // hanya order Lunas.
    const omzetPerLayanan = {};

    omzetFilteredOrders
        .filter((order) => order.payment_status === "Lunas")
        .forEach((order) => {
            const harga = Number(order.total_harga) || 0;
            omzetPerLayanan[order.layanan] = (omzetPerLayanan[order.layanan] || 0) + harga;
        });

    const omzetLayananChart = Object.keys(omzetPerLayanan).map((item) => ({
        name: item,
        value: omzetPerLayanan[item],
    }));

    // ==========================
    // KPI
    // ==========================

    const {
        totalOrders,
        selesai,
        proses,
        totalKg,
        avgWeight,
        expressRate,
        successRate,
        todayOrders,
    } = useAnalyticsStatistics(filteredOrders);

    return (
        <div className="space-y-8">
            <AnalyticsHeader
                period={period}
                setPeriod={setPeriod}
                lastUpdate={lastUpdate}
            />

            {/*
        REDESIGN: Sebelumnya AnalyticsStats & InsightPanel disusun
        dalam 1 grid "xl:grid-cols-5" (rasio 4:1) berdampingan, yang
        selalu bermasalah - kolom manapun yang kontennya lebih pendek
        akan punya celah kosong aneh saat disamakan tingginya dengan
        kolom sebelah. Sudah dicoba beberapa pendekatan CSS tapi tetap
        rapuh terhadap perubahan data.

        Sekarang keduanya disusun VERTIKAL (full width, satu di bawah
        yang lain) - lihat juga redesign InsightPanel.jsx yang sudah
        diubah jadi 3 kartu horizontal sejajar. Dengan begini tidak
        ada lagi 2 blok berbeda proporsi yang dipaksa sama tinggi.
      */}
            <AnalyticsStats
                totalOrders={totalOrders}
                proses={proses}
                selesai={selesai}
                totalKg={totalKg}
                successRate={successRate}
                avgWeight={avgWeight}
                expressRate={expressRate}
                todayOrders={todayOrders}
            />

            <InsightPanel
                successRate={successRate}
                avgWeight={avgWeight}
                expressRate={expressRate}
            />

            <AnalyticsCharts
                chartData={chartData}
                layananChart={layananChart}
                omzetPeriod={omzetPeriod}
                setOmzetPeriod={setOmzetPeriod}
                totalOmzet={totalOmzet}
                piutang={piutang}
                omzetChartData={omzetChartData}
                omzetLayananChart={omzetLayananChart}
            />
        </div>
    );
};

export default Analytics;