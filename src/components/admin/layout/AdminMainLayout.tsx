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
      ? "lg:ms-[var(--sidebar-expanded-width)]"
      : "lg:ms-[var(--sidebar-collapsed-width)]";

  return (
    <div className="h-screen w-full xl:flex z-10">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="lg:mx-6 max-w-full rounded-xl z-10" style={{ padding: 'var(--container-py) var(--container-px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
