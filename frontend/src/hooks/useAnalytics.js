import { useEffect, useState } from "react";
import { API_URL } from "../config";

const useAnalytics = () => {
    const token = sessionStorage.getItem("wl_jwt");

    const [orders, setOrders] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [period, setPeriod] = useState("all");

    useEffect(() => {
        const fetchOrders = () => {
            fetch(`${API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setOrders(data);
                    setLastUpdate(new Date());
                });
        };

        fetchOrders();

        const interval = setInterval(fetchOrders, 5000);

        return () => clearInterval(interval);
    }, [token]);

    return {
        orders,

        period,
        setPeriod,

        lastUpdate,
    };
};

export default useAnalytics;