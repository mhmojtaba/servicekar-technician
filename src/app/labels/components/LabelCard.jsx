import { Tag, X, Clock, Calendar, Trash } from "lucide-react";

const LabelCard = ({ label, onDelete, isDeleting }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white via-white to-neutral-50/50 rounded-2xl border border-neutral-200/60 p-5 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 hover:border-primary-300/50 hover:-translate-y-1 backdrop-blur-sm">
      <div
        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
          label?.data?.used_at
            ? "bg-gradient-to-br from-success-400 to-success-600"
            : "bg-gradient-to-br from-warning-400 to-warning-600"
        }`}
      />

      <div className="absolute inset-0 rounded-2xl opacity-30 bg-gradient-to-br from-transparent via-transparent to-primary-50/20 pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative p-3 bg-gradient-to-br from-primary-100 to-primary-200/80 rounded-xl group-hover:from-primary-200 group-hover:to-primary-300/80 transition-all duration-300 shadow-sm">
              <Tag className="w-5 h-5 text-primary-600 group-hover:text-primary-700 transition-colors" />
              <div className="absolute inset-0 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-neutral-800 truncate text-base lg:text-lg tracking-tight">
                {label.code}
              </h4>
              <div
                className={`text-xs font-medium mt-1 ${
                  label?.data?.used_at ? "text-success-600" : "text-warning-600"
                }`}
              >
                استفاده شده
              </div>
            </div>
          </div>

          {label?.data?.note && (
            <div className="mb-4 p-3 bg-gradient-to-r from-neutral-50/80 to-neutral-100/40 rounded-lg border border-neutral-100/60">
              <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3 font-medium">
                {label?.data?.note}
              </p>
            </div>
          )}

          {label?.data?.used_at && (
            <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-success-50/80 to-success-100/40 rounded-lg border border-success-200/40 w-[160px]">
              <Calendar className="w-4 h-4 text-success-600 flex-shrink-0" />
              <span className="text-sm font-medium text-success-800">
                تاریخ :
              </span>
              <span className="text-sm text-success-700 font-mono">
                {new Date(label?.data?.used_at * 1000).toLocaleDateString(
                  "fa-IR"
                )}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(label.code)}
          disabled={isDeleting}
          className="flex-shrink-0 relative p-2.5 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-neutral-50/80 hover:shadow-md hover:scale-110 active:scale-95"
          title="حذف برچسب"
        >
          <Trash className="w-4 h-4 transition-transform duration-200 " />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-error-50/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/5 via-transparent to-primary-600/5" />
      </div>
    </div>
  );
};

export default LabelCard;
