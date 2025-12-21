import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { PWARegister } from "@/components/pwa/PWARegister";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <PWARegister />
      </body>
    </html>
  );
}
