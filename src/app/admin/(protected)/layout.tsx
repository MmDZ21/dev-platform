import { requireAuth } from "@/lib/auth-helpers";
import type { ReactNode } from "react";


export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  await requireAuth({ loginPath: "/auth-test" });
  return <>{children}</>;
}
