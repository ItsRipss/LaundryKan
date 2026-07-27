import { useEffect, useState } from "react";
import { API_URL } from "../../../config";

const ActivityFeed = () => {
    const token = sessionStorage.getItem("wl_jwt");

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const res = await fetch(
                `${API_URL}/orders/activity-feed`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await res.json();

            if (res.ok) {
                setActivities(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();

        const interval = setInterval(fetchActivities, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-3xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                    Aktivitas Terbaru
                </h2>

                <span className="text-xs text-slate-500">
                    Auto Refresh
                </span>
            </div>

            {loading && (
                <div className="text-slate-500">
                    Memuat aktivitas...
                </div>
            )}

            {!loading && activities.length === 0 && (
                <div className="text-slate-500">
                    Belum ada aktivitas.
                </div>
            )}

            <div className="space-y-5">
                {activities.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4"
                    >
                        <div className="mt-1">
                            <div className="w-3 h-3 rounded-full bg-primary-600" />
                        </div>

                        <div className="flex-1">
                            <p className="font-semibold">
                                {item.description}
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Order :
                                {" "}
                                <span className="font-medium">
                                    {item.order_code}
                                </span>
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                                {item.nama_lengkap || "System"}
                                {" • "}
                                {item.changed_role}
                            </p>

                            <p className="text-xs text-slate-400">
                                {new Date(item.createdAt).toLocaleString(
                                    "id-ID",
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;