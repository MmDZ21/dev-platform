import type { LayoutProps } from "@/cms/types";

export default function MainLayout({ slots, page, children }: LayoutProps & { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-muted/40 antialiased">
      {/* Topbar */}
      {slots.topbar}
      
      {/* Header/Navigation */}
      <div className="sticky top-0 inset-x-0 z-[var(--z-header)]">
        {slots.nav}
      </div>

      {/* Main content area - either children or content slot */}
      <main className="m-0 p-0">
        {children || slots.content}
      </main>

      {/* Footer */}
      {slots.footer}
    </div>
  );
}