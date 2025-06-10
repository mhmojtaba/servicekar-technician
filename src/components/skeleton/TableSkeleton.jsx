import React from "react";

const TableSkeleton = () => {
  return (
    <div className="min-w-[500px] w-full max-w-full overflow-hidden rounded-lg border border-border shadow-sm animate-fadeIn">
      {/* Table Header Skeleton */}
      <div className="bg-primary-50 h-12 flex items-center p-3">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex-1 h-5 bg-primary-100 rounded-md animate-pulse mx-2"
          ></div>
        ))}
      </div>

      {/* Table Body Skeleton */}
      <div className="bg-white">
        {[...Array(5)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center p-4 border-b border-border transition-colors"
          >
            {[...Array(5)].map((_, colIndex) => (
              <div
                key={colIndex}
                className={`flex-1 h-5 bg-neutral-100 rounded-md animate-pulse mx-2 ${
                  colIndex === 4 ? "w-20" : ""
                }`}
                style={{
                  animationDelay: `${(rowIndex * 5 + colIndex) * 0.05}s`,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;