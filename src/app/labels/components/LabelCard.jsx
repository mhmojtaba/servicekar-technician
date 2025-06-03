import { Tag, X } from "lucide-react";

const LabelCard = ({ label, onDelete, isDeleting }) => {
  return (
    <div className="group bg-white rounded-xl border border-neutral-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
              <Tag className="w-4 h-4 text-primary-600" />
            </div>
            <h4 className="font-medium text-neutral-800 truncate text-sm sm:text-base">
              {label.name}
            </h4>
          </div>
          {label.note && (
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
              {label.note}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(label.id)}
          disabled={isDeleting}
          className="flex-shrink-0 p-2 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-neutral-50"
          title="حذف برچسب"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LabelCard;
