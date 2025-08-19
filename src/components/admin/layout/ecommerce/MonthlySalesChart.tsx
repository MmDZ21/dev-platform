"use client";
import React from "react";
// Temporarily disabled ApexCharts for testing AdminDataTable
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

// Dynamically import the ReactApexChart component
// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

const MonthlySalesChart: React.FC = () => {
  // const chartOptions: ApexOptions = {
  //   chart: {
  //     type: "area",
  //     height: 350,
  //     toolbar: {
  //       show: false,
  //     },
  //   },
  //   stroke: {
  //     curve: "smooth",
  //     width: 3,
  //   },
  //   fill: {
  //     type: "gradient",
  //     gradient: {
  //       shadeIntensity: 1,
  //       opacityFrom: 0.7,
  //       opacityTo: 0.9,
  //       stops: [0, 90, 100],
  //     },
  //   },
  //   xaxis: {
  //     categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //   },
  //   yaxis: {
  //     labels: {
  //       formatter: (value) => `$${value}k`,
  //     },
  //   },
  //   colors: ["#10B981"],
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   grid: {
  //     borderColor: "#E5E7EB",
  //   },
  // };

  // const series = [
  //   {
  //     name: "Sales",
  //     data: [30, 40, 35, 50, 49, 60],
  //   },
  // ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
            className="flex w-full font-normal text-start text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
            className="flex w-full font-normal text-start text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ms-5 min-w-[650px] xl:min-w-full ps-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Sales Chart
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              ApexCharts temporarily disabled for AdminDataTable testing.
            </p>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-gray-700 dark:text-gray-300">
              Chart component disabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
