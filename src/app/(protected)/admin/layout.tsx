"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useSidebar } from "@/context/SidebarContext";
import React from "react";

const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExpanded, isHovered } = useSidebar();
  const desktopMargin = isExpanded || isHovered ? "lg:ms-[290px]" : "lg:ms-[90px]";

  return (
    <div className={`flex-1 transition-all duration-300 ease-in-out ${desktopMargin} bg-gray-50 dark:bg-gray-950`}>
      {children}
    </div>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure admin routes are always dynamic (no prerender) due to auth/middleware
  // Next.js reads this on the module, so we export at top-level too
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen xl:flex">
          <AppSidebar />
          <Backdrop />
          <ContentWrapper>
            <AppHeader />
            <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
          </ContentWrapper>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}


