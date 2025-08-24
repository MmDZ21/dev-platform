"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useMemo, useState } from "react";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { trpc } from "@/lib/trpc/client";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlyTarget() {
  const { data } = trpc.adminStats.getMonthlyCounts.useQuery({ modelKey: "Post", months: 12 });
  const total = useMemo(() => (data?.points.reduce((acc, p) => acc + p.value, 0) ?? 0), [data]);
  const progress = Math.min(100, Math.round((total / 100) * 100)) || 0;

  const series = [progress];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: { fontFamily: "Outfit, sans-serif", type: "radialBar", height: 330, sparkline: { enabled: true } },
    plotOptions: { radialBar: { startAngle: -85, endAngle: 85, hollow: { size: "80%" }, track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 }, dataLabels: { name: { show: false }, value: { fontSize: "36px", fontWeight: "600", offsetY: -40, color: "#1D2939", formatter: (val: number) => `${val}%` } } } },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() { setIsOpen(!isOpen); }
  function closeDropdown() { setIsOpen(false); }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Target</h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">Target you’ve set for each month</p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-start text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">View More</DropdownItem>
              <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-start text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">Delete</DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className="absolute start-1/2 top_full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +10%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          مجموع فعالیت این ماه: {total} مورد
        </p>
      </div>
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Target</p>
          <p className="flex items-center justify_center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            100
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Completed</p>
          <p className="flex items-center justify_center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {total}
          </p>
        </div>
      </div>
    </div>
  );
}


