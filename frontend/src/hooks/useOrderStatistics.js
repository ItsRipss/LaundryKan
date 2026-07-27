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

    const completedToday = orders.filter((o) => {
        if ((o.manualStage ?? 0) !== 5) return false;

        if (!o.updatedAt) return false;

        return (
            new Date(o.updatedAt).toDateString() ===
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