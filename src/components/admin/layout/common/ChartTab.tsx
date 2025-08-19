import React, { useState } from "react";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => setSelected("optionOne")}
        className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
          selected === "optionOne"
            ? "bg-brand-500 text-white"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
      >
        Monthly
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
          selected === "optionTwo"
            ? "bg-brand-500 text-white"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
      >
        Quarterly
      </button>

      <button
        onClick={() => setSelected("optionThree")}
        className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
          selected === "optionThree"
            ? "bg-brand-500 text-white"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
      >
        Annually
      </button>
    </div>
  );
};

export default ChartTab;
