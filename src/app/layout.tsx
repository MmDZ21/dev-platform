import { DEFAULT_LOCALE, DIRECTION } from "@/settings";
import "@/themes"; // register themes at startup
import "./globals.css";
import { TRPCReactProvider } from "@/lib/trpc/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={DEFAULT_LOCALE} dir={DIRECTION}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/rss.xml"
        />
      </head>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
