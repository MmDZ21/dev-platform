"use client";

import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemedAdminLayout from "@/components/admin/layout/ThemedAdminLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ThemedAdminLayout>{children}</ThemedAdminLayout>
    </ThemeProvider>
  );
}
