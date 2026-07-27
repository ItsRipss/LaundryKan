import { useEffect, useState } from "react";
import { Mail, RefreshCw, CheckCircle2, Trash2, Inbox } from "lucide-react";
import { API_URL } from "../../config";

export default function Messages({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = async () => {
    try {
      setRefreshing(true);

      const res = await fetch(`${API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(Array.isArray(data) ? data : []);
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/messages/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Hapus pesan ini?")) return;

    try {
      const res = await fetch(`${API_URL}/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
        Memuat pesan...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pesan Masuk</h1>

          <p className="text-slate-500 text-sm mt-1">
            Semua pesan yang dikirim customer.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Inbox className="mx-auto mb-4 text-slate-400" size={56} />

          <h3 className="text-lg font-semibold text-slate-700">
            Belum ada pesan
          </h3>

          <p className="text-slate-500 mt-2">
            Pesan customer akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-primary-600" />

                    <h2 className="font-bold text-lg text-slate-900">
                      {msg.nama}
                    </h2>

                    {!msg.is_read && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Baru
                      </span>
                    )}

                    {msg.is_read && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Sudah Dibaca
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mt-1">{msg.email}</p>
                </div>

                <div className="text-xs text-slate-400">
                  {new Date(msg.createdAt).toLocaleString("id-ID")}
                </div>
              </div>

              <div className="mt-5 text-slate-700 whitespace-pre-wrap">
                {msg.pesan}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {!msg.is_read && (
                  <button
                    onClick={() => markRead(msg.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition"
                  >
                    <CheckCircle2 size={18} />
                    Tandai Dibaca
                  </button>
                )}

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
                >
                  <Trash2 size={18} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
