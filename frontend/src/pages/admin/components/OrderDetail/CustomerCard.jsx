import {
    User,
    Phone,
    MapPinned,
    MessageCircle,
} from "lucide-react";

/**
 * Mengkonversi nomor HP Indonesia (08xxx) menjadi format WhatsApp (628xxx).
 * @param {string} hp - Nomor HP mentah
 * @returns {string} - Nomor dalam format internasional tanpa tanda +
 */
const parseWhatsAppNumber = (hp) => {
    const clean = (hp || "").replace(/\D/g, "");
    if (clean.startsWith("0")) {
        return "62" + clean.slice(1);
    }
    if (clean.startsWith("62")) {
        return clean;
    }
    return "62" + clean;
};

const CustomerCard = ({ order }) => {
    const waNumber = parseWhatsAppNumber(order.hp);

    // URL tracking dinamis: menggunakan origin yang sedang berjalan (localhost atau domain produksi)
    const trackingUrl = `${window.location.origin}/tracking?code=${order.code}`;

    const waMessage = encodeURIComponent(
        `Halo kak ${order.nama} 😊\n\nIni informasi dari *Laundry Wangi* mengenai cucian Anda.\n\n` +
        `🔖 *Kode Pesanan:* ${order.code}\n` +
        `🧺 *Layanan:* ${order.layanan}\n` +
        `⚖️ *Berat/Item:* ${order.berat} Kg/Item\n\n` +
        `Pantau status cucian secara real-time di:\n${trackingUrl}\n\n` +
        `Terima kasih sudah mempercayai kami! 🌿`
    );
    return (
        <div
            className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
                overflow-hidden
            "
        >

            <div className="px-6 py-5 border-b bg-slate-50">

                <h3 className="font-bold text-lg flex items-center gap-2">

                    <User size={20} />

                    Data Pelanggan

                </h3>

            </div>

            <div className="p-6 space-y-5">

                <div>

                    <p className="text-xs uppercase text-slate-400">
                        Nama
                    </p>

                    <p className="font-bold text-lg mt-1">
                        {order.nama}
                    </p>

                </div>

                <div className="flex items-start gap-3">

                    <Phone
                        className="text-primary-600 mt-1"
                        size={18}
                    />

                    <div>

                        <p className="text-xs uppercase text-slate-400">
                            Nomor HP
                        </p>

                        <p className="font-semibold">
                            {order.hp}
                        </p>

                    </div>

                </div>

                <div className="flex items-start gap-3">

                    <MapPinned
                        className="text-primary-600 mt-1"
                        size={18}
                    />

                    <div>

                        <p className="text-xs uppercase text-slate-400">
                            Alamat
                        </p>

                        <p className="font-semibold whitespace-pre-wrap">
                            {order.alamat}
                        </p>

                    </div>

                </div>

                <div className="flex flex-col gap-3 mt-3">
                    <button
                        onClick={() =>
                            window.open(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.alamat)}`,
                                "_blank"
                            )
                        }
                        className="
                            w-full
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            py-3
                            transition
                        "
                    >
                        📍 Buka Google Maps
                    </button>

                    <a
                        href={`https://wa.me/${waNumber}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            w-full
                            rounded-xl
                            bg-green-500
                            hover:bg-green-600
                            text-white
                            py-3
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-semibold
                        "
                    >
                        <MessageCircle size={18} />
                        Chat via WhatsApp
                    </a>
                </div>

            </div>

        </div>
    );
};

export default CustomerCard;