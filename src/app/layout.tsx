import { TRPCReactProvider } from "@/lib/trpc/provider";
import "./globals.css"; // 👈 this import is mandatory
import { DEFAULT_LOCALE, DIRECTION } from "@/settings";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html  lang={DEFAULT_LOCALE} dir={DIRECTION}>
      <head>
        {/* ...other tags... */}
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
