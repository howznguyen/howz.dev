import { GoogleAnalytics } from "@/components/providers/GoogleAnalytics";
import { Umami } from "@/components/providers/Umami";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@/styles/globals.css";
import "react-medium-image-zoom/dist/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next/types";
import { Route } from "@/lib";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "howz.dev",
  description:
    "Personal website and blog made using Next.js, TypeScript, Tailwind CSS and Notion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Howz Nguyen Blog RSS Feed"
          href={Route.rss(true)}
        />
      </head>
      <body
        className={`${inter.variable} font-inter transition-colors dark:bg-dark`}
      >
        <GoogleAnalytics trackPageViews />
        <Umami trackPageViews />
        <ThemeProvider attribute="class" defaultTheme={"light"}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
