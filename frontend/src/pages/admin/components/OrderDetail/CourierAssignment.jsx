import {
    Truck,
    CircleUserRound,
    BadgeCheck,
} from "lucide-react";

const CourierAssignment = ({
                               userRole,
                               assignedCourier,
                               couriers,
                               selectedCourier,
                               setSelectedCourier,
                               assignCourier,
                               assignLoading,
                           }) => {

    return (
        <section>

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

                        <Truck size={20} />

                        Penugasan Kurir

                    </h3>

                </div>

                <div className="p-6">

                    {assignedCourier ? (

                        <div
                            className="
                            rounded-2xl
                            bg-gradient-to-br
                            from-primary-50
                            to-white
                            border
                            border-primary-200
                            p-6
                            mb-6
                        "
                        >

                            <div className="flex flex-col items-center text-center">

                                <div
                                    className="
                                    w-24
                                    h-24
                                    rounded-full
                                    bg-primary-600
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                "
                                >

                                    <CircleUserRound size={46} />

                                </div>

                                <h3 className="mt-5 text-xl font-bold">

                                    {assignedCourier.nama_lengkap}

                                </h3>

                                <p className="text-slate-500">

                                    @{assignedCourier.username}

                                </p>

                                <div
                                    className="
                                    mt-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-full
                                    bg-green-100
                                    text-green-700
                                    font-semibold
                                "
                                >

                                    <BadgeCheck size={18} />

                                    Sedang Bertugas

                                </div>

                            </div>

                        </div>

                    ) : (

                        <div
                            className="
                            rounded-2xl
                            border
                            border-dashed
                            border-red-300
                            bg-red-50
                            text-center
                            p-8
                            mb-6
                        "
                        >

                            <div className="text-4xl mb-3">

                                🚚

                            </div>

                            <h3 className="font-bold text-red-700">

                                Belum Ada Kurir

                            </h3>

                            <p className="text-sm text-slate-500 mt-2">

                                Order ini belum memiliki kurir yang bertugas.

                            </p>

                        </div>

                    )}

                    <div className="space-y-5">

                        <div>

                            <label className="block text-sm text-slate-500 mb-2">

                                Pilih Kurir

                            </label>

                            <select
                                value={selectedCourier}
                                onChange={(e) =>
                                    setSelectedCourier(e.target.value)
                                }
                                className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                px-4
                                py-3
                                focus:ring-2
                                focus:ring-primary-500
                                outline-none
                            "
                            >

                                <option value="">

                                    -- Pilih Kurir --

                                </option>

                                {couriers.map((courier) => (

                                    <option
                                        key={courier.id}
                                        value={courier.id}
                                    >

                                        {courier.nama_lengkap}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <button
                            onClick={assignCourier}
                            disabled={
                                assignLoading ||
                                !selectedCourier
                            }
                            className="
                            w-full
                            rounded-xl
                            bg-primary-600
                            hover:bg-primary-700
                            disabled:opacity-50
                            text-white
                            py-3
                            font-semibold
                            transition
                        "
                        >

                            {assignLoading
                                ? "Menyimpan..."
                                : "Simpan Penugasan"}

                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default CourierAssignment;