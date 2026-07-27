import { useState } from "react";
import { Camera, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { API_URL } from "../../../config";

const CourierUploadProof = ({ order, token, refreshOrders }) => {
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChoosePhoto = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setPhoto(file);
        setPreview(URL.createObjectURL(file));
        setSuccess(false);
    };

    const handleUpload = async () => {
        if (!photo) return;

        try {
            setUploading(true);

            const formData = new FormData();

            formData.append("photo", photo);

            const res = await fetch(
                `${API_URL}/orders/${order.code}/upload-proof`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Upload gagal");
            }

            setSuccess(true);

            if (refreshOrders) {
                refreshOrders();
            }

        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Camera size={20} />
                Upload Bukti Pengantaran
            </h3>

            {preview ? (
                <img
                    src={preview}
                    alt="Preview"
                    className="
                        w-full
                        h-64
                        object-cover
                        rounded-xl
                        border
                        mb-4
                    "
                />
            ) : (
                <div
                    className="
                        h-64
                        rounded-xl
                        border-2
                        border-dashed
                        border-slate-300
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        mb-4
                    "
                >
                    Belum ada foto dipilih
                </div>
            )}

            <label
                className="
                    w-full
                    cursor-pointer
                    rounded-xl
                    bg-white
                    border
                    py-3
                    flex
                    justify-center
                    items-center
                    gap-2
                    hover:bg-slate-100
                    transition
                "
            >
                <Camera size={18} />

                Pilih Foto

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChoosePhoto}
                />
            </label>

            <button
                disabled={!photo || uploading}
                onClick={handleUpload}
                className="
                    mt-4
                    w-full
                    rounded-xl
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    py-3
                    font-semibold
                    flex
                    justify-center
                    items-center
                    gap-2
                    disabled:opacity-50
                "
            >
                {uploading ? (
                    <>
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                        Mengupload...
                    </>
                ) : (
                    <>
                        <Upload size={18} />
                        Upload Bukti
                    </>
                )}
            </button>

            {success && (
                <div
                    className="
                        mt-4
                        rounded-xl
                        bg-green-100
                        text-green-700
                        py-3
                        flex
                        justify-center
                        items-center
                        gap-2
                        font-semibold
                    "
                >
                    <CheckCircle2 size={18} />

                    Upload berhasil
                </div>
            )}

        </div>
    );
};

export default CourierUploadProof;