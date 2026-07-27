import { Bell } from "lucide-react";

export default function NotificationToast({ notification }) {
  if (!notification) return null;

  return (
    <div className="fixed top-6 right-6 z-[999] w-96 bg-white rounded-2xl shadow-2xl border p-5 animate-[slideIn_.35s_ease]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Bell className="text-blue-600" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{notification.title}</h3>
          <p className="text-slate-600 mt-1">{notification.message}</p>
        </div>
      </div>
    </div>
  );
}
