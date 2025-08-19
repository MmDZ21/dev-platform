"use client";
import React from "react";
// Temporarily disabled ApexCharts for testing AdminDataTable
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

const StatisticsChart: React.FC = () => {
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
  //   colors: ["#3B82F6"],
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   grid: {
  //     borderColor: "#E5E7EB",
  //   },
  // };

  // const series = [
  //   {
  //     name: "Statistics",
  //     data: [30, 40, 35, 50, 49, 60],
  //   },
  // ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Statistics Chart
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

export default StatisticsChart;
