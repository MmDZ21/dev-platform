"use client";
import { useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/components/admin/layout/AppSidebar";
import AppHeader from "@/components/admin/layout/AppHeader";
import Backdrop from "@/components/admin/layout/Backdrop";
import React from "react";

export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ms-0"
    : isExpanded || isHovered
      ? "lg:ms-[330px]"
      : "lg:ms-[130px]";

  return (
    <div className="h-screen w-full xl:flex z-10">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="lg:mx-6 max-w-full rounded-xl p-4 md:p-6 lg:my-8 z-10 bg-white/10 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
