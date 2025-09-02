import { DEFAULT_LOCALE, DIRECTION } from "@/settings";
import "@/themes"; // register themes at startup
import "./globals.css";
import { TRPCReactProvider } from "@/lib/trpc/provider";
import { getSiteSettings } from "@/cms/runtime";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteSettings();
  return (
    <html lang={DEFAULT_LOCALE} dir={DIRECTION}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/rss.xml"
        />
        {/* Expose active theme to client for the public theme provider */}
        <meta name="active-theme" content={site?.activeTheme || ""} />
      </head>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
