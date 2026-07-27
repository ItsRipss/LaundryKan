import { useMemo, useState } from "react";

const DEFAULT_STATUS = "Semua Status";
const DEFAULT_SERVICE = "Semua Layanan";

const STAGE_LABELS = [
    "Diterima",
    "Jemput",
    "Cuci",
    "Kering",
    "Antar",
    "Selesai",
];

const useOrderFilters = (orders = []) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(DEFAULT_STATUS);
    const [layanan, setLayanan] = useState(DEFAULT_SERVICE);

    const layananOptions = useMemo(() => {
        return [...new Set(orders.map((order) => order.layanan).filter(Boolean))];
    }, [orders]);

    const filteredOrders = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return orders.filter((order) => {
            const stageName = STAGE_LABELS[order.manualStage ?? 0];

            const matchSearch =
                keyword === "" ||
                order.code?.toLowerCase().includes(keyword) ||
                order.nama?.toLowerCase().includes(keyword) ||
                order.hp?.toLowerCase().includes(keyword);

            const matchStatus =
                status === DEFAULT_STATUS ||
                stageName === status;

            const matchLayanan =
                layanan === DEFAULT_SERVICE ||
                order.layanan === layanan;

            return (
                matchSearch &&
                matchStatus &&
                matchLayanan
            );
        });
    }, [orders, search, status, layanan]);

    const resetFilters = () => {
        setSearch("");
        setStatus(DEFAULT_STATUS);
        setLayanan(DEFAULT_SERVICE);
    };

    return {
        search,
        setSearch,

        status,
        setStatus,

        layanan,
        setLayanan,

        filteredOrders,
        layananOptions,

        resetFilters,
    };
};

export default useOrderFilters;