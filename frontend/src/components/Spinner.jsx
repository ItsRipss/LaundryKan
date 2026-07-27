import { Loader2 } from "lucide-react";

const Spinner = ({ text = "Memuat data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      <span className="font-medium text-slate-600">{text}</span>
    </div>
  );
};

export default Spinner;
