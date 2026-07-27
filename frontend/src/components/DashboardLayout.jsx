import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  LogOut,
  Bell,
} from "lucide-react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import socket from "../socket/socket";
import NotificationToast from "./NotificationToast";
import { API_URL } from "../config";

export const DashboardLayout = ({ userRole, userName, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [toast, setToast] = useState(null);

  const token = sessionStorage.getItem("wl_jwt");
  const location = useLocation();

  // Menu berdasarkan role
  const menuItems = [
    {
      path: "/admin",
      label: "Tinjauan Order",
      icon: ShoppingBag,
      roles: ["owner", "admin", "courier"],
    },
    {
      path: "/admin/messages",
      label: "Pesan Masuk",
      icon: MessageSquare,
      roles: ["owner", "admin"],
    },
    {
      path: "/admin/analytics",
      label: "Statistik",
      icon: LayoutDashboard,
      roles: ["owner"],
    },
  ];

  const visibleMenus = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );
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

  const markNotificationRead = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: 1 } : item)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: 1,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    socket.on("notification:new", (data) => {
      fetchNotifications();
      setToast(data);
      setTimeout(() => {
        setToast(null);
      }, 5000);
    });
    socket.on("notification:read", ({ id }) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id == id ? { ...item, is_read: 1 } : item)),
      );
    });

    socket.on("notification:read-all", () => {
      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: 1,
        })),
      );
    });
    return () => {
      socket.off("notification:new");
      socket.off("notification:read");
      socket.off("notification:read-all");
    };
  }, []);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white mb-1">Internal Panel</h1>
          <p className="text-xs text-slate-400 capitalize tracking-wider font-semibold">
            {userRole} Access
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleMenus.map((menu) => {
            const Icon = menu.icon;
            const isActive = location.pathname === menu.path;
            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={classNames(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm",
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                )}
              >
                <Icon
                  size={20}
                  className={classNames(
                    isActive ? "text-white" : "text-slate-500",
                  )}
                />
                {menu.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
              {userName?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {userName || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{userRole}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-4 z-50">
        <span className="font-bold text-white">Panel • {userRole}</span>
        <button onClick={onLogout} className="text-sm font-medium text-red-400">
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="sticky top-0 z-30 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto h-16 flex items-center justify-end px-6">
            <button
              onClick={() => setOpenNotification(!openNotification)}
              className="relative p-2 rounded-xl hover:bg-slate-200 transition"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {openNotification && (
              <div className="absolute right-6 top-14 w-96 bg-white rounded-2xl shadow-xl border overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-bold">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Tandai semua
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {" "}
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      Tidak ada notifikasi.
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationRead(item.id)}
                        className={`p-4 border-b cursor-pointer transition ${item.is_read ? "bg-white" : "bg-blue-50 hover:bg-blue-100"}`}
                      >
                        <div className="flex justify-between">
                          <div className="font-semibold">{item.title}</div>
                          {!item.is_read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {item.message}
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          {new Date(item.createdAt).toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 md:p-10 max-w-6xl mx-auto pb-32 md:pb-10">
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 pb-safe pt-2">
          <div className="flex justify-around items-center h-16">
            {visibleMenus.map((menu) => {
              const Icon = menu.icon;
              const isActive = location.pathname === menu.path;
              return (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  className={classNames(
                    "flex flex-col items-center justify-center w-full h-full gap-1",
                    isActive ? "text-primary-600" : "text-slate-400",
                  )}
                >
                  <Icon
                    size={22}
                    className={isActive ? "text-primary-600" : "text-slate-400"}
                  />
                  <span className="text-[10px] font-semibold">
                    {menu.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
        <NotificationToast notification={toast} />
      </main>
    </div>
  );
};
