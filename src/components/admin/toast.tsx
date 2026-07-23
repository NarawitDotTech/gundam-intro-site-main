import { AlertIcon, CheckIcon } from "@/components/icons";

export type ToastData = {
  id: number;
  type: "success" | "error";
  message: string;
};

export function Toast({ toast }: { toast: ToastData }) {
  const isSuccess = toast.type === "success";

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className={`fixed right-5 bottom-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md animate-toast-in ${
        isSuccess
          ? "border-emerald-300/30 bg-emerald-950/85 text-emerald-100"
          : "border-rose-300/30 bg-rose-950/85 text-rose-100"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isSuccess ? "bg-emerald-300/15 text-emerald-300" : "bg-rose-300/15 text-rose-300"
        }`}
      >
        {isSuccess ? <CheckIcon className="h-4 w-4" /> : <AlertIcon className="h-4 w-4" />}
      </span>
      <p className="text-sm font-medium">{toast.message}</p>
    </div>
  );
}
