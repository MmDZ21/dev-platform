"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import AdminMainLayout from "@/components/admin/layout/AdminMainLayout";

export default function ThemedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTheme } = useTheme();

  return (
    <div
      className={`theme-${currentTheme} relative min-h-screen w-full xl:flex bg-background text-foreground`}
    >
      <SidebarProvider>
        <AdminMainLayout>{children}</AdminMainLayout>
      </SidebarProvider>
    </div>
  );
}
