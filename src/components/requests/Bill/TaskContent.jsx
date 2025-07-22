import React, { useState, useEffect } from "react";
import { Search, Wrench } from "lucide-react";
import { toast } from "react-toastify";

const TaskContent = ({ taskList, selectedTasks, onAddTask }) => {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (taskList && taskList.length > 0) {
      const initialQuantities = {};
      taskList.forEach((task) => {
        if (!quantities[task.id]) {
          initialQuantities[task.id] = "1";
        }
      });
      if (Object.keys(initialQuantities).length > 0) {
        setQuantities((prev) => ({ ...prev, ...initialQuantities }));
      }
    }
  }, [taskList]);

  const filteredTaskList = taskList.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (taskId, value) => {
    const numValue = parseFloat(value);
    if (value === "" || isNaN(numValue) || numValue <= 0) {
      setQuantities((prev) => ({
        ...prev,
        [taskId]: "1",
      }));
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleAddTask = (task) => {
    const quantity = quantities[task.id] || "1";
    const numQuantity = parseFloat(quantity);

    if (numQuantity <= 0) {
      toast.error("لطفا تعداد معتبر وارد کنید");
      return;
    }

    onAddTask(task, numQuantity);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="p-4 border-b border-neutral-100 flex-shrink-0">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="جستجوی خدمات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-[30vh] max-h-[30vh]">
        {filteredTaskList.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-3 bg-neutral-100 rounded-full w-12 h-12 mx-auto mb-3">
              <Wrench className="w-6 h-6 text-neutral-400 mx-auto" />
            </div>
            <p className="text-neutral-500">هیچ خدمتی یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredTaskList.map((task) => (
              <div
                key={task.id}
                className="p-4  rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-800">{task.title}</p>
                    {/* <p className="text-sm text-neutral-600 mt-1">
                      {task.price.toLocaleString()} تومان
                    </p> */}
                  </div>
                  <div className="flex items-center gap-2 mr-4 flex-shrink-0">
                    <label className="text-sm text-neutral-600">تعداد:</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={quantities[task.id] || "1"}
                      onChange={(e) =>
                        handleQuantityChange(task.id, e.target.value)
                      }
                      className="w-20 px-2 py-1 border border-neutral-300 rounded text-center text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      style={{ direction: "ltr" }}
                      placeholder="0"
                    />
                    <button
                      onClick={() => handleAddTask(task)}
                      className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskContent;
