const OrderHeader = ({ order, onClose }) => {
    return (
        <div className="border-b bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white">

            <div className="flex items-start justify-between p-8">

                <div>

                    <p className="text-primary-100 text-sm tracking-wide uppercase">
                        Detail Order
                    </p>

                    <h1 className="text-3xl font-bold mt-2">
                        {order.code}
                    </h1>

                    <p className="mt-3 text-primary-100">
                        {order.layanan}
                        {" • "}
                        {order.berat} Kg
                    </p>

                </div>

                <button
                    onClick={onClose}
                    className="
                        w-11
                        h-11
                        rounded-xl
                        bg-white/20
                        hover:bg-white/30
                        transition
                        text-2xl
                    "
                >
                    ×
                </button>

            </div>

        </div>
    );
};

export default OrderHeader;