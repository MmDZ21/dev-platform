"use client";
import React from "react";
// Temporarily disabled ApexCharts for testing AdminDataTable
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

const BarChartOne: React.FC = () => {
  // const chartOptions: ApexOptions = {
  //   chart: {
  //     type: "bar",
  //     height: 350,
  //     toolbar: {
  //       show: false,
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       columnWidth: "55%",
  //     },
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     show: true,
  //     width: 2,
  //     colors: ["transparent"],
  //   },
  //   xaxis: {
  //     categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //   },
  //   yaxis: {
  //     title: {
  //       text: "$ (thousands)",
  //     },
  //   },
  //   fill: {
  //     opacity: 1,
  //   },
  //   tooltip: {
  //     y: {
  //       formatter: function (val) {
  //         return "$ " + val + " thousands";
  //       },
  //     },
  //   },
  // };

  // const series = [
  //   {
  //     name: "Net Profit",
  //     data: [44, 55, 57, 56, 61, 58],
  //   },
  //   {
  //     name: "Revenue",
  //     data: [76, 85, 101, 98, 87, 105],
  //   },
  // ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Bar Chart
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ApexCharts temporarily disabled for AdminDataTable testing.
        </p>
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
        <p className="text-gray-500 dark:text-gray-400">
          Chart component disabled
        </p>
      </div>
    </div>
  );
};

export default BarChartOne;
