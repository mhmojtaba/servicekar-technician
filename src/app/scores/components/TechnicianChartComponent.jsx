import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartBarIcon, TrendingUp, Star } from "lucide-react";

const CHART_TYPES = [
  { value: "bar", label: "نمودار ستونی", icon: "📊" },
  { value: "line", label: "نمودار خطی", icon: "📈" },
];

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6366F1",
];

const TechnicianChartComponent = ({
  chartData,
  selectReportType,
  selectGroupType,
  isPending,
  type_report_options,
  group_type_options,
}) => {
  const [chartType, setChartType] = useState("bar");

  const getMonthName = (month) => {
    const monthNames = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    return monthNames[month - 1] || `ماه ${month}`;
  };

  const processedChartData = useMemo(() => {
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return {
        processedData: [],
        timeGrouping: "daily",
      };
    }

    try {
      const sample = chartData[0];
      const hasWeek = "week" in sample;
      const hasMonth = "month" in sample;
      const hasDay = "day" in sample;
      const hasYear = "year" in sample;

      let processedData = {};
      let timeGrouping = "daily";

      if (hasWeek && !hasDay) {
        timeGrouping = "weekly";
      } else if (hasMonth && !hasDay && !hasWeek) {
        timeGrouping = "monthly";
      } else if (hasYear && !hasMonth && !hasWeek && !hasDay) {
        timeGrouping = "yearly";
      }

      chartData.forEach((item) => {
        let timeLabel = "";

        if (timeGrouping === "daily") {
          timeLabel = `${item.year}/${String(item.month).padStart(2, "0")}/${String(item.day).padStart(2, "0")}`;
        } else if (timeGrouping === "weekly") {
          timeLabel = `هفته ${item.week}`;
        } else if (timeGrouping === "monthly") {
          timeLabel = `${item.year}/${getMonthName(item.month)}`;
        } else if (timeGrouping === "yearly") {
          timeLabel = `${item.year}`;
        }

        if (!processedData[timeLabel]) {
          processedData[timeLabel] = {
            label: timeLabel,
            time: timeLabel,
            total_reviews: 0,
            avg_rating: 0,
            total_rating: 0,
            count: 0,
          };
        }

        const reviews = Number(item.total_reviews) || 0;
        const rating = Number(item.avg_rating) || 0;

        processedData[timeLabel].total_reviews += reviews;
        processedData[timeLabel].total_rating += rating * reviews;
        processedData[timeLabel].count += 1;

        // محاسبه میانگین امتیاز
        if (processedData[timeLabel].total_reviews > 0) {
          processedData[timeLabel].avg_rating =
            processedData[timeLabel].total_rating /
            processedData[timeLabel].total_reviews;
        }
      });

      const result = {
        processedData: Object.values(processedData).sort((a, b) =>
          a.time.localeCompare(b.time)
        ),
        timeGrouping,
      };

      return result;
    } catch (error) {
      console.error("Error processing chart data:", error);
      return {
        processedData: [],
        timeGrouping: "daily",
      };
    }
  }, [chartData]);

  const { processedData, timeGrouping } = processedChartData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[250px]">
          {label && (
            <p className="font-semibold text-gray-800 mb-3 text-center border-b border-gray-100 pb-2">
              {label}
            </p>
          )}
          <div className="space-y-2">
            {payload.map((entry, index) => {
              const isRating = entry.dataKey === "avg_rating";
              const isReviews = entry.dataKey === "total_reviews";

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {isRating
                        ? "میانگین امتیاز"
                        : isReviews
                          ? "تعداد نظرات"
                          : entry.dataKey}
                      :
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {isRating
                      ? `${entry.value?.toFixed(1)} ⭐`
                      : entry.value?.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!processedData.length) {
      return (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500 py-8">
          <ChartBarIcon className="w-20 h-20 mb-6 text-gray-300" />
          <div className="text-center space-y-2">
            <p className="text-xl font-medium text-gray-600">
              داده‌ای برای نمایش موجود نیست
            </p>
            <p className="text-sm text-gray-400 max-w-md">
              لطفاً فیلترهای مختلفی را امتحان کرده و مطمئن شوید که داده‌هایی
              برای بازه زمانی انتخابی موجود است
            </p>
          </div>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{
              fontSize: 12,
              dy: 10,
              textAnchor: "end",
            }}
            interval={0}
            angle={0}
            height={70}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickMargin={8}
          />
          <YAxis
            yAxisId="left"
            tick={{
              fontSize: 12,
              dx: -10,
            }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickMargin={8}
            domain={["dataMin - 1", "dataMax + 1"]}
            label={{ value: "تعداد نظرات", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{
              fontSize: 12,
              dx: 10,
            }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickMargin={8}
            domain={[0, 5]}
            label={{ value: "امتیاز", angle: 90, position: "insideRight" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />

          {/* نمودار تعداد نظرات */}
          {chartType === "line" ? (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_reviews"
              stroke={COLORS[0]}
              strokeWidth={3}
              dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: COLORS[0], strokeWidth: 2 }}
              name="تعداد نظرات"
            />
          ) : (
            <Bar
              yAxisId="left"
              dataKey="total_reviews"
              fill={COLORS[0]}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              name="تعداد نظرات"
            />
          )}

          {/* نمودار میانگین امتیاز */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_rating"
            stroke={COLORS[1]}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: COLORS[1], strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: COLORS[1], strokeWidth: 2 }}
            name="میانگین امتیاز"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-96 p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              در حال پردازش داده‌ها
            </h3>
            <p className="text-gray-500">لطفاً منتظر بمانید...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            گزارش امتیازات شما
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 space-x-reverse bg-blue-50 px-4 py-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                نوع گزارش:
              </span>
              <span className="text-sm font-bold text-blue-800">
                {type_report_options.find(
                  (option) => option.value === selectReportType
                )?.label || "همه"}
              </span>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse bg-green-50 px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                گروه‌بندی:
              </span>
              <span className="text-sm font-bold text-green-800">
                {group_type_options.find(
                  (option) => option.value === selectGroupType
                )?.label || "روزانه"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-medium text-gray-700 flex items-center">
          انتخاب نوع نمودار:
        </span>
        {CHART_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setChartType(type.value)}
            className={`
              flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${
                chartType === type.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {renderChart()}
      </div>

      {processedData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-blue-600 font-medium">نقاط داده</p>
            <p className="text-2xl font-bold text-blue-800">
              {processedData.length}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-green-600 font-medium">کل نظرات</p>
            <p className="text-2xl font-bold text-green-800">
              {processedData.reduce((sum, item) => sum + item.total_reviews, 0)}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <p className="text-yellow-600 font-medium">نوع نمودار</p>
            <p className="text-lg font-bold text-yellow-800">
              {CHART_TYPES.find((t) => t.value === chartType)?.label}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <p className="text-purple-600 font-medium">گروه‌بندی</p>
            <p className="text-lg font-bold text-purple-800">
              {group_type_options.find(
                (option) => option.value === selectGroupType
              )?.label || "روزانه"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianChartComponent;
