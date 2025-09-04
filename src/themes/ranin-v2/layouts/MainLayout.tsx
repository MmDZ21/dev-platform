import type { LayoutProps } from "@/cms/types";
import { Slot } from "@/lib/simple-theme";

export default function MainLayout({
  slots,
  page,
  children,
}: LayoutProps & { children?: React.ReactNode }) {
  return (
    <div className="from-muted to-muted/40 min-h-screen bg-gradient-to-b antialiased">
      {/* Topbar */}
      <Slot slots={slots} name="topbar" />

      {/* Header/Navigation */}
      <div className="sticky inset-x-0 top-0 z-[30]">
        <Slot slots={slots} name="nav" />
      </div>

      {/* Main content area - either children or content slot */}
      <main className="m-0 p-0">
        {children || <Slot slots={slots} name="content" />}
      </main>

      {/* Footer */}
      <Slot slots={slots} name="footer" />
    </div>
  );
}
