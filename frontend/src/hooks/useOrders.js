import { useEffect, useState } from "react";
import socket from "../socket/socket";
import { API_URL } from "../config";

const useOrders = (token) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateStage = async (code, newStage) => {
        try {
            const res = await fetch(
                `${API_URL}/orders/${code}/stage`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        manualStage: newStage,
                    }),
                }
            );

            if (!res.ok) return false;

            // Refresh data dari server
            await fetchOrders();

            setSelectedOrder((prev) => {
                if (!prev) return prev;

                if (prev.code !== code) return prev;

                return {
                    ...prev,
                    manualStage: newStage,
                };
            });

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    useEffect(() => {
        fetchOrders();

        socket.on("orders:refresh", fetchOrders);

        return () => {
            socket.off("orders:refresh", fetchOrders);
        };
    }, []);

    return {
        orders,
        fetchOrders,

        selectedOrder,
        setSelectedOrder,

        updateStage,
    };
};

export default useOrders;