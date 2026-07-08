import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hot Wheels Premium Showcase",
    template: "%s · Hot Wheels Showcase",
  },
  description:
    "Browse and search a curated collection of premium Hot Wheels die-cast models — organized by series with favorites.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hotwheels.vercel.app"),
  authors: [{ name: "William Bond" }],
  creator: "William Bond",
  openGraph: {
    title: "Hot Wheels Premium Showcase",
    description:
      "Browse and search a curated collection of premium Hot Wheels die-cast models.",
    type: "website",
    locale: "en_US",
    url: "https://hotwheels.vercel.app",
    siteName: "Hot Wheels Showcase",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground page-bg">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
