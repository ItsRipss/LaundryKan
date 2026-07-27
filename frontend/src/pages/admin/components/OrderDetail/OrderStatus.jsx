const OrderStatus = ({
                         stages,
                         currentStage,
                         setCurrentStage,
                         userRole,
                         orderCode,
                         onUpdateStage,
                         fetchActivity,
                     }) => {

    return (

        <section>

            <div className="flex items-center justify-between mb-5">

                <div>

                    <h3 className="font-bold text-xl">
                        Progress Laundry
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        Pantau perkembangan order secara real-time.
                    </p>

                </div>

                <div className="text-right">

                    <p className="text-xs uppercase text-slate-400">
                        Progress
                    </p>

                    <p className="text-2xl font-bold text-primary-600">
                        {Math.round(((currentStage + 1) / stages.length) * 100)}%
                    </p>

                </div>

            </div>

            {/* Progress Bar */}

            <div className="h-3 rounded-full bg-slate-200 overflow-hidden mb-8">

                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-700"
                    style={{
                        width: `${((currentStage + 1) / stages.length) * 100}%`,
                    }}
                />

            </div>

            {/* Timeline */}

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">

                {stages.map((item, index) => {

                    const finished = index < currentStage;
                    const active = index === currentStage;

                    return (

                        <button
                            key={index}
                            disabled={userRole === "courier"}
                            onClick={async () => {

                                if (userRole === "courier") return;

                                setCurrentStage(index);

                                await onUpdateStage(orderCode, index);

                                await fetchActivity();

                            }}
                            className={`
                                rounded-2xl
                                border
                                p-5
                                text-center
                                transition-all
                                duration-300
                                hover:shadow-lg

                                ${
                                finished
                                    ? "bg-primary-50 border-primary-200"
                                    : active
                                        ? "bg-primary-600 text-white border-primary-600 scale-105"
                                        : "bg-white border-slate-200"
                            }

                                ${
                                userRole === "courier"
                                    ? "cursor-default"
                                    : "hover:-translate-y-1"
                            }
                            `}
                        >

                            <div className="text-3xl mb-3">

                                {item.icon}

                            </div>

                            <h4 className="font-semibold">

                                {item.label}

                            </h4>

                            <div className="mt-3 text-sm">

                                {finished && (
                                    <span className="text-green-600 font-semibold">
                                        ✔ Selesai
                                    </span>
                                )}

                                {active && (
                                    <span className="font-semibold">
                                        ● Sedang Berjalan
                                    </span>
                                )}

                                {!finished && !active && (
                                    <span className="text-slate-400">
                                        Menunggu
                                    </span>
                                )}

                            </div>

                        </button>

                    );

                })}

            </div>

        </section>

    );

};

export default OrderStatus;