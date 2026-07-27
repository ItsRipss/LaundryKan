import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import socket from "../socket/socket";
import { API_URL } from "../config";

export default function NotificationBell() {
  const token = sessionStorage.getItem("wl_jwt");

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    socket.on("notification:new", () => {
      console.log("🔔 Notification Baru");
      fetchNotifications();
    });

    return () => {
      socket.off("notification:new");
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const markRead = async (id) => {
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
          <div className="p-4 border-b">
            <h2 className="font-bold">Notifikasi</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-6 text-center text-slate-500">
                Tidak ada notifikasi
              </div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`cursor-pointer p-4 border-b hover:bg-slate-50 ${!n.is_read ? "bg-blue-50" : ""}`}
              >
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-slate-500 mt-1">{n.message}</div>
                <div className="text-xs text-slate-400 mt-2">
                  {new Date(n.createdAt).toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
