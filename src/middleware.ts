import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LANGUAGES } from "@/settings";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("auth_session")?.value;
  const { pathname } = request.nextUrl;

  // Normalize locale-prefixed URLs to non-prefixed (e.g., /fa/about -> /about)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as any)) {
    const normalizedPath = "/" + segments.slice(1).join("/");
    const url = new URL(normalizedPath || "/", request.url);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth-test", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
