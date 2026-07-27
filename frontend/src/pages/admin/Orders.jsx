import OrderTable from "./components/OrderTable";
import OrderStats from "./components/OrderStats";
import OrderFilters from "./components/OrderFilters";
import OrderDetailModal from "./components/OrderDetailModal";
import CourierOrderCards from "./components/CourierOrderCards";
import CourierStats from "./components/CourierStats";
import OperationalSummary from "./components/OperationalSummary";
import useOrderStatistics from "../../hooks/useOrderStatistics";
import useOrders from "../../hooks/useOrders";
import useOrderFilters from "../../hooks/useOrderFilters";
import { RotateCcw } from "lucide-react";

const Orders = () => {
    const token = sessionStorage.getItem("wl_jwt");
    const userRole = sessionStorage.getItem("wl_role");

    const {
        orders,
        fetchOrders,
        selectedOrder,
        setSelectedOrder,
        updateStage,
    } = useOrders(token);

    const STAGE_LABELS = [
        "Diterima",
        "Jemput",
        "Cuci",
        "Kering",
        "Antar",
        "Selesai",
    ];

    const {
        search,
        setSearch,

        status,
        setStatus,

        layanan,
        setLayanan,

        filteredOrders,

        layananOptions,
    } = useOrderFilters(orders);

    const {
        courierTotal,
        courierInProgress,
        courierFinished,

        newOrders,
        pickupOrders,
        washingOrders,
        deliveryOrders,
        completedToday,
    } = useOrderStatistics(orders, filteredOrders);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">
                {userRole === "courier" ? "Order Saya" : "Tinjauan Operasional"}
            </h1>
            <p className="text-slate-500 mb-8">
                {userRole === "courier" ? "Daftar order yang ditugaskan kepada Anda." : "Pantau dan kelola seluruh order laundry."}
            </p>

            {userRole === "courier" && (
                <CourierStats
                    total={courierTotal}
                    inProgress={courierInProgress}
                    finished={courierFinished}
                />
            )}

            {userRole !== "courier" && (
                <OrderStats orders={orders}/>
            )}

            <OperationalSummary
                newOrders={newOrders}
                pickupOrders={pickupOrders}
                washingOrders={washingOrders}
                deliveryOrders={deliveryOrders}
                completedToday={completedToday}
                setStatus={setStatus}
            />

            {/*
                FIX BUG #10: OrderFilters (satu-satunya tempat tombol
                "Reset Filter" berada) sengaja disembunyikan untuk role
                courier. Tapi kartu-kartu di OperationalSummary di atas
                tetap bisa memanggil setStatus(...) untuk SEMUA role,
                termasuk kurir - jadi kurir bisa "terjebak" di satu
                filter status tanpa cara untuk kembali ke "Semua
                Status". Tombol reset ringkas ini khusus untuk kurir,
                cuma muncul saat filter status sedang aktif (tidak
                menampilkan search/layanan seperti OrderFilters penuh,
                karena itu tampaknya memang sengaja disembunyikan untuk
                alur kerja kurir).
            */}
            {userRole === "courier" && status !== "Semua Status" && (
                <button
                    onClick={() => setStatus("Semua Status")}
                    className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
                >
                    <RotateCcw size={16} />
                    Filter aktif: "{status}" — Tampilkan Semua
                </button>
            )}

            {userRole !== "courier" && (
                <OrderFilters
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    layanan={layanan}
                    setLayanan={setLayanan}
                    layananOptions={layananOptions}
                />
            )}

            {userRole !== "courier" && (
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-slate-500">
                        Menampilkan
                        <span className="font-bold text-slate-900">
                {" "}
                            {filteredOrders.length}{" "}
            </span>
                        dari
                        <span className="font-bold text-slate-900">
                {" "}
                            {orders.length}{" "}
            </span>
                        order.
                    </p>
                </div>
            )}

            {userRole === "courier" ? (
                <CourierOrderCards
                    orders={filteredOrders}
                    onSelectOrder={setSelectedOrder}
                    onUpdateStage={updateStage}
                    token={token}
                    refreshOrders={fetchOrders}
                />
            ) : (
                <OrderTable
                    orders={filteredOrders}
                    onSelectOrder={setSelectedOrder}
                    onUpdateStage={updateStage}
                />
            )}

            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onUpdateStage={updateStage}
                token={token}
                userRole={userRole}
                refreshOrders={fetchOrders}
            />
        </div>
    );
};

export default Orders;