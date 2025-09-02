"use client";
import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import ChartTab from "@/components/common/ChartTab";
import dynamic from "next/dynamic";
import { trpc } from "@/lib/trpc/client";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const { data: postData } = trpc.adminStats.getMonthlyCounts.useQuery({ modelKey: "Post", months: 12 });
  const { data: productData } = trpc.adminStats.getMonthlyCounts.useQuery({ modelKey: "Product", months: 12 });

  const categories = useMemo(() => postData?.points.map((p) => p.label) ?? [], [postData]);
  const series = useMemo(
    () => [
      { name: "پست‌ها", data: postData?.points.map((p) => p.value) ?? [] },
      { name: "محصولات", data: productData?.points.map((p) => p.value) ?? [] },
    ],
    [postData, productData]
  );

  const options: ApexOptions = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#465FFF", "#9CB9FF"],
    chart: { fontFamily: "Outfit, sans-serif", height: 310, type: "line", toolbar: { show: false } },
    stroke: { curve: "straight", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true, x: { show: false } },
    xaxis: { type: "category", categories, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
    yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] } }, title: { text: "", style: { fontSize: "0px" } } },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Statistics</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Monthly new content</p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}


