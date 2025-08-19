"use client";
import React from "react";
// Temporarily disabled ApexCharts for testing AdminDataTable
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

const MonthlyTarget: React.FC = () => {
  // const chartOptions: ApexOptions = {
  //   chart: {
  //     type: "radialBar",
  //     height: 350,
  //     toolbar: {
  //       show: false,
  //     },
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       startAngle: -135,
  //       endAngle: 135,
  //       hollow: {
  //         margin: 15,
  //         size: "70%",
  //       },
  //       track: {
  //         background: "#E5E7EB",
  //         strokeWidth: "97%",
  //         margin: 5,
  //       },
  //       dataLabels: {
  //         name: {
  //           show: false,
  //         },
  //         value: {
  //           offsetY: 7,
  //           color: "#111827",
  //           fontSize: "20px",
  //           fontWeight: "600",
  //         },
  //       },
  //     },
  //   },
  //   fill: {
  //     type: "gradient",
  //     gradient: {
  //       shade: "dark",
  //       type: "horizontal",
  //       shadeIntensity: 0.5,
  //       gradientToColors: ["#10B981"],
  //       inverseColors: true,
  //       opacityFrom: 1,
  //       opacityTo: 1,
  //       stops: [0, 100],
  //     },
  //   },
  //   stroke: {
  //     lineCap: "round",
  //   },
  //   series: [75],
  //   labels: ["Monthly Target"],
  // };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Monthly Target Chart
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

export default MonthlyTarget;
