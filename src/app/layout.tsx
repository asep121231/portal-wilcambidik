import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import BackToTop from "@/components/ui/BackToTop";
import { PWARegister } from "@/components/pwa/PWARegister";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import PageTracker from "@/components/analytics/PageTracker";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Portal Informasi Kedinasan | Wilcambidik Bruno",
    template: "%s | Wilcambidik Bruno",
  },
  description:
    "Portal resmi untuk menyampaikan update informasi kedinasan kepada satuan pendidikan Sekolah Dasar di Wilayah Cabang Bidang Pendidikan Bruno.",
  keywords: [
    "wilcambidik bruno",
    "portal informasi",
    "kedinasan",
    "sekolah dasar",
    "purworejo",
    "dinas pendidikan",
  ],
  authors: [{ name: "Wilcambidik Bruno" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wilcambidik Bruno",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Wilcambidik Bruno",
  },
};

export const viewport: Viewport = {
  themeColor: "#9333EA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider>
          <PageTracker />
          <div className="flex flex-col min-h-screen">
            {!isAdminPage && <Header />}
            <main className="flex-1">{children}</main>
            {!isAdminPage && <Footer />}
          </div>
          <BackToTop />
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}

