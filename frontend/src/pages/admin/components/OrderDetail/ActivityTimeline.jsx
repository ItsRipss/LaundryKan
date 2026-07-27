// FIX BUG #9: ikon & label khusus per activity_type non-"status",
// karena old_stage/new_stage null untuk "assign", "delivery_photo",
// dan "payment" (dikirim backend sebagai null pada createActivity).
const ACTIVITY_ICONS = {
    assign: "🚚",
    delivery_photo: "📷",
    payment: "💳",
};

// FIX BUG #9: menentukan ikon lingkaran timeline - pakai ikon stage
// hanya untuk activity_type "status" (satu-satunya jenis yang punya
// new_stage valid), selain itu pakai ikon berdasarkan jenis aktivitas.
const getActivityIcon = (item, stages) => {
    if (item.activity_type === "status") {
        return stages[item.new_stage]?.icon ?? "📝";
    }
    return ACTIVITY_ICONS[item.activity_type] ?? "🔔";
};

const ActivityTimeline = ({ activities, stages }) => {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold">
                        Riwayat Aktivitas
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        Seluruh perubahan status order akan tercatat di sini.
                    </p>
                </div>

                <div
                    className="
                        px-4
                        py-2
                        rounded-xl
                        bg-primary-50
                        text-primary-700
                        text-sm
                        font-semibold
                    "
                >
                    {activities.length} Aktivitas
                </div>
            </div>

            {activities.length === 0 ? (
                <div
                    className="
                        rounded-3xl
                        border
                        border-dashed
                        border-slate-300
                        py-12
                        text-center
                        text-slate-500
                    "
                >
                    Belum ada aktivitas.
                </div>
            ) : (
                <div className="relative ml-5">
                    <div
                        className="
                            absolute
                            left-4
                            top-2
                            bottom-2
                            w-[2px]
                            bg-slate-200
                        "
                    />

                    <div className="space-y-8">
                        {activities.map((item) => (
                            <div
                                key={item.id}
                                className="relative pl-12"
                            >
                                <div
                                    className="
                                        absolute
                                        left-0
                                        top-1
                                        w-8
                                        h-8
                                        rounded-full
                                        bg-primary-600
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        text-sm
                                        shadow
                                    "
                                >
                                    {getActivityIcon(item, stages)}
                                </div>

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-5
                                        shadow-sm
                                    "
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">
                                                {item.changed_role}
                                            </h4>

                                            {/*
                                                FIX BUG #9: pakai item.description
                                                dari backend (sudah spesifik per
                                                activity_type) alih-alih teks
                                                hardcode "Status berhasil
                                                diperbarui" yang tidak akurat
                                                untuk activity_type selain "status".
                                            */}
                                            <p className="text-slate-500 text-sm mt-1">
                                                {item.description || "Status berhasil diperbarui"}
                                            </p>
                                        </div>

                                        <span className="text-xs text-slate-400">
                                            {new Date(item.createdAt).toLocaleString("id-ID")}
                                        </span>
                                    </div>

                                    {/*
                                        FIX BUG #9: badge old_stage -> new_stage
                                        cuma relevan & valid untuk activity_type
                                        "status" (satu-satunya yang punya
                                        old_stage/new_stage terisi). Untuk
                                        "assign", "delivery_photo", "payment",
                                        badge ini disembunyikan karena akan
                                        selalu tampil kosong (stages[null]).
                                    */}
                                    {item.activity_type === "status" && (
                                        <div
                                            className="
                                                mt-5
                                                flex
                                                items-center
                                                gap-3
                                                flex-wrap
                                            "
                                        >
                                            <span
                                                className="
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-slate-100
                                                "
                                            >
                                                {stages[item.old_stage]?.icon}{" "}
                                                {stages[item.old_stage]?.label}
                                            </span>

                                            <span className="text-slate-400">
                                                →
                                            </span>

                                            <span
                                                className="
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-primary-100
                                                    text-primary-700
                                                    font-semibold
                                                "
                                            >
                                                {stages[item.new_stage]?.icon}{" "}
                                                {stages[item.new_stage]?.label}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ActivityTimeline;