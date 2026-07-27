const useAnalyticsStatistics = (filteredOrders) => {

    const totalOrders = filteredOrders.length;

    const selesai = filteredOrders.filter(
        (o) => o.manualStage === 5
    ).length;

    const proses = filteredOrders.filter(
        (o) => o.manualStage < 5
    ).length;

    const totalKg = filteredOrders.reduce(
        (sum, order) => sum + Number(order.berat || 0),
        0
    );

    const avgWeight =
        totalOrders === 0
            ? 0
            : (totalKg / totalOrders).toFixed(1);

    const expressOrders = filteredOrders.filter((o) =>
        o.layanan?.toLowerCase().includes("express")
    ).length;

    const expressRate =
        totalOrders === 0
            ? 0
            : Math.round((expressOrders / totalOrders) * 100);

    const successRate =
        totalOrders === 0
            ? 0
            : Math.round((selesai / totalOrders) * 100);

    const todayOrders = filteredOrders.filter((o) => {

        if (!o.createdAt) return false;

        return (
            new Date(o.createdAt).toDateString() ===
            new Date().toDateString()
        );

    }).length;

    return {
        totalOrders,
        selesai,
        proses,
        totalKg,
        avgWeight,
        expressRate,
        successRate,
        todayOrders,
    };
};

export default useAnalyticsStatistics;