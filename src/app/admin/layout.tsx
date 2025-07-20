"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import AdminMainLayout from "@/components/admin/layout/AdminMainLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full xl:flex"
  style={{

    backgroundImage: `radial-gradient(circle, rgba(56, 40, 32, 1) 0%, rgba(41, 31, 27, 1) 20%, rgba(26, 23, 36, 1) 64%, rgba(28, 28, 28, 1) 80%)
    `,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "overlay, normal",
    zIndex:1
  }}>       
       {/* <div className="inset-0 absolute bg-[#000]/90"/> */}
       {/* <div className="inset-0 absolute" style={{
        backgroundImage: 'url("images/noise.svg")',
        opacity: 1
       }}/> */}
       <div className="inset-0 absolute bg-white/10 backdrop-blur-sm"/>
        <SidebarProvider>
          <AdminMainLayout>{children}</AdminMainLayout>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}