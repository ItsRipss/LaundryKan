const useOrderStatistics = (orders, filteredOrders) => {
    const courierTotal = filteredOrders.length;

    const courierInProgress = filteredOrders.filter(
        (o) => (o.manualStage ?? 0) < 5
    ).length;

    const courierFinished = filteredOrders.filter(
        (o) => (o.manualStage ?? 0) === 5
    ).length;

    const newOrders = orders.filter(
        (o) => (o.manualStage ?? 0) === 0
    ).length;

    const pickupOrders = orders.filter(
        (o) => (o.manualStage ?? 0) === 1
    ).length;

    const washingOrders = orders.filter(
        (o) => (o.manualStage ?? 0) === 2
    ).length;

    const deliveryOrders = orders.filter(
        (o) => (o.manualStage ?? 0) === 4
    ).length;

    // FIX BUG #8: sebelumnya baca `o.updatedAt`, kolom yang TIDAK
    // PERNAH ADA di skema tabel `orders` (cuma ada `createdAt`),
    // sehingga completedToday selalu 0. Sekarang baca `o.completed_at`
    // - kolom baru yang diisi backend HANYA saat manualStage benar-
    // benar berubah jadi 5 ("Selesai"), jadi angkanya akurat
    // mencerminkan order yang selesai hari ini.
    const completedToday = orders.filter((o) => {
        if ((o.manualStage ?? 0) !== 5) return false;

        if (!o.completed_at) return false;

        return (
            new Date(o.completed_at).toDateString() ===
            new Date().toDateString()
        );
    }).length;

    return {
        courierTotal,
        courierInProgress,
        courierFinished,

        newOrders,
        pickupOrders,
        washingOrders,
        deliveryOrders,
        completedToday,
    };
};

export default useOrderStatistics;