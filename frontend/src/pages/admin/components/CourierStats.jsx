const CourierStats = ({
                          total,
                          inProgress,
                          finished,
                      }) => {
    return (
        <div className="grid md:grid-cols-3 gap-5 mb-8">

            <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 shadow-lg">
                <p className="text-blue-100 text-sm">
                    Total Order
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {total}
                </h2>

                <p className="mt-2 text-blue-100 text-sm">
                    Order yang menjadi tanggung jawab Anda.
                </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 shadow-lg">
                <p className="text-orange-100 text-sm">
                    Sedang Dikerjakan
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {inProgress}
                </h2>

                <p className="mt-2 text-orange-100 text-sm">
                    Masih dalam proses penjemputan maupun pengantaran.
                </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 shadow-lg">
                <p className="text-green-100 text-sm">
                    Order Selesai
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {finished}
                </h2>

                <p className="mt-2 text-green-100 text-sm">
                    Seluruh proses pengantaran telah selesai.
                </p>
            </div>

        </div>
    );
};

export default CourierStats;