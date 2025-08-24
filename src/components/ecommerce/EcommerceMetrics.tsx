"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { trpc } from "@/lib/trpc/client";

export const EcommerceMetrics = () => {
  const { data } = trpc.adminStats.getCounts.useQuery();
  const totalPosts = data?.post ?? 0;
  const totalProducts = data?.product ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">پست‌ها</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalPosts.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11%
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg:white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">محصولات</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text:white/90">
              {totalProducts.toLocaleString()}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            2%
          </Badge>
        </div>
      </div>
    </div>
  );
};


